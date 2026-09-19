"use client";

import { useRef } from 'react';
import { Pill as PillIcon, CheckCircle2, Clock, Droplets, HeartPulse, Sparkles, Camera, Check } from 'lucide-react';
import { StoredMedication } from '@/lib/storageEvents';
import { speakPhrase } from '@/lib/speech';
import { LanguageCode } from '@/types';
import { compressImage } from '@/lib/imageUtils';

interface MedicationCardProps {
  medication: StoredMedication;
  langCode: LanguageCode;
  onToggleTake: (id: string) => void;
  onUpdatePhoto?: (id: string, photoUrl: string) => void;
  audioEnabled: boolean;
}

// Realistic pill / capsule / drop SVG visualizer
function PillVisualizer({ med }: { med: StoredMedication }) {
  if (med.photoUrl) {
    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-md flex-shrink-0 bg-white">
        <img src={med.photoUrl} alt={med.name} className="w-full h-full object-cover" />
      </div>
    );
  }

  const isEyeDrops = med.name.toLowerCase().includes('drop') || med.dosage.toLowerCase().includes('drop');
  const isCapsule = med.dosage.toLowerCase().includes('capsule') || med.hindiName?.includes('कैप्सूल');

  return (
    <div
      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border-3 border-white/80"
      style={{ backgroundColor: med.color || '#F97316' }}
    >
      {isEyeDrops ? (
        <Droplets size={52} className="text-white drop-shadow-md animate-bounce" />
      ) : isCapsule ? (
        <div className="flex items-center rotate-45 scale-125">
          <div className="w-7 h-12 bg-white rounded-t-full border-2 border-slate-900 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          </div>
          <div className="w-7 h-12 bg-amber-400 rounded-b-full border-2 border-slate-900 border-t-0"></div>
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full bg-white/90 border-4 border-slate-900 flex items-center justify-center shadow-inner">
          <div className="w-12 h-1 bg-slate-800 rotate-45 rounded-full"></div>
        </div>
      )}
    </div>
  );
}

export default function MedicationCard({
  medication,
  langCode,
  onToggleTake,
  onUpdatePhoto,
  audioEnabled,
}: MedicationCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTake = () => {
    if (audioEnabled) {
      const phrase = medication.taken
        ? 'दवा अनचेक की गई'
        : `${medication.name} ले ली गई है। शाबाश दादाजी!`;
      speakPhrase(phrase, langCode, phrase);
    }
    onToggleTake(medication.id);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdatePhoto) {
      try {
        const compressedBase64 = await compressImage(file, 400, 0.7);
        onUpdatePhoto(medication.id, compressedBase64);
      } catch (err) {
        console.error("Failed to compress medication photo:", err);
      }
    }
  };

  const slotBadgeColor = {
    Morning: 'bg-amber-100 text-amber-900 border-amber-300',
    Afternoon: 'bg-orange-100 text-orange-900 border-orange-300',
    Evening: 'bg-rose-100 text-rose-900 border-rose-300',
    Night: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  }[medication.timeSlot] || 'bg-slate-100 text-slate-800 border-slate-300';

  return (
    <div
      className={`glass-surface-card rounded-3xl p-6 sm:p-8 flex flex-col gap-5 w-full transition-all border-4 ${
        medication.taken
          ? 'border-emerald-500/80 bg-emerald-50/50 opacity-90'
          : 'border-amber-400/90 shadow-2xl hover:border-orange-500'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Visual Pill & Details */}
        <div className="flex items-center gap-5 sm:gap-6 flex-1">
          <PillVisualizer med={medication} />

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full font-black text-xs sm:text-sm border-2 ${slotBadgeColor}`}>
                {medication.timeSlot} • {medication.time}
              </span>

              {medication.taken && (
                <span className="px-3 py-1 rounded-full font-extrabold text-xs sm:text-sm bg-emerald-600 text-white border border-emerald-700 flex items-center gap-1">
                  <Check size={14} /> {medication.takenAt || 'Taken'}
                </span>
              )}
            </div>

            <h2 className="text-elder-xl sm:text-elder-2xl font-black text-slate-950">
              {medication.name}
            </h2>

            {medication.hindiName && (
              <p className="text-elder-base font-extrabold text-orange-800">
                {medication.hindiName}
              </p>
            )}

            <p className="text-elder-base font-bold text-slate-700">
              खुराक (Dosage): <span className="text-slate-950 font-black">{medication.dosage}</span>
            </p>

            <p className="text-sm sm:text-base font-extrabold text-slate-600 italic bg-white/60 p-2 rounded-xl border border-slate-200 mt-1">
              ℹ️ {medication.instructions}
            </p>
          </div>
        </div>

        {/* Upload Packaging Photo button */}
        {onUpdatePhoto && (
          <div className="sm:self-start">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-white/90 text-slate-800 border-2 border-slate-300 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 shadow"
              title="Upload photo of pill packaging"
            >
              <Camera size={18} />
              <span>पैकेट का फोटो (Packaging Photo)</span>
            </button>
          </div>
        )}
      </div>

      {/* Big Action Button */}
      <button
        onClick={handleTake}
        className={`w-full py-5 sm:py-6 px-6 rounded-2xl text-elder-xl sm:text-elder-2xl font-black min-h-[84px] shadow-xl active:scale-[0.98] transition-all border-4 flex items-center justify-center gap-4 ${
          !medication.taken
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 border-slate-950 hover:brightness-105'
            : 'bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-700'
        }`}
      >
        <CheckCircle2 size={40} className={medication.taken ? 'text-white' : 'text-slate-950'} />
        <span>
          {!medication.taken
            ? 'मैंने दवा ले ली है (I TOOK IT)'
            : 'दवा ली जा चुकी है • टिक हटाएं (TAKEN - TAP TO UNDO)'}
        </span>
      </button>
    </div>
  );
}
