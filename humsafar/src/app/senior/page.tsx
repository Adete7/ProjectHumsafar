"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pill, CreditCard, Users, ShieldCheck, Sun, CheckCircle } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import EmergencySOS from '@/components/common/EmergencySOS';
import ElderDecorativeBackground from '@/components/common/ElderDecorativeBackground';
import { LanguageCode } from '@/types';
import { speakPhrase } from '@/lib/speech';
import { getStoredProfile, getStoredMedications, StoredProfile } from '@/lib/storageEvents';

export default function SeniorDashboard() {
  const [lang, setLang] = useState<LanguageCode>('hi-IN');
  const [audio, setAudio] = useState(true);
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [pendingMeds, setPendingMeds] = useState(0);

  useEffect(() => {
    setProfile(getStoredProfile('senior'));
    const meds = getStoredMedications();
    setPendingMeds(meds.filter(m => !m.taken).length);

    if (audio) {
      speakPhrase('नमस्ते दादाजी! आपका हमसफ़र तैयार है।', lang, 'नमस्ते दादाजी! आपका हमसफ़र तैयार है।');
    }
  }, []);

  const modules = [
    {
      href: '/senior/medications',
      icon: Pill,
      title: 'MEDICINES',
      sub: 'दवाइयां लें',
      desc: `${pendingMeds} दवा बाकी है`,
      accentBg: 'from-amber-400/90 via-yellow-400/90 to-amber-500/90',
      iconColor: 'text-amber-950',
      borderColor: 'border-amber-500',
    },
    {
      href: '/senior/bills',
      icon: CreditCard,
      title: 'PAY BILLS',
      sub: 'सुरक्षित बिल भुगतान',
      desc: '₹3,000 सुरक्षा कैप सक्रिय',
      accentBg: 'from-orange-400/90 via-amber-400/90 to-orange-500/90',
      iconColor: 'text-orange-950',
      borderColor: 'border-orange-500',
    },
    {
      href: '/senior/family',
      icon: Users,
      title: 'CALL FAMILY',
      sub: 'परिवार से बात करें',
      desc: '1-टच स्पीड डायलर',
      accentBg: 'from-emerald-400/90 via-teal-400/90 to-emerald-500/90',
      iconColor: 'text-emerald-950',
      borderColor: 'border-emerald-500',
    },
    {
      href: '/senior/scam-shield',
      icon: ShieldCheck,
      title: 'CHECK SCAM',
      sub: 'संदेश व ठगी जांच',
      desc: 'AI सुरक्षा कवच',
      accentBg: 'from-rose-500/90 via-red-500/90 to-rose-600/90',
      iconColor: 'text-white',
      borderColor: 'border-red-600',
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* Floating Decorative SVG Emblems */}
      <ElderDecorativeBackground />

      <ElderHeader 
        title="HUMSAFAR (हमसफ़र)" 
        langCode={lang} 
        onLanguageChange={setLang}
        audioEnabled={audio}
        onToggleAudio={() => setAudio(!audio)}
        showHomeLink={false}
      />
      
      {/* Welcome Banner */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6">
        <div className="glass-surface-warm p-5 sm:p-6 rounded-3xl border-3 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3 rounded-2xl bg-amber-400/50 text-orange-900 flex-shrink-0">
              <Sun size={40} className="animate-spin" style={{ animationDuration: '24s' }} />
            </div>
            <div>
              <h2 className="text-elder-xl sm:text-elder-2xl font-black text-slate-900">
                नमस्ते दादाजी! (Welcome)
              </h2>
              <p className="text-elder-base text-slate-700 font-extrabold">
                आज सब कुछ सुरक्षित है • AI कवच और पारिवारिक संपर्क तैयार हैं
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 border-2 border-emerald-400 text-emerald-800 font-black text-sm sm:text-base">
            <CheckCircle size={22} className="text-emerald-600" />
            <span>सुरक्षा स्तर: उत्तम (Safe)</span>
          </div>
        </div>
      </div>

      {/* 4 Primary Big Touch Modules */}
      <main className="relative z-10 flex-1 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full mt-2 mb-20">
        {modules.map((mod) => (
          <Link 
            key={mod.href}
            href={mod.href}
            className={`group relative p-8 sm:p-10 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-2xl active:scale-[0.98] hover:scale-[1.02] transition-all min-h-[260px] bg-gradient-to-br ${mod.accentBg} border-4 ${mod.borderColor} backdrop-blur-md`}
            onClick={() => {
              if (audio) speakPhrase(mod.sub, lang, mod.sub);
            }}
          >
            <div className={`p-4 rounded-3xl bg-white/40 backdrop-blur-md shadow-lg border-2 border-white/60 group-hover:scale-110 transition-transform ${mod.iconColor}`}>
              <mod.icon size={76} />
            </div>

            <div className="text-center">
              <h2 className="text-elder-2xl sm:text-elder-3xl font-black text-slate-950 tracking-tight">
                {mod.title}
              </h2>
              <p className="text-elder-xl sm:text-elder-2xl font-black text-slate-900 drop-shadow-sm mt-1">
                {mod.sub}
              </p>
              <span className="inline-block mt-2 px-4 py-1 rounded-full bg-slate-950/20 text-slate-950 text-sm font-extrabold">
                {mod.desc}
              </span>
            </div>
          </Link>
        ))}
      </main>

      {/* Emergency Floating SOS Button with Live Caregiver Alert */}
      <EmergencySOS langCode={lang} />
    </div>
  );
}
