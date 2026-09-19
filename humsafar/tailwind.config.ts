import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'senior-yellow': '#FACC15',
        'senior-black': '#0F172A',
        'senior-blue': '#0A1128',
        'senior-green': '#00875A',
        'senior-red': '#DE350B',
        'sunrise-yellow': '#FDE047',
        'sunrise-amber': '#FACC15',
        'sunrise-orange': '#FB923C',
        'sunrise-deep-orange': '#F97316',
        'sunrise-rose': '#F87171',
        'sunrise-red': '#EF4444',
        'sunrise-cream': '#FFFBEB',
        'sunrise-dark': '#0F172A',
      },
      fontSize: {
        'elder-base': ['20px', { lineHeight: '1.6', fontWeight: '700' }],
        'elder-lg': ['22px', { lineHeight: '1.5', fontWeight: '700' }],
        'elder-xl': ['28px', { lineHeight: '1.4', fontWeight: '800' }],
        'elder-2xl': ['36px', { lineHeight: '1.3', fontWeight: '800' }],
        'elder-3xl': ['48px', { lineHeight: '1.2', fontWeight: '900' }],
        'elder-4xl': ['56px', { lineHeight: '1.1', fontWeight: '900' }],
      },
      fontWeight: {
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(249, 115, 22, 0.15)',
        'glass-card': '0 12px 40px 0 rgba(15, 23, 42, 0.12)',
        'elder-bold': '0 8px 0 rgba(15, 23, 42, 0.9)',
      },
      spacing: {
        '16': '64px',
        '20': '80px',
      }
    },
  },
  plugins: [],
};
export default config;
