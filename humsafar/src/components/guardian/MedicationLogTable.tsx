"use client";

import { Pill } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

export default function MedicationLogTable({ pills }: { pills: Pill[] }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-4 font-bold text-gray-600">Medication</th>
            <th className="p-4 font-bold text-gray-600">Scheduled Time</th>
            <th className="p-4 font-bold text-gray-600">Status</th>
            <th className="p-4 font-bold text-gray-600">Time Taken</th>
          </tr>
        </thead>
        <tbody>
          {pills.map((pill, i) => (
            <tr key={pill.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-4 font-bold flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: pill.color }}
                />
                {pill.name}
              </td>
              <td className="p-4 text-gray-700">{pill.time}</td>
              <td className="p-4">
                {pill.taken ? (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    <CheckCircle size={16} /> Taken
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                    <XCircle size={16} /> Missed
                  </span>
                )}
              </td>
              <td className="p-4 text-gray-500">
                {pill.takenAt ? new Date(pill.takenAt).toLocaleTimeString() : '--'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
