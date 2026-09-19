"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Pill, CreditCard, Users, ShieldCheck } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import { LanguageCode } from '@/types';

export default function SeniorDashboard() {
  const [lang, setLang] = useState<LanguageCode>('hi-IN');
  const [audio, setAudio] = useState(true);

  const modules = [
    { href: '/senior/medications', icon: Pill, color: 'bg-senior-yellow text-senior-black', title: 'MEDICINES', sub: 'दवाइयां' },
    { href: '/senior/bills', icon: CreditCard, color: 'bg-white text-senior-blue border-8 border-senior-blue', title: 'PAY BILLS', sub: 'बिल भुगतान' },
    { href: '/senior/family', icon: Users, color: 'bg-senior-green text-white', title: 'CALL FAMILY', sub: 'परिवार से बात' },
    { href: '/senior/scam-shield', icon: ShieldCheck, color: 'bg-senior-blue text-white', title: 'CHECK SCAM', sub: 'धोखाधड़ी जांच' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <ElderHeader 
        title="HUMSAFAR" 
        langCode={lang} 
        onLanguageChange={setLang}
        audioEnabled={audio}
        onToggleAudio={() => setAudio(!audio)}
      />
      
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full mt-4">
        {modules.map(mod => (
          <Link 
            key={mod.href}
            href={mod.href}
            className={`p-8 rounded-3xl flex flex-col items-center justify-center gap-6 shadow-2xl active:scale-95 transition-transform min-h-[250px] ${mod.color}`}
          >
            <mod.icon size={80} />
            <div className="text-center">
              <h2 className="text-elder-3xl font-black">{mod.title}</h2>
              <p className="text-elder-2xl font-bold opacity-90">{mod.sub}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
