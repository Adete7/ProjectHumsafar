"use client";

import { useState, useEffect } from 'react';
import { AlertOctagon, X } from 'lucide-react';
import { speakPhrase } from '@/lib/speech';
import { LanguageCode } from '@/types';

export default function EmergencySOS({ langCode }: { langCode: LanguageCode }) {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && countdown > 0) {
      speakPhrase(countdown.toString(), langCode);
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (isActive && countdown === 0) {
      speakPhrase('SOS_TRIGGERED', langCode);
      // Trigger actual SOS webhook here
      fetch('/api/sos/trigger', { method: 'POST' }).catch(console.error);
      setIsActive(false);
      setCountdown(3);
      alert("Emergency Alert Sent!");
    }
    return () => clearTimeout(timer);
  }, [isActive, countdown, langCode]);

  const handleCancel = () => {
    setIsActive(false);
    setCountdown(3);
    speakPhrase('Cancelled', langCode, 'Cancelled');
  };

  if (isActive) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-elder-3xl font-black text-senior-red mb-8 animate-pulse">
          SOS Sending in {countdown}
        </h2>
        <button 
          onClick={handleCancel}
          className="flex items-center justify-center gap-4 bg-white text-senior-black p-8 rounded-3xl min-w-[300px] min-h-[120px] text-elder-xl font-bold border-8 border-transparent focus:border-senior-yellow"
        >
          <X size={48} />
          CANCEL
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsActive(true)}
      className="fixed bottom-6 right-6 bg-senior-red text-white p-6 rounded-full shadow-2xl flex items-center justify-center min-w-[80px] min-h-[80px] hover:bg-red-700 active:scale-95 transition-all border-4 border-white focus:outline-none focus:ring-8 focus:ring-senior-yellow z-40"
      aria-label="Emergency SOS"
    >
      <AlertOctagon size={48} />
    </button>
  );
}
