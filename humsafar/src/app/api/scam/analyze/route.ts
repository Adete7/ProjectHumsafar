import { NextResponse } from 'next/server';
import { analyzeScam } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { content, langCode } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const result = await analyzeScam(content, langCode || 'hi-IN');

    // Here we would typically save to Firestore and trigger a notification to the guardian if it's a scam
    if (result.isScam) {
      console.log("ALERT GUARDIAN: ", result.guardianSummary);
      // Implementation for saving to DB and alerting goes here
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error in scam analysis:", error);
    return NextResponse.json({ error: "Failed to analyze content" }, { status: 500 });
  }
}
