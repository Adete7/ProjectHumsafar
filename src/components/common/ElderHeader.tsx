"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LanguageCode } from '@/types';
import { Volume2, VolumeX, Home, User, Languages } from 'lucide-react';
import { getStoredProfile, StoredProfile } from '@/lib/storageEvents';
import { useLanguage, LANGUAGE_OPTIONS, ShortLangCode } from '@/context/LanguageContext';

interface ElderHeaderProps {
  title: string;
  titleKey?: string;
  langCode?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  audioEnabled?: boolean;
  onToggleAudio?: () => void;
  showHomeLink?: boolean;
}

export default function ElderHeader({ 
  title, 
  titleKey,
  langCode: propLangCode, 
  onLanguageChange,
  audioEnabled = true,
  onToggleAudio,
  showHomeLink = true,
}: ElderHeaderProps) {
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const { language, langCode: contextLangCode, setLanguage, t } = useLanguage();

  const activeLangCode = propLangCode || contextLangCode;
  const shortCode = language;

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

  const handleDropdownChange = (newShort: ShortLangCode) => {
    setLanguage(newShort);
    const matchedOption = LANGUAGE_OPTIONS.find((opt) => opt.code === newShort);
    if (matchedOption && onLanguageChange) {
      onLanguageChange(matchedOption.bcp47);
    }
  };

  const displayTitle = titleKey ? t(titleKey, title) : title;

  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between p-3 sm:p-5 glass-surface-warm shadow-lg border-b-4 border-amber-400">
      <div className="flex items-center gap-3 sm:gap-4">
        {showHomeLink && (
          <Link
            href="/senior"
            className="p-3 sm:p-4 rounded-2xl bg-white/90 text-slate-900 border-2 border-slate-300 shadow hover:bg-amber-100 active:scale-95 transition-all flex items-center justify-center min-w-[56px] min-h-[56px]"
            title={t('BACK')}
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
            {displayTitle}
          </h1>
          <span className="text-xs sm:text-sm font-extrabold text-orange-800 hidden sm:inline-block">
            {t('APP_SUBTITLE')}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
        {/* Audio Toggle */}
        {onToggleAudio && (
          <button 
            onClick={onToggleAudio}
            className={`p-3 sm:p-4 rounded-2xl font-black flex items-center justify-center min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] border-3 shadow-md transition-all ${
              audioEnabled 
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-amber-300/50' 
                : 'bg-white/80 text-slate-500 border-slate-300'
            }`}
            aria-label={audioEnabled ? t('VOICE_ON') : t('VOICE_OFF')}
            title={audioEnabled ? t('VOICE_ON') : t('VOICE_OFF')}
          >
            {audioEnabled ? <Volume2 size={32} className="text-slate-950" /> : <VolumeX size={32} />}
          </button>
        )}

        {/* Language Select Dropdown */}
        <div className="relative flex items-center">
          <Languages className="absolute left-3.5 w-5 h-5 text-amber-700 pointer-events-none hidden sm:inline-block" />
          <select 
            value={shortCode}
            onChange={(e) => handleDropdownChange(e.target.value as ShortLangCode)}
            className="p-3 sm:py-4 sm:pl-10 sm:pr-4 bg-white text-slate-950 rounded-2xl font-black text-elder-base sm:text-elder-lg min-w-[140px] min-h-[56px] sm:min-h-[64px] border-3 border-amber-400 focus:border-orange-500 shadow-md outline-none cursor-pointer"
            aria-label="Select Language (भाषा चुनें)"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.nativeName} ({opt.label})
              </option>
            ))}
          </select>
        </div>

        {/* Exit to Role Select */}
        <Link
          href="/"
          className="px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs sm:text-sm hover:bg-orange-600 transition-colors shadow border border-slate-800"
          title={t('SWITCH_ROLE')}
        >
          {t('SWITCH_ROLE')}
        </Link>
      </div>
    </header>
  );
}
