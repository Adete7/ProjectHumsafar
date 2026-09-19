"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import EmergencySOS from '@/components/common/EmergencySOS';
import ElderDecorativeBackground from '@/components/common/ElderDecorativeBackground';
import GuardedBillCard from '@/components/senior/GuardedBillCard';
import { LanguageCode, Bill } from '@/types';

const INITIAL_BILLS: Bill[] = [
  { id: 'b1', billerName: 'Electricity Board (BSES Delhi)', amount: 1250, dueDate: 'Today (आज)', isPaid: false, isDuplicate: false },
  { id: 'b2', billerName: 'Mobile Recharge (Jio Senior)', amount: 350, dueDate: 'In 3 Days', isPaid: false, isDuplicate: false },
  { id: 'b3', billerName: 'Hospital Scan & Diagnostics', amount: 4500, dueDate: 'Next Week', isPaid: false, isDuplicate: false },
];

export default function BillsPage() {
  const [lang, setLang] = useState<LanguageCode>('hi-IN');
  const [audio, setAudio] = useState(true);
  const [bills, setBills] = useState(INITIAL_BILLS);

  const handlePay = async (id: string, pin: string) => {
    try {
      const res = await fetch('/api/bills/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billId: id, pin, amount: bills.find((b) => b.id === id)?.amount }),
      });
      const data = await res.json();

      if (data.success) {
        setBills(bills.map((b) => (b.id === id ? { ...b, isPaid: true } : b)));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (e) {
      return { success: false, error: 'Network Connection Error' };
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <ElderDecorativeBackground />

      <ElderHeader 
        title="PAY BILLS (बिल भुगतान)" 
        langCode={lang} 
        onLanguageChange={setLang}
        audioEnabled={audio}
        onToggleAudio={() => setAudio(!audio)}
      />
      
      <main className="relative z-10 flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full mb-24">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/senior" 
            className="inline-flex items-center gap-3 glass-surface p-4 rounded-2xl border-3 border-amber-400 text-elder-xl font-black text-slate-900 shadow hover:bg-amber-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={34} className="text-orange-600" />
            <span>वापस (BACK)</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl glass-surface-warm border border-amber-300 text-amber-900 font-extrabold text-elder-base">
            <ShieldCheck size={24} className="text-emerald-600" />
            <span>₹3,000 सुरक्षा कैप सक्रिय</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {bills.map((bill) => (
            <GuardedBillCard 
              key={bill.id} 
              bill={bill} 
              maxCap={3000}
              langCode={lang}
              onPay={handlePay}
              audioEnabled={audio}
            />
          ))}
        </div>
      </main>

      <EmergencySOS langCode={lang} />
    </div>
  );
}
