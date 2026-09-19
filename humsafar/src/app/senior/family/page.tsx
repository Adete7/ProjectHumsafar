"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import FamilyDialerGrid from '@/components/senior/FamilyDialerGrid';
import { LanguageCode, FamilyMember } from '@/types';

const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'f1', name: 'Ramesh (Son)', relation: 'Son', photoUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Ramesh', status: 'Available', phone: '123' },
  { id: 'f2', name: 'Priya (Daughter)', relation: 'Daughter', photoUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Priya', status: 'Busy', phone: '124' },
  { id: 'f3', name: 'Rahul (Grandson)', relation: 'Grandson', photoUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rahul', status: 'Available', phone: '125' },
];

export default function FamilyPage() {
  const [lang, setLang] = useState<LanguageCode>('hi-IN');
  const [audio, setAudio] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ElderHeader 
        title="CALL FAMILY (परिवार)" 
        langCode={lang} 
        onLanguageChange={setLang}
        audioEnabled={audio}
        onToggleAudio={() => setAudio(!audio)}
      />
      
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <Link href="/senior" className="inline-flex items-center gap-4 bg-white p-4 rounded-2xl border-4 border-senior-blue text-elder-xl font-bold shadow">
            <ArrowLeft size={36} /> BACK
          </Link>
        </div>

        <FamilyDialerGrid members={FAMILY_MEMBERS} />
      </main>
    </div>
  );
}
