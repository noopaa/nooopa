/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AudioPlaybackState, AudioService } from '../services/audioService';

export function useAudioPlayer() {
  const [audioState, setAudioState] = useState<AudioPlaybackState>(
    AudioService.getState()
  );

  useEffect(() => {
    const unsubscribe = AudioService.subscribe((newState) => {
      setAudioState(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    ...audioState,
    playVerse: AudioService.playVerse.bind(AudioService),
    playFullSurah: AudioService.playFullSurah.bind(AudioService),
    togglePlayPause: AudioService.togglePlayPause.bind(AudioService),
    pause: AudioService.pause.bind(AudioService),
    stop: AudioService.stop.bind(AudioService),
    seek: AudioService.seek.bind(AudioService),
    setVolume: AudioService.setVolume.bind(AudioService),
    setPlaybackRate: AudioService.setPlaybackRate.bind(AudioService),
    setQari: AudioService.setQari.bind(AudioService),
    nextVerse: AudioService.nextVerse.bind(AudioService),
    previousVerse: AudioService.previousVerse.bind(AudioService),
  };
}
