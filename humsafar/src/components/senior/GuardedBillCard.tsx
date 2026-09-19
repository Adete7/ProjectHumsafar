"use client";

import { useState } from 'react';
import { Bill, LanguageCode } from '@/types';
import { ShieldAlert, CreditCard, Check, X, Lock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { speakPhrase } from '@/lib/speech';

interface GuardedBillCardProps {
  bill: Bill;
  maxCap: number;
  langCode: LanguageCode;
  onPay: (id: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  audioEnabled: boolean;
}

export default function GuardedBillCard({
  bill,
  maxCap,
  langCode,
  onPay,
  audioEnabled,
}: GuardedBillCardProps) {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsPin = bill.amount > maxCap;

  const handlePay = async () => {
    if (needsPin && pin.length < 4) {
      setError('कृपया 4-अंकों का सुरक्षा पिन दर्ज करें (Enter 4-digit PIN)');
      return;
    }
    setLoading(true);
    setError(null);
    const res = await onPay(bill.id, pin);
    if (res.success) {
      if (audioEnabled) {
        speakPhrase(`${bill.billerName} का बिल ₹${bill.amount} सफलतापूर्वक जमा हो गया`, langCode);
      }
      setShowPin(false);
    } else {
      setError(res.error || 'भुगतान असफल रहा। कृपया पुनः प्रयास करें।');
    }
    setLoading(false);
  };

  if (bill.isPaid) {
    return (
      <div className="glass-surface p-6 sm:p-8 rounded-3xl border-4 border-emerald-500 bg-emerald-50/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-md">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h2 className="text-elder-2xl font-black text-slate-900">{bill.billerName}</h2>
            <p className="text-elder-base font-bold text-slate-600">
              भुगतान हो चुका है • बिल राशि: ₹{bill.amount}
            </p>
          </div>
        </div>

        <span className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-black text-elder-base border-2 border-emerald-700 shadow">
          PAID (जमा हो चुका)
        </span>
      </div>
    );
  }

  return (
    <div
      className={`glass-surface-card p-6 sm:p-8 rounded-3xl border-4 transition-all shadow-xl flex flex-col gap-6 ${
        needsPin ? 'border-red-500 bg-red-50/40' : 'border-amber-400 hover:border-orange-500'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-elder-2xl font-black text-slate-950">{bill.billerName}</h2>
            {bill.isDuplicate && (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs">
                संभावित डुप्लिकेट
              </span>
            )}
          </div>
          <p className="text-elder-3xl sm:text-elder-4xl font-black text-orange-600">
            ₹{bill.amount}
          </p>
          <p className="text-elder-base font-bold text-slate-600">
            अंतिम तिथि (Due Date): <span className="text-slate-900 font-extrabold">{bill.dueDate}</span>
          </p>
        </div>

        {needsPin ? (
          <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg flex flex-col items-center">
            <ShieldAlert size={36} />
            <span className="text-xs font-black uppercase mt-1">₹{maxCap}+ CAP</span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex flex-col items-center">
            <ShieldCheck size={36} />
            <span className="text-xs font-black uppercase mt-1">SAFE LIMIT</span>
          </div>
        )}
      </div>

      {/* Safety notice */}
      {needsPin && (
        <div className="p-4 rounded-2xl bg-red-100 border-2 border-red-300 text-red-900 flex items-center gap-3">
          <AlertTriangle size={26} className="flex-shrink-0 text-red-700" />
          <p className="text-sm sm:text-base font-bold">
            सुरक्षा सीमा से अधिक (₹{maxCap}+): बड़ी राशि की ठगी रोकने के लिए केयरगिवर ऑथराइजेशन पिन अनिवार्य है।
          </p>
        </div>
      )}

      {needsPin && !showPin ? (
        <button
          onClick={() => setShowPin(true)}
          className="w-full bg-red-600 text-white py-5 sm:py-6 rounded-2xl text-elder-xl font-black min-h-[80px] hover:bg-red-700 shadow-xl border-3 border-slate-950 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <Lock size={32} />
          <span>सुरक्षा पिन दर्ज करके भुगतान करें (ENTER PIN)</span>
        </button>
      ) : showPin ? (
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/95 border-3 border-red-400">
          <label className="text-elder-lg font-black text-slate-900">
            केयरगिवर द्वारा दिया गया 4-अंकीय पिन लिखें (PIN: 1234)
          </label>
          <div className="flex gap-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="flex-1 bg-slate-50 border-3 border-slate-400 rounded-2xl p-4 text-elder-3xl text-center font-black focus:border-red-500 outline-none tracking-widest text-slate-900"
            />
            <button
              type="button"
              onClick={() => setShowPin(false)}
              className="p-4 rounded-2xl bg-slate-200 text-slate-800 hover:bg-slate-300 flex items-center justify-center min-w-[70px]"
            >
              <X size={32} />
            </button>
          </div>
          {error && <p className="text-red-600 font-black text-elder-base">{error}</p>}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 rounded-2xl text-elder-xl font-black min-h-[80px] shadow-xl hover:brightness-105 border-2 border-emerald-800 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'भुगतान हो रहा है...' : 'पुष्टि करें और भुगतान करें (CONFIRM & PAY)'}
          </button>
        </div>
      ) : (
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 py-5 sm:py-6 rounded-2xl text-elder-xl font-black min-h-[80px] shadow-xl hover:brightness-105 border-3 border-slate-950 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          <CreditCard size={36} />
          <span>{loading ? 'भुगतान प्रक्रियाधीन है...' : 'सुरक्षित भुगतान करें (PAY NOW)'}</span>
        </button>
      )}
    </div>
  );
}
