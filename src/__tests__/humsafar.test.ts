import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateDistance, calculateHaversineDistanceKm, isWithinSafeZone } from '../lib/geofence';
import { analyzeScam, analyzeScamWithHeuristics, clearScamCache, getScamCacheStats } from '../lib/gemini';
import {
  triggerLiveSOS,
  cancelLiveSOS,
  getActiveSOS,
  getSharedScamAlerts,
  updateScamAlertStatus,
  getStoredMedications,
  toggleMedicationTaken,
  getStoredFamilyMembers,
  saveFamilyMember,
} from '../lib/storageEvents';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { LANG_BCP47_MAP } from '../lib/speech';

// Mock Gemini API
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: JSON.stringify({
          isScam: true,
          riskLevel: "CRITICAL",
          elderExplanation: "This is a dangerous scam.",
          guardianSummary: "Fraudulent extortion message.",
          suggestedAction: "BLOCK_AND_REPORT"
        })
      })
    }
  }))
}));

describe('Geofencing & Haversine Module', () => {
  it('calculates distance correctly in meters and kilometers', () => {
    const distMeters = calculateDistance(28.7041, 77.1025, 19.0760, 72.8777);
    expect(distMeters).toBeGreaterThan(1000000);
    expect(distMeters).toBeLessThan(1200000);

    const distKm = calculateHaversineDistanceKm(28.7041, 77.1025, 19.0760, 72.8777);
    expect(distKm).toBeGreaterThan(1000);
    expect(distKm).toBeLessThan(1200);
  });

  it('evaluates safe-zone boundary accurately', () => {
    expect(isWithinSafeZone(28.6139, 77.2090, 28.6139, 77.2090, 2000)).toBe(true);
    expect(isWithinSafeZone(28.7041, 77.1025, 28.6139, 77.2090, 2000)).toBe(false);
  });
});

describe('AI Scam Shield & Heuristics Fallback Engine', () => {
  it('detects electricity disconnection extortion pattern', () => {
    const res = analyzeScamWithHeuristics(
      'Your electricity power will be disconnected tonight at 9:30 PM due to bill unpaid. Call 9876543210',
      'hi-IN'
    );
    expect(res.isScam).toBe(true);
    expect(res.riskLevel).toBe('CRITICAL');
    expect(res.suggestedAction).toBe('BLOCK_AND_REPORT');
    expect(res.elderExplanation).toContain('सावधान');
  });

  it('detects fraudulent bank account / KYC suspension message', () => {
    const res = analyzeScamWithHeuristics(
      'SBI YONO Alert: Your account is blocked due to pending PAN KYC. Share OTP to unlock',
      'en-IN'
    );
    expect(res.isScam).toBe(true);
    expect(res.riskLevel).toBe('CRITICAL');
  });

  it('detects unsolicited lottery scam', () => {
    const res = analyzeScamWithHeuristics(
      'Congratulations! You won 25 lakh lottery from KBC. Pay processing charge',
      'hi-IN'
    );
    expect(res.isScam).toBe(true);
    expect(res.riskLevel).toBe('CRITICAL');
  });

  it('marks legitimate family messages as SAFE', () => {
    const res = analyzeScamWithHeuristics(
      'Namaste Dadaji, reaching home in 30 minutes with fresh fruits.',
      'en-IN'
    );
    expect(res.isScam).toBe(false);
    expect(res.riskLevel).toBe('SAFE');
    expect(res.suggestedAction).toBe('SAFE_TO_OPEN');
  });
});

describe('In-Memory Response Caching (Efficiency & Performance)', () => {
  beforeEach(() => {
    clearScamCache();
  });

  it('stores evaluations and returns identical reports from cache with zero token cost', async () => {
    const testMessage = 'Your power will disconnect tonight. Call 9999999999';
    
    // First evaluation
    const firstReport = await analyzeScam(testMessage, 'hi-IN');
    expect(firstReport.isScam).toBe(true);
    expect(firstReport.fromCache).toBeFalsy();

    // Second evaluation with identical text should be served from in-memory cache
    const secondReport = await analyzeScam(testMessage, 'hi-IN');
    expect(secondReport.isScam).toBe(true);
    expect(secondReport.fromCache).toBe(true);

    const stats = getScamCacheStats();
    expect(stats.size).toBeGreaterThanOrEqual(1);
    expect(stats.ttlHours).toBe(24);
  });
});

describe('Reactive Multilingual Engine & Regional Voice Mapping', () => {
  it('defines required UI strings across all 7 regional languages', () => {
    const requiredKeys = [
      'APP_NAME',
      'MEDICINES',
      'PAY_BILLS',
      'CALL_FAMILY',
      'CHECK_SCAM',
      'SOS',
      'BACK',
      'AVAILABLE',
      'BUSY',
      'TAKEN',
      'SAFE'
    ];

    LANGUAGE_OPTIONS.forEach((opt) => {
      const dict = TRANSLATIONS[opt.code];
      expect(dict).toBeDefined();
      requiredKeys.forEach((key) => {
        expect(dict[key], `Missing translation key "${key}" for language "${opt.code}"`).toBeDefined();
        expect(dict[key].length).toBeGreaterThan(0);
      });
    });
  });

  it('maps all language options to valid Indian regional BCP-47 dialect tags', () => {
    LANGUAGE_OPTIONS.forEach((opt) => {
      const mapped = LANG_BCP47_MAP[opt.code];
      expect(mapped).toBeDefined();
      expect(mapped).toMatch(/^[a-z]{2}-IN$/);
    });
  });
});

describe('Cross-Portal Real-time Synchronization & Storage Bus', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('handles emergency SOS broadcast and cancelation', () => {
    const alert = triggerLiveSOS({ lat: 28.6139, lng: 77.2090 });
    expect(alert.active).toBe(true);
    expect(alert.lat).toBe(28.6139);

    const active = getActiveSOS();
    expect(active?.active).toBe(true);

    cancelLiveSOS();
    expect(getActiveSOS()).toBeNull();
  });

  it('manages scam alerts review queue', () => {
    const alerts = getSharedScamAlerts();
    expect(alerts.length).toBeGreaterThanOrEqual(3);

    const updated = updateScamAlertStatus(alerts[0].id, 'BLOCKED');
    const blockedItem = updated.find(a => a.id === alerts[0].id);
    expect(blockedItem?.status).toBe('BLOCKED');
  });

  it('tracks medication schedules and toggles compliance', () => {
    const meds = getStoredMedications();
    expect(meds.length).toBeGreaterThanOrEqual(5);

    const firstMed = meds[0];
    const initialStatus = firstMed.taken;
    const updated = toggleMedicationTaken(firstMed.id);
    const toggled = updated.find(m => m.id === firstMed.id);
    expect(toggled?.taken).toBe(!initialStatus);
  });

  it('persists family contacts list', () => {
    const members = getStoredFamilyMembers();
    expect(members.length).toBeGreaterThanOrEqual(4);

    const newContact = {
      id: 'test-fam',
      name: 'Anjali (Granddaughter)',
      relation: 'पोती',
      phone: '+91 99999 88888',
      photoUrl: '',
      status: 'Available' as const,
    };

    const saved = saveFamilyMember(newContact);
    expect(saved.some(m => m.id === 'test-fam')).toBe(true);
  });
});
