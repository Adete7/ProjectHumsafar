"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Map, ShieldAlert, Activity } from 'lucide-react';
import LiveMapTracker from '@/components/guardian/LiveMapTracker';
import ScamApprovalQueue from '@/components/guardian/ScamApprovalQueue';
import MedicationLogTable from '@/components/guardian/MedicationLogTable';
import { GeofenceZone, ScamAlert, Pill } from '@/types';

// Mock Data for Guardian Dashboard
const SAFE_ZONE: GeofenceZone = { centerLat: 28.7041, centerLng: 77.1025, radiusMeters: 2000 };
const MOCK_ALERTS: ScamAlert[] = [
  {
    id: 'a1',
    content: 'Your electricity will be disconnected tonight at 9 PM. Call this number immediately: 9876543210',
    isScam: true,
    riskLevel: 'CRITICAL',
    elderExplanation: 'यह संदेश बिजली विभाग से नहीं है, यह एक धोखा है।',
    guardianSummary: 'Classic electricity disconnection scam aiming to induce panic and extract money.',
    suggestedAction: 'BLOCK_AND_REPORT',
    timestamp: new Date().toISOString(),
    status: 'PENDING_REVIEW'
  }
];
const MOCK_PILLS: Pill[] = [
  { id: '1', name: 'Amlodipine', color: '#DE350B', time: '08:00 AM', taken: true, takenAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', name: 'Metformin', color: '#00875A', time: '02:00 PM', taken: false },
];

export default function GuardianDashboard() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const handleApprove = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleBlock = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Guardian Console</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            G
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Map & Meds */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <Map size={24} />
              <h2 className="text-xl font-bold">Live Geofencing</h2>
            </div>
            <LiveMapTracker 
              seniorName="Dad (Ramesh)"
              safeZone={SAFE_ZONE}
              currentLat={28.7050}
              currentLng={77.1030}
              isOutside={false}
            />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <Activity size={24} />
              <h2 className="text-xl font-bold">Medication Compliance</h2>
            </div>
            <MedicationLogTable pills={MOCK_PILLS} />
          </section>
        </div>

        {/* Right Column: Scam Queue */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <ShieldAlert size={24} className="text-red-500" />
              <h2 className="text-xl font-bold">Scam Review Queue</h2>
              {alerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {alerts.length}
                </span>
              )}
            </div>
            <ScamApprovalQueue 
              alerts={alerts}
              onApprove={handleApprove}
              onBlock={handleBlock}
            />
          </section>
        </div>

      </main>
    </div>
  );
}
