import { NextResponse } from 'next/server';
import { isWithinSafeZone } from '@/lib/geofence';

export async function POST(req: Request) {
  try {
    const { currentLat, currentLng, centerLat, centerLng, radiusMeters } = await req.json();

    if (currentLat === undefined || currentLng === undefined || centerLat === undefined || centerLng === undefined || radiusMeters === undefined) {
      return NextResponse.json({ error: "Missing location parameters" }, { status: 400 });
    }

    const isSafe = isWithinSafeZone(currentLat, currentLng, centerLat, centerLng, radiusMeters);

    if (!isSafe) {
      console.log("ALERT GUARDIAN: Senior left safe zone!");
      // Trigger Webhook/SMS to guardian here
    }

    return NextResponse.json({ isSafe });
  } catch (error) {
    console.error("API Error in geofence check:", error);
    return NextResponse.json({ error: "Failed to check geofence" }, { status: 500 });
  }
}
