/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { APP_CONFIG, THEME_PALETTE } from '../../config/appConfig';
import { AppEmblem } from '../common/AppEmblem';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#061A35] text-slate-300 border-t border-[#0D3565] pt-12 pb-24 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <AppEmblem size={36} />
              <span className="text-xl font-bold text-white tracking-tight">
                {APP_CONFIG.appName}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {THEME_PALETTE.subTagline}. Didesain dengan prinsip luxury Islamic minimalism untuk menghadirkan kenyamanan tilawah dan tadabbur setiap hari.
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Sumber Data Terverifikasi:</span>
              <span className="text-slate-300 font-medium">equran.id / Kemenag RI</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D9A441] mb-3">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('surah')}
                  className="hover:text-white transition-colors"
                >
                  Daftar 114 Surat
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bookmarks')}
                  className="hover:text-white transition-colors"
                >
                  Ayat Tersimpan & Catatan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-white transition-colors"
                >
                  Riwayat Bacaan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('settings')}
                  className="hover:text-white transition-colors"
                >
                  Preferensi & Audio Qari
                </button>
              </li>
            </ul>
          </div>

          {/* Key Surahs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D9A441] mb-3">
              Surat Pilihan
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('surah:18')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full max-w-[180px]"
                >
                  <span>Al-Kahf</span>
                  <span className="font-arabic text-xs text-slate-400">الكهف</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('surah:36')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full max-w-[180px]"
                >
                  <span>Yasin</span>
                  <span className="font-arabic text-xs text-slate-400">يس</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('surah:56')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full max-w-[180px]"
                >
                  <span>Al-Waqi'ah</span>
                  <span className="font-arabic text-xs text-slate-400">الواقعة</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('surah:67')}
                  className="hover:text-white transition-colors flex items-center justify-between w-full max-w-[180px]"
                >
                  <span>Al-Mulk</span>
                  <span className="font-arabic text-xs text-slate-400">الملك</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#0D3565] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {APP_CONFIG.appName}. Seluruh teks Al-Qur'an bersumber dari Mushaf Standar Indonesia Kemenag RI.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">PWA Offline Ready</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#D9A441]">Audio 6 Qari Masyhur</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
