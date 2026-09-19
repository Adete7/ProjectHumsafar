import { GoogleGenAI } from "@google/genai";
import { LanguageCode, ScamAnalysisResult } from "@/types";

/**
 * Heuristic backup analyzer for immediate zero-downtime protection
 * Detects common Indian senior fraud vectors:
 * - Electricity disconnection threats
 * - Fake KYC expiration (SBI, PNB, Paytm)
 * - OTP & Banking urgency
 * - Lottery / Kaun Banega Crorepati fraud
 * - Malicious APK download links
 */
export function analyzeScamWithHeuristics(
  text: string,
  lang: LanguageCode = "hi-IN"
): ScamAnalysisResult {
  const lower = text.toLowerCase();
  const triggers: string[] = [];

  // Critical fraud patterns
  if (lower.includes("electricity") && (lower.includes("disconnect") || lower.includes("tonight") || lower.includes("bill unpaid"))) {
    triggers.push("Urgent electricity disconnection extortion threat");
  }
  if (lower.includes("kyc") || lower.includes("pan card") || lower.includes("block your account") || lower.includes("aadhar")) {
    triggers.push("Threatening bank/KYC account block");
  }
  if (lower.includes("otp") || lower.includes("one time password") || lower.includes("pin share")) {
    triggers.push("Illegitimate request for private OTP or PIN");
  }
  if (lower.includes("lottery") || lower.includes("kbc") || lower.includes("won 25 lakh") || lower.includes("prize")) {
    triggers.push("Unsolicited lottery or prize scam");
  }
  if (lower.includes(".apk") || lower.includes("anydesk") || lower.includes("teamviewer") || lower.includes("quicksupport")) {
    triggers.push("Malicious remote-access software or APK installation");
  }
  if (lower.includes("refund") && (lower.includes("click here") || lower.includes("link") || lower.includes("http"))) {
    triggers.push("Phishing payment refund link");
  }

  const isCritical = triggers.length >= 1;
  const isModerate =
    !isCritical &&
    (lower.includes("urgent") ||
      lower.includes("pay immediately") ||
      lower.includes("cashback") ||
      lower.includes("reward points"));

  if (isCritical) {
    const elderWarning =
      lang === "hi-IN"
        ? "सावधान दादाजी! यह एक झूठा और ठगी भरा संदेश है। किसी को पैसे या ओटीपी बिल्कुल न दें!"
        : "Warning! This is a dangerous fraud message. Never share your OTP, PIN, or money!";

    return {
      isScam: true,
      riskLevel: "CRITICAL",
      elderExplanation: elderWarning,
      guardianSummary: `Flagged fraudulent message with vectors: ${triggers.join(", ")}. Immediate block recommended.`,
      suggestedAction: "BLOCK_AND_REPORT",
      detectedTriggers: triggers,
    };
  }

  if (isModerate) {
    const elderWarning =
      lang === "hi-IN"
        ? "यह संदेश थोड़ा संदेहास्पद लग रहा है। कृपया परिवार के सदस्य से पूछकर ही आगे बढ़ें।"
        : "This message seems suspicious. Please ask your family member before clicking or replying.";

    return {
      isScam: true,
      riskLevel: "MODERATE",
      elderExplanation: elderWarning,
      guardianSummary: "Message contains urgency keywords or unverified cashback promises.",
      suggestedAction: "MANUAL_REVIEW",
      detectedTriggers: ["Urgency pressure", "Unverified claims"],
    };
  }

  const elderSafe =
    lang === "hi-IN"
      ? "यह संदेश सुरक्षित लग रहा है। फिर भी किसी अनजान को बैंक का पासवर्ड न दें।"
      : "This message appears safe. Always remember never to share bank passwords.";

  return {
    isScam: false,
    riskLevel: "SAFE",
    elderExplanation: elderSafe,
    guardianSummary: "No malicious patterns or phishing triggers detected.",
    suggestedAction: "SAFE_TO_OPEN",
    detectedTriggers: [],
  };
}

/**
 * Analyzes suspicious messages using Google Gemini 1.5 Flash
 * Falls back defensively to rule-based heuristics if API key is not configured or network error occurs.
 */
export async function analyzeScamMessage(
  messageContent: string,
  seniorLanguage: LanguageCode = "hi-IN"
): Promise<ScamAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    // Run defensive heuristic detection
    return analyzeScamWithHeuristics(messageContent, seniorLanguage);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an AI scam and fraud detection specialist for "HUMSAFAR", a protective companion for Indian senior citizens (grandparents).
Analyze the following incoming message, SMS, or phone transcript:
---
"${messageContent}"
---

Identify fraud patterns targeting seniors:
1. Threatening electricity/water disconnection tonight.
2. Fake bank account or credit card KYC block (SBI, PNB, HDFC, ICICI, etc.).
3. Demands for OTP, UPI PIN, or bank credentials.
4. Lottery/KBC winnings or fake pensions.
5. Links to download APK files, AnyDesk, or TeamViewer.
6. Fake digital arrest or police threats.

Provide your response in strictly valid JSON with no markdown backticks, matching this exact schema:
{
  "isScam": boolean,
  "riskLevel": "CRITICAL" | "MODERATE" | "SAFE",
  "elderExplanation": "One clear, reassuring or cautionary sentence written in ${seniorLanguage} tailored for an 75-year-old grandparent",
  "guardianSummary": "Detailed technical analysis for the adult caregiver explaining fraud indicators and vectors",
  "suggestedAction": "BLOCK_AND_REPORT" | "SAFE_TO_OPEN" | "MANUAL_REVIEW",
  "detectedTriggers": ["list of detected fraud indicators"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const responseText = response.text?.trim() || "";
    const cleanJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const parsed: ScamAnalysisResult = JSON.parse(cleanJson);
    return parsed;
  } catch {
    // Fallback to local heuristics
    return analyzeScamWithHeuristics(messageContent, seniorLanguage);
  }
}
