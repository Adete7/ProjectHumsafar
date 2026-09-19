"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import EmergencySOS from '@/components/common/EmergencySOS';
import ElderDecorativeBackground from '@/components/common/ElderDecorativeBackground';
import ScamCheckerBox from '@/components/senior/ScamCheckerBox';
import { LanguageCode } from '@/types';

export default function ScamShieldPage() {
  const [lang, setLang] = useState<LanguageCode>('hi-IN');
  const [audio, setAudio] = useState(true);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <ElderDecorativeBackground />

      <ElderHeader 
        title="CHECK SCAM (धोखाधड़ी जांच)" 
        langCode={lang} 
        onLanguageChange={setLang}
        audioEnabled={audio}
        onToggleAudio={() => setAudio(!audio)}
      />
      
      <main className="relative z-10 flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full mb-24">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/senior" 
            className="inline-flex items-center gap-3 glass-surface p-4 rounded-2xl border-3 border-amber-400 text-elder-xl font-black text-slate-900 shadow hover:bg-amber-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={34} className="text-orange-600" />
            <span>वापस (BACK)</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl glass-surface-warm border border-rose-300 text-red-900 font-extrabold text-elder-base">
            <ShieldCheck size={24} className="text-red-600" />
            <span>24/7 AI सुरक्षा सक्रिय</span>
          </div>
        </div>

        <ScamCheckerBox langCode={lang} />
      </main>

      <EmergencySOS langCode={lang} />
    </div>
  );
}
