/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Bookmark, Home, Search, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenSearch: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onNavigate,
  onOpenSearch,
}) => {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home, action: () => onNavigate('home') },
    { id: 'surah', label: 'Surat', icon: BookOpen, action: () => onNavigate('surah') },
    { id: 'search', label: 'Cari', icon: Search, action: onOpenSearch },
    { id: 'bookmarks', label: 'Bookmark', icon: Bookmark, action: () => onNavigate('bookmarks') },
    { id: 'settings', label: 'Pengaturan', icon: Settings, action: () => onNavigate('settings') },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#061A35]/95 backdrop-blur-md border-t border-[#0D3565] shadow-lg"
      aria-label="Navigasi Bawah"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === 'search' ? false : activeTab === item.id || (item.id === 'surah' && activeTab === 'reader');

          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all rounded-lg ${
                isActive
                  ? 'text-[#D9A441]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D9A441]" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-[#D9A441]' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
