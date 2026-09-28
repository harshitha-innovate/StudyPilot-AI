import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlannerView } from './components/planner/PlannerView';
import { PracticeView } from './components/practice/PracticeView';
import { AgentActivityView } from './components/agent/AgentActivityView';
import { ProgressView } from './components/progress/ProgressView';
import { DemoWorkflowModal } from './components/modals/DemoWorkflowModal';
import { SettingsModal } from './components/modals/SettingsModal';
import {
  initialStudentState,
  initialStudyPlan,
  initialAgentLogs,
  sampleQuestions,
  weeklyStudyData,
} from './data/mockData';
import {
  StudentState,
  StudyPlan,
  PracticeQuestion,
  AnswerEvaluation,
  AgentActivityEvent,
  DifficultyLevel,
  AgentAction,
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [student, setStudent] = useState<StudentState>(initialStudentState);
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(initialStudyPlan);
  const [agentLogs, setAgentLogs] = useState<AgentActivityEvent[]>(initialAgentLogs);
  const [weeklyData] = useState(weeklyStudyData);

  // Practice state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion>(sampleQuestions[0]);
  const [questionNumber, setQuestionNumber] = useState(1);

  // Modals & Navigation
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Navigation handlers
  const handleStartPractice = (topic?: string) => {
    if (topic) {
      const found = sampleQuestions.find((q) => q.topic.toLowerCase().includes(topic.toLowerCase()));
      if (found) {
        setCurrentQuestion(found);
      }
    }
    setCurrentTab('practice');
  };

  const handleViewPlan = () => {
    setCurrentTab('planner');
  };

  const handleFollowRecommendation = () => {
    handleStartPractice(student.recommendation.topic);
  };

  // Called when an answer is evaluated by AI
  const handleAnswerEvaluated = (
    evaluation: AnswerEvaluation,
    question: PracticeQuestion,
    _answer: string
  ) => {
    const newScore = Math.round((student.currentScore * 4 + evaluation.score * 10) / 5);
    const newWeakTopics = [...student.weakTopics];
    const newStrongTopics = [...student.strongTopics];

    if (evaluation.score < 6) {
      if (!newWeakTopics.includes(question.topic)) {
        newWeakTopics.push(question.topic);
      }
    } else if (evaluation.score >= 8) {
      if (!newStrongTopics.includes(question.topic)) {
        newStrongTopics.push(question.topic);
      }
      const idx = newWeakTopics.indexOf(question.topic);
      if (idx !== -1) newWeakTopics.splice(idx, 1);
    }

    // Update recommendation based on the evaluation nextAction
    setStudent({
      ...student,
      currentScore: newScore,
      weakTopics: newWeakTopics,
      strongTopics: newStrongTopics,
      recommendation: {
        title: evaluation.recommendedAction || 'Recommended Study Step',
        action: evaluation.nextAction,
        actionLabel: evaluation.recommendedAction,
        reason: evaluation.nextActionReasoning,
        estimatedMinutes: evaluation.nextAction === 'START_REVISION' ? 25 : 15,
        topic: question.topic,
      },
    });

    // Add agent activity log
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const evalLog: AgentActivityEvent = {
      id: `act-${Date.now()}-1`,
      timestamp: timeStr,
      title: 'Answer Evaluated',
      action: 'ANSWER_EVALUATED',
      description: `Evaluation score: ${evaluation.score}/10 on ${question.topic}. ${
        evaluation.isCorrect ? 'Correct solution' : 'Gaps detected'
      }. Reasoning: ${evaluation.reasoningAnalysis}`,
      status: 'completed',
      category: 'evaluation',
      badgeColor: evaluation.score >= 8 ? 'emerald' : 'amber',
    };

    const decisionLog: AgentActivityEvent = {
      id: `act-${Date.now()}-2`,
      timestamp: timeStr,
      title: 'Next Action Chosen',
      action: evaluation.nextAction,
      description: evaluation.nextActionReasoning,
      status: 'in_progress',
      category: 'decision',
      badgeColor: 'magenta',
    };

    setAgentLogs((prev) => [decisionLog, evalLog, ...prev]);
  };

  // Called when student moves to next question
  const handleNextQuestion = async (targetTopic?: string, difficulty?: DifficultyLevel) => {
    const nextIdx = (currentQuestionIndex + 1) % sampleQuestions.length;
    setCurrentQuestionIndex(nextIdx);
    setQuestionNumber((prev) => prev + 1);

    if (targetTopic) {
      const match = sampleQuestions.find((q) => q.topic.toLowerCase().includes(targetTopic.toLowerCase()));
      if (match) {
        setCurrentQuestion({
          ...match,
          difficulty: difficulty || match.difficulty,
        });
        return;
      }
    }

    // Attempt dynamic AI generation
    try {
      const nextTopic = targetTopic || sampleQuestions[nextIdx].topic;
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: student.subject,
          topic: nextTopic,
          difficulty: difficulty || student.currentDifficulty,
          previousScore: student.currentScore,
        }),
      });
      const data = await res.json();
      if (data.success && data.question) {
        setCurrentQuestion(data.question);
        return;
      }
    } catch (e) {
      // Fallback
    }

    setCurrentQuestion(sampleQuestions[nextIdx]);
  };

  const handleStartRevision = (topic: string) => {
    handleStartPractice(topic);
  };

  const handleTriggerDecision = (action: AgentAction, reason: string) => {
    setStudent((prev) => ({
      ...prev,
      recommendation: {
        ...prev.recommendation,
        action,
        reason,
      },
    }));

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: AgentActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: timeStr,
      title: 'Manual Simulator Decision',
      action,
      description: reason,
      status: 'in_progress',
      category: 'decision',
      badgeColor: 'magenta',
    };
    setAgentLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 antialiased">
      {/* 1. Global Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        student={student}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header Bar */}
        <Header
          student={student}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              student={student}
              weeklyData={weeklyData}
              onStartPractice={handleStartPractice}
              onViewPlan={handleViewPlan}
              onFollowRecommendation={handleFollowRecommendation}
            />
          )}

          {currentTab === 'planner' && (
            <PlannerView
              currentPlan={studyPlan}
              onUpdatePlan={setStudyPlan}
              onSelectTopicForPractice={handleStartPractice}
            />
          )}

          {currentTab === 'practice' && (
            <PracticeView
              currentQuestion={currentQuestion}
              currentScore={student.currentScore}
              questionNumber={questionNumber}
              onAnswerEvaluated={handleAnswerEvaluated}
              onNextQuestion={handleNextQuestion}
              onStartRevision={handleStartRevision}
            />
          )}

          {currentTab === 'activity' && (
            <AgentActivityView
              student={student}
              logs={agentLogs}
              onTriggerDecision={handleTriggerDecision}
              onNavigateToPractice={handleStartPractice}
              onNavigateToPlanner={handleViewPlan}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressView
              student={student}
              weeklyData={weeklyData}
              onPracticeTopic={handleStartPractice}
            />
          )}
        </main>
      </div>

      {/* 3. Interactive Modals */}
      <DemoWorkflowModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onJumpToTab={(tab, topic) => {
          setCurrentTab(tab);
          if (topic) handleStartPractice(topic);
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        student={student}
        onUpdateStudent={setStudent}
      />
    </div>
  );
}
