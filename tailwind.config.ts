import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        foreground: "#f7f5e8",
        cyber: {
          neon: "#00f0ff",
          magenta: "#ff00ea",
          gold: "#c7a23a",
          lime: "#b7ff00",
          red: "#ff3b3b"
        }
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"]
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,240,255,0.25)",
        "glow-gold": "0 0 20px rgba(199,162,58,0.25)"
      },
      animation: { pulseFast: "pulse 1s cubic-bezier(0.4,0,0.6,1) infinite" }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;