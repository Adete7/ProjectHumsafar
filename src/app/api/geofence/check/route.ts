import { NextResponse } from 'next/server';
import { isWithinSafeZone } from '@/lib/geofence';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currentLat, currentLng, centerLat, centerLng, radiusMeters } = body;

    // Numerical range validation
    const coords = [currentLat, currentLng, centerLat, centerLng, radiusMeters];
    const allNumbers = coords.every((val) => typeof val === 'number' && Number.isFinite(val));

    if (!allNumbers) {
      return NextResponse.json({ error: "All location parameters must be valid finite numbers" }, { status: 400 });
    }

    if (currentLat < -90 || currentLat > 90 || centerLat < -90 || centerLat > 90) {
      return NextResponse.json({ error: "Latitude must be between -90 and 90 degrees" }, { status: 400 });
    }

    if (currentLng < -180 || currentLng > 180 || centerLng < -180 || centerLng > 180) {
      return NextResponse.json({ error: "Longitude must be between -180 and 180 degrees" }, { status: 400 });
    }

    if (radiusMeters <= 0 || radiusMeters > 500000) {
      return NextResponse.json({ error: "Radius must be a positive number under 500km" }, { status: 400 });
    }

    const isSafe = isWithinSafeZone(currentLat, currentLng, centerLat, centerLng, radiusMeters);

    return NextResponse.json({ isSafe });
  } catch (error) {
    console.error("API Error in geofence check:", error);
    return NextResponse.json({ error: "Failed to evaluate geofence parameters" }, { status: 500 });
  }
}
