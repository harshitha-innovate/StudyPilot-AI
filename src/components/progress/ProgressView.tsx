import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Flame,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Target,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';
import { StudentState, WeeklyStudyDay } from '../../types';
import { topicMasteryData } from '../../data/mockData';

interface ProgressViewProps {
  student: StudentState;
  weeklyData: WeeklyStudyDay[];
  onPracticeTopic: (topic: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  student,
  weeklyData,
  onPracticeTopic,
}) => {
  // Score progression points for trend graph
  const scoreTrend = [
    { label: 'Week 1', score: 68 },
    { label: 'Week 2', score: 72 },
    { label: 'Week 3', score: 75 },
    { label: 'Week 4', score: 79 },
    { label: 'Current', score: 82 },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 1. Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-950/50 px-3 py-1 text-xs font-semibold text-violet-300">
          <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
          <span>Performance Analytics & Retention Metrics</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Progress & Topic Mastery
        </h2>
        <p className="mt-1 text-sm text-slate-300 max-w-2xl">
          Continuous tracking of question accuracy, study velocity, and curriculum retention across all syllabus units.
        </p>
      </div>

      {/* 2. Top Metric Ribbon */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[11px] font-medium text-slate-400">Overall Progress</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono">82%</span>
            <span className="text-xs text-emerald-400">↗ +4%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dean's honor track</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[11px] font-medium text-slate-400">Study Streak</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-400 font-mono">{student.streakDays}</span>
            <span className="text-xs text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-amber-400/90 mt-1">🔥 Top 5% of cohort</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[11px] font-medium text-slate-400">Questions Attempted</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-cyan-400 font-mono">126</span>
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">84% First-attempt pass</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[11px] font-medium text-slate-400">Topics Completed</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-pink-400 font-mono">8</span>
            <span className="text-xs text-slate-400">of 10</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">2 Units remaining</p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[11px] font-medium text-slate-400">Average Score</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-400 font-mono">82%</span>
            <span className="text-xs text-slate-400">Target 80%</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">Target achieved</p>
        </div>
      </section>

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Score Improvement Over Time */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Score Progression</h3>
              <p className="text-xs text-slate-400">Longitudinal improvement over 5 study milestones</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">+14% Growth</span>
          </div>

          <div className="mt-8 flex items-end justify-between gap-3 h-44 px-4 pb-2">
            {scoreTrend.map((point, idx) => {
              const heightPercent = Math.round(((point.score - 50) / 50) * 100);
              const isCurrent = idx === scoreTrend.length - 1;
              return (
                <div key={point.label} className="flex flex-col items-center gap-2 flex-1">
                  <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-pink-400' : 'text-slate-300'}`}>
                    {point.score}%
                  </span>
                  <div className="w-full max-w-[36px] flex flex-col justify-end h-32 rounded-t-lg overflow-hidden bg-slate-800/80">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isCurrent
                          ? 'bg-gradient-to-t from-violet-600 via-pink-500 to-cyan-400 shadow-lg shadow-pink-500/20'
                          : 'bg-gradient-to-t from-blue-600 to-violet-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{point.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Weekly Study Hours vs Target */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Hours Distribution</h3>
              <p className="text-xs text-slate-400">Total 12.5 study hours logged this week</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">Goal: 10h/wk</span>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            {weeklyData.slice(0, 5).map((d) => (
              <div key={d.day} className="flex items-center justify-between gap-3 text-xs">
                <span className="w-16 font-medium text-slate-300">{d.shortDay}</span>
                <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                    style={{ width: `${Math.min((d.hours / 3) * 100, 100)}%` }}
                  />
                </div>
                <span className="w-16 text-right font-mono text-slate-300">{d.hours} hrs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Topic Mastery Section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Topic Mastery Breakdown</h3>
            <p className="text-xs text-slate-400">Color-coded cognitive retention across all 5 syllabus modules</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Strong (≥85%)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span> Moderate (70–84%)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-400"></span> Weak (&lt;70%)
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          {topicMasteryData.map((t) => {
            const isWeak = t.mastery < 70;
            const isStrong = t.mastery >= 85;

            return (
              <div key={t.topic} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{t.topic}</span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                        isStrong
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isWeak
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono text-[11px]">{t.questionsCount} Qs solved</span>
                    <span className="font-mono font-bold text-white tabular-nums text-sm">{t.mastery}%</span>
                    {isWeak && (
                      <button
                        onClick={() => onPracticeTopic(t.topic)}
                        className="rounded-md bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[11px] font-medium text-rose-300 hover:bg-rose-500/30"
                      >
                        Target with AI →
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isStrong
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : isWeak
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                        : 'bg-gradient-to-r from-blue-500 to-violet-500'
                    }`}
                    style={{ width: `${t.mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. AI INSIGHTS Section */}
      <section className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-slate-900 to-blue-950/30 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 pb-4 border-b border-violet-500/20">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">💡 AI Insights & Pedagogical Diagnosis</h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
              <Award className="h-4 w-4" />
              <span>Optimal Session Length</span>
            </div>
            <p className="mt-2 text-xs text-slate-200 leading-relaxed font-normal">
              “You perform <strong className="text-cyan-300 font-semibold">18% better</strong> when studying in 45-minute focused blocks rather than 2-hour marathons.”
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Strongest Module</span>
            </div>
            <p className="mt-2 text-xs text-slate-200 leading-relaxed font-normal">
              “Your strongest area is <strong className="text-emerald-300 font-semibold">Logic Gates</strong> (90% accuracy). De Morgan synthesis is deeply ingrained.”
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <AlertCircle className="h-4 w-4" />
              <span>Critical Bottleneck</span>
            </div>
            <p className="mt-2 text-xs text-slate-200 leading-relaxed font-normal">
              “Your weakest area is <strong className="text-rose-300 font-semibold">K-Maps</strong> (60% accuracy). Difficulty stems from 4-variable wrap-around quads.”
            </p>
          </div>

          <div className="rounded-xl border border-violet-500/30 bg-violet-950/40 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-violet-300 text-xs font-semibold">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Next Best Action</span>
              </div>
              <p className="mt-2 text-xs text-slate-200 leading-relaxed">
                “Spend your next <strong className="text-white">30 minutes</strong> practicing K-Maps.”
              </p>
            </div>
            <button
              onClick={() => onPracticeTopic('K-Maps')}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 py-1.5 text-xs font-semibold text-white shadow-sm hover:scale-[1.01]"
            >
              <span>Practice K-Maps</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
