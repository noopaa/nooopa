/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, Trash2 } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ReadingHistoryItem } from '../../types/quran';

interface HistoryViewProps {
  onNavigateToAyat: (surahNumber: number, verseNumber: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onNavigateToAyat,
  onNavigateTab,
}) => {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);

  useEffect(() => {
    setHistory(StorageService.getHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Hapus seluruh riwayat bacaan?')) {
      StorageService.clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#061A35] tracking-tight">
            Riwayat Bacaan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar ayat dan surat yang baru-baru ini Anda buka.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Riwayat</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">Belum ada riwayat bacaan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Riwayat akan tercatat secara otomatis saat Anda membuka dan membaca ayat Al-Qur'an.
          </p>
          <button
            onClick={() => onNavigateTab('surah')}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#061A35] text-[#D9A441] text-xs font-semibold hover:bg-[#0D3565] transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buka Daftar Surat</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateToAyat(item.surahNumber, item.verseNumber)}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#061A35] text-[#D9A441] flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:bg-[#15518A] transition-colors">
                  #{item.surahNumber}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#061A35] group-hover:text-[#15518A]">
                    QS. {item.surahNameLatin} : Ayat {item.verseNumber}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-[#15518A] group-hover:text-[#061A35]">
                Lanjutkan Tilawah →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
