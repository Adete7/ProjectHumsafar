/**
 * Cross-component and cross-tab real-time event bus & persistence utility
 * Coordinates real-time state between Senior Mode and Guardian Portal
 */

export interface SOSAlertPayload {
  active: boolean;
  seniorName: string;
  lat: number;
  lng: number;
  timestamp: string;
  batteryPercent?: number;
  address?: string;
}

export interface SharedScamAlert {
  id: string;
  content: string;
  isScam: boolean;
  riskLevel: 'CRITICAL' | 'MODERATE' | 'SAFE';
  elderExplanation: string;
  guardianSummary: string;
  suggestedAction: 'BLOCK_AND_REPORT' | 'SAFE_TO_OPEN';
  timestamp: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'BLOCKED';
  seniorName?: string;
  source?: string;
}

export interface StoredProfile {
  name: string;
  role: 'senior' | 'guardian';
  photoUrl: string; // Base64 data URL
  updatedAt: string;
  emergencyPhone?: string;
  relationship?: string;
}

export interface StoredFamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  photoUrl: string;
  status: 'Available' | 'Busy';
}

export interface StoredMedication {
  id: string;
  name: string;
  hindiName?: string;
  dosage: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  time: string;
  instructions: string;
  color: string;
  photoUrl?: string;
  taken: boolean;
  takenAt?: string;
  missedAlertSent?: boolean;
}

const KEYS = {
  SOS: 'humsafar_active_sos',
  SCAMS: 'humsafar_scam_alerts',
  SENIOR_PROFILE: 'humsafar_senior_profile',
  GUARDIAN_PROFILE: 'humsafar_guardian_profile',
  FAMILY: 'humsafar_family_contacts',
  MEDICATIONS: 'humsafar_medications',
  GUARDIAN_SETTINGS: 'humsafar_guardian_settings',
};

// Dispatch local and cross-tab events
function emitEvent(eventName: string, detail: any) {
  if (typeof window === 'undefined') return;
  // Dispatch for same window
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

// ----------------------------------------------------
// 1. SOS Management
// ----------------------------------------------------
export function triggerLiveSOS(payload: Partial<SOSAlertPayload> = {}): SOSAlertPayload {
  if (typeof window === 'undefined') return {} as SOSAlertPayload;

  const fullPayload: SOSAlertPayload = {
    active: true,
    seniorName: 'Dada-ji (Ramesh Kumar)',
    lat: payload.lat || 28.6139,
    lng: payload.lng || 77.2090,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    batteryPercent: 88,
    address: 'Gulmohar Park, New Delhi',
    ...payload,
  };

  localStorage.setItem(KEYS.SOS, JSON.stringify(fullPayload));
  emitEvent('humsafar_sos_change', fullPayload);
  return fullPayload;
}

export function cancelLiveSOS() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.SOS);
  emitEvent('humsafar_sos_change', null);
}

export function getActiveSOS(): SOSAlertPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.SOS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ----------------------------------------------------
// 2. Scam Alerts Queue (Senior -> Guardian)
// ----------------------------------------------------
export const DEFAULT_SCAM_USE_CASES: SharedScamAlert[] = [
  {
    id: 'scam-preset-1',
    content: 'प्रिय उपभोक्ता, आपके बिजली बिल का भुगतान न होने के कारण आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत इस नंबर पर संपर्क करें: +91-9876543210 (Electricity Dept)',
    isScam: true,
    riskLevel: 'CRITICAL',
    elderExplanation: 'सावधान! यह बिजली काटने का फर्जी संदेश है। किसी अनजान नंबर पर कॉल न करें।',
    guardianSummary: 'Extortion via fake immediate power disconnection. Malicious phone number harvesting personal UPI credentials.',
    suggestedAction: 'BLOCK_AND_REPORT',
    timestamp: '10:15 AM Today',
    status: 'PENDING_REVIEW',
    seniorName: 'Dada-ji',
    source: 'SMS Alert',
  },
  {
    id: 'scam-preset-2',
    content: 'SBI YONO Alert: Your savings account has been frozen due to pending PAN/Aadhaar re-KYC. Click http://bit.ly/sbi-pan-kyc-reactivate immediately to unlock.',
    isScam: true,
    riskLevel: 'CRITICAL',
    elderExplanation: 'खतरा! बैंक कभी ऐसा लिंक नहीं भेजता। यह खाता खाली करने की ठगी है।',
    guardianSummary: 'Phishing domain impersonating SBI YONO. Attempts to capture net banking credentials and OTP tokens.',
    suggestedAction: 'BLOCK_AND_REPORT',
    timestamp: 'Yesterday 4:45 PM',
    status: 'PENDING_REVIEW',
    seniorName: 'Dada-ji',
    source: 'WhatsApp',
  },
  {
    id: 'scam-preset-3',
    content: 'Congratulations! You won PM Senior Citizen Welfare Lottery grant ₹2,50,000. Transfer ₹1,499 processing stamp duty to upi:lottery77@paytm to claim.',
    isScam: true,
    riskLevel: 'CRITICAL',
    elderExplanation: 'यह लॉटरी फर्जी है। कोई भी सरकारी योजना पहले पैसे नहीं मांगती।',
    guardianSummary: 'Advance-fee fraud impersonating national welfare schemes. Demands upfront non-refundable UPI fee.',
    suggestedAction: 'BLOCK_AND_REPORT',
    timestamp: '2 Days Ago',
    status: 'PENDING_REVIEW',
    seniorName: 'Dada-ji',
    source: 'SMS Alert',
  },
];

export function getSharedScamAlerts(): SharedScamAlert[] {
  if (typeof window === 'undefined') return DEFAULT_SCAM_USE_CASES;
  try {
    const raw = localStorage.getItem(KEYS.SCAMS);
    if (!raw) {
      localStorage.setItem(KEYS.SCAMS, JSON.stringify(DEFAULT_SCAM_USE_CASES));
      return DEFAULT_SCAM_USE_CASES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SCAM_USE_CASES;
  }
}

export function addScamAlertToQueue(alert: Omit<SharedScamAlert, 'id' | 'timestamp' | 'status'>): SharedScamAlert {
  const current = getSharedScamAlerts();
  const newEntry: SharedScamAlert = {
    id: `scam-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'PENDING_REVIEW',
    ...alert,
  };
  const updated = [newEntry, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.SCAMS, JSON.stringify(updated));
    emitEvent('humsafar_scams_change', updated);
  }
  return newEntry;
}

export function updateScamAlertStatus(id: string, status: 'APPROVED' | 'BLOCKED'): SharedScamAlert[] {
  const current = getSharedScamAlerts();
  const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.SCAMS, JSON.stringify(updated));
    emitEvent('humsafar_scams_change', updated);
  }
  return updated;
}

// ----------------------------------------------------
// 3. User Profile & Local Photo Storage
// ----------------------------------------------------
export function getStoredProfile(role: 'senior' | 'guardian'): StoredProfile {
  const key = role === 'senior' ? KEYS.SENIOR_PROFILE : KEYS.GUARDIAN_PROFILE;
  const fallback: StoredProfile = {
    name: role === 'senior' ? 'Ramesh Kumar (दादाजी)' : 'Priya Sharma (Guardian)',
    role,
    photoUrl: '',
    updatedAt: new Date().toISOString(),
    relationship: role === 'senior' ? 'Head of Family' : 'Daughter',
    emergencyPhone: '+91 98765 43210',
  };

  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredProfile(role: 'senior' | 'guardian', profile: Partial<StoredProfile>) {
  if (typeof window === 'undefined') return;
  const key = role === 'senior' ? KEYS.SENIOR_PROFILE : KEYS.GUARDIAN_PROFILE;
  const existing = getStoredProfile(role);
  const merged = { ...existing, ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(merged));
  emitEvent('humsafar_profile_change', { role, profile: merged });
  return merged;
}

// ----------------------------------------------------
// 4. Family Contacts with Photo Uploads
// ----------------------------------------------------
export const DEFAULT_FAMILY_MEMBERS: StoredFamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Ramesh (Son)',
    relation: 'बेटा (Son)',
    phone: '+91 98765 43210',
    photoUrl: '',
    status: 'Available',
  },
  {
    id: 'fam-2',
    name: 'Priya (Daughter)',
    relation: 'बेटी (Daughter)',
    phone: '+91 98111 22334',
    photoUrl: '',
    status: 'Available',
  },
  {
    id: 'fam-3',
    name: 'Rahul (Grandson)',
    relation: 'पोता (Grandson)',
    phone: '+91 98222 33445',
    photoUrl: '',
    status: 'Busy',
  },
  {
    id: 'fam-4',
    name: 'Dr. Verma (Doctor)',
    relation: 'पारिवारिक डॉक्टर',
    phone: '+91 98333 44556',
    photoUrl: '',
    status: 'Available',
  },
];

export function getStoredFamilyMembers(): StoredFamilyMember[] {
  if (typeof window === 'undefined') return DEFAULT_FAMILY_MEMBERS;
  try {
    const raw = localStorage.getItem(KEYS.FAMILY);
    if (!raw) {
      localStorage.setItem(KEYS.FAMILY, JSON.stringify(DEFAULT_FAMILY_MEMBERS));
      return DEFAULT_FAMILY_MEMBERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FAMILY_MEMBERS;
  }
}

export function saveFamilyMember(member: StoredFamilyMember) {
  const current = getStoredFamilyMembers();
  const index = current.findIndex((m) => m.id === member.id);
  let updated: StoredFamilyMember[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = member;
  } else {
    updated = [member, ...current];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.FAMILY, JSON.stringify(updated));
    emitEvent('humsafar_family_change', updated);
  }
  return updated;
}

export function deleteFamilyMember(id: string) {
  const current = getStoredFamilyMembers();
  const updated = current.filter((m) => m.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.FAMILY, JSON.stringify(updated));
    emitEvent('humsafar_family_change', updated);
  }
  return updated;
}

// ----------------------------------------------------
// 5. Medication Schedule (5+ Prescriptions)
// ----------------------------------------------------
export const DEFAULT_MEDICATIONS: StoredMedication[] = [
  {
    id: 'med-1',
    name: 'Telmisartan 40mg',
    hindiName: 'रक्तचाप की दवा (BP Tablet)',
    dosage: '1 Tablet',
    timeSlot: 'Morning',
    time: '08:00 AM',
    instructions: 'Take with warm water after morning tea / breakfast',
    color: '#3B82F6', // Blue
    taken: true,
    takenAt: '08:15 AM',
  },
  {
    id: 'med-2',
    name: 'Metformin 500mg',
    hindiName: 'शुगर की कैप्सूल (Diabetes Capsule)',
    dosage: '1 Capsule',
    timeSlot: 'Afternoon',
    time: '01:00 PM',
    instructions: 'Take 10 minutes before afternoon lunch',
    color: '#F97316', // Orange
    taken: false,
  },
  {
    id: 'med-3',
    name: 'Lubricant Eye Drops',
    hindiName: 'आंख की बूंदें (Moisturizing Drops)',
    dosage: '2 Drops in each eye',
    timeSlot: 'Afternoon',
    time: '03:30 PM',
    instructions: 'Rest eyes for 5 minutes after administering',
    color: '#06B6D4', // Cyan
    taken: false,
  },
  {
    id: 'med-4',
    name: 'Calcium & Vitamin D3',
    hindiName: 'हड्डी व जोड़ों की गोली (Joint Calcium)',
    dosage: '1 Tablet',
    timeSlot: 'Evening',
    time: '06:30 PM',
    instructions: 'Take with evening milk or snack',
    color: '#10B981', // Green
    taken: false,
  },
  {
    id: 'med-5',
    name: 'Ecosprin 75mg (Blood Thinner)',
    hindiName: 'हार्ट व रक्त पतला करने की दवा',
    dosage: '1 Tablet',
    timeSlot: 'Night',
    time: '09:00 PM',
    instructions: 'Take strictly after dinner before going to bed',
    color: '#EF4444', // Red
    taken: false,
  },
];

export function getStoredMedications(): StoredMedication[] {
  if (typeof window === 'undefined') return DEFAULT_MEDICATIONS;
  try {
    const raw = localStorage.getItem(KEYS.MEDICATIONS);
    if (!raw) {
      localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(DEFAULT_MEDICATIONS));
      return DEFAULT_MEDICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MEDICATIONS;
  }
}

export function toggleMedicationTaken(id: string): StoredMedication[] {
  const current = getStoredMedications();
  const updated = current.map((med) => {
    if (med.id === id) {
      const newTaken = !med.taken;
      return {
        ...med,
        taken: newTaken,
        takenAt: newTaken
          ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : undefined,
      };
    }
    return med;
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(updated));
    emitEvent('humsafar_medications_change', updated);
  }
  return updated;
}

export function addMedication(med: Omit<StoredMedication, 'id' | 'taken'>): StoredMedication[] {
  const current = getStoredMedications();
  const newMed: StoredMedication = {
    id: `med-${Date.now()}`,
    taken: false,
    ...med,
  };
  const updated = [...current, newMed];
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(updated));
    emitEvent('humsafar_medications_change', updated);
  }
  return updated;
}

// ----------------------------------------------------
// 6. Guardian Settings & Notification Preferences
// ----------------------------------------------------
export interface GuardianSettings {
  whatsappAlerts: boolean;
  smsAlerts: boolean;
  geofenceRadiusKm: number;
  seniorSpendCap: number;
  pairedDeviceName: string;
  guardianPhone: string;
  guardianEmail: string;
}

export const DEFAULT_GUARDIAN_SETTINGS: GuardianSettings = {
  whatsappAlerts: true,
  smsAlerts: true,
  geofenceRadiusKm: 2.0,
  seniorSpendCap: 3000,
  pairedDeviceName: "Dada-ji's Samsung Galaxy A14",
  guardianPhone: "+91 98111 22334",
  guardianEmail: "priya.sharma@care.humsafar.org",
};

export function getGuardianSettings(): GuardianSettings {
  if (typeof window === 'undefined') return DEFAULT_GUARDIAN_SETTINGS;
  try {
    const raw = localStorage.getItem(KEYS.GUARDIAN_SETTINGS);
    return raw ? { ...DEFAULT_GUARDIAN_SETTINGS, ...JSON.parse(raw) } : DEFAULT_GUARDIAN_SETTINGS;
  } catch {
    return DEFAULT_GUARDIAN_SETTINGS;
  }
}

export function saveGuardianSettings(settings: Partial<GuardianSettings>) {
  if (typeof window === 'undefined') return;
  const current = getGuardianSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(KEYS.GUARDIAN_SETTINGS, JSON.stringify(updated));
  emitEvent('humsafar_guardian_settings_change', updated);
  return updated;
}
