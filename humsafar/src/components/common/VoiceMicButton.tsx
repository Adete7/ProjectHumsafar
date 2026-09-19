"use client";

import { Mic, Loader2 } from 'lucide-react';
import { useVoiceCompanion } from '@/hooks/useVoiceCompanion';
import { LanguageCode } from '@/types';

interface VoiceMicButtonProps {
  langCode: LanguageCode;
  onCommand: (command: string) => void;
}

export default function VoiceMicButton({ langCode, onCommand }: VoiceMicButtonProps) {
  const { isListening, listen, error } = useVoiceCompanion(langCode);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => listen(onCommand)}
        disabled={isListening}
        className={`flex items-center justify-center p-8 rounded-full min-w-[96px] min-h-[96px] shadow-xl transition-all border-4 focus:outline-none focus:ring-8 focus:ring-senior-blue ${
          isListening 
            ? 'bg-senior-yellow text-senior-black border-senior-blue animate-pulse scale-110' 
            : 'bg-senior-blue text-white border-transparent hover:bg-blue-900 active:scale-95'
        }`}
        aria-label="Voice Command"
      >
        {isListening ? <Loader2 size={48} className="animate-spin" /> : <Mic size={48} />}
      </button>
      {error && <p className="text-senior-red font-bold text-elder-lg mt-2">{error}</p>}
    </div>
  );
}
