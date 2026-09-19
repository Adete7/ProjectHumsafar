"use client";

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Loader2, Send, Sparkles, Zap } from 'lucide-react';
import { LanguageCode } from '@/types';
import VoiceMicButton from '../common/VoiceMicButton';
import { speakPhrase, speakText } from '@/lib/speech';
import { addScamAlertToQueue } from '@/lib/storageEvents';
import { useLanguage } from '@/context/LanguageContext';

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

export default function ScamCheckerBox({ langCode: propLangCode }: { langCode?: LanguageCode }) {
  const { langCode: contextLangCode, t } = useLanguage();
  const langCode = propLangCode || contextLangCode;

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
      if (data.elderExplanation) {
        speakText(data.elderExplanation, langCode);
      }

      // Instantly transmit flagged threat (RED/YELLOW) to Guardian Portal queue
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
          {t('CHECK_SCAM')}
        </h2>
        <p className="text-elder-base text-slate-700 font-bold mt-1">
          {t('CHECK_SCAM_SUB')}
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

      {/* Input Textarea with 1000 char counter */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 1000))}
          placeholder={t('SCAM_PLACEHOLDER')}
          rows={4}
          maxLength={1000}
          className="w-full p-4 sm:p-5 text-elder-base sm:text-elder-lg font-bold rounded-2xl bg-white border-3 border-amber-400 focus:border-orange-500 outline-none text-slate-950 shadow-inner placeholder:text-slate-400 resize-none"
        />
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2 mt-1">
          <span>{text.length}/1000 अक्षरों की सुरक्षा सीमा (Security Limit)</span>
          {text.length >= 900 && <span className="text-red-600 font-black">सीमा समाप्त होने वाली है</span>}
        </div>
      </div>

      {/* Actions: Send & Voice Mic */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => checkScam(text)}
          disabled={loading || !text.trim()}
          className="w-full sm:flex-1 py-5 px-6 rounded-2xl font-black text-elder-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-2 border-orange-600"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-8 h-8" />
              <span>जांच हो रही है... (Checking)</span>
            </>
          ) : (
            <>
              <Send className="w-7 h-7" />
              <span>{t('VERIFY_MESSAGE')}</span>
            </>
          )}
        </button>

        <VoiceMicButton 
          langCode={langCode} 
          onSpeechResult={(speechText) => {
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
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
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
                  {result.isScam ? t('CRITICAL') : t('SAFE')}
                </h3>
              </div>
            </div>

            {/* Performance LRU Cache Indicator */}
            {result.fromCache && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-400 text-amber-900 font-extrabold text-xs shadow-sm">
                <Zap size={16} className="text-amber-600" />
                <span>24h LRU Cache (0ms)</span>
              </div>
            )}
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
