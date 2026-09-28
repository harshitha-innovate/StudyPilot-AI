import React, { useState } from 'react';
import { Settings, X, Sliders, ShieldCheck, Bell, Sparkles, Check } from 'lucide-react';
import { StudentState } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentState;
  onUpdateStudent: (student: StudentState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  student,
  onUpdateStudent,
}) => {
  const [name, setName] = useState(student.name);
  const [agentRigor, setAgentRigor] = useState<'Gentle' | 'Balanced' | 'ExamStrict'>('Balanced');
  const [sessionBlock, setSessionBlock] = useState('45m');
  const [autoAdapt, setAutoAdapt] = useState(true);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({
      ...student,
      name,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-violet-400" />
            <h3 className="text-base font-bold text-white">StudyPilot Settings & Rigor</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 flex flex-col gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300">Agent Rigor Profile</label>
            <p className="text-[11px] text-slate-400">Controls how aggressively the agent escalates problem difficulty</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { id: 'Gentle', label: 'Gentle', desc: 'More hints' },
                { id: 'Balanced', label: 'Balanced', desc: 'Standard' },
                { id: 'ExamStrict', label: 'Exam Strict', desc: '0 Tolerance' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setAgentRigor(r.id as any)}
                  className={`rounded-xl border p-2.5 text-left transition-colors ${
                    agentRigor === r.id
                      ? 'border-violet-500 bg-violet-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="font-semibold text-xs">{r.label}</p>
                  <p className="text-[10px] text-slate-400">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300">Study Session Block Size</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {['25m Pomodoro', '45m Focused', '60m Deep Dive'].map((blk) => (
                <button
                  key={blk}
                  type="button"
                  onClick={() => setSessionBlock(blk)}
                  className={`rounded-xl border py-2 text-center transition-colors ${
                    sessionBlock === blk
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {blk}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div>
              <p className="font-semibold text-slate-200">Real-time Continuous Adaptation</p>
              <p className="text-[10px] text-slate-400">Allow agent to re-order study timeline based on live test errors</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoAdapt(!autoAdapt)}
              className={`h-6 w-11 rounded-full p-1 transition-colors ${
                autoAdapt ? 'bg-violet-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  autoAdapt ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 px-5 py-2 text-xs font-semibold text-white shadow-md hover:scale-[1.02]"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
