import { NextResponse } from 'next/server';
import { analyzeScam } from '@/lib/gemini';

const ALLOWED_LANG_CODES = new Set(['hi-IN', 'en-IN', 'ta-IN', 'te-IN', 'bn-IN', 'mr-IN', 'gu-IN']);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, langCode } = body;

    // Strict Input Validation & Boundary Checks
    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: "Content must be a non-empty string" }, { status: 400 });
    }

    // DoS / Payload-size guard
    if (content.length > 5000) {
      return NextResponse.json({ error: "Content exceeds maximum length limit of 5000 characters" }, { status: 413 });
    }

    // Validate or sanitize language code
    const validLang = (typeof langCode === 'string' && ALLOWED_LANG_CODES.has(langCode)) ? langCode : 'hi-IN';

    // Strip potential control characters to prevent prompt tampering
    const sanitizedContent = content.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '');

    const result = await analyzeScam(sanitizedContent, validLang);

    if (result.isScam) {
      console.log("ALERT GUARDIAN: High risk scam detected:", result.guardianSummary);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error in scam analysis:", error);
    return NextResponse.json({ error: "Failed to analyze content securely" }, { status: 500 });
  }
}
