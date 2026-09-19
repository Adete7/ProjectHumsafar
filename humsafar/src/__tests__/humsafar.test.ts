import { describe, it, expect, vi } from 'vitest';
import { calculateDistance, isWithinSafeZone } from '../lib/geofence';
import { analyzeScam } from '../lib/gemini';

// Mock Gemini
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: JSON.stringify({
          isScam: true,
          riskLevel: "CRITICAL",
          elderExplanation: "This is a scam.",
          guardianSummary: "Fraud attempt.",
          suggestedAction: "BLOCK_AND_REPORT"
        })
      })
    }
  }))
}));

describe('Geofencing Module', () => {
  it('calculates distance correctly (approximate)', () => {
    // Delhi to Mumbai is approx 1148 km
    const dist = calculateDistance(28.7041, 77.1025, 19.0760, 72.8777);
    expect(dist).toBeGreaterThan(1000000); // > 1000km
    expect(dist).toBeLessThan(1200000);
  });

  it('determines if inside safe zone', () => {
    // Exact same point
    expect(isWithinSafeZone(28.7041, 77.1025, 28.7041, 77.1025, 100)).toBe(true);
    
    // Far away point
    expect(isWithinSafeZone(19.0760, 72.8777, 28.7041, 77.1025, 1000)).toBe(false);
  });
});

describe('Scam Shield API', () => {
  it('parses Gemini response successfully', async () => {
    const result = await analyzeScam("Send OTP for electricity", "en-IN");
    expect(result.isScam).toBe(true);
    expect(result.riskLevel).toBe("CRITICAL");
  });
});
