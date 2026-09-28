import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Target,
  Sparkles,
  Bot,
  CheckCircle2,
  Circle,
  AlertCircle,
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';
import { StudyPlan, DifficultyLevel, PlanTimelineItem } from '../../types';

interface PlannerViewProps {
  currentPlan: StudyPlan;
  onUpdatePlan: (plan: StudyPlan) => void;
  onSelectTopicForPractice: (topic: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  currentPlan,
  onUpdatePlan,
  onSelectTopicForPractice,
}) => {
  // Form States
  const [subject, setSubject] = useState(currentPlan.subject);
  const [examDate, setExamDate] = useState(currentPlan.examDate);
  const [availableHours, setAvailableHours] = useState(currentPlan.availableHours);
  const [targetScore, setTargetScore] = useState(currentPlan.targetScore);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(currentPlan.difficulty);
  const [learningGoal, setLearningGoal] = useState(currentPlan.learningGoal);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Boolean Algebra',
    'Logic Gates',
    'K-Maps',
    'Combinational Circuits',
    'Computer Organization',
  ]);

  // Available topic bank
  const allTopics = [
    'Boolean Algebra',
    'Logic Gates',
    'K-Maps',
    'Combinational Circuits',
    'Sequential Circuits',
    'Computer Organization',
    'Instruction Cycles & Bus',
    'Memory Architecture',
  ];

  // AI Agent Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    { label: 'Analyzing your goal...', detail: 'Understanding exam requirements' },
    { label: 'Analyzing available time...', detail: 'Calculating available study hours' },
    { label: 'Analyzing topics...', detail: 'Identifying topic priorities & cognitive load' },
    { label: 'Creating study strategy...', detail: 'Building personalized schedule' },
    { label: 'Preparing practice session...', detail: 'Generating recommended questions' },
    { label: 'Finalizing plan...', detail: 'Study plan ready' },
  ];

  const toggleTopic = (t: string) => {
    if (selectedTopics.includes(t)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((item) => item !== t));
      }
    } else {
      setSelectedTopics([...selectedTopics, t]);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep(0);

    // Sequence the agentic thought stages
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          examDate,
          availableHours,
          targetScore,
          topics: selectedTopics,
          difficulty,
          learningGoal,
        }),
      });

      const data = await response.json();
      if (data.success && data.plan) {
        onUpdatePlan({
          ...currentPlan,
          subject,
          examDate,
          availableHours,
          targetScore,
          difficulty,
          learningGoal,
          summary: data.plan.summary,
          strategy: data.plan.strategy,
          timeline: data.plan.timeline || currentPlan.timeline,
          agentNotes: data.plan.agentNotes,
          createdAt: 'Just now',
        });
      }
    } catch (err) {
      console.error('Plan generation failed, keeping local fallback:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleTimelineItem = (id: string) => {
    const updated = currentPlan.timeline.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdatePlan({ ...currentPlan, timeline: updated });
  };

  const completedCount = currentPlan.timeline.filter((i) => i.completed).length;
  const totalMinutes = currentPlan.timeline.reduce((acc, i) => acc + (i.durationMinutes || 60), 0);
  const completedMinutes = currentPlan.timeline
    .filter((i) => i.completed)
    .reduce((acc, i) => acc + (i.durationMinutes || 60), 0);
  const planProgressPercent = Math.round((completedMinutes / (totalMinutes || 1)) * 100);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-950/50 px-3 py-1 text-xs font-semibold text-violet-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Continuous Adaptive Engine</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Create Your Personalized Study Plan
        </h2>
        <p className="mt-1 text-sm text-slate-300 max-w-2xl">
          Tell StudyPilot your goal. Your AI agent will analyze syllabus depth, calibrate to your available time, and dynamically adjust based on practice scores.
        </p>
      </div>

      {/* Main Grid: Form on Left, Timeline on Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Planner Input Form (Left 5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <Sliders className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Study Constraints</h3>
          </div>

          <form onSubmit={handleCreatePlan} className="mt-5 flex flex-col gap-4">
            {/* Subject */}
            <div>
              <label className="text-xs font-medium text-slate-300">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="Digital Logic and Computer Organization">Digital Logic & Computer Organization</option>
                <option value="Data Structures and Algorithms">Data Structures & Algorithms</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Computer Architecture">Computer Architecture</option>
                <option value="Discrete Mathematics">Discrete Mathematics</option>
              </select>
            </div>

            {/* Exam Date */}
            <div>
              <label className="text-xs font-medium text-slate-300">Exam Timeline</label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {['Tomorrow', 'In 3 Days', 'Next Week'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setExamDate(preset)}
                    className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                      examDate === preset
                        ? 'bg-violet-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Study Time Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300">Available Study Time</span>
                <span className="font-mono text-cyan-400 font-bold">{availableHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={availableHours}
                onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                className="mt-2 w-full accent-violet-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>1h Sprint</span>
                <span>6h Deep Study</span>
                <span>12h Full Day</span>
              </div>
            </div>

            {/* Target Score Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-300">Target Score</span>
                <span className="font-mono text-pink-400 font-bold">{targetScore}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={targetScore}
                onChange={(e) => setTargetScore(parseInt(e.target.value))}
                className="mt-2 w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Topics Multi-Select */}
            <div>
              <label className="text-xs font-medium text-slate-300">Select Focus Topics</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {allTopics.map((t) => {
                  const isSelected = selectedTopics.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTopic(t)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-violet-600/90 text-white shadow-sm ring-1 ring-violet-400/40'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      <span>{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Segmented */}
            <div>
              <label className="text-xs font-medium text-slate-300">Starting Difficulty</label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                      difficulty === d
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Goal */}
            <div>
              <label className="text-xs font-medium text-slate-300">Learning Goal</label>
              <select
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="Pass Exam">Pass Exam (Safeguard 60%)</option>
                <option value="Score 70%">Score 70% (Solid Foundation)</option>
                <option value="Score 80%">Score 80% (Dean's Honor Target)</option>
                <option value="Score 90%+">Score 90%+ (Comprehensive Mastery)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.01] hover:shadow-violet-600/50 active:scale-[0.99] disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isProcessing ? 'Agent Planning...' : '✨ Create My AI Study Plan'}</span>
            </button>
          </form>
        </div>

        {/* Generated Timeline (Right 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* AI Agent Processing Animation Modal / Box */}
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-violet-500/40 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl min-h-[480px]">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 shadow-xl shadow-violet-500/30 animate-pulse">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">StudyPilot Agent Active</h3>
              <p className="text-xs text-violet-300">Synthesizing personalized curriculum...</p>

              <div className="mt-8 w-full max-w-md flex flex-col gap-3">
                {processingSteps.map((step, idx) => {
                  const isDone = idx < processingStep;
                  const isCurrent = idx === processingStep;
                  return (
                    <div
                      key={step.label}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                        isCurrent
                          ? 'border-violet-500/60 bg-violet-950/40 text-white scale-[1.02]'
                          : isDone
                          ? 'border-emerald-500/30 bg-slate-950/40 text-slate-300'
                          : 'border-slate-800/40 bg-slate-950/20 text-slate-400 opacity-40'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-600 shrink-0" />
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-xs font-semibold">{step.label}</p>
                        <p className="text-[11px] text-slate-400">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
              {/* Timeline Header & Progress */}
              <div className="flex flex-col justify-between gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">Current AI Plan</span>
                    <span className="text-[11px] font-mono text-slate-400">· Created {currentPlan.createdAt}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-white">{currentPlan.summary}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Plan Completed</p>
                    <p className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                      {completedCount} of {currentPlan.timeline.length} ({planProgressPercent}%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Strategy Card */}
              <div className="mt-4 rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-950/30 to-blue-950/30 p-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-violet-400" />
                  <span className="text-xs font-semibold text-violet-300">Agent Strategy Rationale</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{currentPlan.strategy}</p>
              </div>

              {/* Timeline Items */}
              <div className="mt-6 flex flex-col gap-3">
                {currentPlan.timeline.map((item, index) => {
                  const isHigh = item.priority === 'HIGH';
                  return (
                    <div
                      key={item.id}
                      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-200 ${
                        item.completed
                          ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
                          : 'border-slate-800 bg-slate-950/60 hover:border-violet-500/40 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Completion Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleTimelineItem(item.id)}
                          className="mt-0.5 rounded-lg p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                          aria-label={item.completed ? 'Mark incomplete' : 'Mark completed'}
                        >
                          {item.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-950" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-cyan-400">{item.time}</span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isHigh
                                  ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              Priority: {item.priority}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.difficulty} · {item.durationMinutes}m
                            </span>
                          </div>

                          <h4 className={`mt-1.5 text-sm font-bold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                            {item.topic}
                          </h4>
                          <p className="text-xs text-slate-300">{item.activity}</p>

                          {/* Agent Reasoning */}
                          <p className="mt-1.5 text-[11px] text-slate-400 italic">
                            Agent note: {item.agentReasoning}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => onSelectTopicForPractice(item.topic)}
                        className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-violet-600 hover:text-white"
                      >
                        <Zap className="h-3 w-3 text-amber-400" />
                        <span>Practice Now</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Agent Note */}
              {currentPlan.agentNotes && (
                <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-400">
                  <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>{currentPlan.agentNotes}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
