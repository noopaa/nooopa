/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { BookOpen, ChevronRight, FileText, Loader2, RotateCcw, X } from 'lucide-react';
import { useSurahTafsir } from '../../hooks/useQuranData';

interface TafsirDrawerProps {
  surahNumber: number;
  surahNameLatin: string;
  initialAyatNumber?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const TafsirDrawer: React.FC<TafsirDrawerProps> = ({
  surahNumber,
  surahNameLatin,
  initialAyatNumber = 1,
  isOpen,
  onClose,
}) => {
  const { tafsir, loading, error, reload } = useSurahTafsir(surahNumber);
  const [selectedAyat, setSelectedAyat] = useState(initialAyatNumber);

  // Update selectedAyat when initialAyatNumber changes
  React.useEffect(() => {
    if (initialAyatNumber) {
      setSelectedAyat(initialAyatNumber);
    }
  }, [initialAyatNumber]);

  const currentTafsirItem = useMemo(() => {
    if (!tafsir || !tafsir.tafsir) return null;
    return tafsir.tafsir.find((t) => t.ayat === selectedAyat) || tafsir.tafsir[0];
  }, [tafsir, selectedAyat]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#061A35] text-white flex items-center justify-between border-b border-[#0D3565]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0D3565] text-[#D9A441] flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Tafsir Kemenag RI</span>
                <span className="text-xs font-normal text-slate-300">
                  QS. {surahNameLatin} : Ayat {selectedAyat}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Kementerian Agama Republik Indonesia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Tutup Tafsir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Ayat Selector Pills */}
          {tafsir && tafsir.tafsir && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Pilih Nomor Ayat:
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {tafsir.tafsir.map((item) => (
                  <button
                    key={item.ayat}
                    onClick={() => setSelectedAyat(item.ayat)}
                    className={`px-3 py-1 text-xs rounded-lg font-mono font-bold transition shrink-0 ${
                      selectedAyat === item.ayat
                        ? 'bg-[#061A35] text-[#D9A441] shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Ayat {item.ayat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#15518A]" />
              <p className="text-xs font-medium">Memuat tafsir terverifikasi Kemenag...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
              <p className="text-sm font-semibold text-rose-700">{error}</p>
              <button
                onClick={reload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#061A35] text-white text-xs font-semibold hover:bg-[#0D3565] transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
            </div>
          )}

          {/* Tafsir Content */}
          {!loading && !error && currentTafsirItem && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#061A35]">
                  Tafsir Lengkap Ayat ke-{currentTafsirItem.ayat}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {surahNameLatin}
                </span>
              </div>

              <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-3">
                {currentTafsirItem.teks.split('\n\n').map((paragraph, idx) => {
                  if (!paragraph.trim()) return null;
                  return (
                    <p key={idx} className="leading-relaxed text-justify">
                      {paragraph.trim()}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Mushaf Standar Indonesia Kemenag RI</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#061A35] text-[#D9A441] font-semibold text-xs hover:bg-[#0D3565] transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
