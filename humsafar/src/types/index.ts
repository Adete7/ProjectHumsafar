export type LanguageCode = 'en-IN' | 'hi-IN' | 'ta-IN' | 'te-IN' | 'bn-IN' | 'mr-IN' | 'gu-IN';

export interface SeniorUser {
  id: string;
  name: string;
  preferredLanguage: LanguageCode;
  emergencyContactId: string;
  safeZoneCenterLat: number;
  safeZoneCenterLng: number;
  safeZoneRadiusMeters: number;
}

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  seniorId: string;
}

export interface Pill {
  id: string;
  name: string;
  color: string;
  time: string;
  taken: boolean;
  takenAt?: string;
  missedAlertSent?: boolean;
}

export interface Bill {
  id: string;
  billerName: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  isDuplicate: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  photoUrl: string;
  status: 'Available' | 'Busy';
  phone: string;
}

export interface ScamAlert {
  id: string;
  content: string;
  isScam: boolean;
  riskLevel: 'CRITICAL' | 'MODERATE' | 'SAFE';
  elderExplanation: string;
  guardianSummary: string;
  suggestedAction: 'BLOCK_AND_REPORT' | 'SAFE_TO_OPEN';
  timestamp: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'BLOCKED';
}

export interface GeofenceZone {
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
}
