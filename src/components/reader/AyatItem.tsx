/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bookmark,
  Check,
  Copy,
  Edit3,
  FileText,
  Headphones,
  Pause,
  Play,
  Share2,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { AyatItemData, PersonalNote } from '../../types/quran';

interface AyatItemProps {
  ayat: AyatItemData;
  surahNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  arabicFontSize: number;
  showTransliteration: boolean;
  showTranslation: boolean;
  isPlayingThisAyat: boolean;
  onPlayAyat: (ayat: AyatItemData) => void;
  onOpenTafsir: (ayatNumber: number) => void;
  onOpenNoteModal: (ayatNumber: number) => void;
  hasNote: boolean;
}

export const AyatItem: React.FC<AyatItemProps> = ({
  ayat,
  surahNumber,
  surahNameLatin,
  surahNameArabic,
  arabicFontSize,
  showTransliteration,
  showTranslation,
  isPlayingThisAyat,
  onPlayAyat,
  onOpenTafsir,
  onOpenNoteModal,
  hasNote,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(() =>
    StorageService.isBookmarked(surahNumber, ayat.nomorAyat)
  );
  const [copied, setCopied] = useState(false);

  const handleToggleBookmark = () => {
    const nextState = StorageService.toggleBookmark({
      id: `${surahNumber}-${ayat.nomorAyat}`,
      surahNumber,
      surahNameLatin,
      surahNameArabic,
      verseNumber: ayat.nomorAyat,
      verseTextArabic: ayat.teksArab,
      verseTextTranslation: ayat.teksIndonesia,
      createdAt: Date.now(),
    });
    setIsBookmarked(nextState);
  };

  const handleCopyAyat = async () => {
    const formattedText = `${ayat.teksArab}\n\n"${ayat.teksIndonesia}"\n\n(QS. ${surahNameLatin} [${surahNumber}]: Ayat ${ayat.nomorAyat})`;
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const textToShare = `${ayat.teksArab}\n\n"${ayat.teksIndonesia}"\n\n(QS. ${surahNameLatin} [${surahNumber}]: ${ayat.nomorAyat})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${surahNameLatin} : ${ayat.nomorAyat}`,
          text: textToShare,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyAyat();
    }
  };

  return (
    <article
      id={`ayat-${ayat.nomorAyat}`}
      className={`p-5 sm:p-6 rounded-2xl bg-white border transition-all duration-300 relative scroll-mt-24 ${
        isPlayingThisAyat
          ? 'border-[#D9A441] ring-2 ring-[#D9A441]/25 bg-[#FFFDF7] shadow-md'
          : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
      }`}
    >
      {/* Header of Ayat: Number badge & Action Buttons */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-2">
        {/* Ayat Number Star Badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#061A35] text-[#D9A441] flex items-center justify-center font-bold text-xs font-mono shadow-xs">
            {ayat.nomorAyat}
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            QS. {surahNameLatin}:{ayat.nomorAyat}
          </span>
        </div>

        {/* Action icons row */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-500">
          {/* Play Ayat Audio */}
          <button
            onClick={() => onPlayAyat(ayat)}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
              isPlayingThisAyat
                ? 'bg-[#D9A441] text-[#061A35] font-semibold'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Dengarkan Ayat Ini"
            aria-label={`Dengarkan ayat ${ayat.nomorAyat}`}
          >
            {isPlayingThisAyat ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span className="hidden sm:inline">
              {isPlayingThisAyat ? 'Memutar' : 'Putar'}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-lg transition ${
              isBookmarked
                ? 'text-[#D9A441] bg-[#D9A441]/10'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
            aria-label="Bookmark ayat"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Personal Note */}
          <button
            onClick={() => onOpenNoteModal(ayat.nomorAyat)}
            className={`p-1.5 rounded-lg transition ${
              hasNote
                ? 'text-[#15518A] bg-[#15518A]/10'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title={hasNote ? 'Lihat Catatan Tadabbur' : 'Tambah Catatan Tadabbur'}
            aria-label="Catatan ayat"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Tafsir */}
          <button
            onClick={() => onOpenTafsir(ayat.nomorAyat)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="Buka Tafsir Kemenag Ayat Ini"
            aria-label="Buka Tafsir Kemenag"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Copy Ayat */}
          <button
            onClick={handleCopyAyat}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="Salin Teks & Terjemahan"
            aria-label="Salin teks ayat"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* Share Ayat */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="Bagikan Ayat"
            aria-label="Bagikan ayat"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Arabic Text (RTL with ample line spacing to avoid clipped harakat) */}
      <div className="pt-6 pb-5 text-right" dir="rtl">
        <p
          className="font-arabic font-normal text-slate-900 tracking-wide select-text"
          style={{
            fontSize: `${arabicFontSize}px`,
            lineHeight: `${arabicFontSize * 2.1}px`,
            wordSpacing: '0.15em',
          }}
        >
          {ayat.teksArab}
        </p>
      </div>

      {/* Latin Transliteration (if enabled) */}
      {showTransliteration && (
        <div className="pt-2 pb-2 text-xs sm:text-sm text-[#15518A] font-medium leading-relaxed font-sans">
          <p className="italic">{ayat.teksLatin}</p>
        </div>
      )}

      {/* Indonesian Translation (if enabled) */}
      {showTranslation && (
        <div className="pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans border-t border-slate-100 mt-2">
          <p>{ayat.teksIndonesia}</p>
        </div>
      )}
    </article>
  );
};
