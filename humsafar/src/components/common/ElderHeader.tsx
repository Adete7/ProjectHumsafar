"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LanguageCode } from '@/types';
import { Volume2, VolumeX, Home, User } from 'lucide-react';
import { getStoredProfile, StoredProfile } from '@/lib/storageEvents';

interface ElderHeaderProps {
  title: string;
  langCode: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  showHomeLink?: boolean;
}

export default function ElderHeader({ 
  title, 
  langCode, 
  onLanguageChange,
  audioEnabled,
  onToggleAudio,
  showHomeLink = true,
}: ElderHeaderProps) {
  const [profile, setProfile] = useState<StoredProfile | null>(null);

  useEffect(() => {
    setProfile(getStoredProfile('senior'));
    const listener = (e: any) => {
      if (e.detail?.role === 'senior') {
        setProfile(e.detail.profile);
      }
    };
    window.addEventListener('humsafar_profile_change', listener);
    return () => window.removeEventListener('humsafar_profile_change', listener);
  }, []);

  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between p-3 sm:p-5 glass-surface-warm shadow-lg border-b-4 border-amber-400">
      <div className="flex items-center gap-3 sm:gap-4">
        {showHomeLink && (
          <Link
            href="/senior"
            className="p-3 sm:p-4 rounded-2xl bg-white/90 text-slate-900 border-2 border-slate-300 shadow hover:bg-amber-100 active:scale-95 transition-all flex items-center justify-center min-w-[56px] min-h-[56px]"
            title="Senior Home Dashboard"
          >
            <Home size={28} className="text-orange-600" />
          </Link>
        )}

        {/* Profile Avatar */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-500 shadow-md bg-amber-100 flex items-center justify-center flex-shrink-0">
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="Dada-ji" className="w-full h-full object-cover" />
          ) : (
            <User size={28} className="text-amber-700" />
          )}
        </div>

        <div>
          <h1 className="text-elder-xl sm:text-elder-2xl font-black text-slate-950 tracking-tight leading-tight drop-shadow-sm">
            {title}
          </h1>
          <span className="text-xs sm:text-sm font-extrabold text-orange-800 hidden sm:inline-block">
            हमसफ़र वरिष्ठ सेवा • HUMSAFAR
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
        {/* Audio Toggle */}
        <button 
          onClick={onToggleAudio}
          className={`p-3 sm:p-4 rounded-2xl font-black flex items-center justify-center min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] border-3 shadow-md transition-all ${
            audioEnabled 
              ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-amber-300/50' 
              : 'bg-white/80 text-slate-500 border-slate-300'
          }`}
          aria-label={audioEnabled ? "Turn off audio reading" : "Turn on audio reading"}
          title={audioEnabled ? "आवाज़ चालू है (Voice On)" : "आवाज़ बंद है (Voice Off)"}
        >
          {audioEnabled ? <Volume2 size={32} className="text-slate-950" /> : <VolumeX size={32} />}
        </button>

        {/* Language Select */}
        <div className="relative">
          <select 
            value={langCode}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="p-3 sm:p-4 bg-white/95 text-slate-950 rounded-2xl font-black text-elder-base sm:text-elder-lg min-w-[120px] min-h-[56px] sm:min-h-[64px] border-3 border-amber-400 focus:border-orange-500 shadow-md outline-none cursor-pointer"
            aria-label="Select Language (भाषा चुनें)"
          >
            <option value="hi-IN">हिंदी (Hindi)</option>
            <option value="en-IN">English (Indian)</option>
            <option value="ta-IN">தமிழ் (Tamil)</option>
            <option value="te-IN">తెలుగు (Telugu)</option>
            <option value="bn-IN">বাংলা (Bengali)</option>
            <option value="mr-IN">मराठी (Marathi)</option>
            <option value="gu-IN">ગુજરાતી (Gujarati)</option>
          </select>
        </div>

        {/* Exit to Role Select */}
        <Link
          href="/"
          className="px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs sm:text-sm hover:bg-orange-600 transition-colors shadow border border-slate-800"
          title="Switch Portal Mode"
        >
          बदलें (Switch)
        </Link>
      </div>
    </header>
  );
}
