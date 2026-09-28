import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  HelpCircle,
  SkipForward,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { PracticeQuestion, AnswerEvaluation, DifficultyLevel, AgentAction } from '../../types';

interface PracticeViewProps {
  currentQuestion: PracticeQuestion;
  currentScore: number;
  questionNumber: number;
  totalQuestions?: number;
  onAnswerEvaluated: (evaluation: AnswerEvaluation, question: PracticeQuestion, answer: string) => void;
  onNextQuestion: (topic?: string, difficulty?: DifficultyLevel) => void;
  onStartRevision: (topic: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  currentQuestion,
  currentScore,
  questionNumber,
  totalQuestions = 10,
  onAnswerEvaluated,
  onNextQuestion,
  onStartRevision,
}) => {
  const [studentAnswer, setStudentAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);

  // Quick mathematical symbol helper buttons
  const mathSymbols = ['+', '·', "'", '⊕', '(', ')', '0', '1'];

  const insertSymbol = (sym: string) => {
    setStudentAnswer((prev) => prev + sym);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!studentAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: currentQuestion.questionText,
          studentAnswer,
          topic: currentQuestion.topic,
          difficulty: currentQuestion.difficulty,
          keyConcepts: currentQuestion.keyConcepts,
        }),
      });

      const data = await response.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
        onAnswerEvaluated(data.evaluation, currentQuestion, studentAnswer);
      }
    } catch (err) {
      console.error('Answer evaluation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (type: 'correct' | 'weak') => {
    if (type === 'correct') {
      setStudentAnswer(
        'F = A + AB = A(1 + B). Since (1 + B) = 1 by Annulment Law, F = A · 1 = A. This matches the Absorption Law.'
      );
    } else {
      setStudentAnswer('F = AB + A, so maybe F = B? I am unsure how to reduce the A variable.');
    }
  };

  const handleContinue = () => {
    if (!evaluation) return;

    const action = evaluation.nextAction;
    if (action === 'START_REVISION') {
      onStartRevision(currentQuestion.topic);
    } else if (action === 'INCREASE_DIFFICULTY') {
      onNextQuestion(currentQuestion.topic, 'Advanced');
    } else if (action === 'LOWER_DIFFICULTY') {
      onNextQuestion(currentQuestion.topic, 'Beginner');
    } else {
      onNextQuestion();
    }

    setStudentAnswer('');
    setEvaluation(null);
    setShowHint(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Header & Live Context Bar */}
      <div>
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-950/50 px-3 py-1 text-xs font-semibold text-violet-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Real-Time Adaptive Agent</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">AI Practice</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Your agent adapts every question based on your performance in real time.
            </p>
          </div>

          {/* Context Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-left">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Current Topic</p>
              <p className="text-xs font-bold text-violet-300">{currentQuestion.topic}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-left">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Difficulty</p>
              <p className="text-xs font-bold text-cyan-400">{currentQuestion.difficulty}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-left">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Question</p>
              <p className="text-xs font-bold text-white font-mono">{questionNumber} of {totalQuestions}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-left">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Score</p>
              <p className="text-xs font-bold text-pink-400 font-mono">{currentScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Question Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md shadow-xl lg:p-8">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Problem #{questionNumber} · {currentQuestion.subject}
          </span>
          <span className="text-xs text-cyan-400 font-mono">Exam Focus: 80% Target</span>
        </div>

        {/* Question Text */}
        <div className="mt-5 rounded-xl border border-violet-500/20 bg-slate-950/80 p-5">
          <p className="text-base text-slate-100 font-medium leading-relaxed whitespace-pre-line sm:text-lg">
            {currentQuestion.questionText}
          </p>

          {/* Key Concepts Required */}
          {currentQuestion.keyConcepts && currentQuestion.keyConcepts.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400">Target Theorems:</span>
              {currentQuestion.keyConcepts.map((c) => (
                <span
                  key={c}
                  className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-[11px] font-mono text-violet-300"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Math Quick Symbols */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1">Quick symbols:</span>
          {mathSymbols.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => insertSymbol(s)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 hover:border-violet-500 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Answer Input Area */}
        <div className="mt-3">
          <label className="text-xs font-medium text-slate-300">Your Solution & Reasoning:</label>
          <textarea
            rows={5}
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder="Type your simplified Boolean expression and cite the laws used (e.g. F = A because A(1+B) by Distributive Law)..."
            disabled={evaluation !== null}
            className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono disabled:opacity-70"
          />
        </div>

        {/* Demo Fast Fills for Workshop Demo */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Workshop Demo Fills:</span>
            <button
              type="button"
              onClick={() => handleQuickFill('correct')}
              className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] text-emerald-400 hover:bg-slate-700"
            >
              ✓ Strong Answer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('weak')}
              className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] text-amber-400 hover:bg-slate-700"
            >
              ⚠ Weak Answer
            </button>
          </div>

          {currentQuestion.hint && (
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Ask AI for Hint'}</span>
            </button>
          )}
        </div>

        {/* AI Hint Drawer */}
        {showHint && currentQuestion.hint && (
          <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-amber-200">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Lightbulb className="h-4 w-4" />
              <span>StudyPilot Hint:</span>
            </div>
            <p className="mt-1 text-slate-300 leading-relaxed">{currentQuestion.hint}</p>
          </div>
        )}

        {/* Action Buttons when NOT evaluated yet */}
        {!evaluation && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onNextQuestion()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
              <span>Skip Question</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!studentAnswer.trim() || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] hover:shadow-violet-600/50 disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>AI Agent Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 3. AI Evaluation Panel (Appears after submission) */}
      {evaluation && (
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950/30 p-6 shadow-2xl backdrop-blur-xl lg:p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold font-mono text-xl ${
                  evaluation.score >= 8
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 ring-4 ring-emerald-500/10'
                    : evaluation.score >= 5
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 ring-4 ring-amber-500/10'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 ring-4 ring-rose-500/10'
                }`}
              >
                {evaluation.score}/10
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">AI Evaluation</h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      evaluation.score >= 8
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : evaluation.score >= 5
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    Understanding: {evaluation.conceptUnderstanding}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Evaluated with Gemini 3.8 Flash Engine
                </p>
              </div>
            </div>

            {/* Next Action Badge */}
            <div className="rounded-xl border border-violet-500/30 bg-violet-950/40 p-3 text-left">
              <p className="text-[10px] text-violet-300 uppercase font-semibold">Agent Decision</p>
              <p className="text-sm font-bold text-cyan-300 font-mono">{evaluation.nextAction}</p>
            </div>
          </div>

          {/* Breakdown checklist */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
              {evaluation.correctFinalAnswer ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
              <span className={evaluation.correctFinalAnswer ? 'text-slate-200' : 'text-rose-300'}>
                {evaluation.correctFinalAnswer ? 'Correct final answer' : 'Incorrect or incomplete final answer'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
              {evaluation.correctReasoning ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
              )}
              <span className={evaluation.correctReasoning ? 'text-slate-200' : 'text-amber-300'}>
                {evaluation.correctReasoning ? 'Correct algebraic reasoning' : 'Incomplete theorem application'}
              </span>
            </div>
          </div>

          {/* Minor Issues Warning if any */}
          {evaluation.minorIssues && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Minor issue: </span>
                <span>{evaluation.minorIssues}</span>
              </div>
            </div>
          )}

          {/* AI Recommendation Box */}
          <div className="mt-4 rounded-xl border border-violet-500/30 bg-slate-950/80 p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-300">AI Recommendation</span>
            </div>
            <p className="mt-1 text-sm text-slate-200 font-medium">
              {evaluation.aiRecommendation}
            </p>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              {evaluation.nextActionReasoning}
            </p>
          </div>

          {/* Model Solution Dropdown */}
          {evaluation.modelSolution && (
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase font-mono">Model Solution</p>
              <p className="mt-1 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                {evaluation.modelSolution}
              </p>
            </div>
          )}

          {/* Next Action Button */}
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              <span>{evaluation.nextAction === 'START_REVISION' ? 'Follow Recommendation: Start Revision' : 'Continue Learning'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
