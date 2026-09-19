"use client";

import { useEffect, useRef, useState } from 'react';
import { GeofenceZone } from '@/types';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, ExternalLink, Sliders, RefreshCw } from 'lucide-react';
import { calculateHaversineDistanceKm } from '@/lib/geofence';

interface LiveMapTrackerProps {
  seniorName: string;
  safeZone: GeofenceZone;
  initialLat?: number;
  initialLng?: number;
}

export default function LiveMapTracker({
  seniorName,
  safeZone,
  initialLat = 28.6139,
  initialLng = 77.2090,
}: LiveMapTrackerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  // Dynamic interactive state for testing and live tracking
  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);
  const [radiusMeters, setRadiusMeters] = useState(safeZone.radiusMeters || 2000);
  const [isMapReady, setIsMapReady] = useState(false);

  // Haversine distance
  const distanceKm = calculateHaversineDistanceKm(
    safeZone.centerLat,
    safeZone.centerLng,
    currentLat,
    currentLng
  );
  const radiusKm = radiusMeters / 1000;
  const isOutside = distanceKm > radiusKm;
  const breachDistanceKm = isOutside ? (distanceKm - radiusKm).toFixed(2) : '0.00';

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      if (!isMounted) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current).setView([currentLat, currentLng], 14);

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // 1. Safe Zone Circle
      const circle = L.circle([safeZone.centerLat, safeZone.centerLng], {
        radius: radiusMeters,
        color: '#10B981',
        fillColor: '#10B981',
        fillOpacity: 0.18,
        weight: 3,
        dashArray: '6, 6',
      }).addTo(map);
      circleRef.current = circle;

      // 2. Home Base Marker
      const homeIcon = L.divIcon({
        className: 'custom-home-icon',
        html: `
          <div style="background: #0F172A; color: #FACC15; border-radius: 9999px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            🏠
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([safeZone.centerLat, safeZone.centerLng], { icon: homeIcon })
        .addTo(map)
        .bindPopup('<b>Home Base</b><br>Designated Safe Zone Center');

      // 3. Senior Location Marker
      const seniorIcon = L.divIcon({
        className: 'custom-senior-icon',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 42px; height: 42px; border-radius: 9999px; background: ${isOutside ? '#EF4444' : '#2563EB'}; color: white; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 8px 24px rgba(0,0,0,0.4); font-weight: bold;">
              👴
            </div>
            <div style="background: white; border: 2px solid #0F172A; border-radius: 6px; padding: 2px 6px; font-size: 11px; font-weight: 800; color: #0F172A; white-space: nowrap; margin-top: 3px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
              ${seniorName}
            </div>
          </div>
        `,
        iconSize: [42, 60],
        iconAnchor: [21, 30],
      });

      const seniorMarker = L.marker([currentLat, currentLng], { icon: seniorIcon }).addTo(map);
      seniorMarker.bindPopup(`<b>${seniorName}</b><br>${distanceKm.toFixed(2)} km from home base`);
      markerRef.current = seniorMarker;

      mapInstanceRef.current = map;
      setIsMapReady(true);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker & circle whenever coordinates or radius change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !circleRef.current) return;

    import('leaflet').then((L) => {
      // Update Circle
      circleRef.current.setRadius(radiusMeters);
      circleRef.current.setStyle({
        color: isOutside ? '#EF4444' : '#10B981',
        fillColor: isOutside ? '#EF4444' : '#10B981',
      });

      // Update Senior Marker
      markerRef.current.setLatLng([currentLat, currentLng]);
      const newIcon = L.divIcon({
        className: 'custom-senior-icon',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 42px; height: 42px; border-radius: 9999px; background: ${isOutside ? '#EF4444' : '#2563EB'}; color: white; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 8px 24px rgba(0,0,0,0.4); font-weight: bold; ${isOutside ? 'animation: pulse 1s infinite;' : ''}">
              👴
            </div>
            <div style="background: white; border: 2px solid ${isOutside ? '#EF4444' : '#0F172A'}; border-radius: 6px; padding: 2px 6px; font-size: 11px; font-weight: 800; color: #0F172A; white-space: nowrap; margin-top: 3px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
              ${seniorName} (${distanceKm.toFixed(2)} km)
            </div>
          </div>
        `,
        iconSize: [42, 60],
        iconAnchor: [21, 30],
      });
      markerRef.current.setIcon(newIcon);

      mapInstanceRef.current.panTo([currentLat, currentLng]);
    });
  }, [currentLat, currentLng, radiusMeters, isOutside, distanceKm, seniorName]);

  // Simulation handlers
  const simulateAtHome = () => {
    setCurrentLat(safeZone.centerLat + 0.003); // ~300m away
    setCurrentLng(safeZone.centerLng + 0.002);
  };

  const simulateBreach = () => {
    setCurrentLat(safeZone.centerLat + 0.028); // ~3.5km away
    setCurrentLng(safeZone.centerLng + 0.022);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`;

  return (
    <div className="glass-surface rounded-3xl p-6 border-3 border-slate-200 shadow-xl flex flex-col gap-5">
      {/* Header with Status Badge */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 text-amber-300">
            <Navigation size={28} />
          </div>
          <div>
            <h2 className="text-elder-xl font-black text-slate-950">
              Live Location: {seniorName}
            </h2>
            <p className="text-sm font-bold text-slate-600">
              GPS Lat: {currentLat.toFixed(4)}, Lng: {currentLng.toFixed(4)} • Distance: {distanceKm.toFixed(2)} km
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full font-black text-sm sm:text-base border-2 shadow flex items-center gap-2 ${
              isOutside
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-emerald-600 text-white border-emerald-700'
            }`}
          >
            {isOutside ? (
              <>
                <AlertTriangle size={20} />
                <span>सुरक्षा घेरे से बाहर (OUTSIDE SAFE ZONE)</span>
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                <span>सुरक्षित दायरे में (INSIDE SAFE ZONE)</span>
              </>
            )}
          </span>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-white text-slate-900 border-2 border-slate-300 hover:bg-amber-100 shadow text-xs font-black flex items-center gap-1.5"
            title="Open Live Location in Google Maps"
          >
            <ExternalLink size={18} />
            <span className="hidden sm:inline">Google Maps</span>
          </a>
        </div>
      </div>

      {/* Breach Warning Banner */}
      {isOutside && (
        <div className="p-4 rounded-2xl bg-red-600 text-white border-2 border-red-800 flex items-center justify-between gap-4 shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <AlertTriangle size={32} className="flex-shrink-0" />
            <div>
              <h3 className="font-black text-elder-base">
                ⚠️ चेतावनी: बुजुर्ग {radiusKm} किमी के सुरक्षा दायरे से {breachDistanceKm} किमी बाहर निकल गए हैं!
              </h3>
              <p className="text-sm font-bold opacity-90">
                तुरंत संपर्क करें या दिए गए लाइव लिंक से सहायता भेजें।
              </p>
            </div>
          </div>
          <a
            href={`tel:+919876543210`}
            className="px-4 py-2 rounded-xl bg-white text-red-700 font-black text-sm whitespace-nowrap shadow hover:bg-red-50"
          >
            कॉल करें (Call Elder)
          </a>
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border-3 border-slate-300 shadow-inner z-10">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Simulation Controls & Radius Adjuster */}
      <div className="p-4 rounded-2xl bg-white/80 border-2 border-slate-200 flex flex-wrap items-center justify-between gap-4">
        {/* Radius slider */}
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <Sliders size={20} className="text-slate-700" />
          <span className="text-sm font-bold text-slate-900">
            Safe Perimeter: <span className="font-black text-orange-600">{(radiusMeters / 1000).toFixed(1)} km</span>
          </span>
          <input
            type="range"
            min="500"
            max="5000"
            step="250"
            value={radiusMeters}
            onChange={(e) => setRadiusMeters(Number(e.target.value))}
            className="w-36 accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Live Simulation Buttons */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase text-slate-500">Live Demo:</span>
          <button
            onClick={simulateAtHome}
            className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300 text-xs font-black transition-colors"
          >
            🏠 घर पर रखें (Safe at Home)
          </button>
          <button
            onClick={simulateBreach}
            className="px-3.5 py-2 rounded-xl bg-red-100 text-red-900 hover:bg-red-200 border border-red-300 text-xs font-black transition-colors"
          >
            🚨 बाहर भेजें (Simulate Breach)
          </button>
        </div>
      </div>
    </div>
  );
}
