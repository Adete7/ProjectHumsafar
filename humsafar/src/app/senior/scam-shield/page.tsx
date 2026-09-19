"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import ScamCheckerBox from '@/components/senior/ScamCheckerBox';
import { LanguageCode } from '@/types';

export default function ScamShieldPage() {
  const [lang, setLang] = useState<LanguageCode>('hi-IN');
  const [audio, setAudio] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ElderHeader 
        title="CHECK SCAM (धोखाधड़ी जांच)" 
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

        <ScamCheckerBox langCode={lang} />
      </main>
    </div>
  );
}
