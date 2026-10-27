/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SurahDetail, SurahSummary, TafsirData } from '../types/quran';

const API_BASE_URL = 'https://equran.id/api/v2';
const MEMORY_CACHE = new Map<string, unknown>();

// Local storage cache helper with expiration
function getCached<T>(key: string): T | null {
  if (MEMORY_CACHE.has(key)) {
    return MEMORY_CACHE.get(key) as T;
  }
  try {
    const raw = localStorage.getItem(`equran_cache_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Cache valid for 14 days
    if (Date.now() - parsed.timestamp > 14 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(`equran_cache_${key}`);
      return null;
    }
    MEMORY_CACHE.set(key, parsed.data);
    return parsed.data as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  MEMORY_CACHE.set(key, data);
  try {
    localStorage.setItem(
      `equran_cache_${key}`,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (err) {
    // Quota exceeded, clear older caches
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('equran_cache_')) {
          localStorage.removeItem(k);
          break;
        }
      }
    } catch {
      // Ignore
    }
  }
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(url, {
        ...options,
        signal: options.signal || controller.signal,
      });
      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      if (json.code !== 200 && json.status !== 'success' && !json.data) {
        throw new Error(json.message || 'Format respons tidak valid dari server.');
      }

      return json.data as T;
    } catch (err) {
      attempt++;
      if (attempt > retries) {
        throw err;
      }
      // Exponential backoff wait
      await new Promise((r) => setTimeout(r, 600 * attempt));
    }
  }
  throw new Error('Gagal menghubungi server setelah beberapa percobaan.');
}

export const QuranApi = {
  /**
   * Fetches metadata for all 114 Surahs
   */
  async getAllSurahs(forceRefresh = false): Promise<SurahSummary[]> {
    const cacheKey = 'surat_all_list';
    if (!forceRefresh) {
      const cached = getCached<SurahSummary[]>(cacheKey);
      if (cached && cached.length === 114) {
        return cached;
      }
    }

    try {
      const data = await fetchWithRetry<SurahSummary[]>(`${API_BASE_URL}/surat`);
      if (Array.isArray(data) && data.length > 0) {
        setCache(cacheKey, data);
        return data;
      }
      throw new Error('Daftar surat tidak lengkap.');
    } catch (err) {
      // Fallback to cache if available even if stale
      const stale = getCached<SurahSummary[]>(cacheKey);
      if (stale && stale.length > 0) {
        return stale;
      }
      throw err;
    }
  },

  /**
   * Fetches detail for a specific Surah by number (1 to 114)
   */
  async getSurahDetail(surahNumber: number, forceRefresh = false): Promise<SurahDetail> {
    if (surahNumber < 1 || surahNumber > 114) {
      throw new Error(`Nomor surat tidak valid: ${surahNumber}. Harus di antara 1 dan 114.`);
    }

    const cacheKey = `surat_${surahNumber}_detail`;
    if (!forceRefresh) {
      const cached = getCached<SurahDetail>(cacheKey);
      if (cached && cached.ayat && cached.ayat.length > 0) {
        return cached;
      }
    }

    try {
      const data = await fetchWithRetry<SurahDetail>(`${API_BASE_URL}/surat/${surahNumber}`);
      if (data && Array.isArray(data.ayat)) {
        setCache(cacheKey, data);
        return data;
      }
      throw new Error(`Data ayat surat nomor ${surahNumber} tidak valid.`);
    } catch (err) {
      const stale = getCached<SurahDetail>(cacheKey);
      if (stale && stale.ayat && stale.ayat.length > 0) {
        return stale;
      }
      throw err;
    }
  },

  /**
   * Fetches Kemenag Tafsir for a specific Surah by number
   */
  async getSurahTafsir(surahNumber: number, forceRefresh = false): Promise<TafsirData> {
    if (surahNumber < 1 || surahNumber > 114) {
      throw new Error(`Nomor surat tidak valid: ${surahNumber}.`);
    }

    const cacheKey = `tafsir_${surahNumber}`;
    if (!forceRefresh) {
      const cached = getCached<TafsirData>(cacheKey);
      if (cached && cached.tafsir && cached.tafsir.length > 0) {
        return cached;
      }
    }

    try {
      const data = await fetchWithRetry<TafsirData>(`${API_BASE_URL}/tafsir/${surahNumber}`);
      if (data && Array.isArray(data.tafsir)) {
        setCache(cacheKey, data);
        return data;
      }
      throw new Error(`Data tafsir surat nomor ${surahNumber} tidak valid.`);
    } catch (err) {
      const stale = getCached<TafsirData>(cacheKey);
      if (stale) {
        return stale;
      }
      throw err;
    }
  },

  /**
   * Check if a surah detail is already cached locally
   */
  isSurahCached(surahNumber: number): boolean {
    return !!getCached<SurahDetail>(`surat_${surahNumber}_detail`);
  },
};
