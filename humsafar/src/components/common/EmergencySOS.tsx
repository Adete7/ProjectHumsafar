"use client";

import { useState, useEffect, useRef } from 'react';
import { AlertOctagon, X, PhoneCall, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { speakPhrase } from '@/lib/speech';
import { LanguageCode } from '@/types';
import { triggerLiveSOS, cancelLiveSOS } from '@/lib/storageEvents';

// Web Audio synthesizer siren
function playSiren() {
  if (typeof window === 'undefined') return () => {};
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return () => {};
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.0);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    const interval = setInterval(() => {
      try {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.0);
      } catch {}
    }, 1000);

    return () => {
      clearInterval(interval);
      try {
        osc.stop();
        ctx.close();
      } catch {}
    };
  } catch {
    return () => {};
  }
}

export default function EmergencySOS({ langCode }: { langCode: LanguageCode }) {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [sentAlert, setSentAlert] = useState(false);
  const stopSirenRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && countdown > 0) {
      speakPhrase(countdown.toString(), langCode);
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isActive && countdown === 0) {
      // Countdown finished -> Trigger Live SOS!
      speakPhrase('SOS_TRIGGERED', langCode);

      // Start synthesizer siren sound
      stopSirenRef.current = playSiren();

      // Dispatch to storage and event bus
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            triggerLiveSOS({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          () => {
            triggerLiveSOS(); // fallback coordinates
          },
          { timeout: 3000 }
        );
      } else {
        triggerLiveSOS();
      }

      setSentAlert(true);
    }
    return () => clearTimeout(timer);
  }, [isActive, countdown, langCode]);

  const handleCancel = () => {
    if (stopSirenRef.current) {
      stopSirenRef.current();
      stopSirenRef.current = null;
    }
    cancelLiveSOS();
    setIsActive(false);
    setSentAlert(false);
    setCountdown(3);
    speakPhrase('Cancelled', langCode, 'आपातकालीन अलार्म रद्द कर दिया गया है');
  };

  if (isActive) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
        {!sentAlert ? (
          <div className="flex flex-col items-center max-w-xl">
            <div className="w-32 h-32 rounded-full bg-red-600/30 flex items-center justify-center mb-6 animate-ping">
              <ShieldAlert className="text-red-500" size={80} />
            </div>

            <h2 className="text-elder-3xl sm:text-elder-4xl font-black text-red-500 mb-4 tracking-wide">
              EMERGENCY SOS
            </h2>
            <p className="text-elder-xl text-white font-extrabold mb-8">
              भेजा जा रहा है... <span className="text-yellow-400 text-6xl font-black">{countdown}</span>
            </p>

            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-4 bg-white text-slate-950 p-8 rounded-3xl min-w-[320px] min-h-[100px] text-elder-2xl font-black border-8 border-yellow-400 shadow-2xl active:scale-95 transition-transform"
            >
              <X size={44} className="text-red-600" />
              <span>गलती से दबा? रद्द करें (CANCEL)</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-xl bg-red-950/80 p-8 rounded-3xl border-4 border-red-500">
            <div className="w-28 h-28 rounded-full bg-red-600 flex items-center justify-center mb-4 animate-bounce">
              <AlertOctagon className="text-white" size={64} />
            </div>

            <h2 className="text-elder-3xl font-black text-red-400 mb-2">
              🚨 SOS ALARM ACTIVE!
            </h2>
            <p className="text-elder-xl text-white font-bold mb-4">
              केयरगिवर को लाइव लोकेशन और सायरन भेज दिया गया है।
            </p>
            <p className="text-elder-base text-yellow-300 font-extrabold mb-8 bg-black/50 p-4 rounded-xl">
              Live GPS Coordinates Transmitted to Guardian Portal.
            </p>

            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-5 rounded-2xl text-elder-xl font-black border-4 border-slate-900 shadow-2xl active:scale-95 transition-transform"
            >
              <CheckCircle2 size={36} className="text-emerald-600" />
              <span>मैं सुरक्षित हूँ • STOP SOS ALARM</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsActive(true)}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-rose-600 text-white p-5 sm:p-6 rounded-full shadow-[0_10px_35px_rgba(220,38,38,0.6)] flex items-center justify-center min-w-[84px] min-h-[84px] hover:scale-110 active:scale-95 transition-all border-4 border-white focus:outline-none focus:ring-8 focus:ring-amber-300 z-40 group"
      aria-label="Emergency SOS (आपातकालीन सायरन)"
      title="Emergency SOS (आपातकालीन सायरन)"
    >
      <div className="flex flex-col items-center">
        <AlertOctagon size={42} className="animate-pulse" />
        <span className="text-xs font-black tracking-wider uppercase mt-0.5">SOS</span>
      </div>
    </button>
  );
}
