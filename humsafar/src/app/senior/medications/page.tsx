"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import MedicationCard from '@/components/senior/MedicationCard';
import { LanguageCode, Pill } from '@/types';

const INITIAL_PILLS: Pill[] = [
  { id: '1', name: 'Blood Pressure (Amlodipine)', color: '#DE350B', time: '08:00 AM', taken: false },
  { id: '2', name: 'Diabetes (Metformin)', color: '#00875A', time: '02:00 PM', taken: false },
  { id: '3', name: 'Vitamins', color: '#FACC15', time: '08:00 PM', taken: true, takenAt: new Date().toISOString() },
];

export default function MedicationsPage() {
  const [lang, setLang] = useState<LanguageCode>('hi-IN');
  const [audio, setAudio] = useState(true);
  const [pills, setPills] = useState(INITIAL_PILLS);

  const handleTake = (id: string) => {
    setPills(pills.map(p => p.id === id ? { ...p, taken: true, takenAt: new Date().toISOString() } : p));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ElderHeader 
        title="MEDICINES (दवाइयां)" 
        langCode={lang} 
        onLanguageChange={setLang}
        audioEnabled={audio}
        onToggleAudio={() => setAudio(!audio)}
      />
      
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <Link href="/senior" className="inline-flex items-center gap-4 bg-white p-4 rounded-2xl border-4 border-senior-blue text-elder-xl font-bold shadow">
            <ArrowLeft size={36} /> BACK
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {pills.map(pill => (
            <MedicationCard 
              key={pill.id} 
              pill={pill} 
              langCode={lang} 
              onTake={handleTake}
              audioEnabled={audio}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
