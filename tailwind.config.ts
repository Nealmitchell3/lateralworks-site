import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2B4B",
          light: "#253d6e",
          dark: "#111e33",
        },
        gray: {
          50:  "#FAFAFA",
          100: "#F4F4F5",
          200: "#E8E8EA",
          300: "#D4D4D8",
          400: "#A0A0AB",
          500: "#6B6B78",
          600: "#4B4B57",
          700: "#333340",
          800: "#1F1F2A",
          900: "#111118",
        },
        ink: {
          DEFAULT: "#111118",
          secondary: "#3D3D4A",
          muted: "#6B6B78",
        },
        accent: {
          DEFAULT: "#1B2B4B",
          hover: "#253d6e",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-ibm-plex)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "8xl": "88rem",
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
};
export default config;
