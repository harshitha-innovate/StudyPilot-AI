import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
  RotateCcw,
  Target,
  Sliders,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Activity,
  Terminal,
} from 'lucide-react';
import { StudentState, AgentActivityEvent, AgentAction } from '../../types';

interface AgentActivityViewProps {
  student: StudentState;
  logs: AgentActivityEvent[];
  onTriggerDecision: (action: AgentAction, reason: string) => void;
  onNavigateToPractice: (topic?: string) => void;
  onNavigateToPlanner: () => void;
}

export const AgentActivityView: React.FC<AgentActivityViewProps> = ({
  student,
  logs,
  onTriggerDecision,
  onNavigateToPractice,
  onNavigateToPlanner,
}) => {
  const [activeSimulatorScenario, setActiveSimulatorScenario] = useState<string | null>(null);

  const simulateScenario = (scenario: 'high' | 'weak' | 'stuck') => {
    setActiveSimulatorScenario(scenario);
    if (scenario === 'high') {
      onTriggerDecision(
        'INCREASE_DIFFICULTY',
        'Student achieved 92% average over consecutive questions. Agent escalates difficulty to Advanced to maximize peak retention.'
      );
    } else if (scenario === 'weak') {
      onTriggerDecision(
        'START_REVISION',
        'Recent evaluation on Boolean simplification scored 45%. Agent mandates 25-minute axiomatic review before circuit questions.'
      );
    } else if (scenario === 'stuck') {
      onTriggerDecision(
        'GIVE_CONCEPT_EXPLANATION',
        'Repeated difficulty detected on universal gate synthesis. Agent provides step-by-step NAND/NOR equivalence diagram.'
      );
    }
  };

  const actionRules = [
    {
      condition: 'Score ≥ 80%',
      action: 'MOVE_TO_NEXT_TOPIC / INCREASE_DIFFICULTY',
      explanation: 'Concept mastered; advance to higher cognitive challenge.',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      condition: 'Score 50% – 79%',
      action: 'GENERATE_ANOTHER_QUESTION',
      explanation: 'Foundations in place; one more problem cements application.',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      condition: 'Score < 50%',
      action: 'START_REVISION / GIVE_CONCEPT_EXPLANATION',
      explanation: 'Identifies gap; initiates focused review before exam.',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      condition: 'Repeated Scores ≥ 90%',
      action: 'INCREASE_DIFFICULTY',
      explanation: 'Escalates question tier to university honors standard.',
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
    {
      condition: 'Repeated Scores < 50%',
      action: 'LOWER_DIFFICULTY / CONCEPT EXPLANATION',
      explanation: 'De-escalates friction and re-establishes base theorems.',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 1. Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-950/50 px-3 py-1 text-xs font-semibold text-violet-300">
          <Bot className="h-3.5 w-3.5 text-cyan-400" />
          <span>Autonomous Agent Telemetry</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Agent Activity Monitor
        </h2>
        <p className="mt-1 text-sm text-slate-300 max-w-3xl">
          StudyPilot is not a chatbot. It is a goal-seeking autonomous agent that observes student outcomes, maintains state memory, evaluates mathematical solutions, and decides the next best action.
        </p>
      </div>

      {/* 2. Top Prominent Card: AGENT DECISION CARD */}
      <section className="relative overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-950/50 via-slate-900 to-pink-950/40 p-6 shadow-2xl backdrop-blur-xl lg:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-violet-500/20 pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/30">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">🤖 Agent Decision</h3>
                <span className="rounded-full border border-cyan-400/30 bg-cyan-950/40 px-2.5 py-0.5 text-xs font-mono font-semibold text-cyan-300">
                  Real-Time Heuristic
                </span>
              </div>
              <p className="text-xs text-slate-300">Autonomous evaluation based on latest session telemetry</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-right">
            <p className="text-[10px] text-slate-400 font-mono">Decision Trigger</p>
            <p className="text-sm font-bold font-mono text-pink-400">{student.recommendation.action}</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wider text-violet-300 font-semibold">Current Recommendation:</p>
          <h4 className="mt-1 text-2xl font-extrabold text-white tracking-tight">
            “{student.recommendation.action}”
          </h4>

          <div className="mt-4 rounded-xl border border-violet-500/20 bg-slate-950/80 p-4">
            <p className="text-xs font-semibold text-slate-400 font-mono">Agent Reasoning Log:</p>
            <p className="mt-1 text-sm text-slate-200 leading-relaxed font-normal">
              “{student.recommendation.reason}”
            </p>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToPractice(student.recommendation.topic)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Follow Recommendation</span>
            </button>

            <button
              onClick={() => onNavigateToPractice()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <span>Continue Anyway</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Grid: Live Agent Memory State + Interactive Decision Engine Simulator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Memory State Inspector (Left 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Agent State Inspector
              </h3>
            </div>

            <div className="mt-4 flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Target Subject:</span>
                <span className="text-white text-right font-semibold">{student.subject.split(' ')[0]} ...</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Exam Deadline:</span>
                <span className="text-amber-400 font-semibold">{student.examDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Target Score:</span>
                <span className="text-pink-400 font-bold">{student.targetScore}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Current Average:</span>
                <span className="text-cyan-400 font-bold">{student.currentScore}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Weak Topics:</span>
                <span className="text-rose-400 font-semibold">{student.weakTopics.join(', ')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Strong Topics:</span>
                <span className="text-emerald-400 font-semibold">{student.strongTopics.join(', ')}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Current Difficulty:</span>
                <span className="text-violet-300 font-semibold">{student.currentDifficulty}</span>
              </div>
            </div>
          </div>

          {/* Interactive Agent Simulator for Workshop Demo */}
          <div className="rounded-2xl border border-violet-500/20 bg-slate-900/70 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Workshop Simulator</h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Live Inject</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Trigger instant agent state evaluations to demonstrate how the agent adapts to student actions:
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => simulateScenario('high')}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-left transition-colors hover:border-emerald-500/40 hover:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-white">Simulate High Score (95%)</p>
                    <p className="text-[10px] text-slate-400">Triggers INCREASE_DIFFICULTY</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => simulateScenario('weak')}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-left transition-colors hover:border-amber-500/40 hover:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-amber-400" />
                  <div>
                    <p className="font-semibold text-white">Simulate Low Score (40%)</p>
                    <p className="text-[10px] text-slate-400">Triggers START_REVISION</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => simulateScenario('stuck')}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-left transition-colors hover:border-violet-500/40 hover:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-violet-400" />
                  <div>
                    <p className="font-semibold text-white">Simulate Repeated Stalling</p>
                    <p className="text-[10px] text-slate-400">Triggers CONCEPT_EXPLANATION</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Activity Timeline (Right 7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-pink-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Agent Decision & Activity Timeline
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">7 Events Recorded</span>
          </div>

          <div className="mt-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {logs.map((log) => {
              const isCurrent = log.status === 'in_progress';
              return (
                <div key={log.id} className="relative mb-6 last:mb-0 group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-slate-950 ${
                      isCurrent ? 'bg-pink-500 animate-ping' : 'bg-emerald-400'
                    }`}
                  />
                  <div
                    className={`absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-slate-950 ${
                      isCurrent ? 'bg-pink-500' : 'bg-emerald-400'
                    }`}
                  />

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors group-hover:border-violet-500/40">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-cyan-400">{log.timestamp}</span>
                        <span className="text-xs font-bold text-white">{log.title}</span>
                      </div>
                      <span className="rounded-md border border-violet-500/20 bg-violet-950/30 px-2 py-0.5 text-[10px] font-mono text-violet-300">
                        {log.action}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-300 leading-relaxed font-normal">
                      {log.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Agent Decision Rules Table */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white">Agentic Decision Rule Matrix</h3>
        <p className="text-xs text-slate-400">Autonomous criteria executed by StudyPilot to direct the student's study flow</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Performance Trigger</th>
                <th className="py-2.5 px-3">Agent Action</th>
                <th className="py-2.5 px-3">Pedagogical Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {actionRules.map((rule, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{rule.condition}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${rule.badgeColor}`}>
                      {rule.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">{rule.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
