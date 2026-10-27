/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  Compass,
  Headphones,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { APP_CONFIG, THEME_PALETTE } from '../../config/appConfig';
import { StorageService } from '../../services/storageService';
import { AppSettings, LastReadPosition, SurahSummary } from '../../types/quran';
import { AppEmblem } from '../common/AppEmblem';

interface HomeViewProps {
  surahs: SurahSummary[];
  onSelectSurah: (surahNumber: number, verseNumber?: number) => void;
  onOpenSearch: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  surahs,
  onSelectSurah,
  onOpenSearch,
  onNavigateTab,
}) => {
  const [lastRead, setLastRead] = useState<LastReadPosition | null>(null);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [bookmarkedCount, setBookmarkedCount] = useState(0);

  useEffect(() => {
    setLastRead(StorageService.getLastRead());
    setSettings(StorageService.getSettings());
    setBookmarkedCount(StorageService.getBookmarks().length);
  }, []);

  const progressPercent = Math.min(
    100,
    Math.round((settings.todayReadAyatCount / Math.max(1, settings.dailyTargetAyat)) * 100)
  );

  const featuredSurahs = [
    { no: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', desc: 'Pembukaan' },
    { no: 18, name: 'Al-Kahf', arabic: 'الكهف', desc: 'Gua (Sunnah Jumat)' },
    { no: 36, name: 'Yasin', arabic: 'يس', desc: 'Jantung Al-Qur\'an' },
    { no: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', desc: 'Hari Kiamat' },
    { no: 67, name: 'Al-Mulk', arabic: 'الملك', desc: 'Kerajaan (Pelindung Kubur)' },
    { no: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', desc: 'Memurnikan Keesaan Allah' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Luxury Islamic Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061A35] via-[#0D3565] to-[#061A35] text-white p-6 sm:p-10 border border-[#15518A]/50 shadow-xl">
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D9A441]">
              <span>Bismillahir Rahmanir Rahim</span>
              <span aria-hidden="true">·</span>
              <span>114 Surat Lengkap</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
              Kemudahan Membaca & Meresapi <span className="text-[#D9A441]">Kalamullah</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Selamat datang di <strong className="text-white font-semibold">{APP_CONFIG.appName}</strong>.
              Nikmati tilawah mushaf dengan teks Utsmani presisi tinggi, terjemahan & tafsir Kemenag RI, audio murottal 6 qari ternama, serta fitur auto-scroll tanpa jeda.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => (lastRead ? onSelectSurah(lastRead.surahNumber, lastRead.verseNumber) : onSelectSurah(1, 1))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9A441] text-[#061A35] font-semibold text-sm hover:bg-[#edd48d] active:scale-95 transition-all shadow-md"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lastRead ? `Lanjutkan: ${lastRead.surahNameLatin} : ${lastRead.verseNumber}` : 'Mulai Membaca (Al-Fatihah)'}</span>
              </button>
              <button
                onClick={onOpenSearch}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/15"
              >
                <Search className="w-4 h-4 text-[#D9A441]" />
                <span>Cari Ayat atau Terjemahan</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative group p-2">
              <div className="absolute inset-0 bg-[#D9A441]/20 rounded-full blur-xl group-hover:bg-[#D9A441]/30 transition-all" />
              <AppEmblem size={180} className="relative z-10 transition-transform group-hover:scale-105" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Last Read & Daily Tilawah Progress */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Last Read Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#15518A]" />
                <span>Terakhir Dibaca</span>
              </div>
              {lastRead && (
                <span className="text-xs text-slate-400">
                  {new Date(lastRead.timestamp).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>

            {lastRead ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[#061A35] tracking-tight">
                      {lastRead.surahNameLatin}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Surat ke-{lastRead.surahNumber} · Ayat ke-{lastRead.verseNumber} dari {lastRead.totalVerses}
                    </p>
                  </div>
                  <span className="font-arabic text-3xl font-bold text-[#15518A]">
                    {lastRead.surahNameArabic}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-[#D9A441] h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((lastRead.verseNumber / lastRead.totalVerses) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-5 py-4 text-center">
                <p className="text-sm font-medium text-slate-700">Belum ada riwayat bacaan.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Mulai baca surat pertama atau pilih surat favoritmu di bawah.
                </p>
              </div>
            )}
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
            {lastRead ? (
              <button
                onClick={() => onSelectSurah(lastRead.surahNumber, lastRead.verseNumber)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#061A35] text-[#D9A441] font-semibold text-xs hover:bg-[#0D3565] transition flex items-center justify-center gap-2"
              >
                <span>Buka Ayat Terakhir</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={() => onSelectSurah(1, 1)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#061A35] text-[#D9A441] font-semibold text-xs hover:bg-[#0D3565] transition flex items-center justify-center gap-2"
              >
                <span>Buka Surah Al-Fatihah</span>
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Real Daily Reading Target */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-[#D9A441]" />
                <span>Target Tilawah Hari Ini</span>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">
                {settings.todayReadAyatCount} / {settings.dailyTargetAyat} Ayat
              </span>
            </div>

            <div className="mt-4 flex items-center gap-5">
              {/* Circular Metric Ring */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#D9A441] transition-all duration-700 ease-out"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-bold text-[#061A35] font-mono">
                  {progressPercent}%
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#061A35]">
                  {progressPercent >= 100 ? 'Alhamdulillah, Target Tercapai!' : 'Lanjutkan Istiqomah Tilawah'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {progressPercent >= 100
                    ? `Kamu telah membaca ${settings.todayReadAyatCount} ayat hari ini. Terus pertahankan kelancaran tilawahmu.`
                    : `Tersisa ${Math.max(0, settings.dailyTargetAyat - settings.todayReadAyatCount)} ayat lagi untuk mencapai target harian (${settings.dailyTargetAyat} ayat).`}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dihitung otomatis saat kamu membaca ayat</span>
            <button
              onClick={() => onNavigateTab('settings')}
              className="text-[#15518A] font-semibold hover:underline"
            >
              Ubah Target
            </button>
          </div>
        </div>
      </section>

      {/* Featured / Recommended Surahs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#061A35] tracking-tight">
              Surat Pilihan & Rutinitas
            </h2>
            <p className="text-xs text-slate-500">
              Akses cepat ke surat-surat yang dianjurkan dibaca setiap hari dan malam Jumat.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('surah')}
            className="text-xs font-semibold text-[#15518A] hover:text-[#061A35] transition flex items-center gap-1"
          >
            <span>Semua 114 Surat</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {featuredSurahs.map((item) => (
            <button
              key={item.no}
              onClick={() => onSelectSurah(item.no, 1)}
              className="group p-4 bg-white rounded-xl border border-slate-200/80 hover:border-[#D9A441] hover:shadow-md transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-[#D9A441] font-semibold">
                    #{item.no}
                  </span>
                  <span className="font-arabic text-lg text-slate-800 group-hover:text-[#061A35]">
                    {item.arabic}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#061A35] truncate group-hover:text-[#15518A]">
                  {item.name}
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.desc}</p>
              </div>
              <span className="text-[10px] font-semibold text-[#15518A] group-hover:text-[#D9A441] mt-3 flex items-center gap-1">
                <span>Baca</span>
                <span aria-hidden="true">→</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => onNavigateTab('surah')}
          className="p-5 rounded-2xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 text-left transition flex items-start gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#061A35] text-[#D9A441] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#061A35]">Daftar 114 Surat</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cari berdasarkan nama Arab, latin, arti, dan tempat turun Mekah/Madinah.
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('bookmarks')}
          className="p-5 rounded-2xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 text-left transition flex items-start gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#061A35] text-[#D9A441] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#061A35]">Bookmark & Catatan</h3>
              {bookmarkedCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#D9A441]/20 text-[#061A35] font-semibold">
                  {bookmarkedCount}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simpan ayat yang berkesan dan buat catatan tadabbur pribadi.
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('settings')}
          className="p-5 rounded-2xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 text-left transition flex items-start gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#061A35] text-[#D9A441] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#061A35]">Audio 6 Qari & Ukuran Teks</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan qari murottal favorit, ukuran kaligrafi Arab, dan mode tampilan.
            </p>
          </div>
        </button>
      </section>
    </div>
  );
};
