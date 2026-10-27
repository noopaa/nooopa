/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Headphones,
  Minus,
  Play,
  Plus,
  Scroll,
} from 'lucide-react';
import { SurahDetail } from '../../types/quran';

interface SurahHeaderProps {
  surah: SurahDetail;
  arabicFontSize: number;
  onFontSizeChange: (newSize: number) => void;
  showTransliteration: boolean;
  onToggleTransliteration: () => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  isAutoScrollActive: boolean;
  onToggleAutoScroll: () => void;
  activeViewMode: 'ayat' | 'tafsir';
  onToggleViewMode: (mode: 'ayat' | 'tafsir') => void;
  onNavigateSurah: (surahNumber: number) => void;
  onPlayFullSurah: () => void;
  isPlayingFullSurah: boolean;
  onJumpToAyat?: (verseNumber: number) => void;
}

export const SurahHeader: React.FC<SurahHeaderProps> = ({
  surah,
  arabicFontSize,
  onFontSizeChange,
  showTransliteration,
  onToggleTransliteration,
  showTranslation,
  onToggleTranslation,
  isAutoScrollActive,
  onToggleAutoScroll,
  activeViewMode,
  onToggleViewMode,
  onNavigateSurah,
  onPlayFullSurah,
  isPlayingFullSurah,
  onJumpToAyat,
}) => {
  // Surat at-Taubah (nomor 9) does not start with Basmalah
  const showBasmalah = surah.nomor !== 9 && surah.nomor !== 1;

  return (
    <div className="space-y-6">
      {/* Surah Navigation Bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        {surah.suratSebelumnya ? (
          <button
            onClick={() => onNavigateSurah(surah.suratSebelumnya ? surah.suratSebelumnya.nomor : 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-medium"
            aria-label={`Surat Sebelumnya: ${surah.suratSebelumnya.namaLatin}`}
          >
            <ChevronLeft className="w-4 h-4 text-[#15518A]" />
            <span className="hidden sm:inline">Surat Sebelumnya:</span>
            <span className="font-semibold text-[#061A35]">{surah.suratSebelumnya.namaLatin}</span>
          </button>
        ) : (
          <div />
        )}

        {surah.suratSelanjutnya && (
          <button
            onClick={() => onNavigateSurah(surah.suratSelanjutnya ? surah.suratSelanjutnya.nomor : 114)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-medium ml-auto"
            aria-label={`Surat Selanjutnya: ${surah.suratSelanjutnya.namaLatin}`}
          >
            <span className="hidden sm:inline">Surat Selanjutnya:</span>
            <span className="font-semibold text-[#061A35]">{surah.suratSelanjutnya.namaLatin}</span>
            <ChevronRight className="w-4 h-4 text-[#15518A]" />
          </button>
        )}
      </div>

      {/* Surah Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061A35] via-[#0D3565] to-[#061A35] text-white p-6 sm:p-8 border border-[#15518A]/50 shadow-lg text-center">
        <div className="space-y-3 relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D9A441]">
            <span>Surat ke-{surah.nomor}</span>
            <span aria-hidden="true">·</span>
            <span>{surah.tempatTurun}</span>
            <span aria-hidden="true">·</span>
            <span>{surah.jumlahAyat} Ayat</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {surah.namaLatin}
          </h1>

          <p className="font-arabic text-4xl sm:text-5xl font-bold text-[#D9A441] py-1">
            {surah.nama}
          </p>

          <p className="text-sm text-slate-300 italic">
            "{surah.arti}"
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
            <button
              onClick={onPlayFullSurah}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-xs ${
                isPlayingFullSurah
                  ? 'bg-[#D9A441] text-[#061A35]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>{isPlayingFullSurah ? 'Sedang Diputar' : 'Putar Murottal Penuh'}</span>
            </button>

            <button
              onClick={onToggleAutoScroll}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-xs ${
                isAutoScrollActive
                  ? 'bg-[#D9A441] text-[#061A35]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Scroll className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>{isAutoScrollActive ? 'Auto-Scroll Aktif' : 'Auto-Scroll Tilawah'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reader Controls Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Mode Selector: Ayat vs Tafsir */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => onToggleViewMode('ayat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeViewMode === 'ayat'
                ? 'bg-white text-[#061A35] font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Teks & Terjemahan</span>
          </button>
          <button
            onClick={() => onToggleViewMode('tafsir')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeViewMode === 'tafsir'
                ? 'bg-white text-[#061A35] font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tafsir Lengkap Kemenag</span>
          </button>
        </div>

        {/* View Options: Font Size & Toggles */}
        {activeViewMode === 'ayat' && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Arabic Font Size Adjuster */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <span className="text-[11px] text-slate-500 font-medium px-1">Ukuran Huruf:</span>
              <button
                onClick={() => onFontSizeChange(Math.max(20, arabicFontSize - 2))}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-700 hover:bg-slate-200 transition"
                aria-label="Kecilkan Font Arab"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center font-mono font-bold text-slate-800">
                {arabicFontSize}px
              </span>
              <button
                onClick={() => onFontSizeChange(Math.min(48, arabicFontSize + 2))}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-700 hover:bg-slate-200 transition"
                aria-label="Besarkan Font Arab"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Transliteration Toggle */}
            <button
              onClick={onToggleTransliteration}
              className={`px-3 py-1.5 rounded-xl border font-medium transition ${
                showTransliteration
                  ? 'bg-[#0D3565] text-white border-[#0D3565]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Transliterasi
            </button>

            {/* Translation Toggle */}
            <button
              onClick={onToggleTranslation}
              className={`px-3 py-1.5 rounded-xl border font-medium transition ${
                showTranslation
                  ? 'bg-[#0D3565] text-white border-[#0D3565]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Terjemahan
            </button>

            {/* Quick Ayat Jumper Dropdown */}
            {onJumpToAyat && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <span className="text-[11px] text-slate-500 font-medium">Ayat:</span>
                <select
                  aria-label="Loncat ke Ayat"
                  className="bg-transparent font-mono font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (val) onJumpToAyat(val);
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Pilih (1–{surah.jumlahAyat})
                  </option>
                  {Array.from({ length: surah.jumlahAyat }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Ayat {num}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bismillah Banner for surahs other than At-Taubah and Al-Fatihah */}
      {showBasmalah && activeViewMode === 'ayat' && (
        <div className="py-6 text-center border-b border-slate-200">
          <p className="font-arabic text-3xl sm:text-4xl text-[#061A35] tracking-wide">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="text-xs text-slate-500 mt-2 italic">
            Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
          </p>
        </div>
      )}
    </div>
  );
};
