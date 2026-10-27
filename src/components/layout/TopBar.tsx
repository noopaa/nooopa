/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { APP_CONFIG, THEME_PALETTE } from '../../config/appConfig';
import { AppEmblem } from '../common/AppEmblem';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface TopBarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenSearch: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onNavigate,
  onOpenSearch,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#061A35] text-white border-b border-[#0D3565] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line with emblem */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
        >
          <AppEmblem size={38} />
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#D9A441] transition-colors whitespace-nowrap">
            {APP_CONFIG.appName}
          </span>
        </button>

        {/* Zone 2: 4-5 single-line nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'home'
                ? 'text-[#D9A441] font-semibold border-b-2 border-[#D9A441]'
                : ''
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigate('surah')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'surah' || activeTab === 'reader'
                ? 'text-[#D9A441] font-semibold border-b-2 border-[#D9A441]'
                : ''
            }`}
          >
            Daftar Surat
          </button>
          <button
            onClick={() => onNavigate('bookmarks')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'bookmarks'
                ? 'text-[#D9A441] font-semibold border-b-2 border-[#D9A441]'
                : ''
            }`}
          >
            Bookmark & Catatan
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'history'
                ? 'text-[#D9A441] font-semibold border-b-2 border-[#D9A441]'
                : ''
            }`}
          >
            Riwayat
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'settings'
                ? 'text-[#D9A441] font-semibold border-b-2 border-[#D9A441]'
                : ''
            }`}
          >
            Pengaturan
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#0D3565] text-slate-200 hover:bg-[#15518A] hover:text-white transition-all border border-[#15518A]/40 shadow-xs whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
            aria-label="Cari Surat dan Ayat"
          >
            <Search className="w-4 h-4 text-[#D9A441]" />
            <span className="hidden sm:inline">Cari Ayat / Kata</span>
            <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-[#061A35] text-slate-400 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>
          <div className="hidden sm:block">
            <PWAInstallButton />
          </div>
        </div>
      </div>
    </header>
  );
};
