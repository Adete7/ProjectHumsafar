// Haversine formula to calculate distance between two coordinates in meters
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const meters = calculateDistance(lat1, lon1, lat2, lon2);
  return Math.round((meters / 1000) * 100) / 100;
}

export function isWithinSafeZone(
  currentLat: number, 
  currentLng: number, 
  centerLat: number, 
  centerLng: number, 
  radiusMeters: number
): boolean {
  const distance = calculateDistance(currentLat, currentLng, centerLat, centerLng);
  return distance <= radiusMeters;
}
