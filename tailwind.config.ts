import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "senior-yellow": "#FACC15",
        "senior-black": "#000000",
        "senior-blue": "#0A1128",
        "senior-blue-light": "#1E2A4A",
        "senior-green": "#00875A",
        "senior-green-dark": "#005A3C",
        "senior-red": "#DE350B",
        "senior-red-dark": "#9E2406",
        "senior-card-bg": "#FFFFFF",
        "senior-border": "#000000",
      },
      fontSize: {
        "elder-base": ["20px", { lineHeight: "1.6", fontWeight: "700" }],
        "elder-lg": ["22px", { lineHeight: "1.5", fontWeight: "700" }],
        "elder-xl": ["28px", { lineHeight: "1.4", fontWeight: "800" }],
        "elder-2xl": ["36px", { lineHeight: "1.3", fontWeight: "800" }],
        "elder-3xl": ["48px", { lineHeight: "1.2", fontWeight: "900" }],
        "elder-4xl": ["56px", { lineHeight: "1.1", fontWeight: "900" }],
      },
      minHeight: {
        touch: "64px",
      },
      minWidth: {
        touch: "64px",
      },
      boxShadow: {
        "elder-high": "0 8px 0 #000000",
        "elder-card": "0 10px 0 #0A1128",
        "elder-inset": "inset 0 4px 0 rgba(0,0,0,0.2)",
      },
      borderWidth: {
        "3": "3px",
        "4": "4px",
        "6": "6px",
      },
    },
  },
  plugins: [],
};

export default config;
