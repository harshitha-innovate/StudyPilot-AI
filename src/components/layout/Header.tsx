import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { StudentState } from '../../types';

interface HeaderProps {
  student: StudentState;
  onOpenDemo: () => void;
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  onOpenDemo,
  onToggleMobileNav,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Agent Weak Area Detected',
      message: 'Boolean Algebra accuracy dropped below 50%. Revision session recommended.',
      time: '10m ago',
      icon: AlertTriangle,
      color: 'text-amber-400',
    },
    {
      id: 'notif-2',
      title: 'Study Streak Active',
      message: 'You have studied 7 days consecutively. Keep the momentum going!',
      time: '1h ago',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      id: 'notif-3',
      title: 'Adaptive Plan Updated',
      message: 'K-Maps session slotted for 10:00 AM with 4-variable focus.',
      time: '2h ago',
      icon: Lightbulb,
      color: 'text-violet-400',
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-3.5 backdrop-blur-xl lg:px-8">
      {/* Left: Mobile Toggle & Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileNav}
          className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white lg:text-xl">
              Good morning, {student.name} <span className="inline-block animate-wave origin-bottom-right">👋</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Ready to make progress today? <span className="text-slate-400">·</span>{' '}
            <span className="font-mono text-slate-400">Monday, Sep 28, 2026</span>
          </p>
        </div>
      </div>

      {/* Right: Demo Mode CTA, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Interactive Demo Mode CTA */}
        <button
          onClick={onOpenDemo}
          className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span className="hidden sm:inline">🎬 Demo Mode</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-violet-400" />
                  <span className="text-sm font-semibold text-white">Agent Alerts</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">3 New</span>
              </div>

              <div className="mt-3 flex flex-col gap-2.5">
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-slate-800/60 bg-slate-950/60 p-2.5 transition-colors hover:border-violet-500/30"
                    >
                      <div className="mt-0.5">
                        <Icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400 leading-snug">{item.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowNotifications(false)}
                className="mt-3 w-full rounded-lg bg-slate-800/80 py-1.5 text-center text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Close Alerts
              </button>
            </div>
          )}
        </div>

        {/* Profile Avatar with subtle status */}
        <div className="flex items-center gap-2 pl-1">
          <div className="relative">
            <img
              src="/src/assets/images/student_avatar_alex_1790579451569.jpg"
              alt={student.name}
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-500/30"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden h-9 w-9 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
              {student.name[0]}
            </div>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
