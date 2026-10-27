/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { ArrowUpDown, BookOpen, Headphones, RotateCcw, Search, X } from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { SurahSummary } from '../../types/quran';

interface SurahListViewProps {
  surahs: SurahSummary[];
  loading: boolean;
  error: string | null;
  onReload: () => void;
  onSelectSurah: (surahNumber: number, verseNumber?: number) => void;
}

export const SurahListView: React.FC<SurahListViewProps> = ({
  surahs,
  loading,
  error,
  onReload,
  onSelectSurah,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Mekah' | 'Madinah'>('all');
  const [sortBy, setSortBy] = useState<'number' | 'verses'>('number');

  const { playFullSurah, currentSurahNumber, isPlaying, togglePlayPause, qariId } = useAudioPlayer();

  const filteredSurahs = useMemo(() => {
    return surahs
      .filter((s) => {
        // Place of revelation filter
        if (typeFilter !== 'all' && s.tempatTurun !== typeFilter) {
          return false;
        }
        // Search term matching
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase().trim();
        return (
          s.namaLatin.toLowerCase().includes(q) ||
          s.arti.toLowerCase().includes(q) ||
          s.nomor.toString() === q ||
          s.nama.includes(searchTerm.trim())
        );
      })
      .sort((a, b) => {
        if (sortBy === 'verses') {
          return b.jumlahAyat - a.jumlahAyat;
        }
        return a.nomor - b.nomor;
      });
  }, [surahs, searchTerm, typeFilter, sortBy]);

  const handlePlaySurahAudio = (e: React.MouseEvent, surah: SurahSummary) => {
    e.stopPropagation();
    if (currentSurahNumber === surah.nomor && isPlaying) {
      togglePlayPause();
      return;
    }
    const audioUrl = surah.audioFull ? (surah.audioFull[qariId] || surah.audioFull['05'] || Object.values(surah.audioFull)[0]) : null;
    if (audioUrl) {
      playFullSurah(surah.nomor, surah.namaLatin, audioUrl);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#061A35] tracking-tight">
            Daftar 114 Surat
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Buka mushaf, dengarkan murottal, atau baca tafsir dari surat ke-1 hingga ke-114.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari surat, arti, nomor..."
              className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15518A] focus:border-transparent text-slate-800 placeholder-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Quick search tags */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 overflow-x-auto">
            <span>Populer:</span>
            {['Al-Kahf', 'Yasin', 'Al-Mulk', 'Al-Waqi\'ah'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="hover:text-[#15518A] hover:underline"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Revelation Filter segmented controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
              typeFilter === 'all'
                ? 'bg-white text-[#061A35] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua (114)
          </button>
          <button
            onClick={() => setTypeFilter('Mekah')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
              typeFilter === 'Mekah'
                ? 'bg-white text-[#061A35] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Makkiyyah
          </button>
          <button
            onClick={() => setTypeFilter('Madinah')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
              typeFilter === 'Madinah'
                ? 'bg-white text-[#061A35] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Madaniyyah
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs hidden sm:inline">Urutkan:</span>
          <button
            onClick={() => setSortBy(sortBy === 'number' ? 'verses' : 'number')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-medium"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#15518A]" />
            <span>{sortBy === 'number' ? 'Nomor Surat (1-114)' : 'Jumlah Ayat Terbanyak'}</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && surahs.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl border border-slate-200 animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-7 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry Button */}
      {error && surahs.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-red-200 space-y-3">
          <p className="text-sm font-semibold text-red-600">{error}</p>
          <p className="text-xs text-slate-500">
            Periksa koneksi internet Anda atau coba muat kembali data surat.
          </p>
          <button
            onClick={onReload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#061A35] text-white text-xs font-semibold hover:bg-[#0D3565] transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Surah List Grid */}
      {!loading && filteredSurahs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-semibold text-slate-700">Tidak ada surat yang sesuai</p>
          <p className="text-xs text-slate-500">
            Coba gunakan kata kunci pencarian yang berbeda atau reset filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
            }}
            className="mt-3 px-4 py-2 text-xs font-semibold text-[#15518A] hover:underline"
          >
            Reset Pencarian & Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => {
            const isCurrentlyPlayingSurah = currentSurahNumber === surah.nomor && isPlaying;

            return (
              <div
                key={surah.nomor}
                onClick={() => onSelectSurah(surah.nomor, 1)}
                className={`group p-4 sm:p-5 bg-white rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#15518A]/60 ${
                  isCurrentlyPlayingSurah
                    ? 'border-[#D9A441] ring-2 ring-[#D9A441]/20 bg-[#FFFDF7]'
                    : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Number & Titles */}
                  <div className="flex items-start gap-3.5">
                    {/* Number Badge with Luxury Diamond Border */}
                    <div className="relative w-10 h-10 rounded-xl bg-[#061A35] text-[#D9A441] flex items-center justify-center shrink-0 font-bold text-xs font-mono shadow-xs group-hover:bg-[#15518A] transition-colors">
                      <span>{surah.nomor}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#061A35] group-hover:text-[#15518A] transition-colors flex items-center gap-1.5">
                        <span>{surah.namaLatin}</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                        {surah.arti}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 font-medium">
                        <span>{surah.tempatTurun}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{surah.jumlahAyat} Ayat</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Arabic Name */}
                  <div className="text-right shrink-0">
                    <span className="font-arabic text-2xl font-bold text-[#061A35] group-hover:text-[#15518A] transition-colors block">
                      {surah.nama}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#15518A] group-hover:text-[#061A35] transition-colors flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Buka Mushaf</span>
                  </span>

                  <button
                    onClick={(e) => handlePlaySurahAudio(e, surah)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      isCurrentlyPlayingSurah
                        ? 'bg-[#D9A441] text-[#061A35] font-semibold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Putar Audio Murottal Surat Ini"
                    aria-label={`Putar Audio Surat ${surah.namaLatin}`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>{isCurrentlyPlayingSurah ? 'Memutar' : 'Murottal'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
