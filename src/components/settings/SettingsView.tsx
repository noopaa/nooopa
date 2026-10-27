/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Check,
  Globe,
  Headphones,
  Moon,
  RotateCcw,
  Sliders,
  Sun,
  Target,
  Type,
} from 'lucide-react';
import { APP_CONFIG, THEME_PALETTE } from '../../config/appConfig';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { StorageService } from '../../services/storageService';
import { AppSettings, DEFAULT_SETTINGS, QARI_LIST } from '../../types/quran';
import { AppEmblem } from '../common/AppEmblem';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [saveToast, setSaveToast] = useState(false);
  const { setQari } = useAudioPlayer();

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    StorageService.saveSettings(updated);
    if (key === 'selectedQariId') {
      setQari(value as string);
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan semua pengaturan ke default?')) {
      StorageService.saveSettings(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
      setQari(DEFAULT_SETTINGS.selectedQariId);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#061A35] tracking-tight">
            Pengaturan & Preferensi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sesuaikan kenyamanan tilawah, audio qari, target harian, dan tampilan.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Tersimpan</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: Typography & Tampilan Mushaf */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Type className="w-5 h-5 text-[#15518A]" />
            <h2 className="text-base font-bold text-[#061A35]">
              Tipografi & Tampilan Ayat
            </h2>
          </div>

          {/* Arabic Font Size Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Ukuran Teks Kaligrafi Arab
              </label>
              <span className="text-xs font-mono font-bold text-[#15518A]">
                {settings.arabicFontSize}px
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="44"
              step="2"
              value={settings.arabicFontSize}
              onChange={(e) =>
                updateSetting('arabicFontSize', parseInt(e.target.value, 10))
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#15518A]"
            />
            {/* Live Preview of Arabic Font */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-right mt-2" dir="rtl">
              <p
                className="font-arabic font-normal text-[#061A35] leading-relaxed"
                style={{ fontSize: `${settings.arabicFontSize}px` }}
              >
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
            </div>
          </div>

          {/* Transliteration Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Tampilkan Transliterasi Latin
              </p>
              <p className="text-[11px] text-slate-400">
                Menampilkan ejaan latin di bawah teks Arab untuk mempermudah pelafalan
              </p>
            </div>
            <button
              onClick={() =>
                updateSetting('showTransliteration', !settings.showTransliteration)
              }
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                settings.showTransliteration ? 'bg-[#15518A]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.showTransliteration ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Translation Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Tampilkan Terjemahan Bahasa Indonesia
              </p>
              <p className="text-[11px] text-slate-400">
                Terjemahan resmi Kementerian Agama Republik Indonesia (Kemenag)
              </p>
            </div>
            <button
              onClick={() =>
                updateSetting('showTranslation', !settings.showTranslation)
              }
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                settings.showTranslation ? 'bg-[#15518A]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.showTranslation ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 2: Audio Murottal & Qari Favorit */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Headphones className="w-5 h-5 text-[#D9A441]" />
            <h2 className="text-base font-bold text-[#061A35]">
              Audio Murottal & Pilihan Qari
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            Pilih qari utama yang melantunkan bacaan saat Anda memutar ayat atau surat:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QARI_LIST.map((q) => (
              <button
                key={q.id}
                onClick={() => updateSetting('selectedQariId', q.id)}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                  settings.selectedQariId === q.id
                    ? 'border-[#D9A441] bg-[#FFFDF7] ring-1 ring-[#D9A441]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-[#061A35]">{q.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{q.description}</p>
                </div>
                {settings.selectedQariId === q.id && (
                  <Check className="w-4 h-4 text-[#D9A441] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Target Tilawah Harian */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Target className="w-5 h-5 text-[#15518A]" />
            <h2 className="text-base font-bold text-[#061A35]">
              Target Tilawah Harian
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Jumlah Ayat Target per Hari
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 50].map((count) => (
                <button
                  key={count}
                  onClick={() => updateSetting('dailyTargetAyat', count)}
                  className={`py-2 text-xs font-mono font-bold rounded-xl border transition ${
                    settings.dailyTargetAyat === count
                      ? 'bg-[#061A35] text-[#D9A441] border-[#061A35]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {count} Ayat
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Setiap kali Anda membuka ayat di pembaca, progres tilawah harian Anda akan bertambah secara otomatis.
            </p>
          </div>
        </div>

        {/* Section 4: Auto-Scroll Speed */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-[#15518A]" />
            <h2 className="text-base font-bold text-[#061A35]">
              Kecepatan Default Auto-Scroll
            </h2>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => updateSetting('autoScrollSpeed', spd)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    settings.autoScrollSpeed === spd
                      ? 'bg-[#061A35] text-[#D9A441] border-[#061A35]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {spd}x {spd === 1 ? '(Lambat)' : spd === 5 ? '(Cepat)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Reset & App Info */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Pengaturan Default</span>
          </button>

          <span className="text-xs text-slate-400">
            {APP_CONFIG.appName} · Mushaf Kemenag RI
          </span>
        </div>
      </div>
    </div>
  );
};
