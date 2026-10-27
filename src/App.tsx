/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BookmarksView } from './components/bookmarks/BookmarksView';
import { HistoryView } from './components/history/HistoryView';
import { HomeView } from './components/home/HomeView';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { TopBar } from './components/layout/TopBar';
import { AudioPlayerBar } from './components/reader/AudioPlayerBar';
import { ReaderView } from './components/reader/ReaderView';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { SettingsView } from './components/settings/SettingsView';
import { SurahListView } from './components/surah/SurahListView';
import { APP_CONFIG, applyThemeVariables } from './config/appConfig';
import { useAllSurahs } from './hooks/useQuranData';

export default function App() {
  const { surahs, loading, error, reload } = useAllSurahs();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number>(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Apply theme tokens and set document title on mount
  useEffect(() => {
    applyThemeVariables();
    document.title = `${APP_CONFIG.appName} - Platform Al-Qur'an Digital Premium`;
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSurah = (surahNumber: number, verseNumber = 1) => {
    setSelectedSurahNumber(surahNumber);
    setSelectedVerseNumber(verseNumber);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateTab = (tab: string) => {
    if (tab.startsWith('surah:')) {
      const sNo = parseInt(tab.replace('surah:', ''), 10);
      handleSelectSurah(sNo, 1);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-[#D9A441]/25 selection:text-[#061A35]">
      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Primary Top Navigation Bar (Strict 3-zone Top Bar Contract) */}
      <TopBar
        activeTab={activeTab}
        onNavigate={handleNavigateTab}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomeView
            surahs={surahs}
            onSelectSurah={handleSelectSurah}
            onOpenSearch={() => setIsSearchOpen(true)}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'surah' && (
          <SurahListView
            surahs={surahs}
            loading={loading}
            error={error}
            onReload={reload}
            onSelectSurah={handleSelectSurah}
          />
        )}

        {activeTab === 'reader' && (
          <ReaderView
            surahNumber={selectedSurahNumber}
            initialVerseNumber={selectedVerseNumber}
            onBackToSurahList={() => setActiveTab('surah')}
            onNavigateSurah={handleSelectSurah}
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksView
            onNavigateToAyat={handleSelectSurah}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            onNavigateToAyat={handleSelectSurah}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Persistent Audio Murottal Mini Player */}
      <AudioPlayerBar />

      {/* Mobile Bottom Thumb Navigation */}
      <BottomNav
        activeTab={activeTab}
        onNavigate={handleNavigateTab}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigateTab} />

      {/* Global Search Modal with Debounce and Cross-Surah Indexing */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        surahs={surahs}
        onNavigateToAyat={handleSelectSurah}
      />
    </div>
  );
}
