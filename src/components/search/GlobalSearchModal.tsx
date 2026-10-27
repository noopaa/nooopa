/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { QuranApi } from '../../services/quranApi';
import { SurahDetail, SurahSummary } from '../../types/quran';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahs: SurahSummary[];
  onNavigateToAyat: (surahNumber: number, verseNumber: number) => void;
}

interface TranslationMatch {
  surahNumber: number;
  surahNameLatin: string;
  verseNumber: number;
  teksArab: string;
  teksIndonesia: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  surahs,
  onNavigateToAyat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchingTranslations, setIsSearchingTranslations] = useState(false);
  const [translationMatches, setTranslationMatches] = useState<TranslationMatch[]>([]);
  const [searchedSurahsCount, setSearchedSurahsCount] = useState(0);

  // Debounce input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Keyboard shortcut ⌘K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // modal trigger
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 1. Direct format detection: e.g. "2:255", "18:10", "Al-Baqarah 255"
  const directJump = useMemo(() => {
    if (!debouncedQuery) return null;

    // Pattern: "number:number" e.g. "2:255"
    const colonMatch = debouncedQuery.match(/^(\d{1,3})\s*[:\.]\s*(\d{1,3})$/);
    if (colonMatch) {
      const sNo = parseInt(colonMatch[1], 10);
      const vNo = parseInt(colonMatch[2], 10);
      const targetSurah = surahs.find((s) => s.nomor === sNo);
      if (targetSurah && vNo >= 1 && vNo <= targetSurah.jumlahAyat) {
        return {
          surah: targetSurah,
          verse: vNo,
          label: `Loncat langsung ke QS. ${targetSurah.namaLatin} : Ayat ${vNo}`,
        };
      }
    }

    // Pattern: "SurahName number" e.g. "Kahf 10" or "Baqarah 255"
    const nameMatch = debouncedQuery.match(/^([a-zA-Z\s'-]+)\s+(\d{1,3})$/);
    if (nameMatch) {
      const namePart = nameMatch[1].trim().toLowerCase();
      const vNo = parseInt(nameMatch[2], 10);
      const targetSurah = surahs.find((s) =>
        s.namaLatin.toLowerCase().includes(namePart)
      );
      if (targetSurah && vNo >= 1 && vNo <= targetSurah.jumlahAyat) {
        return {
          surah: targetSurah,
          verse: vNo,
          label: `Loncat langsung ke QS. ${targetSurah.namaLatin} : Ayat ${vNo}`,
        };
      }
    }

    return null;
  }, [debouncedQuery, surahs]);

  // 2. Surah name & topic matches
  const matchedSurahs = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    const q = debouncedQuery.toLowerCase();
    return surahs.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.nama.includes(debouncedQuery) ||
        s.nomor.toString() === q
    );
  }, [debouncedQuery, surahs]);

  // 3. Search across cached surahs for translation keyword matches
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setTranslationMatches([]);
      setIsSearchingTranslations(false);
      return;
    }

    let isMounted = true;
    setIsSearchingTranslations(true);

    const runSearch = async () => {
      const query = debouncedQuery.toLowerCase();
      const results: TranslationMatch[] = [];

      // Check all cached surahs in localStorage + memory
      let count = 0;
      for (const s of surahs) {
        if (!isMounted) break;
        if (results.length >= 15) break; // Limit top 15 results for snappiness

        // Try getting cached surah detail without network spam
        if (QuranApi.isSurahCached(s.nomor)) {
          count++;
          try {
            const detail = await QuranApi.getSurahDetail(s.nomor);
            if (detail && detail.ayat) {
              for (const ayat of detail.ayat) {
                if (
                  ayat.teksIndonesia.toLowerCase().includes(query) ||
                  ayat.teksLatin.toLowerCase().includes(query)
                ) {
                  results.push({
                    surahNumber: s.nomor,
                    surahNameLatin: s.namaLatin,
                    verseNumber: ayat.nomorAyat,
                    teksArab: ayat.teksArab,
                    teksIndonesia: ayat.teksIndonesia,
                  });
                  if (results.length >= 15) break;
                }
              }
            }
          } catch {
            // Ignore
          }
        }
      }

      // If fewer than 5 cached surahs exist, also fetch popular surahs (1, 18, 36, 67, 112)
      if (results.length < 5 && isMounted) {
        const prioritySurahs = [1, 2, 18, 36, 67, 112];
        for (const sNo of prioritySurahs) {
          if (!isMounted || results.length >= 10) break;
          const s = surahs.find((item) => item.nomor === sNo);
          if (s) {
            count++;
            try {
              const detail = await QuranApi.getSurahDetail(s.nomor);
              if (detail && detail.ayat) {
                for (const ayat of detail.ayat) {
                  if (
                    ayat.teksIndonesia.toLowerCase().includes(query) &&
                    !results.some(
                      (r) =>
                        r.surahNumber === s.nomor &&
                        r.verseNumber === ayat.nomorAyat
                    )
                  ) {
                    results.push({
                      surahNumber: s.nomor,
                      surahNameLatin: s.namaLatin,
                      verseNumber: ayat.nomorAyat,
                      teksArab: ayat.teksArab,
                      teksIndonesia: ayat.teksIndonesia,
                    });
                  }
                }
              }
            } catch {
              // Ignore
            }
          }
        }
      }

      if (isMounted) {
        setTranslationMatches(results);
        setSearchedSurahsCount(count);
        setIsSearchingTranslations(false);
      }
    };

    runSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, surahs]);

  if (!isOpen) return null;

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-[#D9A441]/30 text-[#061A35] font-semibold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[80vh]">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 bg-[#061A35] text-white flex items-center gap-3 border-b border-[#0D3565]">
          <Search className="w-5 h-5 text-[#D9A441] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari surat, '18:10', 'Al-Baqarah 255', atau kata terjemahan..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
              aria-label="Bersihkan"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Help / Examples when query empty */}
          {!debouncedQuery && (
            <div className="py-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pencarian Cepat & Contoh Format:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setSearchTerm('18:10')}
                  className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
                >
                  <span className="font-bold text-[#061A35] block">18:10</span>
                  <span className="text-slate-500 text-[11px]">Buka QS. Al-Kahf Ayat 10</span>
                </button>
                <button
                  onClick={() => setSearchTerm('2:255')}
                  className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
                >
                  <span className="font-bold text-[#061A35] block">2:255</span>
                  <span className="text-slate-500 text-[11px]">Ayat Kursi (QS. Al-Baqarah)</span>
                </button>
                <button
                  onClick={() => setSearchTerm('sabar')}
                  className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
                >
                  <span className="font-bold text-[#061A35] block">sabar</span>
                  <span className="text-slate-500 text-[11px]">Cari ayat bertema kesabaran</span>
                </button>
                <button
                  onClick={() => setSearchTerm('Al-Mulk')}
                  className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
                >
                  <span className="font-bold text-[#061A35] block">Al-Mulk</span>
                  <span className="text-slate-500 text-[11px]">Surat ke-67 (Kerajaan)</span>
                </button>
              </div>
            </div>
          )}

          {/* Direct Verse Jump Result */}
          {directJump && (
            <div
              onClick={() => {
                onNavigateToAyat(directJump.surah.nomor, directJump.verse);
                onClose();
              }}
              className="p-4 rounded-2xl bg-[#061A35] text-white border border-[#D9A441] shadow-md cursor-pointer hover:bg-[#0D3565] transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D9A441] text-[#061A35] flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#D9A441]">
                    {directJump.label}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Klik untuk membuka langsung ayat ini di mushaf
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#D9A441]" />
            </div>
          )}

          {/* Surah Matches */}
          {matchedSurahs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Surat Ditemukan ({matchedSurahs.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedSurahs.map((surah) => (
                  <button
                    key={surah.nomor}
                    onClick={() => {
                      onNavigateToAyat(surah.nomor, 1);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#15518A] hover:shadow-xs transition text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#061A35] text-[#D9A441] flex items-center justify-center text-xs font-mono font-bold">
                        {surah.nomor}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#061A35]">
                          {highlightMatch(surah.namaLatin, debouncedQuery)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {highlightMatch(surah.arti, debouncedQuery)}
                        </div>
                      </div>
                    </div>
                    <span className="font-arabic text-base text-slate-800">
                      {surah.nama}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Search in Indonesian Translations */}
          {debouncedQuery.length >= 3 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <span>Hasil Terjemahan Bahasa Indonesia</span>
                  {isSearchingTranslations && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#15518A]" />
                  )}
                </span>
                <span className="text-[11px] text-slate-400">
                  {translationMatches.length} ayat ditemukan
                </span>
              </div>

              {translationMatches.length === 0 && !isSearchingTranslations && matchedSurahs.length === 0 && !directJump && (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-600">
                    Tidak ditemukan ayat dengan kata kunci "{debouncedQuery}"
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Coba kata dasar bahasa Indonesia atau gunakan nama surat.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {translationMatches.map((m, idx) => (
                  <button
                    key={`${m.surahNumber}-${m.verseNumber}-${idx}`}
                    onClick={() => {
                      onNavigateToAyat(m.surahNumber, m.verseNumber);
                      onClose();
                    }}
                    className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition text-left space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#061A35] group-hover:text-[#15518A]">
                        QS. {m.surahNameLatin} : Ayat {m.verseNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Surat #{m.surahNumber}
                      </span>
                    </div>
                    <p className="font-arabic text-sm text-right text-slate-800" dir="rtl">
                      {m.teksArab}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {highlightMatch(m.teksIndonesia, debouncedQuery)}
                    </p>
                  </button>
                ))}
              </div>

              {/* Scope note complying with Section 5.F */}
              <div className="p-2.5 bg-slate-100/70 rounded-xl text-[10px] text-slate-500 leading-normal">
                Indeks pencarian terjemahan mencakup surat-surat yang telah dimuat & surat pilihan utama (Al-Fatihah, Al-Baqarah, Al-Kahf, Yasin, Al-Mulk, dll).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
