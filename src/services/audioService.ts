/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AyatItemData } from '../types/quran';

export type AudioPlayMode = 'single_ayat' | 'continuous_ayat' | 'full_surah';

export interface AudioPlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  currentSurahNumber: number | null;
  currentSurahName: string | null;
  currentVerseNumber: number | null;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  qariId: string;
  playMode: AudioPlayMode;
  error: string | null;
}

type StateListener = (state: AudioPlaybackState) => void;

class AudioServiceController {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<StateListener> = new Set();
  private versesQueue: AyatItemData[] = [];
  private currentQueueIndex = -1;

  private state: AudioPlaybackState = {
    isPlaying: false,
    isLoading: false,
    currentSurahNumber: null,
    currentSurahName: null,
    currentVerseNumber: null,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    qariId: '05', // Default: Misyari Rasyid Al-Afasi
    playMode: 'continuous_ayat',
    error: null,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    if (this.audio) return;
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    this.audio.addEventListener('play', () => {
      this.updateState({ isPlaying: true, isLoading: false, error: null });
    });

    this.audio.addEventListener('pause', () => {
      this.updateState({ isPlaying: false });
    });

    this.audio.addEventListener('waiting', () => {
      this.updateState({ isLoading: true });
    });

    this.audio.addEventListener('playing', () => {
      this.updateState({ isPlaying: true, isLoading: false });
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.updateState({
          currentTime: this.audio.currentTime,
          duration: this.audio.duration || 0,
        });
      }
    });

    this.audio.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('[AudioService] Audio playback error:', e);
      this.updateState({
        isPlaying: false,
        isLoading: false,
        error: 'Gagal memutar audio. Pastikan koneksi internet stabil.',
      });
    });
  }

  private handleTrackEnded() {
    if (this.state.playMode === 'continuous_ayat') {
      // Advance to next verse in queue
      if (this.currentQueueIndex + 1 < this.versesQueue.length) {
        this.currentQueueIndex++;
        const nextVerse = this.versesQueue[this.currentQueueIndex];
        this.playVerseAudio(
          nextVerse,
          this.state.currentSurahNumber!,
          this.state.currentSurahName || '',
          this.state.qariId,
          true
        );
      } else {
        // Finished all verses in this surah
        this.updateState({
          isPlaying: false,
          currentVerseNumber: null,
          currentTime: 0,
        });
      }
    } else {
      this.updateState({ isPlaying: false, currentTime: 0 });
    }
  }

  private updateState(partial: Partial<AudioPlaybackState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioPlaybackState {
    return this.state;
  }

  public setQari(qariId: string) {
    this.updateState({ qariId });
    // If playing, switch active verse audio to newly selected qari
    if (this.audio && this.state.isPlaying && this.state.currentVerseNumber) {
      const currentVerse = this.versesQueue[this.currentQueueIndex];
      if (currentVerse && currentVerse.audio && currentVerse.audio[qariId]) {
        const resumePos = this.audio.currentTime;
        this.audio.src = currentVerse.audio[qariId];
        this.audio.currentTime = resumePos;
        this.audio.play().catch(() => {});
      }
    }
  }

  /**
   * Play specific ayat, optionally loading all verses for continuous mode
   */
  public playVerse(
    verse: AyatItemData,
    surahNumber: number,
    surahName: string,
    allVersesInSurah?: AyatItemData[],
    mode: AudioPlayMode = 'continuous_ayat'
  ) {
    this.initAudio();
    if (allVersesInSurah && allVersesInSurah.length > 0) {
      this.versesQueue = allVersesInSurah;
      this.currentQueueIndex = allVersesInSurah.findIndex(
        (v) => v.nomorAyat === verse.nomorAyat
      );
      if (this.currentQueueIndex === -1) {
        this.versesQueue = [verse];
        this.currentQueueIndex = 0;
      }
    } else {
      this.versesQueue = [verse];
      this.currentQueueIndex = 0;
    }

    this.updateState({ playMode: mode });
    this.playVerseAudio(verse, surahNumber, surahName, this.state.qariId);
  }

  private playVerseAudio(
    verse: AyatItemData,
    surahNumber: number,
    surahName: string,
    qariId: string,
    autoPlay = true
  ) {
    if (!this.audio) return;
    const audioUrl = verse.audio ? (verse.audio[qariId] || verse.audio['05'] || Object.values(verse.audio)[0]) : null;

    if (!audioUrl) {
      this.updateState({
        error: `Audio ayat ${verse.nomorAyat} tidak tersedia untuk qari ini.`,
        isPlaying: false,
        isLoading: false,
      });
      return;
    }

    this.updateState({
      isLoading: true,
      currentSurahNumber: surahNumber,
      currentSurahName: surahName,
      currentVerseNumber: verse.nomorAyat,
      error: null,
    });

    this.audio.src = audioUrl;
    this.audio.playbackRate = this.state.playbackRate;
    this.audio.volume = this.state.volume;

    if (autoPlay) {
      this.audio
        .play()
        .then(() => {
          this.updateState({ isPlaying: true, isLoading: false });
        })
        .catch((err) => {
          console.warn('[AudioService] Play blocked or failed:', err);
          this.updateState({
            isPlaying: false,
            isLoading: false,
            error: 'Pemutaran audio dijeda atau belum diizinkan oleh browser.',
          });
        });
    }
  }

  /**
   * Play full surah audio track
   */
  public playFullSurah(
    surahNumber: number,
    surahName: string,
    audioFullUrl: string
  ) {
    this.initAudio();
    if (!this.audio) return;

    this.versesQueue = [];
    this.currentQueueIndex = -1;

    this.updateState({
      isLoading: true,
      playMode: 'full_surah',
      currentSurahNumber: surahNumber,
      currentSurahName: surahName,
      currentVerseNumber: null,
      error: null,
    });

    this.audio.src = audioFullUrl;
    this.audio.playbackRate = this.state.playbackRate;
    this.audio.volume = this.state.volume;

    this.audio
      .play()
      .then(() => {
        this.updateState({ isPlaying: true, isLoading: false });
      })
      .catch((err) => {
        console.warn('[AudioService] Play full surah failed:', err);
        this.updateState({
          isPlaying: false,
          isLoading: false,
          error: 'Gagal memutar audio surat penuh.',
        });
      });
  }

  public togglePlayPause() {
    if (!this.audio || !this.audio.src) return;
    if (this.state.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(() => {});
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
    }
    this.updateState({
      isPlaying: false,
      isLoading: false,
      currentVerseNumber: null,
      currentTime: 0,
      duration: 0,
    });
  }

  public seek(timeSeconds: number) {
    if (this.audio) {
      this.audio.currentTime = timeSeconds;
      this.updateState({ currentTime: timeSeconds });
    }
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = clamped;
    }
    this.updateState({ volume: clamped });
  }

  public setPlaybackRate(rate: number) {
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    this.updateState({ playbackRate: rate });
  }

  public nextVerse() {
    if (
      this.state.playMode === 'continuous_ayat' &&
      this.currentQueueIndex + 1 < this.versesQueue.length
    ) {
      this.currentQueueIndex++;
      const next = this.versesQueue[this.currentQueueIndex];
      this.playVerseAudio(
        next,
        this.state.currentSurahNumber!,
        this.state.currentSurahName || '',
        this.state.qariId
      );
    }
  }

  public previousVerse() {
    if (this.state.playMode === 'continuous_ayat' && this.currentQueueIndex > 0) {
      this.currentQueueIndex--;
      const prev = this.versesQueue[this.currentQueueIndex];
      this.playVerseAudio(
        prev,
        this.state.currentSurahNumber!,
        this.state.currentSurahName || '',
        this.state.qariId
      );
    }
  }
}

export const AudioService = new AudioServiceController();
