import { GeofenceZone, LocationPing } from "@/types";

/**
 * Calculates great-circle distance between two points using the Haversine formula
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in kilometers
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371.0;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;
  return Math.round(distance * 1000) / 1000; // Round to 3 decimal places (meter precision)
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export interface GeofenceEvaluation {
  isInside: boolean;
  distanceKm: number;
  breachKm: number;
  statusText: string;
}

/**
 * Checks if current location is inside the safe-zone boundary
 */
export function evaluateGeofence(
  currentLat: number,
  currentLng: number,
  zone: GeofenceZone
): GeofenceEvaluation {
  const distanceKm = calculateHaversineDistanceKm(
    zone.centerLat,
    zone.centerLng,
    currentLat,
    currentLng
  );

  const isInside = distanceKm <= zone.radiusKm;
  const breachKm = isInside ? 0 : Math.round((distanceKm - zone.radiusKm) * 1000) / 1000;

  return {
    isInside,
    distanceKm,
    breachKm,
    statusText: isInside
      ? `Within safe zone (${distanceKm.toFixed(2)} km from home)`
      : `BREACH: ${breachKm.toFixed(2)} km beyond ${zone.radiusKm} km perimeter`,
  };
}

/**
 * Generate Google Maps live view link
 */
export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * Formats SMS/WhatsApp emergency message for guardian
 */
export function createGeofenceAlertMessage(
  seniorName: string,
  currentLat: number,
  currentLng: number,
  distanceKm: number,
  zone: GeofenceZone
): { message: string; mapsUrl: string } {
  const mapsUrl = getGoogleMapsUrl(currentLat, currentLng);
  const message = `🚨 [HUMSAFAR GEOFENCE ALERT]\n${seniorName} has moved outside the designated ${zone.radiusKm} km safe zone (${zone.address}).\nCurrent distance: ${distanceKm.toFixed(2)} km.\nLive Location: ${mapsUrl}\nPlease check in immediately.`;

  return { message, mapsUrl };
}

/**
 * Default safe zone for demonstrations (e.g. New Delhi residential zone)
 */
export const DEFAULT_GEOFENCE_ZONE: GeofenceZone = {
  centerLat: 28.6139,
  centerLng: 77.2090,
  radiusKm: 2.0,
  address: "B-42, Gulmohar Park, New Delhi",
  label: "Dada-Dadi Home Safe Zone",
};

/**
 * Default location pings history
 */
export const INITIAL_LOCATION_PINGS: LocationPing[] = [
  {
    lat: 28.6139,
    lng: 77.2090,
    timestamp: "10:00 AM",
    distanceKm: 0.0,
    isInsideSafeZone: true,
    batteryPercent: 92,
  },
  {
    lat: 28.6185,
    lng: 77.2120,
    timestamp: "10:30 AM",
    distanceKm: 0.65,
    isInsideSafeZone: true,
    batteryPercent: 88,
  },
  {
    lat: 28.6250,
    lng: 77.2200,
    timestamp: "11:00 AM",
    distanceKm: 1.62,
    isInsideSafeZone: true,
    batteryPercent: 84,
  },
];
