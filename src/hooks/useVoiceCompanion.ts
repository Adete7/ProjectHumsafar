"use client";

import { useState, useCallback, useRef } from 'react';
import { startListening, speakText, speakPhrase, LANG_BCP47_MAP } from '@/lib/speech';
import { LanguageCode } from '@/types';

export function useVoiceCompanion(langCodeInput: string = 'hi-IN') {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const langCode: LanguageCode = LANG_BCP47_MAP[langCodeInput] || 'hi-IN';

  const listen = useCallback(
    (onCommandFound: (command: string) => void) => {
      setIsListening(true);
      setError(null);

      // Audible cue informing the senior that mic is hot
      speakPhrase('MIC_LISTENING', langCode);

      // Stop any existing session
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      recognitionRef.current = startListening(
        langCode,
        (text: string) => {
          setIsListening(false);
          setLastTranscript(text);
          onCommandFound(text);
        },
        (err: any) => {
          setIsListening(false);
          const errMsg =
            err?.error === 'not-allowed'
              ? 'माइक्रोफ़ोन की अनुमति नहीं मिली (Microphone blocked)'
              : err?.error === 'no-speech'
              ? 'आवाज़ सुनाई नहीं दी, कृपया दोबारा बोलें (No speech heard)'
              : 'पहचान में त्रुटि हुई, पुनः प्रयास करें (Speech error)';
          setError(errMsg);
        },
        () => {
          setIsListening(true);
        },
        () => {
          setIsListening(false);
        }
      );
    },
    [langCode]
  );

  const speak = useCallback(
    (textOrKey: string, customText?: string) => {
      setIsSpeaking(true);
      if (customText) {
        speakText(customText, langCode);
      } else {
        speakPhrase(textOrKey, langCode);
      }
      setTimeout(() => setIsSpeaking(false), 2500);
    },
    [langCode]
  );

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    lastTranscript,
    error,
    listen,
    speak,
    stop,
    langCode,
  };
}
