"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Sparkles, CheckCircle2, Clock, Camera, X } from 'lucide-react';
import ElderHeader from '@/components/common/ElderHeader';
import EmergencySOS from '@/components/common/EmergencySOS';
import ElderDecorativeBackground from '@/components/common/ElderDecorativeBackground';
import MedicationCard from '@/components/senior/MedicationCard';
import { LanguageCode } from '@/types';
import {
  getStoredMedications,
  toggleMedicationTaken,
  addMedication,
  StoredMedication,
} from '@/lib/storageEvents';
import { speakPhrase } from '@/lib/speech';

export default function MedicationsPage() {
  const [lang, setLang] = useState<LanguageCode>('hi-IN');
  const [audio, setAudio] = useState(true);
  const [medications, setMedications] = useState<StoredMedication[]>([]);
  const [activeSlot, setActiveSlot] = useState<'All' | 'Morning' | 'Afternoon' | 'Evening' | 'Night'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formHindiName, setFormHindiName] = useState('');
  const [formDosage, setFormDosage] = useState('1 Tablet');
  const [formSlot, setFormSlot] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');
  const [formTime, setFormTime] = useState('08:00 AM');
  const [formInstructions, setFormInstructions] = useState('Take with warm water after food');
  const [formColor, setFormColor] = useState('#F97316');
  const [formPhoto, setFormPhoto] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMedications(getStoredMedications());
    const listener = (e: any) => {
      if (e.detail) setMedications(e.detail);
    };
    window.addEventListener('humsafar_medications_change', listener);
    return () => window.removeEventListener('humsafar_medications_change', listener);
  }, []);

  const handleToggle = (id: string) => {
    const updated = toggleMedicationTaken(id);
    setMedications(updated);
  };

  const handleUpdatePhoto = (id: string, photoUrl: string) => {
    const current = getStoredMedications();
    const updated = current.map((m) => (m.id === id ? { ...m, photoUrl } : m));
    localStorage.setItem('humsafar_medications', JSON.stringify(updated));
    setMedications(updated);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormPhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const updated = addMedication({
      name: formName.trim(),
      hindiName: formHindiName.trim() || undefined,
      dosage: formDosage.trim(),
      timeSlot: formSlot,
      time: formTime.trim(),
      instructions: formInstructions.trim(),
      color: formColor,
      photoUrl: formPhoto || undefined,
    });

    setMedications(updated);
    setIsAddModalOpen(false);
    speakPhrase(`${formName} दवा सूची में जोड़ी गई`, lang, `${formName} दवा सूची में जोड़ी गई`);

    // Reset Form
    setFormName('');
    setFormHindiName('');
    setFormPhoto('');
  };

  const filteredMeds =
    activeSlot === 'All'
      ? medications
      : medications.filter((m) => m.timeSlot === activeSlot);

  const takenCount = medications.filter((m) => m.taken).length;
  const totalCount = medications.length;
  const progressPercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <ElderDecorativeBackground />

      <ElderHeader 
        title="MEDICINES (दवाइयां)" 
        langCode={lang} 
        onLanguageChange={setLang}
        audioEnabled={audio}
        onToggleAudio={() => setAudio(!audio)}
      />
      
      <main className="relative z-10 flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full mb-24">
        {/* Navigation & Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link 
            href="/senior" 
            className="inline-flex items-center gap-3 glass-surface p-4 rounded-2xl border-3 border-amber-400 text-elder-xl font-black text-slate-900 shadow hover:bg-amber-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={34} className="text-orange-600" />
            <span>वापस (BACK)</span>
          </Link>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-4 rounded-2xl bg-slate-900 text-amber-300 hover:bg-orange-600 hover:text-white transition-all font-black text-elder-base shadow-xl flex items-center gap-3 border-2 border-amber-400 active:scale-95"
          >
            <PlusCircle size={28} />
            <span>दवा जोड़ें (Add Medicine)</span>
          </button>
        </div>

        {/* Daily Progress Tracker */}
        <div className="glass-surface-warm p-6 rounded-3xl border-3 border-amber-300 shadow-xl mb-6 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={32} className="text-emerald-600" />
              <span className="text-elder-xl font-black text-slate-950">
                आज का हिसाब: {takenCount} / {totalCount} दवाइयां ली गईं
              </span>
            </div>
            <span className="text-elder-xl font-black text-orange-600">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-5 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-300">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Time Slot Filter Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          {(['All', 'Morning', 'Afternoon', 'Evening', 'Night'] as const).map((slot) => (
            <button
              key={slot}
              onClick={() => setActiveSlot(slot)}
              className={`px-5 py-3 rounded-2xl font-black text-elder-base transition-all border-2 shadow-sm ${
                activeSlot === slot
                  ? 'bg-slate-900 text-amber-300 border-slate-950 shadow-md scale-105'
                  : 'glass-surface text-slate-800 border-slate-300 hover:bg-amber-50'
              }`}
            >
              {slot === 'All' ? 'सभी (All)' : slot}
            </button>
          ))}
        </div>

        {/* Medications List */}
        <div className="flex flex-col gap-6">
          {filteredMeds.map((med) => (
            <MedicationCard 
              key={med.id} 
              medication={med} 
              langCode={lang} 
              onToggleTake={handleToggle}
              onUpdatePhoto={handleUpdatePhoto}
              audioEnabled={audio}
            />
          ))}

          {filteredMeds.length === 0 && (
            <div className="glass-surface p-12 rounded-3xl text-center border-2 border-dashed border-amber-300">
              <p className="text-elder-xl font-bold text-slate-700">
                इस समय के लिए कोई दवा शेड्यूल नहीं है।
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add New Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="glass-surface-warm p-6 sm:p-8 rounded-3xl max-w-xl w-full border-4 border-amber-400 shadow-2xl my-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-elder-2xl font-black text-slate-950">
                नई दवा जोड़ें (Add Medicine)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full bg-white text-slate-900 border border-slate-300 hover:bg-red-50"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              {/* Packaging Photo Upload */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 border-2 border-amber-200">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-500 bg-amber-100 flex items-center justify-center flex-shrink-0 shadow">
                  {formPhoto ? (
                    <img src={formPhoto} alt="Packaging" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={32} className="text-amber-700" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-extrabold text-slate-900">
                    दवा के पैकेट का फोटो (Packaging Photo)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-orange-600 font-bold text-xs flex items-center gap-2 w-fit shadow"
                  >
                    <Camera size={14} />
                    <span>फोटो खींचें / चुनें</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                  दवा का नाम (Medicine Name)
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="उदा. Amlodipine 5mg"
                  className="w-full p-4 rounded-xl border-3 border-slate-300 text-elder-lg font-bold focus:border-amber-500 outline-none bg-white"
                />
              </div>

              {/* Hindi Name */}
              <div>
                <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                  सरल विवरण (Hindi Name / Purpose)
                </label>
                <input
                  type="text"
                  value={formHindiName}
                  onChange={(e) => setFormHindiName(e.target.value)}
                  placeholder="उदा. ब्लड प्रेशर की गोली (BP Tablet)"
                  className="w-full p-4 rounded-xl border-3 border-slate-300 text-elder-lg font-bold focus:border-amber-500 outline-none bg-white"
                />
              </div>

              {/* Dosage & Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                    खुराक (Dosage)
                  </label>
                  <input
                    type="text"
                    required
                    value={formDosage}
                    onChange={(e) => setFormDosage(e.target.value)}
                    placeholder="उदा. 1 Tablet"
                    className="w-full p-3.5 rounded-xl border-3 border-slate-300 text-elder-base font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                    समय स्लॉट (Time Slot)
                  </label>
                  <select
                    value={formSlot}
                    onChange={(e) => setFormSlot(e.target.value as any)}
                    className="w-full p-3.5 rounded-xl border-3 border-slate-300 text-elder-base font-bold bg-white"
                  >
                    <option value="Morning">Morning (सुबह)</option>
                    <option value="Afternoon">Afternoon (दोपहर)</option>
                    <option value="Evening">Evening (शाम)</option>
                    <option value="Night">Night (रात)</option>
                  </select>
                </div>
              </div>

              {/* Exact Time & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                    समय (Scheduled Time)
                  </label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full p-3.5 rounded-xl border-3 border-slate-300 text-elder-base font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                    रंग कोड (Pill Color)
                  </label>
                  <select
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full p-3.5 rounded-xl border-3 border-slate-300 text-elder-base font-bold bg-white"
                  >
                    <option value="#3B82F6">नीला (Blue)</option>
                    <option value="#F97316">नारंगी (Orange)</option>
                    <option value="#EF4444">लाल (Red)</option>
                    <option value="#10B981">हरा (Green)</option>
                    <option value="#06B6D4">सियान / आई ड्रॉप (Cyan)</option>
                    <option value="#EAB308">पीला (Yellow)</option>
                  </select>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                  दवा लेने के निर्देश (Instructions)
                </label>
                <input
                  type="text"
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="उदा. नाश्ते के बाद गर्म पानी से लें"
                  className="w-full p-3.5 rounded-xl border-3 border-slate-300 text-elder-base font-bold bg-white"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-elder-xl shadow-lg hover:brightness-105 border-2 border-slate-900"
              >
                सुरक्षित करें (Save Prescription)
              </button>
            </form>
          </div>
        </div>
      )}

      <EmergencySOS langCode={lang} />
    </div>
  );
}
