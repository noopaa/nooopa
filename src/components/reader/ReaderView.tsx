/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useSurahDetail } from '../../hooks/useQuranData';
import { StorageService } from '../../services/storageService';
import { AyatItemData } from '../../types/quran';
import { AutoScrollControlBar } from './AutoScrollControlBar';
import { AyatItem } from './AyatItem';
import { NoteModal } from './NoteModal';
import { SurahHeader } from './SurahHeader';
import { TafsirDrawer } from './TafsirDrawer';

interface ReaderViewProps {
  surahNumber: number;
  initialVerseNumber?: number;
  onBackToSurahList: () => void;
  onNavigateSurah: (surahNumber: number, verseNumber?: number) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  surahNumber,
  initialVerseNumber = 1,
  onBackToSurahList,
  onNavigateSurah,
}) => {
  const { surah, loading, error, reload } = useSurahDetail(surahNumber);
  const settings = StorageService.getSettings();

  const [arabicFontSize, setArabicFontSize] = useState(settings.arabicFontSize || 28);
  const [showTransliteration, setShowTransliteration] = useState(settings.showTransliteration);
  const [showTranslation, setShowTranslation] = useState(settings.showTranslation);
  const [activeViewMode, setActiveViewMode] = useState<'ayat' | 'tafsir'>('ayat');

  // Tafsir & Note Modals
  const [tafsirDrawerOpen, setTafsirDrawerOpen] = useState(false);
  const [selectedAyatForTafsir, setSelectedAyatForTafsir] = useState(initialVerseNumber);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedAyatForNote, setSelectedAyatForNote] = useState(1);
  const [notesVersion, setNotesVersion] = useState(0);

  // Audio Player Hook
  const {
    currentSurahNumber,
    currentVerseNumber,
    isPlaying,
    playVerse,
    playFullSurah,
    qariId,
  } = useAudioPlayer();

  // Auto Scroll Hook
  const autoScroll = useAutoScroll({
    speed: settings.autoScrollSpeed || 2,
    onReachBottom: () => {
      // Gentle notification or stop
    },
  });

  // Track & update last read position
  useEffect(() => {
    if (surah) {
      StorageService.setLastRead({
        surahNumber: surah.nomor,
        surahNameLatin: surah.namaLatin,
        surahNameArabic: surah.nama,
        verseNumber: initialVerseNumber || 1,
        totalVerses: surah.jumlahAyat,
        timestamp: Date.now(),
      });
      // Record initial verse read
      StorageService.recordAyatRead(surah.nomor, initialVerseNumber || 1);
    }
  }, [surah, initialVerseNumber]);

  // Jump to specific verse on load
  const hasScrolledRef = useRef(false);

  const scrollToVerse = (verseNum: number) => {
    const el = document.getElementById(`ayat-${verseNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      StorageService.recordAyatRead(surahNumber, verseNum);
    }
  };

  useEffect(() => {
    if (surah && initialVerseNumber > 1 && !hasScrolledRef.current) {
      const timer = setTimeout(() => {
        scrollToVerse(initialVerseNumber);
        hasScrolledRef.current = true;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [surah, initialVerseNumber]);

  // Smoothly follow current reciting ayat during audio playback
  useEffect(() => {
    if (isPlaying && currentSurahNumber === surahNumber && currentVerseNumber) {
      const el = document.getElementById(`ayat-${currentVerseNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isPlaying, currentSurahNumber, currentVerseNumber, surahNumber]);

  // Save font size & toggle settings
  const handleFontSizeChange = (newSize: number) => {
    setArabicFontSize(newSize);
    const s = StorageService.getSettings();
    s.arabicFontSize = newSize;
    StorageService.saveSettings(s);
  };

  const handleToggleTransliteration = () => {
    const next = !showTransliteration;
    setShowTransliteration(next);
    const s = StorageService.getSettings();
    s.showTransliteration = next;
    StorageService.saveSettings(s);
  };

  const handleToggleTranslation = () => {
    const next = !showTranslation;
    setShowTranslation(next);
    const s = StorageService.getSettings();
    s.showTranslation = next;
    StorageService.saveSettings(s);
  };

  // Play single/continuous ayat
  const handlePlayAyat = (ayat: AyatItemData) => {
    if (surah) {
      playVerse(ayat, surah.nomor, surah.namaLatin, surah.ayat, 'continuous_ayat');
      StorageService.recordAyatRead(surah.nomor, ayat.nomorAyat);
    }
  };

  // Play full surah audio
  const handlePlayFullSurah = () => {
    if (!surah || !surah.audioFull) return;
    const url =
      surah.audioFull[qariId] ||
      surah.audioFull['05'] ||
      Object.values(surah.audioFull)[0];
    if (url) {
      playFullSurah(surah.nomor, surah.namaLatin, url);
    }
  };

  const isPlayingFullSurah =
    isPlaying && currentSurahNumber === surahNumber && currentVerseNumber === null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-32">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <button
          onClick={onBackToSurahList}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Surat</span>
        </button>

        {surah && (
          <span className="text-slate-400 font-mono hidden sm:inline">
            Mushaf Standar RI · Kemenag
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && !surah && (
        <div className="py-24 text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#15518A] mx-auto" />
          <p className="text-sm font-semibold text-[#061A35]">
            Memuat Surat ke-{surahNumber}...
          </p>
          <p className="text-xs text-slate-500">
            Mengambil teks Utsmani asli dan terjemahan terverifikasi.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !surah && (
        <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 shadow-sm space-y-4">
          <p className="text-sm font-semibold text-rose-600">{error}</p>
          <p className="text-xs text-slate-500">
            Gagal mengambil data ayat dari server. Periksa koneksi internet Anda.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#061A35] text-white text-xs font-semibold hover:bg-[#0D3565] transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
            <button
              onClick={onBackToSurahList}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* Main Content when loaded */}
      {surah && (
        <div className="space-y-8">
          {/* Surah Header with Metadata and Controls */}
          <SurahHeader
            surah={surah}
            arabicFontSize={arabicFontSize}
            onFontSizeChange={handleFontSizeChange}
            showTransliteration={showTransliteration}
            onToggleTransliteration={handleToggleTransliteration}
            showTranslation={showTranslation}
            onToggleTranslation={handleToggleTranslation}
            isAutoScrollActive={autoScroll.isActive}
            onToggleAutoScroll={autoScroll.toggle}
            activeViewMode={activeViewMode}
            onToggleViewMode={setActiveViewMode}
            onNavigateSurah={(no) => onNavigateSurah(no, 1)}
            onPlayFullSurah={handlePlayFullSurah}
            isPlayingFullSurah={isPlayingFullSurah}
            onJumpToAyat={scrollToVerse}
          />

          {/* VIEW MODE 1: AYAT LIST */}
          {activeViewMode === 'ayat' && (
            <div className="space-y-5">
              {surah.ayat.map((ayat) => {
                const isPlayingThis =
                  isPlaying &&
                  currentSurahNumber === surah.nomor &&
                  currentVerseNumber === ayat.nomorAyat;
                const hasNote = !!StorageService.getNote(surah.nomor, ayat.nomorAyat);

                return (
                  <AyatItem
                    key={ayat.nomorAyat}
                    ayat={ayat}
                    surahNumber={surah.nomor}
                    surahNameLatin={surah.namaLatin}
                    surahNameArabic={surah.nama}
                    arabicFontSize={arabicFontSize}
                    showTransliteration={showTransliteration}
                    showTranslation={showTranslation}
                    isPlayingThisAyat={isPlayingThis}
                    onPlayAyat={handlePlayAyat}
                    onOpenTafsir={(ayatNo) => {
                      setSelectedAyatForTafsir(ayatNo);
                      setTafsirDrawerOpen(true);
                    }}
                    onOpenNoteModal={(ayatNo) => {
                      setSelectedAyatForNote(ayatNo);
                      setNoteModalOpen(true);
                    }}
                    hasNote={hasNote}
                  />
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: TAFSIR LENGKAP KEMENAG TAB */}
          {activeViewMode === 'tafsir' && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-[#061A35]">
                    Tafsir Lengkap {surah.namaLatin} ({surah.nama})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bersumber resmi dari Mushaf Standar Indonesia Kemenag RI
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAyatForTafsir(1);
                    setTafsirDrawerOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#061A35] text-[#D9A441] text-xs font-semibold hover:bg-[#0D3565] transition"
                >
                  Buka Mode Drawer
                </button>
              </div>

              {/* Description from API */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <span className="font-bold text-[#061A35] block mb-1">
                  Pengantar Surat:
                </span>
                <div
                  dangerouslySetInnerHTML={{ __html: surah.deskripsi }}
                  className="space-y-2"
                />
              </div>

              <div className="text-center py-6">
                <button
                  onClick={() => {
                    setSelectedAyatForTafsir(1);
                    setTafsirDrawerOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#061A35] text-[#D9A441] font-bold text-sm hover:bg-[#0D3565] transition shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>Jelajahi Tafsir Per Ayat</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation to Next / Previous Surah */}
          <div className="pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
            {surah.suratSebelumnya ? (
              <button
                onClick={() => onNavigateSurah(surah.suratSebelumnya ? surah.suratSebelumnya.nomor : 1, 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4 text-[#15518A]" />
                <span>{surah.suratSebelumnya.namaLatin}</span>
              </button>
            ) : (
              <div />
            )}

            {surah.suratSelanjutnya && (
              <button
                onClick={() => onNavigateSurah(surah.suratSelanjutnya ? surah.suratSelanjutnya.nomor : 114, 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs font-semibold ml-auto"
              >
                <span>{surah.suratSelanjutnya.namaLatin}</span>
                <ChevronRight className="w-4 h-4 text-[#15518A]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Auto Scroll Floating Controls */}
      <AutoScrollControlBar
        isActive={autoScroll.isActive}
        isPaused={autoScroll.isPaused}
        scrollSpeed={autoScroll.scrollSpeed}
        onTogglePlayPause={autoScroll.toggle}
        onStop={autoScroll.stop}
        onSpeedChange={autoScroll.setScrollSpeed}
      />

      {/* Tafsir Drawer Modal */}
      {surah && (
        <TafsirDrawer
          surahNumber={surah.nomor}
          surahNameLatin={surah.namaLatin}
          initialAyatNumber={selectedAyatForTafsir}
          isOpen={tafsirDrawerOpen}
          onClose={() => setTafsirDrawerOpen(false)}
        />
      )}

      {/* Personal Note Modal */}
      {surah && (
        <NoteModal
          surahNumber={surah.nomor}
          surahNameLatin={surah.namaLatin}
          ayatNumber={selectedAyatForNote}
          isOpen={noteModalOpen}
          onClose={() => setNoteModalOpen(false)}
          onSaved={() => setNotesVersion((v) => v + 1)}
        />
      )}
    </div>
  );
};
