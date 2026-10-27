/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SurahSummary {
  nomor: number;
  nama: string; // Arabic name, e.g. "الفاتحة"
  namaLatin: string; // e.g. "Al-Fatihah"
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah' | string;
  arti: string; // Indonesian translation of the name, e.g. "Pembukaan"
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface AyatItemData {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>; // "01" through "06"
}

export interface SurahDetail extends SurahSummary {
  ayat: AyatItemData[];
  suratSelanjutnya: false | {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
  };
  suratSebelumnya: false | {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
  };
}

export interface TafsirAyat {
  ayat: number;
  teks: string;
}

export interface TafsirData {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  tafsir: TafsirAyat[];
}

export interface QariInfo {
  id: string; // "01", "02", etc.
  name: string;
  description: string;
}

export const QARI_LIST: QariInfo[] = [
  { id: '01', name: 'Abdullah Al-Juhany', description: 'Imam Masjidil Haram Makkah' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim', description: 'Imam Masjid Nabawi Madinah' },
  { id: '03', name: 'Abdurrahman as-Sudais', description: 'Imam Besar Masjidil Haram' },
  { id: '04', name: 'Ibrahim Al-Dossari', description: 'Qari & Pensyarah Qiraat' },
  { id: '05', name: 'Misyari Rasyid Al-Afasi', description: 'Qari & Nasheed Internasional' },
  { id: '06', name: 'Yasser Al-Dosari', description: 'Imam Masjidil Haram Makkah' },
];

export interface Bookmark {
  id: string; // surah-ayat
  surahNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  verseNumber: number;
  verseTextArabic: string;
  verseTextTranslation: string;
  createdAt: number;
}

export interface PersonalNote {
  id: string;
  surahNumber: number;
  surahNameLatin: string;
  verseNumber: number;
  noteText: string;
  createdAt: number;
  updatedAt: number;
}

export interface LastReadPosition {
  surahNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  verseNumber: number;
  totalVerses: number;
  timestamp: number;
}

export interface ReadingHistoryItem {
  id: string;
  surahNumber: number;
  surahNameLatin: string;
  verseNumber: number;
  timestamp: number;
}

export interface AppSettings {
  arabicFontSize: number; // default 28px
  showTransliteration: boolean;
  showTranslation: boolean;
  selectedQariId: string; // default "05" Misyari Rasyid
  autoScrollSpeed: number; // 1 to 5 (pixels per tick)
  dailyTargetAyat: number; // default 20 ayat
  todayReadAyatCount: number;
  lastTargetDate: string; // YYYY-MM-DD
  themeMode: 'light' | 'dark' | 'system';
}

export const DEFAULT_SETTINGS: AppSettings = {
  arabicFontSize: 28,
  showTransliteration: true,
  showTranslation: true,
  selectedQariId: '05',
  autoScrollSpeed: 2,
  dailyTargetAyat: 20,
  todayReadAyatCount: 0,
  lastTargetDate: new Date().toISOString().split('T')[0],
  themeMode: 'light',
};
