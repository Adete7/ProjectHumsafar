"use client";

import { useState, useEffect } from 'react';
import { StoredMedication, getStoredMedications, toggleMedicationTaken } from '@/lib/storageEvents';
import { CheckCircle, XCircle, Clock, Pill, RotateCcw } from 'lucide-react';

export default function MedicationLogTable({ pills: initialPills }: { pills?: StoredMedication[] }) {
  const [meds, setMeds] = useState<StoredMedication[]>(initialPills || []);

  useEffect(() => {
    setMeds(getStoredMedications());
    const listener = (e: any) => {
      if (e.detail) setMeds(e.detail);
    };
    window.addEventListener('humsafar_medications_change', listener);
    return () => window.removeEventListener('humsafar_medications_change', listener);
  }, []);

  const handleToggle = (id: string) => {
    const updated = toggleMedicationTaken(id);
    setMeds(updated);
  };

  const takenCount = meds.filter((m) => m.taken).length;
  const complianceRate = meds.length > 0 ? Math.round((takenCount / meds.length) * 100) : 0;

  return (
    <div className="glass-surface rounded-3xl p-6 border-3 border-slate-200 shadow-xl flex flex-col gap-4">
      {/* Header & Compliance Score */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h3 className="text-elder-xl font-black text-slate-950">
            Daily Medication Audit (दवा अनुपालन)
          </h3>
          <p className="text-sm font-bold text-slate-600">
            {takenCount} of {meds.length} doses confirmed by senior today
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500">Compliance:</span>
          <span
            className={`font-black text-base ${
              complianceRate >= 80
                ? 'text-emerald-600'
                : complianceRate >= 50
                ? 'text-amber-600'
                : 'text-red-600'
            }`}
          >
            {complianceRate}%
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 bg-white/90">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-black uppercase">
              <th className="p-3.5">Medication (दवा)</th>
              <th className="p-3.5">Schedule</th>
              <th className="p-3.5">Instructions</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Logged At</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {meds.map((med) => (
              <tr key={med.id} className="hover:bg-amber-50/50 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: med.color || '#F97316' }}
                    />
                    <div>
                      <div className="font-black text-slate-950">{med.name}</div>
                      {med.hindiName && (
                        <div className="text-xs font-bold text-slate-500">{med.hindiName}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3.5 font-bold text-slate-700">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-black border border-slate-200">
                    {med.timeSlot} • {med.time}
                  </span>
                </td>
                <td className="p-3.5 text-xs font-bold text-slate-600 max-w-[200px]">
                  {med.instructions}
                </td>
                <td className="p-3.5">
                  {med.taken ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black border border-emerald-300">
                      <CheckCircle size={14} /> Taken
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black border border-amber-300">
                      <Clock size={14} /> Pending
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-xs font-extrabold text-slate-500">
                  {med.takenAt || '--'}
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleToggle(med.id)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold transition-colors inline-flex items-center gap-1"
                    title="Toggle Taken Status"
                  >
                    <RotateCcw size={14} />
                    <span>बदलें</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
