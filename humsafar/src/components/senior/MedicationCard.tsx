"use client";

import { Pill as PillModel, LanguageCode } from '@/types';
import { Pill as PillIcon, CheckCircle, Clock } from 'lucide-react';
import { speakPhrase } from '@/lib/speech';

interface MedicationCardProps {
  pill: PillModel;
  langCode: LanguageCode;
  onTake: (id: string) => void;
  audioEnabled: boolean;
}

export default function MedicationCard({ pill, langCode, onTake, audioEnabled }: MedicationCardProps) {
  const handleTake = () => {
    if (audioEnabled) {
      speakPhrase('MEDICINE_TAKEN', langCode);
    }
    onTake(pill.id);
  };

  return (
    <div 
      className={`p-6 rounded-3xl border-8 flex flex-col gap-6 w-full ${
        pill.taken 
          ? 'bg-gray-100 border-senior-green opacity-75' 
          : 'bg-white border-senior-yellow shadow-2xl'
      }`}
    >
      <div className="flex items-center gap-6">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: pill.color || '#000' }}
        >
          <PillIcon size={48} />
        </div>
        <div className="flex-col">
          <h2 className="text-elder-2xl font-black">{pill.name}</h2>
          <div className="flex items-center gap-2 text-elder-xl font-bold mt-2 text-gray-700">
            <Clock size={32} />
            <span>{pill.time}</span>
          </div>
        </div>
      </div>

      {!pill.taken ? (
        <button 
          onClick={handleTake}
          className="w-full bg-senior-blue text-white py-6 rounded-2xl text-elder-xl font-black min-h-[80px] hover:bg-blue-900 active:bg-blue-950 transition-colors border-4 border-transparent focus:border-senior-yellow flex items-center justify-center gap-4"
        >
          <CheckCircle size={36} />
          I TOOK IT
        </button>
      ) : (
        <div className="w-full bg-senior-green text-white py-6 rounded-2xl text-elder-xl font-black flex items-center justify-center gap-4">
          <CheckCircle size={36} />
          TAKEN
        </div>
      )}
    </div>
  );
}
