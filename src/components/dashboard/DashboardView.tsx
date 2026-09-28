import React, { useState } from 'react';
import {
  Flame,
  Clock,
  TrendingUp,
  Target,
  Sparkles,
  Bot,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Brain,
  ChevronRight,
} from 'lucide-react';
import { StudentState, WeeklyStudyDay } from '../../types';

interface DashboardViewProps {
  student: StudentState;
  weeklyData: WeeklyStudyDay[];
  onStartPractice: (topic?: string) => void;
  onViewPlan: () => void;
  onFollowRecommendation: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  student,
  weeklyData,
  onStartPractice,
  onViewPlan,
  onFollowRecommendation,
}) => {
  const [hoveredDay, setHoveredDay] = useState<WeeklyStudyDay | null>(null);

  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 3.5);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 1. Top Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950/40 p-6 shadow-2xl lg:p-8">
        {/* Glow backdrop mesh */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-950/60 px-3 py-1 text-xs font-semibold text-violet-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Agentic AI Study Assistant</span>
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl text-balance">
              Let's make today's study session count.
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed sm:text-base">
              StudyPilot observes your performance, diagnoses weak topics, and dynamically generates practice problems tailored to your exam target.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onStartPractice()}
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-violet-600/50 active:scale-[0.98]"
              >
                <Brain className="h-4 w-4" />
                <span>Start AI Study Session</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onViewPlan}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
              >
                <Calendar className="h-4 w-4 text-violet-400" />
                <span>View Study Plan</span>
              </button>
            </div>
          </div>

          {/* Visual Agent Graphic Banner */}
          <div className="relative hidden lg:block w-72 h-44 rounded-2xl overflow-hidden border border-violet-500/30 shadow-xl group">
            <img
              src="/src/assets/images/study_agent_graphic_1790579462577.jpg"
              alt="StudyPilot Core"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-mono text-cyan-300">Neural Agent Online · 99.8% Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Statistic Cards */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Study Streak */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:border-amber-500/40 hover:bg-slate-900/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Study Streak</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 ring-1 ring-amber-500/20">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums sm:text-3xl">
              {student.streakDays}
            </span>
            <span className="text-sm font-medium text-slate-400">Days</span>
          </div>
          <p className="mt-1 text-xs text-amber-400/90">🔥 Daily momentum unlocked</p>
        </div>

        {/* Stat 2: Study Time */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Study Time</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400 ring-1 ring-blue-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums sm:text-3xl">
              {student.studyHours}
            </span>
            <span className="text-sm font-medium text-slate-400">Hours</span>
          </div>
          <p className="mt-1 text-xs text-blue-400/90">+2.5 hrs vs last week</p>
        </div>

        {/* Stat 3: Average Score */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:border-violet-500/40 hover:bg-slate-900/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Score</span>
            <div className="rounded-xl bg-violet-500/10 p-2 text-violet-400 ring-1 ring-violet-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums sm:text-3xl">
              {student.currentScore}%
            </span>
            <span className="text-sm font-medium text-emerald-400">↗ +4%</span>
          </div>
          <p className="mt-1 text-xs text-violet-400/90">Above 80% target</p>
        </div>

        {/* Stat 4: Topics Mastered */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:border-pink-500/40 hover:bg-slate-900/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Topics Mastered</span>
            <div className="rounded-xl bg-pink-500/10 p-2 text-pink-400 ring-1 ring-pink-500/20">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums sm:text-3xl">
              {student.topicsMastered}
            </span>
            <span className="text-sm font-medium text-slate-400">of 10</span>
          </div>
          <p className="mt-1 text-xs text-pink-400/90">80% syllabus covered</p>
        </div>
      </section>

      {/* 3. Grid: Today's AI Goal + AI Recommendation Card */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Study Goal */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Today's AI Goal</h3>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>On Track</span>
              </div>
            </div>

            <h4 className="mt-4 text-xl font-bold text-white">{student.subject}</h4>

            {/* Progress metric bar */}
            <div className="mt-5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Session Progress</span>
                <span className="font-mono tabular-nums text-white">68% / Target 80%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 transition-all duration-500"
                  style={{ width: '68%' }}
                />
              </div>
            </div>

            {/* Metadata tags */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5">
              <div>
                <p className="text-[11px] text-slate-400">Current Level</p>
                <p className="text-sm font-semibold text-slate-200">Intermediate</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Estimated Completion</p>
                <p className="text-sm font-semibold text-cyan-400 font-mono tabular-nums">4h 20m</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60">
            <button
              onClick={() => onStartPractice('Boolean Algebra')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              <span>Continue Learning</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* AI Recommendation Card (Distinct AI Gradient) */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-950/40 via-slate-900 to-pink-950/30 p-6 shadow-xl backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-400" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-300">🤖 AI Recommendation</h3>
              </div>
              <span className="text-[11px] font-mono text-pink-400 border border-pink-500/30 bg-pink-950/30 px-2 py-0.5 rounded-full">
                High Priority
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-200 leading-relaxed font-normal">
              “Based on your recent practice, <strong className="text-white font-semibold">Boolean Algebra</strong> is currently your weakest topic. I recommend spending <strong className="text-cyan-300 font-semibold">25 minutes</strong> revising Boolean Laws before attempting another advanced question.”
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-violet-500/20 bg-slate-950/60 p-3.5">
              <div>
                <p className="text-[11px] text-slate-400">Recommended Action</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-100">Revision</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Estimated Time</p>
                <p className="text-sm font-semibold text-cyan-400 font-mono tabular-nums">25 minutes</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-violet-500/20">
            <button
              onClick={onFollowRecommendation}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.01] hover:shadow-violet-600/50"
            >
              <Sparkles className="h-4 w-4" />
              <span>Follow AI Recommendation</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Weekly Study Activity Chart */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Weekly Study Activity</h3>
            <p className="text-xs text-slate-400">Hours spent, question volume, and retention scoring over the past 7 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-blue-600 to-violet-500"></span>
              <span className="text-slate-300">Study Hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full bg-pink-400"></span>
              <span className="text-slate-300">Score %</span>
            </div>
          </div>
        </div>

        {/* Interactive Bar Chart */}
        <div className="mt-6 grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-8 pb-2">
          {weeklyData.map((item) => {
            const heightPercent = Math.round((item.hours / maxHours) * 100);
            const isHovered = hoveredDay?.day === item.day;

            return (
              <div
                key={item.day}
                className="group relative flex flex-col items-center h-full justify-end cursor-pointer"
                onMouseEnter={() => setHoveredDay(item)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Bar */}
                <div className="relative w-full max-w-[42px] flex flex-col justify-end items-center h-full">
                  <div
                    className={`w-full rounded-t-xl bg-gradient-to-t transition-all duration-300 ${
                      isHovered
                        ? 'from-blue-500 via-violet-500 to-pink-400 shadow-lg shadow-violet-500/30'
                        : 'from-blue-600/80 to-violet-600/80 hover:from-blue-500 hover:to-violet-500'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day label */}
                <span className={`mt-2 text-xs font-medium transition-colors ${isHovered ? 'text-white font-semibold' : 'text-slate-400'}`}>
                  {item.shortDay}
                </span>

                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs shadow-xl backdrop-blur-md">
                    <p className="font-semibold text-white">{item.day}</p>
                    <p className="font-mono text-slate-300">
                      ⏱ {item.hours}h · ❓ {item.questions} Qs · 📈 {item.score}%
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary metrics beneath chart */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4 text-center">
          <div>
            <p className="text-[11px] text-slate-400">Total Hours</p>
            <p className="text-sm font-semibold font-mono text-white">12.5 hrs</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Questions Solved</p>
            <p className="text-sm font-semibold font-mono text-cyan-400">156 Qs</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Best Performing Day</p>
            <p className="text-sm font-semibold text-emerald-400">Saturday (88%)</p>
          </div>
        </div>
      </section>
    </div>
  );
};
