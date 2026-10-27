/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  Headphones,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { QARI_LIST } from '../../types/quran';

export const AudioPlayerBar: React.FC = () => {
  const {
    isPlaying,
    isLoading,
    currentSurahNumber,
    currentSurahName,
    currentVerseNumber,
    currentTime,
    duration,
    volume,
    playbackRate,
    qariId,
    playMode,
    error,
    togglePlayPause,
    stop,
    seek,
    setVolume,
    setPlaybackRate,
    setQari,
    nextVerse,
    previousVerse,
  } = useAudioPlayer();

  const [showQariDropdown, setShowQariDropdown] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // If no surah is loaded in player, hide bar
  if (!currentSurahNumber) return null;

  const currentQari = QARI_LIST.find((q) => q.id === qariId) || QARI_LIST[4];

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-35 bg-[#061A35]/95 backdrop-blur-md text-white border-t border-[#0D3565] shadow-2xl px-4 py-2.5 transition-all animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
        {/* Progress Bar (Clickable) */}
        <div
          className="relative w-full h-1.5 bg-slate-800 rounded-full cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            seek(clickPos * duration);
          }}
        >
          <div
            className="absolute top-0 left-0 h-full bg-[#D9A441] rounded-full group-hover:bg-[#edd38c]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Player Controls Row */}
        <div className="flex items-center justify-between gap-3 text-xs">
          {/* Left: Surah & Verse Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0D3565] text-[#D9A441] flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-white text-xs sm:text-sm truncate">
                  {currentSurahName}
                </span>
                <span className="text-[11px] text-[#D9A441] font-mono shrink-0">
                  {currentVerseNumber ? `Ayat ${currentVerseNumber}` : 'Surat Lengkap'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {currentQari.name}
              </p>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {playMode === 'continuous_ayat' && (
              <button
                onClick={previousVerse}
                className="p-1.5 text-slate-300 hover:text-white transition"
                title="Ayat Sebelumnya"
                aria-label="Ayat Sebelumnya"
              >
                <SkipBack className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="w-9 h-9 rounded-full bg-[#D9A441] text-[#061A35] flex items-center justify-center hover:bg-[#ebd28b] active:scale-95 transition shadow-sm"
              aria-label={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {playMode === 'continuous_ayat' && (
              <button
                onClick={nextVerse}
                className="p-1.5 text-slate-300 hover:text-white transition"
                title="Ayat Selanjutnya"
                aria-label="Ayat Selanjutnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right: Qari selector, Volume & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Qari Selector Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowQariDropdown(!showQariDropdown)}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0D3565] text-slate-200 hover:text-white text-[11px] font-medium"
              >
                <span className="truncate max-w-[120px]">{currentQari.name}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showQariDropdown && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#061A35] border border-slate-700 rounded-xl shadow-2xl p-1 z-50">
                  <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-[#D9A441] border-b border-slate-800">
                    Pilih Qari Murottal
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {QARI_LIST.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setQari(q.id);
                          setShowQariDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition ${
                          q.id === qariId
                            ? 'bg-[#15518A] text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-medium">{q.name}</div>
                        <div className="text-[10px] text-slate-400">{q.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Playback Speed Toggle */}
            <button
              onClick={() => {
                const speeds = [0.75, 1, 1.25, 1.5];
                const currentIndex = speeds.indexOf(playbackRate);
                const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
                setPlaybackRate(nextSpeed);
              }}
              className="px-2 py-0.5 rounded-lg bg-[#0D3565] text-[#D9A441] font-mono font-bold text-[11px] hover:bg-[#15518A] transition"
              title="Kecepatan Audio (0.75x, 1x, 1.25x, 1.5x)"
              aria-label="Atur Kecepatan Audio"
            >
              {playbackRate}x
            </button>

            {/* Volume toggle */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="p-1.5 text-slate-300 hover:text-white transition"
                aria-label="Volume"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Close / Stop Button */}
            <button
              onClick={stop}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Tutup Audio"
              aria-label="Tutup Audio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error notification if audio fails */}
        {error && (
          <div className="text-[11px] text-rose-300 flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
