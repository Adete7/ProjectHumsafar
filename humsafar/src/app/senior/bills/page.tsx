"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import GuardedBillCard from '@/components/senior/GuardedBillCard';
import { LanguageCode, Bill } from '@/types';

const INITIAL_BILLS: Bill[] = [
  { id: 'b1', billerName: 'Electricity Board', amount: 1250, dueDate: 'Today', isPaid: false, isDuplicate: false },
  { id: 'b2', billerName: 'Phone Recharge', amount: 350, dueDate: 'Tomorrow', isPaid: false, isDuplicate: false },
  { id: 'b3', billerName: 'Hospital Scan', amount: 4500, dueDate: 'Next Week', isPaid: false, isDuplicate: false },
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
        body: JSON.stringify({ billId: id, pin, amount: bills.find(b => b.id === id)?.amount })
      });
      const data = await res.json();
      
      if (data.success) {
        setBills(bills.map(b => b.id === id ? { ...b, isPaid: true } : b));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (e) {
      return { success: false, error: "Network Error" };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ElderHeader 
        title="PAY BILLS (बिल भुगतान)" 
        langCode={lang} 
        onLanguageChange={setLang}
        audioEnabled={audio}
        onToggleAudio={() => setAudio(!audio)}
      />
      
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <Link href="/senior" className="inline-flex items-center gap-4 bg-white p-4 rounded-2xl border-4 border-senior-blue text-elder-xl font-bold shadow">
            <ArrowLeft size={36} /> BACK
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {bills.map(bill => (
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
    </div>
  );
}
