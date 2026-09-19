"use client";

import { useState, useRef } from 'react';
import { PhoneCall, Video, UserPlus, Edit3, Trash2, Camera, X, Check, PhoneForwarded } from 'lucide-react';
import { StoredFamilyMember, saveFamilyMember, deleteFamilyMember } from '@/lib/storageEvents';
import { speakPhrase } from '@/lib/speech';
import { LanguageCode } from '@/types';

interface FamilyDialerGridProps {
  members: StoredFamilyMember[];
  onMembersChange: (updated: StoredFamilyMember[]) => void;
  langCode: LanguageCode;
}

export default function FamilyDialerGrid({ members, onMembersChange, langCode }: FamilyDialerGridProps) {
  const [editingMember, setEditingMember] = useState<StoredFamilyMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callingState, setCallingState] = useState<{ member: StoredFamilyMember; type: 'voice' | 'video' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formRelation, setFormRelation] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [formStatus, setFormStatus] = useState<'Available' | 'Busy'>('Available');

  const openAddModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormRelation('बेटा (Son)');
    setFormPhone('+91 ');
    setFormPhoto('');
    setFormStatus('Available');
    setIsModalOpen(true);
  };

  const openEditModal = (member: StoredFamilyMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRelation(member.relation);
    setFormPhone(member.phone);
    setFormPhoto(member.photoUrl || '');
    setFormStatus(member.status);
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setFormPhoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newMember: StoredFamilyMember = {
      id: editingMember ? editingMember.id : `fam-${Date.now()}`,
      name: formName.trim(),
      relation: formRelation.trim() || 'पारिवारिक सदस्य',
      phone: formPhone.trim() || '+91 98765 43210',
      photoUrl: formPhoto,
      status: formStatus,
    };

    const updated = saveFamilyMember(newMember);
    onMembersChange(updated);
    setIsModalOpen(false);
    speakPhrase(`${formName} संपर्क सुरक्षित हो गया`, langCode, `${formName} संपर्क सुरक्षित हो गया`);
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस पारिवारिक संपर्क को हटाना चाहते हैं?')) {
      const updated = deleteFamilyMember(id);
      onMembersChange(updated);
      setIsModalOpen(false);
    }
  };

  const handleCall = (member: StoredFamilyMember, type: 'voice' | 'video') => {
    setCallingState({ member, type });
    const announcement = `${member.name} को कॉल किया जा रहा है`;
    speakPhrase(announcement, langCode, announcement);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top action: Add new contact */}
      <div className="flex justify-end">
        <button
          onClick={openAddModal}
          className="px-6 py-4 rounded-2xl bg-slate-900 text-amber-300 hover:bg-orange-600 hover:text-white transition-all font-black text-elder-base shadow-xl flex items-center gap-3 border-2 border-amber-400 active:scale-95"
        >
          <UserPlus size={26} />
          <span>नया संपर्क जोड़ें (Add Family Member)</span>
        </button>
      </div>

      {/* Grid of Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {members.map((member) => (
          <div
            key={member.id}
            className="glass-surface-card rounded-3xl p-6 sm:p-8 flex flex-col gap-6 items-center text-center relative group hover:border-amber-400 transition-all shadow-xl"
          >
            {/* Status Badge */}
            <div
              className={`absolute top-5 left-5 px-4 py-1.5 rounded-full font-black text-sm sm:text-base border-2 shadow-sm ${
                member.status === 'Available'
                  ? 'bg-emerald-500 text-white border-emerald-700 animate-pulse'
                  : 'bg-slate-400 text-slate-900 border-slate-500'
              }`}
            >
              {member.status === 'Available' ? 'उपलब्ध (Available)' : 'व्यस्त (Busy)'}
            </div>

            {/* Edit Button */}
            <button
              onClick={() => openEditModal(member)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/80 hover:bg-amber-200 border-2 border-slate-300 text-slate-800 shadow transition-colors"
              title="Edit Contact & Photo"
            >
              <Edit3 size={20} />
            </button>

            {/* Circular Avatar / Real Uploaded Photo */}
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl bg-gradient-to-tr from-amber-100 to-orange-100 flex items-center justify-center mt-4">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-5xl">
                  {getInitials(member.name)}
                </div>
              )}
            </div>

            {/* Member Details */}
            <div className="flex flex-col gap-1">
              <h2 className="text-elder-2xl sm:text-elder-3xl font-black text-slate-950">
                {member.name}
              </h2>
              <p className="text-elder-lg font-extrabold text-orange-700 uppercase tracking-wide">
                {member.relation}
              </p>
              <span className="text-elder-base font-bold text-slate-600">
                {member.phone}
              </span>
            </div>

            {/* Calling Buttons */}
            <div className="flex w-full gap-4 mt-2">
              <button
                onClick={() => handleCall(member, 'voice')}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 px-4 rounded-2xl flex items-center justify-center gap-3 min-h-[88px] border-3 border-emerald-700 shadow-lg hover:brightness-110 active:scale-95 transition-all text-elder-xl font-black"
                aria-label={`Voice call ${member.name}`}
              >
                <PhoneCall size={38} />
                <span>फोन (CALL)</span>
              </button>

              <button
                onClick={() => handleCall(member, 'video')}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 py-5 px-4 rounded-2xl flex items-center justify-center gap-3 min-h-[88px] border-3 border-orange-600 shadow-lg hover:brightness-110 active:scale-95 transition-all text-elder-xl font-black"
                aria-label={`Video call ${member.name}`}
              >
                <Video size={38} />
                <span>वीडियो (VIDEO)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Calling Simulation Modal */}
      {callingState && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="glass-surface-warm p-8 sm:p-12 rounded-3xl max-w-lg w-full flex flex-col items-center text-center border-4 border-amber-400 shadow-2xl">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl mb-6 animate-pulse">
              {callingState.member.photoUrl ? (
                <img src={callingState.member.photoUrl} alt="Contact" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-amber-400 flex items-center justify-center text-4xl font-black text-slate-900">
                  {getInitials(callingState.member.name)}
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-elder-base mb-2">
              <PhoneForwarded size={22} className="animate-bounce" />
              <span>घंटी बज रही है (Ringing...)</span>
            </div>

            <h3 className="text-elder-3xl font-black text-slate-950">
              {callingState.member.name}
            </h3>
            <p className="text-elder-lg text-slate-700 font-bold mb-8">
              {callingState.type === 'voice' ? 'ऑडियो कॉल' : 'लाइव वीडियो कॉल'} • {callingState.member.phone}
            </p>

            <button
              onClick={() => setCallingState(null)}
              className="w-full py-5 rounded-2xl bg-red-600 text-white font-black text-elder-xl hover:bg-red-700 shadow-xl border-2 border-white active:scale-95 transition-all"
            >
              कॉल समाप्त करें (End Call)
            </button>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="glass-surface-warm p-6 sm:p-8 rounded-3xl max-w-xl w-full border-4 border-amber-400 shadow-2xl my-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-elder-2xl font-black text-slate-950">
                {editingMember ? 'पारिवारिक संपर्क बदलें' : 'नया परिवार संपर्क'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-white text-slate-900 border border-slate-300 hover:bg-red-50"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              {/* Photo Preview & Uploader */}
              <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/70 border-2 border-amber-200">
                <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-amber-500 bg-amber-100 flex items-center justify-center flex-shrink-0 shadow">
                  {formPhoto ? (
                    <img src={formPhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-500 font-bold text-sm text-center px-2">No Photo</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-elder-base font-extrabold text-slate-900">
                    गैलरी से फोटो चुनें (Real Photo)
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
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-orange-600 font-bold text-sm flex items-center gap-2 w-fit shadow"
                  >
                    <Camera size={18} />
                    <span>फोटो अपलोड करें (Choose File)</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                  नाम (Full Name)
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="उदा. रमेश (बेटा)"
                  className="w-full p-4 rounded-xl border-3 border-slate-300 text-elder-lg font-bold focus:border-amber-500 outline-none bg-white"
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                  रिश्ता (Relationship)
                </label>
                <input
                  type="text"
                  value={formRelation}
                  onChange={(e) => setFormRelation(e.target.value)}
                  placeholder="उदा. बेटा (Son), बेटी (Daughter), पोता, डॉक्टर"
                  className="w-full p-4 rounded-xl border-3 border-slate-300 text-elder-lg font-bold focus:border-amber-500 outline-none bg-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                  फ़ोन नंबर (Phone Number)
                </label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-4 rounded-xl border-3 border-slate-300 text-elder-lg font-bold focus:border-amber-500 outline-none bg-white"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-elder-base font-extrabold text-slate-900 mb-1">
                  उपलब्धता (Live Status)
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'Available' | 'Busy')}
                  className="w-full p-4 rounded-xl border-3 border-slate-300 text-elder-lg font-bold focus:border-amber-500 outline-none bg-white cursor-pointer"
                >
                  <option value="Available">उपलब्ध (Available / Free to talk)</option>
                  <option value="Busy">व्यस्त (Busy at work)</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-elder-xl shadow-lg hover:brightness-105 border-2 border-slate-900 flex items-center justify-center gap-2"
                >
                  <Check size={26} />
                  <span>सुरक्षित करें (Save Contact)</span>
                </button>

                {editingMember && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingMember.id)}
                    className="p-4 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 font-black flex items-center justify-center border-2 border-red-300"
                    title="Delete Contact"
                  >
                    <Trash2 size={26} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
