import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  X,
  Target,
  Brain,
  Sliders,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface DemoWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTab: (tab: string, topic?: string) => void;
}

export const DemoWorkflowModal: React.FC<DemoWorkflowModalProps> = ({
  isOpen,
  onClose,
  onJumpToTab,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      name: 'Goal Ingestion',
      icon: Target,
      tag: 'INPUT',
      agentSays: 'Alex specifies: Midterm Exam Tomorrow in Digital Logic. Goal: 80% target with 5 hours of study time.',
      actionDetail: 'The agent parses curriculum objectives, target score delta, and creates an academic state vector.',
      jumpTab: 'planner',
    },
    {
      num: 2,
      name: 'Cognitive Analysis',
      icon: Sliders,
      tag: 'REASONING',
      agentSays: 'Analyzing 5 syllabus units against 5 hours. Found: 60m blocks are optimal. Detected Boolean Algebra as high-yield prerequisite.',
      actionDetail: 'Allocates cognitive weight and computes optimal time distribution before exam lock-in.',
      jumpTab: 'planner',
    },
    {
      num: 3,
      name: 'Adaptive Planning',
      icon: Sparkles,
      tag: 'PLANNING',
      agentSays: 'Generated 5-stage chronological schedule: Boolean Algebra (09:00 AM) → K-Maps (10:00 AM) → Logic Gates (11:00 AM) → Computer Org (11:45 AM) → AI Mock Test (12:45 PM).',
      actionDetail: 'Creates dynamic timeline items with difficulty ratings and contingency slots.',
      jumpTab: 'planner',
    },
    {
      num: 4,
      name: 'Question Generation',
      icon: Brain,
      tag: 'GENERATION',
      agentSays: 'Generating intermediate practice problem for Boolean Algebra: "Simplify F = A + AB using Boolean laws."',
      actionDetail: 'Uses Gemini 3.8 Flash to synthesize target exam-level question requiring specific theorem proof.',
      jumpTab: 'practice',
    },
    {
      num: 5,
      name: 'Answer Evaluation',
      icon: CheckCircle2,
      tag: 'EVALUATION',
      agentSays: 'Student submits solution. Agent evaluates correctness (F = A is correct), verifies factoring, notes omitted theorem citation (Absorption Law). Score: 9/10.',
      actionDetail: 'Deep semantic analysis of mathematical steps, checking theorem rigor and partial credit.',
      jumpTab: 'practice',
    },
    {
      num: 6,
      name: 'Weak Area Detection',
      icon: AlertTriangle,
      tag: 'DETECTION',
      agentSays: 'Telemetry reveals student is fast on gates but vulnerable when multi-variable absorption is combined with K-Maps.',
      actionDetail: 'Updates student mastery matrix: Boolean Algebra flagged for immediate reinforcement.',
      jumpTab: 'activity',
    },
    {
      num: 7,
      name: 'Agent Decision',
      icon: Bot,
      tag: 'DECISION',
      agentSays: 'Agent invokes Decision Engine: Selects START_REVISION. Reason: 25 minutes of targeted Boolean law review will elevate consistency before high-stakes K-Map problems.',
      actionDetail: 'Executes autonomous rule matrix: Rather than blind text generation, agent chooses pedagogical intervention.',
      jumpTab: 'activity',
    },
    {
      num: 8,
      name: 'Next Best Action',
      icon: Lightbulb,
      tag: 'ACTION',
      agentSays: 'Dashboard and Practice views are dynamically re-routed. New high-priority revision card active.',
      actionDetail: 'The student plan auto-adapts without requiring manual rescheduling. Continuous learning loop closed!',
      jumpTab: 'dashboard',
    },
  ];

  const current = steps[activeStep];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-violet-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950/40 p-6 shadow-2xl sm:p-8">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-pink-500 text-white font-bold">
              🎬
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Agentic AI Architecture Walkthrough</h3>
              <p className="text-xs text-slate-400">Step-by-step breakdown of StudyPilot's autonomous loop</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close walkthrough"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Stepper Ribbon */}
        <div className="mt-6 flex items-center justify-between gap-1 overflow-x-auto pb-2">
          {steps.map((s, idx) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold transition-all ${
                activeStep === idx
                  ? 'bg-gradient-to-r from-blue-600 to-pink-500 text-white ring-2 ring-violet-400/50 scale-110'
                  : idx < activeStep
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {idx < activeStep ? '✓' : s.num}
            </button>
          ))}
        </div>

        {/* Current Step Showcase Card */}
        <div className="mt-6 rounded-2xl border border-violet-500/30 bg-slate-950/80 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-violet-500/20 p-2 text-violet-400">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                  Step {current.num} of {steps.length} · {current.tag}
                </span>
                <h4 className="text-lg font-bold text-white">{current.name}</h4>
              </div>
            </div>
            <span className="rounded-full border border-violet-500/30 bg-violet-950/40 px-3 py-0.5 text-xs font-mono text-violet-300">
              Agent Phase
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-[11px] font-mono text-slate-400">Agent Dialogue / Monologue:</p>
            <p className="mt-1 text-sm text-slate-200 leading-relaxed font-medium">
              “{current.agentSays}”
            </p>
          </div>

          <p className="mt-4 text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">System Mechanism:</strong> {current.actionDetail}
          </p>
        </div>

        {/* Modal Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep(0)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => {
                onJumpToTab(current.jumpTab);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-slate-700"
            >
              <span>View in App: {current.jumpTab} →</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Previous
              </button>
            )}

            {activeStep < steps.length - 1 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 hover:scale-[1.02]"
              >
                <span>Next Step</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onJumpToTab('practice');
                  onClose();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 hover:scale-[1.02]"
              >
                <span>Experience Live Practice</span>
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
