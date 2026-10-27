/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AppSettings,
  Bookmark,
  DEFAULT_SETTINGS,
  LastReadPosition,
  PersonalNote,
  ReadingHistoryItem,
} from '../types/quran';

const STORAGE_KEYS = {
  BOOKMARKS: 'equran_bookmarks_v2',
  NOTES: 'equran_notes_v2',
  LAST_READ: 'equran_last_read_v2',
  HISTORY: 'equran_history_v2',
  SETTINGS: 'equran_settings_v2',
  CACHE_PREFIX: 'equran_api_cache_',
  DAILY_VERSES_SET: 'equran_today_verses_',
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storageService] Error reading key "${key}":`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storageService] Error writing key "${key}":`, err);
    return false;
  }
}

export const StorageService = {
  // Settings
  getSettings(): AppSettings {
    const saved = safeGet<Partial<AppSettings>>(STORAGE_KEYS.SETTINGS, {});
    const today = new Date().toISOString().split('T')[0];
    const settings = { ...DEFAULT_SETTINGS, ...saved };

    // Reset daily reading count if date changed
    if (settings.lastTargetDate !== today) {
      settings.lastTargetDate = today;
      settings.todayReadAyatCount = 0;
      safeSet(STORAGE_KEYS.SETTINGS, settings);
    }
    return settings;
  },

  saveSettings(settings: AppSettings): void {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
  },

  // Record reading progress for daily target
  recordAyatRead(surahNumber: number, verseNumber: number): number {
    const today = new Date().toISOString().split('T')[0];
    const setKey = `${STORAGE_KEYS.DAILY_VERSES_SET}${today}`;
    const readSet = new Set<string>(safeGet<string[]>(setKey, []));
    const verseId = `${surahNumber}:${verseNumber}`;

    if (!readSet.has(verseId)) {
      readSet.add(verseId);
      safeSet(setKey, Array.from(readSet));

      const settings = this.getSettings();
      settings.todayReadAyatCount = readSet.size;
      settings.lastTargetDate = today;
      this.saveSettings(settings);
      return readSet.size;
    }
    return readSet.size;
  },

  // Bookmarks
  getBookmarks(): Bookmark[] {
    return safeGet<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
  },

  toggleBookmark(bookmark: Bookmark): boolean {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.findIndex((b) => b.id === bookmark.id);
    let isNowBookmarked = false;

    if (index >= 0) {
      bookmarks.splice(index, 1);
      isNowBookmarked = false;
    } else {
      bookmarks.unshift(bookmark);
      isNowBookmarked = true;
    }
    safeSet(STORAGE_KEYS.BOOKMARKS, bookmarks);
    return isNowBookmarked;
  },

  removeBookmark(id: string): void {
    const bookmarks = this.getBookmarks().filter((b) => b.id !== id);
    safeSet(STORAGE_KEYS.BOOKMARKS, bookmarks);
  },

  isBookmarked(surahNumber: number, verseNumber: number): boolean {
    const id = `${surahNumber}-${verseNumber}`;
    return this.getBookmarks().some((b) => b.id === id);
  },

  // Personal Notes
  getNotes(): PersonalNote[] {
    return safeGet<PersonalNote[]>(STORAGE_KEYS.NOTES, []);
  },

  getNote(surahNumber: number, verseNumber: number): PersonalNote | undefined {
    const id = `${surahNumber}-${verseNumber}`;
    return this.getNotes().find((n) => n.id === id);
  },

  saveNote(surahNumber: number, surahNameLatin: string, verseNumber: number, noteText: string): void {
    const notes = this.getNotes();
    const id = `${surahNumber}-${verseNumber}`;
    const existingIndex = notes.findIndex((n) => n.id === id);
    const now = Date.now();

    if (existingIndex >= 0) {
      if (!noteText.trim()) {
        notes.splice(existingIndex, 1);
      } else {
        notes[existingIndex] = {
          ...notes[existingIndex],
          noteText: noteText.trim(),
          updatedAt: now,
        };
      }
    } else if (noteText.trim()) {
      notes.unshift({
        id,
        surahNumber,
        surahNameLatin,
        verseNumber,
        noteText: noteText.trim(),
        createdAt: now,
        updatedAt: now,
      });
    }
    safeSet(STORAGE_KEYS.NOTES, notes);
  },

  deleteNote(id: string): void {
    const notes = this.getNotes().filter((n) => n.id !== id);
    safeSet(STORAGE_KEYS.NOTES, notes);
  },

  // Last Read Position
  getLastRead(): LastReadPosition | null {
    return safeGet<LastReadPosition | null>(STORAGE_KEYS.LAST_READ, null);
  },

  setLastRead(pos: LastReadPosition): void {
    safeSet(STORAGE_KEYS.LAST_READ, pos);
    this.addHistory({
      id: `${pos.surahNumber}-${pos.verseNumber}-${Date.now()}`,
      surahNumber: pos.surahNumber,
      surahNameLatin: pos.surahNameLatin,
      verseNumber: pos.verseNumber,
      timestamp: Date.now(),
    });
  },

  // Reading History
  getHistory(): ReadingHistoryItem[] {
    return safeGet<ReadingHistoryItem[]>(STORAGE_KEYS.HISTORY, []);
  },

  addHistory(item: ReadingHistoryItem): void {
    const history = this.getHistory();
    // Keep max 50 recent items, filtering immediate duplicate
    const filtered = history.filter(
      (h) => !(h.surahNumber === item.surahNumber && h.verseNumber === item.verseNumber)
    );
    filtered.unshift(item);
    safeSet(STORAGE_KEYS.HISTORY, filtered.slice(0, 50));
  },

  clearHistory(): void {
    safeSet(STORAGE_KEYS.HISTORY, []);
  },
};
