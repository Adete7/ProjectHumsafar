"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import EmergencySOS from '@/components/common/EmergencySOS';
import ElderDecorativeBackground from '@/components/common/ElderDecorativeBackground';
import FamilyDialerGrid from '@/components/senior/FamilyDialerGrid';
import { getStoredFamilyMembers, StoredFamilyMember } from '@/lib/storageEvents';
import { useLanguage } from '@/context/LanguageContext';

export default function FamilyPage() {
  const { langCode, t } = useLanguage();
  const [audio, setAudio] = useState(true);
  const [members, setMembers] = useState<StoredFamilyMember[]>([]);

  useEffect(() => {
    setMembers(getStoredFamilyMembers());
    const listener = (e: any) => {
      if (e.detail) setMembers(e.detail);
    };
    window.addEventListener('humsafar_family_change', listener);
    return () => window.removeEventListener('humsafar_family_change', listener);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <ElderDecorativeBackground />

      <ElderHeader 
        title={t('CALL_FAMILY')} 
        titleKey="CALL_FAMILY"
        langCode={langCode} 
        audioEnabled={audio}
        onToggleAudio={() => setAudio(!audio)}
      />
      
      <main className="relative z-10 flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full mb-20">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/senior" 
            className="inline-flex items-center gap-3 glass-surface p-4 rounded-2xl border-3 border-amber-400 text-elder-xl font-black text-slate-900 shadow hover:bg-amber-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={34} className="text-orange-600" />
            <span>{t('BACK')}</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl glass-surface-warm border border-amber-300 text-amber-900 font-extrabold text-elder-base">
            <Users size={22} className="text-orange-600" />
            <span>{t('CALL_FAMILY_SUB')}</span>
          </div>
        </div>

        <FamilyDialerGrid 
          members={members} 
          onMembersChange={setMembers} 
          langCode={langCode} 
        />
      </main>

      <EmergencySOS langCode={langCode} />
    </div>
  );
}
