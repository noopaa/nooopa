/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { QuranApi } from '../services/quranApi';
import { SurahDetail, SurahSummary, TafsirData } from '../types/quran';

export function useAllSurahs() {
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurahs = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuranApi.getAllSurahs(force);
      setSurahs(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memuat daftar surat.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurahs(false);
  }, [fetchSurahs]);

  return { surahs, loading, error, reload: () => fetchSurahs(true) };
}

export function useSurahDetail(surahNumber: number) {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(
    async (force = false) => {
      if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
        setError('Nomor surat tidak valid.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await QuranApi.getSurahDetail(surahNumber, force);
        setSurah(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : `Gagal memuat surat ke-${surahNumber}.`;
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [surahNumber]
  );

  useEffect(() => {
    fetchDetail(false);
  }, [fetchDetail]);

  return { surah, loading, error, reload: () => fetchDetail(true) };
}

export function useSurahTafsir(surahNumber: number) {
  const [tafsir, setTafsir] = useState<TafsirData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTafsir = useCallback(
    async (force = false) => {
      if (!surahNumber || surahNumber < 1 || surahNumber > 114) return;
      try {
        setLoading(true);
        setError(null);
        const data = await QuranApi.getSurahTafsir(surahNumber, force);
        setTafsir(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : `Gagal memuat tafsir surat ke-${surahNumber}.`;
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [surahNumber]
  );

  useEffect(() => {
    fetchTafsir(false);
  }, [fetchTafsir]);

  return { tafsir, loading, error, reload: () => fetchTafsir(true) };
}
