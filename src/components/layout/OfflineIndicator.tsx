/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-18 right-4 z-50 flex items-center gap-2 rounded-xl bg-[#061A35] border border-[#D9A441]/50 px-3.5 py-2 text-xs font-medium text-slate-100 shadow-xl animate-fade-in">
      <WifiOff className="w-4 h-4 text-[#D9A441] animate-pulse" />
      <span>Mode Offline — Menampilkan data tersimpan di cache</span>
    </div>
  );
};
