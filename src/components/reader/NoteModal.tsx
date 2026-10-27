/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Edit3, Save, Trash2, X } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface NoteModalProps {
  surahNumber: number;
  surahNameLatin: string;
  ayatNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  surahNumber,
  surahNameLatin,
  ayatNumber,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existing = StorageService.getNote(surahNumber, ayatNumber);
      setNoteText(existing ? existing.noteText : '');
    }
  }, [isOpen, surahNumber, ayatNumber]);

  if (!isOpen) return null;

  const handleSave = () => {
    StorageService.saveNote(surahNumber, surahNameLatin, ayatNumber, noteText);
    onSaved();
    onClose();
  };

  const handleDelete = () => {
    StorageService.deleteNote(`${surahNumber}-${ayatNumber}`);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-[#061A35] text-white flex items-center justify-between border-b border-[#0D3565]">
          <div className="flex items-center gap-2.5">
            <Edit3 className="w-5 h-5 text-[#D9A441]" />
            <div>
              <h3 className="text-base font-bold text-white">
                Catatan Tadabbur Ayat
              </h3>
              <p className="text-xs text-slate-300">
                QS. {surahNameLatin} : Ayat {ayatNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Tuliskan faedah, renungan, atau pengingat pribadi dari ayat ini. Catatan disimpan secara privat di perangkat Anda.
          </p>

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={5}
            placeholder="Tulis refleksi atau tadabbur ayat di sini..."
            className="w-full p-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#15518A] text-slate-800 placeholder-slate-400 resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            {noteText.trim() ? (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Catatan</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#061A35] text-[#D9A441] text-xs font-bold hover:bg-[#0D3565] transition shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Catatan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
