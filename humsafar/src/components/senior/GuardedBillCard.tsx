"use client";

import { useState } from 'react';
import { Bill, LanguageCode } from '@/types';
import { ShieldAlert, CreditCard, Check, X } from 'lucide-react';
import { speakPhrase } from '@/lib/speech';

interface GuardedBillCardProps {
  bill: Bill;
  maxCap: number;
  langCode: LanguageCode;
  onPay: (id: string, pin: string) => Promise<{success: boolean; error?: string}>;
  audioEnabled: boolean;
}

export default function GuardedBillCard({ bill, maxCap, langCode, onPay, audioEnabled }: GuardedBillCardProps) {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsPin = bill.amount > maxCap;

  const handlePay = async () => {
    if (needsPin && pin.length < 4) {
      setError("Please enter 4-digit PIN");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await onPay(bill.id, pin);
    if (res.success) {
      if (audioEnabled) speakPhrase('BILL_PAID', langCode);
      setShowPin(false);
    } else {
      setError(res.error || "Payment failed");
    }
    setLoading(false);
  };

  if (bill.isPaid) {
    return (
      <div className="p-6 rounded-3xl border-8 border-senior-green bg-gray-50 flex flex-col gap-4">
        <h2 className="text-elder-2xl font-black text-gray-800">{bill.billerName}</h2>
        <p className="text-elder-xl font-bold text-gray-600">₹{bill.amount} - PAID</p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-3xl border-8 ${needsPin ? 'border-senior-red bg-red-50' : 'border-senior-blue bg-white'} shadow-xl flex flex-col gap-6`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h2 className="text-elder-2xl font-black">{bill.billerName}</h2>
          <p className="text-elder-3xl font-black text-senior-blue">₹{bill.amount}</p>
          <p className="text-elder-lg font-bold text-gray-600">Due: {bill.dueDate}</p>
        </div>
        {needsPin && (
          <div className="bg-senior-red text-white p-3 rounded-full flex items-center justify-center">
            <ShieldAlert size={40} />
          </div>
        )}
      </div>

      {needsPin && !showPin ? (
        <button 
          onClick={() => setShowPin(true)}
          className="w-full bg-senior-red text-white py-6 rounded-2xl text-elder-xl font-black min-h-[80px] hover:bg-red-800 flex items-center justify-center gap-4"
        >
          <ShieldAlert size={36} />
          HIGH AMOUNT - REQUIRES PIN
        </button>
      ) : showPin ? (
        <div className="flex flex-col gap-4">
          <label className="text-elder-xl font-bold">Enter 4-Digit PIN to Pay</label>
          <div className="flex gap-4">
            <input 
              type="password" 
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="flex-1 bg-white border-4 border-senior-blue rounded-2xl p-4 text-elder-2xl text-center font-black focus:border-senior-yellow outline-none"
            />
            <button 
              onClick={() => setShowPin(false)}
              className="bg-gray-300 text-senior-black p-4 rounded-2xl flex items-center justify-center min-w-[80px]"
            >
              <X size={36} />
            </button>
          </div>
          {error && <p className="text-senior-red font-bold text-elder-lg">{error}</p>}
          <button 
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-senior-green text-white py-6 rounded-2xl text-elder-xl font-black min-h-[80px] hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "CONFIRM & PAY"}
          </button>
        </div>
      ) : (
        <button 
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-senior-blue text-white py-6 rounded-2xl text-elder-xl font-black min-h-[80px] hover:bg-blue-900 flex items-center justify-center gap-4 disabled:opacity-50"
        >
          <CreditCard size={36} />
          {loading ? "PROCESSING..." : "PAY NOW"}
        </button>
      )}
    </div>
  );
}
