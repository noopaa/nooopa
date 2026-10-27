/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Clock,
  Edit3,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { Bookmark as BookmarkType, PersonalNote } from '../../types/quran';

interface BookmarksViewProps {
  onNavigateToAyat: (surahNumber: number, verseNumber: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  onNavigateToAyat,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [notes, setNotes] = useState<PersonalNote[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBookmarks(StorageService.getBookmarks());
    setNotes(StorageService.getNotes());
  };

  const handleRemoveBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    StorageService.removeBookmark(id);
    loadData();
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    StorageService.deleteNote(id);
    loadData();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#061A35] tracking-tight">
            Ayat Tersimpan & Catatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kumpulan ayat favorit dan catatan tadabbur pribadi yang tersimpan di perangkat Anda.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
              activeTab === 'bookmarks'
                ? 'bg-white text-[#061A35] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmark ({bookmarks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
              activeTab === 'notes'
                ? 'bg-white text-[#061A35] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Catatan ({notes.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Belum ada ayat yang di-bookmark</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Saat membaca surat, tekan ikon bookmark pada ayat untuk menyimpannya ke daftar ini.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onNavigateToAyat(b.surahNumber, b.verseNumber)}
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#15518A] hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#061A35] text-[#D9A441] flex items-center justify-center font-mono font-bold text-xs">
                        {b.verseNumber}
                      </span>
                      <h4 className="text-sm font-bold text-[#061A35] group-hover:text-[#15518A]">
                        QS. {b.surahNameLatin} : Ayat {b.verseNumber}
                      </h4>
                    </div>
                    <button
                      onClick={(e) => handleRemoveBookmark(e, b.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus Bookmark"
                      aria-label="Hapus Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-arabic text-lg text-right text-slate-900 line-clamp-2" dir="rtl">
                    {b.verseTextArabic}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    "{b.verseTextTranslation}"
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {new Date(b.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[#15518A] font-semibold flex items-center gap-1 group-hover:text-[#061A35]">
                      <span>Buka Ayat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PERSONAL NOTES */}
      {activeTab === 'notes' && (
        <div>
          {notes.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Edit3 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Belum ada catatan tadabbur</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tekan tombol pena/catatan di samping ayat manapun untuk menulis renungan atau faedah pribadi.
              </p>
              <button
                onClick={() => onNavigateTab('surah')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#061A35] text-[#D9A441] text-xs font-semibold hover:bg-[#0D3565] transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Buka Mushaf</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onNavigateToAyat(n.surahNumber, n.verseNumber)}
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#15518A] hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-[#061A35] group-hover:text-[#15518A]">
                      QS. {n.surahNameLatin} : Ayat {n.verseNumber}
                    </h4>
                    <button
                      onClick={(e) => handleDeleteNote(e, n.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus Catatan"
                      aria-label="Hapus Catatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/50 text-xs text-slate-800 leading-relaxed font-sans">
                    <p className="whitespace-pre-line">{n.noteText}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Diperbarui:{' '}
                      {new Date(n.updatedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[#15518A] font-semibold flex items-center gap-1 group-hover:text-[#061A35]">
                      <span>Buka Ayat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
