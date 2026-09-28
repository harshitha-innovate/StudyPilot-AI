import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Brain,
  BarChart3,
  Bot,
  Settings,
  Flame,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { StudentState } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  student: StudentState;
  onOpenSettings: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  student,
  onOpenSettings,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'planner',
      label: 'Study Planner',
      icon: CalendarCheck,
      badge: 'Active',
    },
    {
      id: 'practice',
      label: 'AI Practice',
      icon: Brain,
      badge: 'Adaptive',
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'activity',
      label: 'Agent Activity',
      icon: Bot,
      badge: 'Live',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-800/80 bg-slate-950/95 p-5 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Brand Logo */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 shadow-lg shadow-violet-500/25">
                <Brain className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-white">StudyPilot</span>
                  <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-lg font-extrabold text-transparent">AI</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">Personal AI Study Agent</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden"
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>

          {/* Agent Status Pill */}
          <div className="relative overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-b from-violet-950/40 to-slate-900/40 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">Agent Active</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Autonomous</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              Monitoring {student.subject.split(' ')[0]} goal ({student.targetScore}% target).
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/90 via-violet-600/90 to-purple-700/80 text-white shadow-md shadow-violet-900/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800/80 text-violet-300 border border-violet-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Settings & Student Profile */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200"
          >
            <Settings className="h-4 w-4" />
            <span>Settings & Preferences</span>
          </button>

          {/* Student Profile Card */}
          <div className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 transition-colors hover:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/src/assets/images/student_avatar_alex_1790579451569.jpg"
                  alt={student.name}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-violet-500/40"
                  onError={(e) => {
                    // Fallback to stylized SVG avatar
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-pink-500 flex items-center justify-center text-white font-bold ring-2 ring-violet-500/40">
                  {student.name[0]}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{student.name}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Flame className="h-3 w-3 text-amber-400" />
                  <span className="font-mono tabular-nums">{student.streakDays}-Day Streak</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-violet-400">82% Avg</div>
          </div>
        </div>
      </aside>
    </>
  );
};
