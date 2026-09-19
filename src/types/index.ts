export type LanguageCode =
  | "hi-IN"
  | "en-IN"
  | "ta-IN"
  | "te-IN"
  | "bn-IN"
  | "mr-IN"
  | "gu-IN";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  greeting: string;
}

export interface SeniorUser {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  primaryLanguage: LanguageCode;
  emergencyPhone: string;
  spendLimitCap: number; // default ₹3000
  homeAddress: string;
  homeCoordinates: {
    lat: number;
    lng: number;
  };
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  notifyViaWhatsApp: boolean;
  notifyViaSMS: boolean;
}

export type PillTimeSlot = "morning" | "afternoon" | "evening" | "night";

export interface Pill {
  id: string;
  name: string;
  hindiName?: string;
  dosage: string;
  unit: string;
  timeSlot: PillTimeSlot;
  scheduledTime: string; // e.g. "08:30 AM"
  colorHex: string;
  shape: "capsule" | "round" | "tablet" | "drop";
  taken: boolean;
  takenAt?: string;
  instruction: string;
  escalatedToGuardian: boolean;
  isOverdue: boolean;
}

export type BillCategory = "electricity" | "water" | "gas" | "phone" | "medical";

export interface Bill {
  id: string;
  title: string;
  provider: string;
  billNumber: string;
  category: BillCategory;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "flagged";
  requiresGuardianApproval: boolean;
  paidAt?: string;
  transactionRef?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  relationHindi: string;
  avatarUrl: string;
  phone: string;
  status: "available" | "busy" | "offline";
  lastContacted?: string;
}

export type ScamRiskLevel = "CRITICAL" | "MODERATE" | "SAFE";

export interface ScamAnalysisResult {
  isScam: boolean;
  riskLevel: ScamRiskLevel;
  elderExplanation: string;
  guardianSummary: string;
  suggestedAction: "BLOCK_AND_REPORT" | "SAFE_TO_OPEN" | "MANUAL_REVIEW";
  detectedTriggers?: string[];
}

export interface ScamAlertItem extends ScamAnalysisResult {
  id: string;
  sender: string;
  channel: "SMS" | "WhatsApp" | "Call" | "Payment";
  rawContent: string;
  receivedAt: string;
  status: "pending_review" | "approved_safe" | "blocked";
  reviewedByGuardianAt?: string;
}

export interface GeofenceZone {
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  address: string;
  label: string;
}

export interface LocationPing {
  lat: number;
  lng: number;
  timestamp: string;
  distanceKm: number;
  isInsideSafeZone: boolean;
  batteryPercent: number;
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed";
  address: string;
  phone: string;
  tokenNumber: string;
  syncedToGuardian: boolean;
}

export interface GuardianNotification {
  id: string;
  type: "SOS" | "GEOFENCE_BREACH" | "MISSED_PILL" | "HIGH_BILL" | "SCAM_FLAG";
  title: string;
  message: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  resolved: boolean;
}
