import { NextResponse } from 'next/server';
import { analyzeScam } from '@/lib/gemini';

const ALLOWED_LANG_CODES = new Set(['hi-IN', 'en-IN', 'ta-IN', 'te-IN', 'bn-IN', 'mr-IN', 'gu-IN', 'hi', 'en', 'ta', 'te', 'bn', 'mr', 'gu']);

// In-memory sliding window rate limiter (max 15 requests per IP per minute)
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS_PER_WINDOW = 15;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { timestamps: [] };

  // Retain only requests within the active sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, record);
    return true;
  }

  record.timestamps.push(now);
  rateLimitMap.set(ip, record);

  // Self-cleaning garbage collection if map grows large
  if (rateLimitMap.size > 5000) {
    rateLimitMap.forEach((val, key) => {
      if (val.timestamps.every((ts) => now - ts >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(key);
      }
    });
  }

  return false;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

function sanitizeInput(raw: string): string {
  if (!raw) return '';
  return raw
    // Strip malicious script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip javascript: pseudo-protocols
    .replace(/javascript:/gi, '')
    // Strip dangerous inline event handlers (onerror, onload, onclick, etc.)
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    // Strip raw HTML tags
    .replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, '')
    // Strip unprintable control characters
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
    .trim();
}

export async function POST(req: Request) {
  try {
    // 1. Sliding Window Rate Limiting Guard
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a moment before analyzing more messages.",
          isScam: false,
          riskLevel: "SAFE",
          elderExplanation: "कृपया कुछ क्षण प्रतीक्षा करें। सिस्टम अभी व्यस्त है।",
          guardianSummary: "Client IP exceeded sliding window rate limit of 15 requests per minute.",
          suggestedAction: "MANUAL_REVIEW"
        },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await req.json();
    const rawContent = body.content || body.messageContent;
    const rawLang = body.langCode || body.lang || body.seniorLanguage;

    // 2. Strict Input Validation
    if (!rawContent || typeof rawContent !== 'string' || !rawContent.trim()) {
      return NextResponse.json({ error: "Content must be a non-empty string" }, { status: 400 });
    }

    // Enforce strict 1000 character maximum limit
    if (rawContent.length > 1000) {
      return NextResponse.json(
        { error: "Content exceeds maximum security limit of 1000 characters" },
        { status: 413 }
      );
    }

    // 3. XSS & Code Injection Sanitization
    const sanitizedContent = sanitizeInput(rawContent);
    if (!sanitizedContent) {
      return NextResponse.json(
        { error: "Input content contained only prohibited script or markup sequences" },
        { status: 400 }
      );
    }

    // 4. Validate or normalize language code
    let validLang = 'hi-IN';
    if (typeof rawLang === 'string') {
      if (ALLOWED_LANG_CODES.has(rawLang)) {
        validLang = rawLang.includes('-') ? rawLang : `${rawLang}-IN`;
      }
    }

    // 5. Execute AI analysis (Backed by Server Environment Key & LRU Cache)
    const result = await analyzeScam(sanitizedContent, validLang);

    if (result.isScam) {
      console.log(`[HUMSAFAR SHIELD ALERT] Fraud Vector Detected for IP ${clientIp}:`, result.guardianSummary);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error in scam analysis route:", error);
    return NextResponse.json({ error: "Failed to analyze content securely" }, { status: 500 });
  }
}
