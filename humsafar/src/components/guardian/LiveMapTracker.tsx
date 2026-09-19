"use client";

import { useEffect, useState } from 'react';
import { GeofenceZone } from '@/types';
import { MapPin, Navigation } from 'lucide-react';

interface LiveMapTrackerProps {
  seniorName: string;
  safeZone: GeofenceZone;
  currentLat: number;
  currentLng: number;
  isOutside: boolean;
}

export default function LiveMapTracker({ seniorName, safeZone, currentLat, currentLng, isOutside }: LiveMapTrackerProps) {
  // A real implementation would use Google Maps or Mapbox here.
  // Using a visual abstraction since we cannot easily embed a true map in this sandbox without API keys.
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Live Location: {seniorName}</h2>
        <span className={`px-4 py-1 rounded-full text-sm font-bold ${isOutside ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {isOutside ? 'OUTSIDE SAFE ZONE' : 'SAFE'}
        </span>
      </div>

      <div className="relative w-full h-[400px] bg-blue-50 rounded-lg border-2 border-blue-100 flex items-center justify-center overflow-hidden">
        {/* Mock Map Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* Safe Zone Circle (Mock) */}
        <div className="absolute w-64 h-64 rounded-full border-2 border-green-500 bg-green-500/20 flex items-center justify-center">
          <div className="absolute flex flex-col items-center justify-center text-green-800 font-medium">
            <Navigation size={16} />
            <span className="text-xs mt-1">Home Base</span>
            <span className="text-xs">Radius: {safeZone.radiusMeters}m</span>
          </div>
        </div>

        {/* Current Location Marker */}
        <div 
          className={`absolute flex flex-col items-center transition-all duration-1000 ${
            isOutside ? 'translate-x-40 -translate-y-20' : 'translate-x-10 translate-y-10'
          }`}
        >
          <div className={`p-3 rounded-full ${isOutside ? 'bg-red-500 animate-bounce' : 'bg-blue-600'} text-white shadow-lg`}>
            <MapPin size={24} />
          </div>
          <span className="mt-2 bg-white px-2 py-1 rounded shadow text-sm font-bold">
            {seniorName}
          </span>
        </div>
      </div>
    </div>
  );
}
