import { NextResponse } from 'next/server';

const MAX_SAFE_CAP = 3000;
const DUMMY_PIN = "1234";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { billId, pin, amount } = body;

    // Strict validation
    if (!billId || typeof billId !== 'string' || typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid payment parameters provided" }, { status: 400 });
    }

    // High amount guard
    if (amount > MAX_SAFE_CAP) {
      if (!pin || typeof pin !== 'string') {
        return NextResponse.json({ success: false, error: "Guardian authorization PIN required for high amounts" }, { status: 403 });
      }
      if (pin !== DUMMY_PIN) {
        return NextResponse.json({ success: false, error: "Incorrect Guardian PIN entered" }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      transactionId: `TXN-${Date.now()}`
    });
  } catch (error) {
    console.error("API Error in bill payment:", error);
    return NextResponse.json({ success: false, error: "Payment processing failed safely" }, { status: 500 });
  }
}
