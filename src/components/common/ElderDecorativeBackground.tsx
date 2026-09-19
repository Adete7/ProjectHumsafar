import React from 'react';

/**
 * Lightweight, semi-transparent elder-friendly SVG stickers/emblems
 * (walking stick, chai tea cup, heart-hands, spectacles, flower)
 * Floating softly in background corners with low opacity.
 */
export default function ElderDecorativeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Top-Left: Warm Chai Cup */}
      <div className="absolute -top-6 -left-6 w-48 h-48 opacity-20 text-orange-600 animate-float">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Cup Body */}
          <path d="M22 38h46c0 18-10 32-23 32S22 56 22 38z" fill="currentColor" fillOpacity="0.15" />
          {/* Saucer */}
          <path d="M14 74h62" strokeWidth="4" />
          {/* Cup Handle */}
          <path d="M68 44c8 0 14 5 14 11s-6 11-14 11" />
          {/* Steam curves */}
          <path d="M34 26c-2-4 2-8 0-12" strokeWidth="2.5" />
          <path d="M45 28c-2-5 2-9 0-14" strokeWidth="2.5" />
          <path d="M56 26c-2-4 2-8 0-12" strokeWidth="2.5" />
        </svg>
      </div>

      {/* 2. Top-Right: Spectacles / Glasses */}
      <div className="absolute top-10 -right-8 w-56 h-36 opacity-20 text-amber-600 animate-float-reverse">
        <svg viewBox="0 0 120 70" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          {/* Left Lens */}
          <circle cx="34" cy="36" r="22" fill="currentColor" fillOpacity="0.12" />
          {/* Right Lens */}
          <circle cx="86" cy="36" r="22" fill="currentColor" fillOpacity="0.12" />
          {/* Bridge */}
          <path d="M56 32c4-5 10-5 14 0" strokeWidth="4.5" />
          {/* Left Temple */}
          <path d="M12 36C8 28 4 18 2 12" strokeWidth="3.5" />
          {/* Right Temple */}
          <path d="M108 36c4-8 8-18 10-24" strokeWidth="3.5" />
        </svg>
      </div>

      {/* 3. Bottom-Left: Walking Stick / Cane */}
      <div className="absolute -bottom-10 -left-6 w-52 h-64 opacity-20 text-red-600 animate-float">
        <svg viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {/* Curved handle */}
          <path d="M48 24c0-12-14-16-24-10-10 6-12 18-6 26 4 6 12 10 16 16l18 56" />
          {/* Rubber tip */}
          <line x1="48" y1="112" x2="56" y2="114" strokeWidth="7" />
          {/* Heart grip detail */}
          <circle cx="34" cy="18" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* 4. Bottom-Right: Lotus / Marigold Flower */}
      <div className="absolute -bottom-8 -right-8 w-60 h-60 opacity-20 text-orange-500 animate-pulse-gentle">
        <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Central Petal */}
          <path d="M60 20c-12 22-8 44 0 62 8-18 12-40 0-62z" fill="currentColor" fillOpacity="0.18" />
          {/* Left Petal */}
          <path d="M60 82C40 76 28 54 36 34c10 18 18 34 24 48z" fill="currentColor" fillOpacity="0.14" />
          {/* Right Petal */}
          <path d="M60 82c20-6 32-28 24-48-10 18-18 34-24 48z" fill="currentColor" fillOpacity="0.14" />
          {/* Far Left Petal */}
          <path d="M60 82C34 84 16 70 20 50c16 12 28 24 40 32z" fill="currentColor" fillOpacity="0.1" />
          {/* Far Right Petal */}
          <path d="M60 82c26 2 44-12 40-32-16 12-28 24-40 32z" fill="currentColor" fillOpacity="0.1" />
          {/* Lotus Base */}
          <path d="M30 88c18 10 42 10 60 0" strokeWidth="4" />
        </svg>
      </div>

      {/* 5. Center-Right Subtle Accent: Heart in Hands */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 w-48 h-48 opacity-15 text-rose-500 animate-float-reverse">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Heart */}
          <path
            d="M50 34c-6-8-16-9-22-3-7 7-6 17 0 24l22 22 22-22c6-7 7-17 0-24-6-6-16-5-22 3z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          {/* Caring hands cradle */}
          <path d="M22 66c6 8 16 16 28 16s22-8 28-16" strokeWidth="3.5" />
        </svg>
      </div>

      {/* Radiant Sunrise Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-300/25 to-orange-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-gradient-to-tl from-rose-300/20 via-orange-300/20 to-yellow-200/25 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
