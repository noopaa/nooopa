/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Pause, Play, Square, X, Zap } from 'lucide-react';

interface AutoScrollControlBarProps {
  isActive: boolean;
  isPaused: boolean;
  scrollSpeed: number;
  onTogglePlayPause: () => void;
  onStop: () => void;
  onSpeedChange: (speed: number) => void;
}

export const AutoScrollControlBar: React.FC<AutoScrollControlBarProps> = ({
  isActive,
  isPaused,
  scrollSpeed,
  onTogglePlayPause,
  onStop,
  onSpeedChange,
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 bg-[#061A35] text-white rounded-2xl p-3 shadow-2xl border border-[#D9A441]/40 flex items-center gap-3 animate-fade-in backdrop-blur-md">
      <div className="flex items-center gap-2 pr-2 border-r border-slate-700">
        <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-ping" />
        <span className="text-xs font-semibold text-slate-200">
          {isPaused ? 'Auto-Scroll Dijeda' : 'Auto-Scroll Berjalan'}
        </span>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={onTogglePlayPause}
        className="w-8 h-8 rounded-xl bg-[#D9A441] text-[#061A35] flex items-center justify-center font-bold hover:bg-[#ebce87] transition shadow-xs"
        aria-label={isPaused ? 'Lanjutkan Auto Scroll' : 'Jeda Auto Scroll'}
      >
        {isPaused ? (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        ) : (
          <Pause className="w-4 h-4 fill-current" />
        )}
      </button>

      {/* Speed Selector (1x - 5x) */}
      <div className="flex items-center gap-1 bg-[#0D3565] p-1 rounded-xl">
        {[1, 2, 3, 4, 5].map((spd) => (
          <button
            key={spd}
            onClick={() => onSpeedChange(spd)}
            className={`w-6 h-6 rounded-lg text-xs font-mono font-bold transition ${
              scrollSpeed === spd
                ? 'bg-[#D9A441] text-[#061A35]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {spd}x
          </button>
        ))}
      </div>

      {/* Stop / Close Button */}
      <button
        onClick={onStop}
        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        title="Hentikan Auto Scroll"
        aria-label="Hentikan Auto Scroll"
      >
        <Square className="w-4 h-4" />
      </button>
    </div>
  );
};
