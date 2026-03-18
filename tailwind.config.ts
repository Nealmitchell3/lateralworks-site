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
          DEFAULT: "#0C1B33",
          light: "#1A3057",
          faint: "#0F2244",
        },
        cream: {
          DEFAULT: "#F8F6F1",
          dark: "#EDE9E1",
        },
        gold: {
          DEFAULT: "#B8922A",
          light: "#D4A93A",
        },
        ink: {
          DEFAULT: "#1C1C1C",
          secondary: "#4B4B4B",
          muted: "#7A7A7A",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-dm-sans)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};
export default config;
