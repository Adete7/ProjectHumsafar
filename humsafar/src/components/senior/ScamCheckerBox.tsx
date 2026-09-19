"use client";

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Loader2, Send, Sparkles, PhoneCall } from 'lucide-react';
import { LanguageCode } from '@/types';
import VoiceMicButton from '../common/VoiceMicButton';
import { speakPhrase } from '@/lib/speech';
import { addScamAlertToQueue, SharedScamAlert } from '@/lib/storageEvents';

const SAMPLE_MESSAGES = [
  {
    label: '⚡ बिजली बिल धमकी (Power cut threat)',
    text: 'प्रिय उपभोक्ता, आपके बिजली बिल का भुगतान न होने के कारण आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत 9876543210 पर संपर्क करें।',
  },
  {
    label: '🏦 बैंक खाता ब्लॉक (SBI KYC threat)',
    text: 'SBI Alert: Your YONO bank account has been blocked due to pending PAN card verification. Click http://bit.ly/sbi-pan-kyc to reactivate immediately.',
  },
  {
    label: '🎁 लॉटरी/पेंशन स्कीम (Lottery Scam)',
    text: 'बधाई हो! आपका नाम PM पेंशन योजना लॉटरी में ₹2,50,000 के लिए चुना गया है। ₹1,499 शुल्क भेजकर तुरंत राशि प्राप्त करें।',
  },
  {
    label: '💚 सुरक्षित संदेश (Safe Family SMS)',
    text: 'नमस्ते दादाजी, मैं ऑफिस पहुंच गया हूँ। शाम को 7 बजे घर आकर साथ में चाय पिएंगे।',
  },
];

export default function ScamCheckerBox({ langCode }: { langCode: LanguageCode }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [escalatedToGuardian, setEscalatedToGuardian] = useState(false);

  const checkScam = async (contentToCheck: string) => {
    const cleanContent = contentToCheck.trim();
    if (!cleanContent) return;
    setLoading(true);
    setResult(null);
    setEscalatedToGuardian(false);
    speakPhrase('CHECKING_SCAM', langCode);

    try {
      const res = await fetch('/api/scam/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: cleanContent, langCode }),
      });
      const data = await res.json();
      setResult(data);
      speakPhrase(data.elderExplanation, langCode, data.elderExplanation);

      // Instantly transmit flagged threat (RED/YELLOW) to Guardian Portal queue!
      if (data.isScam || data.riskLevel === 'CRITICAL' || data.riskLevel === 'MODERATE') {
        addScamAlertToQueue({
          content: cleanContent,
          isScam: true,
          riskLevel: data.riskLevel || 'CRITICAL',
          elderExplanation: data.elderExplanation,
          guardianSummary: data.guardianSummary || 'Flagged potential scam targeting senior citizen.',
          suggestedAction: data.suggestedAction || 'BLOCK_AND_REPORT',
          seniorName: 'Dada-ji (Ramesh Kumar)',
          source: 'Senior Scam Shield Input',
        });
        setEscalatedToGuardian(true);
      }
    } catch (e) {
      console.error(e);
      alert('संदेश जांचने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-surface-card p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-elder-2xl sm:text-elder-3xl font-black text-slate-950">
          संदेश या फोन नंबर सुरक्षित है?
        </h2>
        <p className="text-elder-base text-slate-700 font-bold mt-1">
          कोई भी SMS, WhatsApp या कॉल का संदेश यहाँ लिखें या बोलें:
        </p>
      </div>

      {/* Quick Test Chips for Seniors or Demo */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
          तुरंत टेस्ट करने के लिए नीचे टैप करें (Try Sample Scams):
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_MESSAGES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setText(sample.text);
                checkScam(sample.text);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/90 hover:bg-amber-100 border-2 border-amber-300 text-slate-900 font-extrabold text-xs sm:text-sm shadow-sm transition-all text-left active:scale-95"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input Textarea */}
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="यहाँ संदेश टाइप करें या पेस्ट करें... (Paste SMS / WhatsApp message here)"
        className="w-full min-h-[140px] bg-white border-3 border-slate-300 rounded-2xl p-5 text-elder-base sm:text-elder-lg font-bold focus:border-amber-500 outline-none shadow-inner"
      />
      
      {/* Action Buttons: Check Now & Voice Mic */}
      <div className="flex gap-4">
        <button 
          onClick={() => checkScam(text)}
          disabled={loading || !text.trim()}
          className="flex-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 py-5 rounded-2xl text-elder-xl font-black min-h-[80px] shadow-xl hover:brightness-105 active:scale-95 transition-all border-3 border-slate-950 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={36} />
              <span>जांच हो रही है...</span>
            </>
          ) : (
            <>
              <Sparkles size={32} />
              <span>अभी जांचें (CHECK NOW)</span>
            </>
          )}
        </button>

        <VoiceMicButton 
          langCode={langCode} 
          onCommand={(speechText) => {
            setText(speechText);
            checkScam(speechText);
          }} 
        />
      </div>

      {/* Analysis Result Banner */}
      {result && (
        <div className={`mt-2 p-6 sm:p-8 rounded-3xl border-4 shadow-2xl transition-all ${
          result.isScam 
            ? 'bg-red-50 border-red-600 text-red-950' 
            : 'bg-emerald-50 border-emerald-600 text-emerald-950'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            {result.isScam ? (
              <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg animate-pulse">
                <ShieldAlert size={56} />
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg">
                <ShieldCheck size={56} />
              </div>
            )}

            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                result.isScam ? 'bg-red-200 text-red-900' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {result.riskLevel || (result.isScam ? 'CRITICAL' : 'SAFE')} VERDICT
              </span>
              <h3 className="text-elder-2xl sm:text-elder-3xl font-black mt-1">
                {result.isScam ? "खतरा! यह एक फर्जी संदेश है (SCAM)" : "सुरक्षित संदेश (SAFE TO READ)"}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-3 border-slate-300 shadow-sm mt-2">
            <p className="text-elder-lg sm:text-elder-xl font-black text-slate-900 leading-relaxed">
              {result.elderExplanation}
            </p>
          </div>

          {result.isScam && (
            <div className="mt-5 p-4 rounded-2xl bg-red-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <AlertTriangle size={32} className="flex-shrink-0" />
                <span className="text-elder-base font-extrabold">
                  संदेश को ब्लॉक किया गया और केयरगिवर को भेजा गया। (Sent to Guardian)
                </span>
              </div>

              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black whitespace-nowrap">
                LIVE SYNCED
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
