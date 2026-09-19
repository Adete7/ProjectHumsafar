import { NextResponse } from 'next/server';

const MAX_SAFE_CAP = 3000;
const DUMMY_PIN = "1234";

export async function POST(req: Request) {
  try {
    const { billId, pin, amount } = await req.json();

    if (!billId || amount === undefined) {
      return NextResponse.json({ success: false, error: "Missing details" }, { status: 400 });
    }

    if (amount > MAX_SAFE_CAP) {
      if (!pin) {
        return NextResponse.json({ success: false, error: "PIN required for high amounts" }, { status: 403 });
      }
      if (pin !== DUMMY_PIN) {
        return NextResponse.json({ success: false, error: "Incorrect PIN" }, { status: 403 });
      }
    }

    // Process payment logic here...
    
    return NextResponse.json({ success: true, message: "Payment successful" });
  } catch (error) {
    console.error("API Error in bill payment:", error);
    return NextResponse.json({ success: false, error: "Payment processing failed" }, { status: 500 });
  }
}
