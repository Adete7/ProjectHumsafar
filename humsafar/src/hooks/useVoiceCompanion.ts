import { useState, useCallback } from 'react';
import { startListening, speakPhrase } from '@/lib/speech';
import { LanguageCode } from '@/types';

export function useVoiceCompanion(langCode: LanguageCode = 'hi-IN') {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const listen = useCallback((onCommandFound: (command: string) => void) => {
    setIsListening(true);
    setError(null);
    
    startListening(
      langCode,
      (text) => {
        setIsListening(false);
        setLastTranscript(text);
        onCommandFound(text);
      },
      (err) => {
        setIsListening(false);
        setError('Could not understand. Please try again.');
        console.error(err);
      }
    );
  }, [langCode]);

  const speak = useCallback((textKey: string, customText?: string) => {
    speakPhrase(textKey, langCode, customText);
  }, [langCode]);

  return {
    isListening,
    lastTranscript,
    error,
    listen,
    speak
  };
}
