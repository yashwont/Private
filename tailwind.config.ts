import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#fff8ee",
        parchment: "#f5eadb",
        burgundy: "#6f1d2f",
        rose: "#b66a74",
        clay: "#8d5b4c",
        cocoa: "#3b2420",
        moss: "#6f7461"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(59, 36, 32, 0.16)",
        photo: "0 18px 45px rgba(59, 36, 32, 0.22)"
      },
      backgroundImage: {
        "paper-grain": "radial-gradient(circle at 20% 20%, rgba(111,29,47,0.07), transparent 30%), radial-gradient(circle at 80% 0%, rgba(182,106,116,0.11), transparent 28%), linear-gradient(135deg, #fff8ee 0%, #f5eadb 48%, #fff4e4 100%)"
      }
    }
  },
  plugins: []
};

export default config;
