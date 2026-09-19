"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Map,
  ShieldAlert,
  Activity,
  AlertOctagon,
  PhoneCall,
  ExternalLink,
  CheckCircle2,
  Settings,
  User,
  Sparkles,
} from 'lucide-react';
import LiveMapTracker from '@/components/guardian/LiveMapTracker';
import ScamApprovalQueue from '@/components/guardian/ScamApprovalQueue';
import MedicationLogTable from '@/components/guardian/MedicationLogTable';
import ElderDecorativeBackground from '@/components/common/ElderDecorativeBackground';
import {
  getActiveSOS,
  cancelLiveSOS,
  SOSAlertPayload,
  getStoredProfile,
  StoredProfile,
} from '@/lib/storageEvents';

const SAFE_ZONE = {
  centerLat: 28.6139,
  centerLng: 77.2090,
  radiusMeters: 2000,
};

export default function GuardianDashboard() {
  const [activeSOS, setActiveSOS] = useState<SOSAlertPayload | null>(null);
  const [guardianProfile, setGuardianProfile] = useState<StoredProfile | null>(null);

  useEffect(() => {
    setActiveSOS(getActiveSOS());
    setGuardianProfile(getStoredProfile('guardian'));

    const sosListener = (e: any) => {
      setActiveSOS(e.detail);
    };
    const profListener = (e: any) => {
      if (e.detail?.role === 'guardian') {
        setGuardianProfile(e.detail.profile);
      }
    };

    window.addEventListener('humsafar_sos_change', sosListener);
    window.addEventListener('humsafar_profile_change', profListener);

    return () => {
      window.removeEventListener('humsafar_sos_change', sosListener);
      window.removeEventListener('humsafar_profile_change', profListener);
    };
  }, []);

  const handleResolveSOS = () => {
    cancelLiveSOS();
    setActiveSOS(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <ElderDecorativeBackground />

      {/* Header */}
      <header className="relative z-20 glass-surface p-4 sm:p-5 border-b-2 border-slate-300 shadow-md flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-3 rounded-2xl bg-white text-slate-900 border-2 border-slate-300 hover:bg-amber-100 shadow flex items-center gap-2 font-black text-sm"
            title="Switch Mode"
          >
            <ArrowLeft size={22} className="text-orange-600" />
            <span className="hidden sm:inline">पोर्टल बदलें (Switch)</span>
          </Link>

          <div>
            <h1 className="text-elder-xl sm:text-elder-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              <span>Guardian Command Portal</span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
                संरक्षक
              </span>
            </h1>
            <p className="text-xs font-bold text-slate-600 hidden sm:block">
              Continuous Remote Care • Real-Time Protection for Elders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Link to About & Settings */}
          <Link
            href="/guardian/about"
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 border-2 border-slate-300 hover:bg-amber-100 shadow flex items-center gap-2 font-black text-xs sm:text-sm"
          >
            <Settings size={18} className="text-orange-600" />
            <span>सेटिंग्स और प्रोफ़ाइल (About & Settings)</span>
          </Link>

          {/* Guardian Profile Avatar */}
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-slate-900 shadow bg-slate-100 flex items-center justify-center">
            {guardianProfile?.photoUrl ? (
              <img src={guardianProfile.photoUrl} alt="Guardian" className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-slate-700" />
            )}
          </div>
        </div>
      </header>

      {/* URGENT SOS ACTIVE BANNER (Real-time Linkage) */}
      {activeSOS && activeSOS.active && (
        <div className="relative z-20 bg-red-600 text-white p-4 sm:p-6 border-b-4 border-red-800 shadow-2xl animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-white text-red-600 rounded-2xl animate-bounce shadow">
              <AlertOctagon size={40} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900 text-yellow-300 text-xs font-black uppercase tracking-wider mb-1">
                🚨 CRITICAL EMERGENCY SOS SIGNAL RECEIVED
              </div>
              <h2 className="text-elder-xl font-black">
                {activeSOS.seniorName} has pressed the Emergency Siren!
              </h2>
              <p className="text-sm font-bold opacity-95">
                Timestamp: {activeSOS.timestamp} • Location: Lat {activeSOS.lat.toFixed(4)}, Lng {activeSOS.lng.toFixed(4)} ({activeSOS.address || 'Home Perimeter'})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:+919876543210`}
              className="px-5 py-3 rounded-2xl bg-white text-red-700 font-black text-sm shadow-xl flex items-center gap-2 hover:bg-red-50"
            >
              <PhoneCall size={20} />
              <span>तुरंत कॉल करें (Call Elder)</span>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activeSOS.lat},${activeSOS.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-red-950 text-white font-black text-sm shadow-xl flex items-center gap-2 border border-red-400"
            >
              <ExternalLink size={20} />
              <span>लाइव लोकेशन देखें (View Maps)</span>
            </a>

            <button
              onClick={handleResolveSOS}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-xl flex items-center gap-2"
            >
              <CheckCircle2 size={20} />
              <span>हल हुआ • अलार्म बंद करें (Mark Safe)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <main className="relative z-10 flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Left 2 Columns: Leaflet Geofence Map & Medication Audit */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Section 1: Live OpenStreetMap Geofence */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <Map size={24} />
                </div>
                <h2 className="text-elder-xl font-black">
                  Live Geofencing & Location Radar
                </h2>
              </div>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                OpenStreetMap Active
              </span>
            </div>

            <LiveMapTracker 
              seniorName="Dada-ji (Ramesh Kumar)"
              safeZone={SAFE_ZONE}
              initialLat={SAFE_ZONE.centerLat}
              initialLng={SAFE_ZONE.centerLng}
            />
          </section>

          {/* Section 2: Medication Audit Table */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  <Activity size={24} />
                </div>
                <h2 className="text-elder-xl font-black">
                  Prescription Compliance Audit
                </h2>
              </div>
              <span className="text-xs font-extrabold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-300">
                Real-time sync
              </span>
            </div>

            <MedicationLogTable />
          </section>
        </div>

        {/* Right 1 Column: Scam Review Queue */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <div className="p-2 rounded-xl bg-rose-100 text-red-600">
                  <ShieldAlert size={24} />
                </div>
                <h2 className="text-elder-xl font-black">
                  Scam Review Queue
                </h2>
              </div>
            </div>

            <ScamApprovalQueue />
          </section>
        </div>
      </main>
    </div>
  );
}
