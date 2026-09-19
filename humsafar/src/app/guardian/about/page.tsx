"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Smartphone,
  Bell,
  CheckCircle2,
  Users,
  Info,
  Save,
  MessageSquare,
  Phone,
  Sliders,
  Check,
} from 'lucide-react';
import ElderDecorativeBackground from '@/components/common/ElderDecorativeBackground';
import {
  getGuardianSettings,
  saveGuardianSettings,
  getStoredProfile,
  saveStoredProfile,
  GuardianSettings,
  StoredProfile,
} from '@/lib/storageEvents';

export default function GuardianAboutPage() {
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [settings, setSettings] = useState<GuardianSettings>(getGuardianSettings());
  const [savedToast, setSavedToast] = useState(false);

  // Form profile
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  useEffect(() => {
    const prof = getStoredProfile('guardian');
    setProfile(prof);
    setName(prof.name);
    setPhone(prof.emergencyPhone || '+91 98111 22334');
    setRelationship(prof.relationship || 'Daughter');
    setSettings(getGuardianSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredProfile('guardian', {
      name,
      emergencyPhone: phone,
      relationship,
    });
    saveGuardianSettings(settings);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <ElderDecorativeBackground />

      {/* Header */}
      <header className="relative z-10 glass-surface p-4 sm:p-5 border-b-2 border-slate-300 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/guardian"
            className="p-3 rounded-2xl bg-white text-slate-900 border-2 border-slate-300 hover:bg-amber-100 shadow flex items-center gap-2 font-black text-sm"
          >
            <ArrowLeft size={22} className="text-orange-600" />
            <span>कंसोल पर वापस (Back to Console)</span>
          </Link>
          <h1 className="text-elder-xl font-black text-slate-950">
            About Guardian & System Profile
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
            DEVICE PAIRED • ONLINE
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full mb-16 flex flex-col gap-8">
        {savedToast && (
          <div className="p-4 rounded-2xl bg-slate-900 text-amber-300 font-bold text-sm shadow-xl flex items-center gap-2 border-2 border-amber-400 animate-bounce">
            <Check size={20} className="text-emerald-400" />
            <span>सेटिंग्स और प्रोफाइल सुरक्षित हो गईं! (Settings saved successfully)</span>
          </div>
        )}

        {/* 1. Device Pairing Status Card */}
        <section className="glass-surface-warm p-6 sm:p-8 rounded-3xl border-3 border-amber-300 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-slate-900 text-amber-300 shadow-lg flex-shrink-0">
              <Smartphone size={36} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                ACTIVE SENIOR DEVICE LINK
              </span>
              <h2 className="text-elder-xl font-black text-slate-950 mt-0.5">
                {settings.pairedDeviceName}
              </h2>
              <p className="text-sm font-bold text-slate-700">
                Senior: <span className="font-extrabold text-orange-950">Ramesh Kumar (दादाजी)</span> • Battery: 88% • GPS: High Precision
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 text-white font-black text-sm shadow">
            <CheckCircle2 size={20} />
            <span>लाइव सिंक चालू (Synced)</span>
          </div>
        </section>

        <form onSubmit={handleSave} className="flex flex-col gap-8">
          {/* 2. Guardian Contact Details */}
          <section className="glass-surface p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xl flex flex-col gap-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-elder-lg font-black text-slate-950">
                  Guardian & Caregiver Contact Information
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  This contact receives instant SOS alerts and high-value bill authorization requests.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-black text-slate-800 mb-1">
                  केयरगिवर का नाम (Full Name)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold bg-white text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-800 mb-1">
                  रिश्ता (Relation to Senior)
                </label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold bg-white text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-800 mb-1">
                  अलर्ट फ़ोन नंबर (Alert Phone)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold bg-white text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* 3. Notification Preferences (WhatsApp & SMS mock toggles) */}
          <section className="glass-surface p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xl flex flex-col gap-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="text-elder-lg font-black text-slate-950">
                  Emergency & Notification Preferences
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Select which gateways receive instant alerts when SOS, Scam, or Geofence breach fires.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Toggle */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">WhatsApp Gateway Alert</h4>
                    <p className="text-xs font-bold text-slate-500">
                      Dispatches immediate WhatsApp alert with Google Maps URL
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settings.whatsappAlerts}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsappAlerts: e.target.checked })
                  }
                  className="w-6 h-6 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* SMS Gateway Toggle */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">SMS / Cellular Backup</h4>
                    <p className="text-xs font-bold text-slate-500">
                      Fallback SMS dispatch if senior has low data connectivity
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settings.smsAlerts}
                  onChange={(e) =>
                    setSettings({ ...settings, smsAlerts: e.target.checked })
                  }
                  className="w-6 h-6 accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Threshold Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200">
                <label className="block text-sm font-black text-slate-900 mb-1">
                  वरिष्ठ खर्च सीमा (Senior Spend Cap Threshold)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={settings.seniorSpendCap}
                    onChange={(e) =>
                      setSettings({ ...settings, seniorSpendCap: Number(e.target.value) })
                    }
                    className="w-36 p-2.5 rounded-xl border-2 border-slate-300 font-bold bg-slate-50 text-slate-900 text-base"
                  />
                  <span className="text-xs font-extrabold text-slate-600">
                    (Bills above ₹{settings.seniorSpendCap} trigger Guardian approval)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200">
                <label className="block text-sm font-black text-slate-900 mb-1">
                  डिफ़ॉल्ट सुरक्षित दायरा (Safe Geofence Radius)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.5"
                    value={settings.geofenceRadiusKm}
                    onChange={(e) =>
                      setSettings({ ...settings, geofenceRadiusKm: Number(e.target.value) })
                    }
                    className="w-36 p-2.5 rounded-xl border-2 border-slate-300 font-bold bg-slate-50 text-slate-900 text-base"
                  />
                  <span className="text-xs font-extrabold text-slate-600">
                    km from Home Coordinates
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-3 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-elder-base shadow-lg hover:brightness-105 border-2 border-slate-900 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              <span>सेटिंग्स सुरक्षित करें (Save Preferences)</span>
            </button>
          </section>
        </form>

        {/* 4. App Version & Security Details */}
        <section className="glass-surface p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <Info size={24} />
            </div>
            <div>
              <h3 className="text-elder-lg font-black text-slate-950">
                System Specification & Security Audit
              </h3>
              <p className="text-xs font-bold text-slate-500">
                Application build parameters and runtime compliance info
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Version</span>
              <div className="font-black text-base text-slate-900">v2.4.0-sunrise</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">AI Engine</span>
              <div className="font-black text-base text-orange-600">Gemini 1.5 Flash</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Accessibility</span>
              <div className="font-black text-base text-emerald-600">WCAG AAA</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Offline Sync</span>
              <div className="font-black text-base text-blue-600">Active (PWA)</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
