"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { UserCircle, Shield, Camera, CheckCircle2, HeartHandshake, Sparkles, PhoneCall } from 'lucide-react';
import ElderDecorativeBackground from '@/components/common/ElderDecorativeBackground';
import { getStoredProfile, saveStoredProfile, StoredProfile } from '@/lib/storageEvents';
import { compressImage } from '@/lib/imageUtils';

export default function Home() {
  const [seniorProfile, setSeniorProfile] = useState<StoredProfile | null>(null);
  const [guardianProfile, setGuardianProfile] = useState<StoredProfile | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const seniorFileRef = useRef<HTMLInputElement | null>(null);
  const guardianFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSeniorProfile(getStoredProfile('senior'));
    setGuardianProfile(getStoredProfile('guardian'));
  }, []);

  const handlePhotoUpload = async (role: 'senior' | 'guardian', file: File) => {
    try {
      const base64 = await compressImage(file, 400, 0.7);
      if (role === 'senior') {
        const updated = saveStoredProfile('senior', { photoUrl: base64 });
        if (updated) setSeniorProfile(updated);
        setUploadMessage('दादाजी का फोटो सफलतापूर्वक अपडेट हो गया! (Senior photo updated)');
      } else {
        const updated = saveStoredProfile('guardian', { photoUrl: base64 });
        if (updated) setGuardianProfile(updated);
        setUploadMessage('केयरगिवर का फोटो अपडेट हो गया! (Guardian photo updated)');
      }
      setTimeout(() => setUploadMessage(null), 3500);
    } catch (err) {
      console.error("Failed to compress profile image:", err);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden">
      {/* Elder-friendly decorative SVG stickers floating softly */}
      <ElderDecorativeBackground />

      {/* Header Badge */}
      <header className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center mt-2 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface text-amber-900 font-extrabold text-sm sm:text-base mb-3 shadow-md">
          <Sparkles className="text-orange-500" size={18} />
          <span>वरिष्ठ नागरिक सुरक्षा साथी • Elder Care & Scam Shield Companion</span>
        </div>

        <h1 className="text-elder-3xl sm:text-elder-4xl font-black tracking-tight text-slate-900 drop-shadow-sm">
          हमसफ़र <span className="text-orange-600">(HUMSAFAR)</span>
        </h1>
        <p className="text-elder-lg text-slate-700 max-w-2xl mt-1 font-bold">
          सुरक्षित, सरल और पारिवारिक डिजिटल साथी — बुजुर्गों के लिए प्यार से निर्मित।
        </p>

        {uploadMessage && (
          <div className="mt-4 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-elder-base shadow-lg animate-bounce flex items-center gap-2">
            <CheckCircle2 size={24} />
            <span>{uploadMessage}</span>
          </div>
        )}
      </header>

      {/* 2 Distinct Glassmorphic Portal Cards */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl my-auto">
        {/* 1. Senior Portal Card */}
        <div className="glass-surface-warm p-8 sm:p-10 rounded-3xl flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.02] group">
          <div className="w-full flex justify-between items-center mb-4">
            <span className="px-3 py-1 rounded-full bg-amber-400/30 text-amber-900 font-extrabold text-sm border border-amber-400/50">
              आसान मोड (Easy Mode)
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-extrabold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              लाइव वॉइस सक्षम
            </span>
          </div>

          {/* Senior Photo & Uploader */}
          <div className="relative my-4">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-amber-500 shadow-2xl bg-amber-100 flex items-center justify-center">
              {seniorProfile?.photoUrl ? (
                <img
                  src={seniorProfile.photoUrl}
                  alt="Senior Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-32 h-32 text-amber-600" />
              )}
            </div>

            {/* Profile Photo Upload Button */}
            <input
              ref={seniorFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload('senior', file);
              }}
            />
            <button
              type="button"
              onClick={() => seniorFileRef.current?.click()}
              className="absolute bottom-1 right-1 p-3 rounded-full bg-slate-900 text-white hover:bg-orange-600 transition-colors shadow-lg border-2 border-white flex items-center justify-center"
              title="Upload Senior Profile Photo (फोटो अपलोड करें)"
            >
              <Camera size={20} />
            </button>
          </div>

          <h2 className="text-elder-2xl sm:text-elder-3xl font-black text-slate-900 mt-2">
            SENIOR PORTAL<br />
            <span className="text-orange-600">(दादा / दादी मोड)</span>
          </h2>

          <p className="text-elder-base text-slate-700 font-bold mt-2 mb-6">
            बड़े अक्षर, बोलकर निर्देश, दवाइयों की याद, और ठगी से तुरंत सुरक्षा।
          </p>

          <div className="grid grid-cols-2 gap-3 w-full my-3 text-left">
            <div className="p-3 rounded-2xl bg-white/70 border border-amber-200 text-slate-800 text-sm font-bold flex items-center gap-2">
              <span className="text-xl">🛡️</span> AI स्कैम शील्ड
            </div>
            <div className="p-3 rounded-2xl bg-white/70 border border-amber-200 text-slate-800 text-sm font-bold flex items-center gap-2">
              <span className="text-xl">💊</span> दवा रिमाइंडर
            </div>
            <div className="p-3 rounded-2xl bg-white/70 border border-amber-200 text-slate-800 text-sm font-bold flex items-center gap-2">
              <span className="text-xl">⚡</span> सुरक्षित बिल पे
            </div>
            <div className="p-3 rounded-2xl bg-white/70 border border-amber-200 text-slate-800 text-sm font-bold flex items-center gap-2">
              <span className="text-xl">🚨</span> 1-टच SOS
            </div>
          </div>

          {/* Action Button */}
          <Link
            href="/senior"
            className="w-full mt-6 py-5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 font-black text-elder-xl shadow-xl hover:shadow-2xl hover:brightness-105 active:scale-95 transition-all text-center flex items-center justify-center gap-3 border-4 border-slate-900"
          >
            <span>ENTER SENIOR MODE (शुरू करें)</span>
            <span>➔</span>
          </Link>
        </div>

        {/* 2. Guardian Portal Card */}
        <div className="glass-surface p-8 sm:p-10 rounded-3xl flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.02] group">
          <div className="w-full flex justify-between items-center mb-4">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-300 font-extrabold text-sm border border-slate-700">
              नियंत्रण कक्ष (Command Center)
            </span>
            <span className="flex items-center gap-1 text-blue-700 font-extrabold text-sm">
              <Shield size={16} />
              सुरक्षा मॉनिटर
            </span>
          </div>

          {/* Guardian Photo & Uploader */}
          <div className="relative my-4">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl bg-slate-100 flex items-center justify-center">
              {guardianProfile?.photoUrl ? (
                <img
                  src={guardianProfile.photoUrl}
                  alt="Guardian Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Shield className="w-28 h-28 text-slate-800" />
              )}
            </div>

            {/* Profile Photo Upload Button */}
            <input
              ref={guardianFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload('guardian', file);
              }}
            />
            <button
              type="button"
              onClick={() => guardianFileRef.current?.click()}
              className="absolute bottom-1 right-1 p-3 rounded-full bg-orange-500 text-white hover:bg-slate-900 transition-colors shadow-lg border-2 border-white flex items-center justify-center"
              title="Upload Caregiver Profile Photo (केयरगिवर फोटो अपलोड करें)"
            >
              <Camera size={20} />
            </button>
          </div>

          <h2 className="text-elder-2xl sm:text-elder-3xl font-black text-slate-900 mt-2">
            GUARDIAN PORTAL<br />
            <span className="text-orange-600">(केयरगिवर मोड)</span>
          </h2>

          <p className="text-elder-base text-slate-700 font-bold mt-2 mb-6">
            लाइव जीपीएस जियोफेंस, संदिग्ध संदेशों का विश्लेषण, और दवाइयों का पूरा ऑडिट।
          </p>

          <div className="grid grid-cols-2 gap-3 w-full my-3 text-left">
            <div className="p-3 rounded-2xl bg-white/70 border border-slate-200 text-slate-800 text-sm font-bold flex items-center gap-2">
              <span className="text-xl">📍</span> लाइव लोकेशन मैप
            </div>
            <div className="p-3 rounded-2xl bg-white/70 border border-slate-200 text-slate-800 text-sm font-bold flex items-center gap-2">
              <span className="text-xl">🛑</span> स्कैम अप्रूवल कतार
            </div>
            <div className="p-3 rounded-2xl bg-white/70 border border-slate-200 text-slate-800 text-sm font-bold flex items-center gap-2">
              <span className="text-xl">📋</span> दवा अनुपालन रिपोर्ट
            </div>
            <div className="p-3 rounded-2xl bg-white/70 border border-slate-200 text-slate-800 text-sm font-bold flex items-center gap-2">
              <span className="text-xl">⚙️</span> सुरक्षा सेटिंग्स
            </div>
          </div>

          {/* Action Button */}
          <Link
            href="/guardian"
            className="w-full mt-6 py-5 px-8 rounded-2xl bg-slate-900 text-white font-black text-elder-xl shadow-xl hover:bg-slate-800 active:scale-95 transition-all text-center flex items-center justify-center gap-3 border-4 border-orange-500"
          >
            <span>OPEN GUARDIAN PORTAL (संरक्षक)</span>
            <span>➔</span>
          </Link>
        </div>
      </div>

      {/* Footer reassurance */}
      <footer className="relative z-10 mt-8 mb-2 flex items-center justify-center gap-2 text-slate-700 font-extrabold text-sm sm:text-base">
        <HeartHandshake className="text-rose-600" size={20} />
        <span>HUMSAFAR • Dedicated to the dignity, safety, and happiness of Indian Elders.</span>
      </footer>
    </main>
  );
}
