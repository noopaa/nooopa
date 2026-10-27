/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { THEME_PALETTE } from '../../config/appConfig';

interface AppEmblemProps {
  size?: number;
  className?: string;
  showImageIfAvailable?: boolean;
}

export const AppEmblem: React.FC<AppEmblemProps> = ({
  size = 40,
  className = '',
  showImageIfAvailable = true,
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Use the verified attached high-res Islamic luxury emblem asset
  if (showImageIfAvailable && !imageError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-full shadow-md overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/icons/icon-512.png"
          alt="nopsQur'an Emblem"
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Scalable luxury SVG Islamic emblem matching dynamic primaryColor
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 rounded-full drop-shadow-md ${className}`}
    >
      <defs>
        <radialGradient id="navyShimmer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={THEME_PALETTE.royalBlue} />
          <stop offset="100%" stopColor={THEME_PALETTE.primary} />
        </radialGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E6C8" />
          <stop offset="50%" stopColor="#D9A441" />
          <stop offset="100%" stopColor="#9E7422" />
        </linearGradient>
      </defs>

      {/* Circular Navy Base */}
      <circle cx="60" cy="60" r="58" fill="url(#navyShimmer)" stroke="url(#goldGradient)" strokeWidth="3" />
      {/* Inner Decorative Golden Star Ring */}
      <circle cx="60" cy="60" r="50" stroke="#D9A441" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      {/* Islamic Arch / Mihrab Motif */}
      <path
        d="M60 22 C78 34 88 50 88 72 C88 88 75 98 60 98 C45 98 32 88 32 72 C32 50 42 34 60 22 Z"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />
      {/* Authentic Stylized Arabic Calligraphy for "القرآن" */}
      <text
        x="60"
        y="70"
        textAnchor="middle"
        fill="url(#goldGradient)"
        fontFamily="'Amiri', 'Noto Naskh Arabic', serif"
        fontSize="34"
        fontWeight="bold"
        className="select-none"
      >
        القرآن
      </text>
    </svg>
  );
};
