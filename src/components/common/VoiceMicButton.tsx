"use client";

import { Mic, Loader2 } from 'lucide-react';
import { useVoiceCompanion } from '@/hooks/useVoiceCompanion';
import { LanguageCode } from '@/types';

interface VoiceMicButtonProps {
  langCode: LanguageCode;
  onCommand?: (command: string) => void;
  onSpeechResult?: (result: string) => void;
  compact?: boolean;
}

export default function VoiceMicButton({ 
  langCode, 
  onCommand, 
  onSpeechResult,
  compact = false 
}: VoiceMicButtonProps) {
  const { isListening, listen, error } = useVoiceCompanion(langCode);

  const handleTrigger = () => {
    listen((speechText: string) => {
      if (onSpeechResult) onSpeechResult(speechText);
      if (onCommand) onCommand(speechText);
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleTrigger}
        disabled={isListening}
        className={`flex items-center justify-center rounded-full shadow-xl transition-all border-4 focus:outline-none focus:ring-8 focus:ring-senior-blue ${
          compact ? 'p-4 min-w-[64px] min-h-[64px]' : 'p-8 min-w-[96px] min-h-[96px]'
        } ${
          isListening 
            ? 'bg-senior-yellow text-senior-black border-senior-blue animate-pulse scale-110' 
            : 'bg-senior-blue text-white border-transparent hover:bg-blue-900 active:scale-95'
        }`}
        aria-label="Voice Command"
      >
        {isListening ? (
          <Loader2 size={compact ? 32 : 48} className="animate-spin" />
        ) : (
          <Mic size={compact ? 32 : 48} />
        )}
      </button>
      {error && <p className="text-senior-red font-bold text-elder-lg mt-2 text-center">{error}</p>}
    </div>
  );
}
