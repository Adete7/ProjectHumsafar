"use client";

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Loader2 } from 'lucide-react';
import { LanguageCode, ScamAlert } from '@/types';
import VoiceMicButton from '../common/VoiceMicButton';
import { speakPhrase } from '@/lib/speech';

export default function ScamCheckerBox({ langCode }: { langCode: LanguageCode }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamAlert | null>(null);

  const checkScam = async (content: string) => {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    speakPhrase('CHECKING_SCAM', langCode);

    try {
      const res = await fetch('/api/scam/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, langCode })
      });
      const data = await res.json();
      setResult(data);
      speakPhrase(data.elderExplanation, langCode, data.elderExplanation);
    } catch (e) {
      console.error(e);
      alert("Error checking scam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border-8 border-senior-blue shadow-2xl flex flex-col gap-6">
      <h2 className="text-elder-2xl font-black text-center">Is this message safe?</h2>
      
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste message here..."
        className="w-full min-h-[150px] bg-gray-100 border-4 border-gray-300 rounded-2xl p-6 text-elder-xl font-bold focus:border-senior-yellow outline-none"
      />
      
      <div className="flex gap-4">
        <button 
          onClick={() => checkScam(text)}
          disabled={loading || !text}
          className="flex-1 bg-senior-blue text-white py-6 rounded-2xl text-elder-xl font-black min-h-[80px] hover:bg-blue-900 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" size={40} /> : "CHECK NOW"}
        </button>
        <VoiceMicButton 
          langCode={langCode} 
          onCommand={(speechText) => {
            setText(speechText);
            checkScam(speechText);
          }} 
        />
      </div>

      {result && (
        <div className={`mt-6 p-6 rounded-2xl border-8 ${
          result.isScam 
            ? 'bg-red-50 border-senior-red text-senior-red' 
            : 'bg-green-50 border-senior-green text-senior-green'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            {result.isScam ? <ShieldAlert size={64} /> : <ShieldCheck size={64} />}
            <h3 className="text-elder-3xl font-black">
              {result.isScam ? "DANGER / SCAM" : "SAFE"}
            </h3>
          </div>
          <p className="text-elder-2xl font-bold text-senior-black bg-white p-4 rounded-xl border-4 border-gray-200">
            {result.elderExplanation}
          </p>
          {result.isScam && (
            <div className="mt-6 flex items-center justify-center gap-4 bg-senior-red text-white p-4 rounded-xl">
              <AlertTriangle size={32} />
              <span className="text-elder-xl font-bold">Sent to Guardian for review. Do not reply.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
