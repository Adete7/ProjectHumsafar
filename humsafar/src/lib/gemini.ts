import { GoogleGenAI } from '@google/genai';

export function analyzeScamWithHeuristics(text: string, langCode: string = 'hi-IN') {
  const lower = text.toLowerCase();
  const triggers: string[] = [];

  // Critical fraud patterns commonly targeting Indian seniors
  if (
    lower.includes("electricity") &&
    (lower.includes("disconnect") || lower.includes("tonight") || lower.includes("bill unpaid") || lower.includes("power"))
  ) {
    triggers.push("Urgent electricity disconnection extortion threat");
  }
  if (
    lower.includes("kyc") ||
    lower.includes("pan card") ||
    lower.includes("block your account") ||
    lower.includes("bank account block") ||
    lower.includes("aadhar")
  ) {
    triggers.push("Threatening bank/KYC account block");
  }
  if (
    lower.includes("otp") ||
    lower.includes("one time password") ||
    lower.includes("pin share") ||
    lower.includes("cvv") ||
    lower.includes("password")
  ) {
    triggers.push("Illegitimate request for private OTP or PIN");
  }
  if (
    lower.includes("lottery") ||
    lower.includes("kbc") ||
    lower.includes("won") ||
    lower.includes("lakh") ||
    lower.includes("crore") ||
    lower.includes("prize")
  ) {
    triggers.push("Unsolicited lottery or prize scam");
  }
  if (
    lower.includes(".apk") ||
    lower.includes("anydesk") ||
    lower.includes("teamviewer") ||
    lower.includes("quicksupport")
  ) {
    triggers.push("Malicious remote-access software or APK installation");
  }
  if (
    (lower.includes("refund") || lower.includes("subsidy") || lower.includes("pension")) &&
    (lower.includes("click here") || lower.includes("link") || lower.includes("http") || lower.includes("bit.ly"))
  ) {
    triggers.push("Phishing payment refund/subsidy link");
  }

  const isCritical = triggers.length >= 1;
  const isModerate =
    !isCritical &&
    (lower.includes("urgent") ||
      lower.includes("pay immediately") ||
      lower.includes("cashback") ||
      lower.includes("reward points") ||
      lower.includes("expire today"));

  if (isCritical) {
    const elderWarning =
      langCode.startsWith("hi")
        ? "सावधान दादाजी! यह एक झूठा और ठगी भरा संदेश है। किसी को पैसे या ओटीपी बिल्कुल न दें!"
        : "Warning! This is a dangerous fraud message. Never share your OTP, PIN, or money!";

    return {
      isScam: true,
      riskLevel: "CRITICAL" as const,
      elderExplanation: elderWarning,
      guardianSummary: `Flagged fraudulent message with vectors: ${triggers.join(", ")}. Immediate block recommended.`,
      suggestedAction: "BLOCK_AND_REPORT" as const,
    };
  }

  if (isModerate) {
    const elderWarning =
      langCode.startsWith("hi")
        ? "यह संदेश थोड़ा संदेहास्पद लग रहा है। कृपया परिवार के सदस्य से पूछकर ही आगे बढ़ें।"
        : "This message seems suspicious. Please ask your family member before clicking or replying.";

    return {
      isScam: true,
      riskLevel: "MODERATE" as const,
      elderExplanation: elderWarning,
      guardianSummary: "Message contains urgency keywords or unverified cashback promises.",
      suggestedAction: "BLOCK_AND_REPORT" as const,
    };
  }

  const elderSafe =
    langCode.startsWith("hi")
      ? "यह संदेश सुरक्षित लग रहा है। फिर भी किसी अनजान को बैंक का पासवर्ड न दें।"
      : "This message appears safe. Always remember never to share bank passwords.";

  return {
    isScam: false,
    riskLevel: "SAFE" as const,
    elderExplanation: elderSafe,
    guardianSummary: "No malicious patterns or phishing triggers detected.",
    suggestedAction: "SAFE_TO_OPEN" as const,
  };
}

export async function analyzeScam(content: string, langCode: string = 'hi-IN') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return analyzeScamWithHeuristics(content, langCode);
  }

  const prompt = `
You are a scam detection AI for senior citizens. Analyze the following content.
Content: "${content}"
Language of Explanation: ${langCode}

Check for: Bank impersonation, lottery/OTP urgency, threats of electricity disconnection, unverified payment links.
Output strictly structured JSON without markdown formatting:
{
  "isScam": boolean,
  "riskLevel": "CRITICAL" | "MODERATE" | "SAFE",
  "elderExplanation": "Simple 1-sentence warning in the specified language",
  "guardianSummary": "Technical breakdown of fraud vectors for the caregiver",
  "suggestedAction": "BLOCK_AND_REPORT" | "SAFE_TO_OPEN"
}
`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    
    let text = response.text || "{}";
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("Gemini Scam Analysis Error, falling back to heuristics:", error);
    return analyzeScamWithHeuristics(content, langCode);
  }
}
