"use client";

import { LanguageCode } from '@/types';
import { Volume2, VolumeX, Settings } from 'lucide-react';

interface ElderHeaderProps {
  title: string;
  langCode: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export default function ElderHeader({ 
  title, 
  langCode, 
  onLanguageChange,
  audioEnabled,
  onToggleAudio
}: ElderHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-senior-blue text-white shadow-lg border-b-8 border-senior-yellow">
      <h1 className="text-elder-2xl font-black truncate">{title}</h1>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleAudio}
          className="p-4 bg-white text-senior-blue rounded-xl font-bold flex items-center justify-center min-w-[64px] min-h-[64px] border-4 border-transparent focus:border-senior-yellow active:bg-gray-200 transition-colors"
          aria-label={audioEnabled ? "Turn off audio" : "Turn on audio"}
        >
          {audioEnabled ? <Volume2 size={36} /> : <VolumeX size={36} />}
        </button>

        <select 
          value={langCode}
          onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
          className="p-4 bg-white text-senior-blue rounded-xl font-bold text-elder-lg min-w-[64px] min-h-[64px] border-4 border-transparent focus:border-senior-yellow outline-none"
          aria-label="Select Language"
        >
          <option value="hi-IN">हिंदी</option>
          <option value="en-IN">English</option>
          <option value="ta-IN">தமிழ்</option>
          <option value="te-IN">తెలుగు</option>
          <option value="bn-IN">বাংলা</option>
          <option value="mr-IN">मराठी</option>
          <option value="gu-IN">ગુજરાતી</option>
        </select>
      </div>
    </header>
  );
}
