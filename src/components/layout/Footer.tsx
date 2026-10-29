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
  const partnerLogos = [
    {
      id: 'yayasan',
      name: 'Yayasan Karya Pondok Mandiri',
      category: 'Pondok & Yayasan',
      src: '/assets/aistudio/Screenshot_2026-10-29-11-22-39-39_99c04817c0de5652397fc8b56c3b3817_b22f5706.jpg',
      scale: 'scale-[2.35]',
      aspect: 'w-16 h-16 sm:w-20 sm:h-20 rounded-full',
    },
    {
      id: 'bbpvp',
      name: 'BBPVP Bekasi',
      category: 'Kementerian Ketenagakerjaan RI',
      src: '/assets/aistudio/Screenshot_2026-10-29-11-22-55-37_99c04817c0de5652397fc8b56c3b3817_c1efd137.jpg',
      scale: 'scale-[2.45]',
      aspect: 'w-36 sm:w-44 h-16 rounded-xl',
    },
    {
      id: 'computindo',
      name: 'Computindo',
      category: 'Teknologi & Komputasi',
      src: '/assets/aistudio/Screenshot_2026-10-29-11-22-50-03_99c04817c0de5652397fc8b56c3b3817_a0c5604c.jpg',
      scale: 'scale-[2.35]',
      aspect: 'w-24 sm:w-28 h-16 rounded-xl',
    },
  ];

  return (
    <footer className="w-full bg-[#061A35] text-slate-300 border-t border-[#0D3565] pt-12 pb-24 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

        {/* Institutional & Partner Logos Section */}
        <div className="pt-8 border-t border-[#0D3565] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D9A441]">
                Kemitraan & Afiliasi Institusi
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Didukung oleh sinergi lembaga pendidikan, pelatihan vokasi, dan pengembangan teknologi.
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Mitra Resmi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {partnerLogos.map((logo) => (
              <div
                key={logo.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#030D1C]/80 border border-[#0D3565] hover:border-[#D9A441]/50 transition-all shadow-xs group"
              >
                {/* Logo Frame: Centers cropped logo from screenshot */}
                <div
                  className={`relative overflow-hidden bg-black flex items-center justify-center border border-slate-800 shrink-0 ${logo.aspect}`}
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className={`w-full h-full object-cover object-center ${logo.scale} transition-transform group-hover:scale-[2.5]`}
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0">
                  <h5 className="text-sm font-bold text-white group-hover:text-[#D9A441] transition-colors truncate">
                    {logo.name}
                  </h5>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {logo.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Status */}
        <div className="pt-6 border-t border-[#0D3565] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {APP_CONFIG.appName}. Seluruh hak cipta dilindungi. Teks Al-Qur'an bersumber dari Mushaf Standar Indonesia Kemenag RI.</p>
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
