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
        'senior-black': '#000000',
        'senior-blue': '#0A1128',
        'senior-green': '#00875A',
        'senior-red': '#DE350B',
      },
      fontSize: {
        'elder-lg': ['22px', '32px'],
        'elder-xl': ['28px', '38px'],
        'elder-2xl': ['36px', '48px'],
        'elder-3xl': ['48px', '64px'],
      },
      fontWeight: {
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      spacing: {
        '16': '64px',
      }
    },
  },
  plugins: [],
};
export default config;
