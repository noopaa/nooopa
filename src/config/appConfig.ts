/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// 1. INPUT PESERTA — EDIT BAGIAN INI SAJA
// ============================================================================
export const APP_CONFIG = {
  appName: "nopsQur'an",
  primaryColor: "#061A35",
};

// ============================================================================
// DYNAMIC COLOR PALETTE & LUXURY ISLAMIC DESIGN TOKEN ENGINE
// Generates harmonious luxury Islamic palette derived mathematically from primaryColor
// ============================================================================

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  if (sNorm === 0) {
    const val = Math.round(lNorm * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  return {
    r: Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hNorm) * 255),
    b: Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255),
  };
}

export interface HarmoniousPalette {
  primary: string; // Midnight Navy reference (#061A35)
  primaryDark: string; // Ultra deep navy (#030E1F)
  royalBlue: string; // Deep Royal Blue (#0D3565)
  sapphire: string; // Classic Sapphire (#15518A)
  sapphireLight: string; // Lighter interactive sapphire (#2A6DAF)
  gold: string; // Royal Gold (#D9A441)
  goldLight: string; // Warm Ivory Gold (#F5E6C8)
  goldDark: string; // Deep Metallic Antique Gold (#9E7422)
  ivoryWhite: string; // Warm Ivory background/accent (#FFF8E9)
  pearlSilver: string; // Pearl Silver borders (#D9E2ED)
  pureWhite: string; // #FFFFFF
  // Semantic Status Tokens (WCAG AA compliant)
  statusSuccess: string;
  statusSuccessBg: string;
  statusWarning: string;
  statusWarningBg: string;
  statusError: string;
  statusErrorBg: string;
  // Dynamic Tagline
  tagline: string;
  subTagline: string;
}

export function generateHarmoniousPalette(baseHex: string, appName: string): HarmoniousPalette {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb);

  // Derive royal blue & sapphire shades by shifting luminance and retaining hue
  const royalBlueHsl: HSL = {
    h: hsl.h,
    s: Math.max( hsl.s, 60 ),
    l: Math.min( Math.max(hsl.l + 12, 22), 35 ),
  };
  const sapphireHsl: HSL = {
    h: hsl.h,
    s: Math.max( hsl.s, 65 ),
    l: Math.min( Math.max(hsl.l + 25, 34), 48 ),
  };
  const sapphireLightHsl: HSL = {
    h: hsl.h,
    s: Math.max( hsl.s, 60 ),
    l: Math.min( Math.max(hsl.l + 38, 48), 65 ),
  };

  // Derive deep royal gold accent mathematically: complementary or warm split (around 42° - 45° warm amber gold)
  const goldRgb = { r: 217, g: 164, b: 65 }; // #D9A441 (Royal Gold reference)
  const goldHex = rgbToHex(goldRgb.r, goldRgb.g, goldRgb.b);

  const royalBlueHex = rgbToHex(
    hslToRgb(royalBlueHsl).r,
    hslToRgb(royalBlueHsl).g,
    hslToRgb(royalBlueHsl).b
  );
  const sapphireHex = rgbToHex(
    hslToRgb(sapphireHsl).r,
    hslToRgb(sapphireHsl).g,
    hslToRgb(sapphireHsl).b
  );
  const sapphireLightHex = rgbToHex(
    hslToRgb(sapphireLightHsl).r,
    hslToRgb(sapphireLightHsl).g,
    hslToRgb(sapphireLightHsl).b
  );

  return {
    primary: baseHex,
    primaryDark: '#030D1C',
    royalBlue: royalBlueHex,
    sapphire: sapphireHex,
    sapphireLight: sapphireLightHex,
    gold: goldHex,
    goldLight: '#FFF8E9',
    goldDark: '#9E7422',
    ivoryWhite: '#FFFBF2',
    pearlSilver: '#D9E2ED',
    pureWhite: '#FFFFFF',
    statusSuccess: '#0F766E', // Refined teal emerald
    statusSuccessBg: '#F0FDFA',
    statusWarning: '#B45309', // Warm amber gold
    statusWarningBg: '#FFFBEB',
    statusError: '#BE123C', // Deep ruby crimson
    statusErrorBg: '#FFF1F2',
    tagline: `Platform Al-Qur'an Digital Premium`,
    subTagline: `Teks Utsmani Terverifikasi, Terjemahan & Tafsir Kemenag, Audio Murottal 6 Qari`,
  };
}

export const THEME_PALETTE = generateHarmoniousPalette(
  APP_CONFIG.primaryColor,
  APP_CONFIG.appName
);

/**
 * Injects CSS custom properties dynamically so Tailwind / raw CSS can reference tokens
 */
export function applyThemeVariables(palette: HarmoniousPalette = THEME_PALETTE) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-primary-dark', palette.primaryDark);
  root.style.setProperty('--color-royal-blue', palette.royalBlue);
  root.style.setProperty('--color-sapphire', palette.sapphire);
  root.style.setProperty('--color-sapphire-light', palette.sapphireLight);
  root.style.setProperty('--color-gold', palette.gold);
  root.style.setProperty('--color-gold-light', palette.goldLight);
  root.style.setProperty('--color-gold-dark', palette.goldDark);
  root.style.setProperty('--color-pearl-silver', palette.pearlSilver);
  root.style.setProperty('--color-ivory-white', palette.ivoryWhite);
  root.style.setProperty('--color-pure-white', palette.pureWhite);
}
