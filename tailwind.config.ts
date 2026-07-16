import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F172A",
        navy2: "#132038",
        brand: {
          DEFAULT: "#2563EB",
          light: "#38BDF8",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        bg: "#F8FAFC",
        ink: "#64748B",
      },
      fontFamily: {
        heading: ["Cairo", "Tajawal", "sans-serif"],
        body: ["Tajawal", "Cairo", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "mesh-navy":
          "radial-gradient(80% 60% at 15% 0%, rgba(37,99,235,0.35) 0%, rgba(15,23,42,0) 60%), radial-gradient(60% 50% at 100% 20%, rgba(56,189,248,0.25) 0%, rgba(15,23,42,0) 60%), linear-gradient(180deg, #0B1224 0%, #0F172A 60%, #0F172A 100%)",
        "grid-lines":
          "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
      },
      boxShadow: {
        card: "0 4px 24px -6px rgba(15, 23, 42, 0.08)",
        cardHover: "0 12px 32px -8px rgba(37, 99, 235, 0.22)",
        glow: "0 0 0 1px rgba(56,189,248,0.15), 0 8px 40px -8px rgba(37,99,235,0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        floaty: "floaty 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
