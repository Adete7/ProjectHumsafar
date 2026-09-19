"use client";

import { ScamAlert } from '@/types';
import { AlertOctagon, CheckCircle, ShieldOff } from 'lucide-react';

interface ScamApprovalQueueProps {
  alerts: ScamAlert[];
  onApprove: (id: string) => void;
  onBlock: (id: string) => void;
}

export default function ScamApprovalQueue({ alerts, onApprove, onBlock }: ScamApprovalQueueProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
        <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
        <h3 className="text-lg font-bold text-gray-700">No Pending Alerts</h3>
        <p className="text-gray-500">All scam checks are cleared.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {alerts.map(alert => (
        <div key={alert.id} className="bg-white p-6 rounded-xl border-l-8 border-red-500 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <AlertOctagon className="text-red-500" size={24} />
              <span className="font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm">
                {alert.riskLevel} RISK
              </span>
            </div>
            <span className="text-sm text-gray-500">{new Date(alert.timestamp).toLocaleString()}</span>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase">Original Message</h4>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-800 font-mono text-sm border">
              {alert.content}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase">AI Analysis</h4>
            <p className="mt-1 text-gray-800">
              {alert.guardianSummary}
            </p>
          </div>

          <div className="flex gap-4 border-t pt-4">
            <button 
              onClick={() => onBlock(alert.id)}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldOff size={20} />
              BLOCK & WARN SENIOR
            </button>
            <button 
              onClick={() => onApprove(alert.id)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle size={20} />
              MARK AS SAFE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
