import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        // Surfaces — matte black with subtle elevation steps
        surface: {
          0: "#08080a",   // page background
          1: "#0d0d10",   // base layer
          2: "#131316",   // card
          3: "#1a1a1f",   // raised card
          4: "#22222a",   // floating / hover
        },
        // Borders — barely-there steel
        edge: {
          subtle: "#1f1f24",
          DEFAULT: "#2a2a31",
          strong: "#3a3a44",
        },
        // Type
        ink: {
          primary: "#f5f5f4",
          secondary: "#a3a3a8",
          muted: "#6b6b73",
          dim: "#454550",
        },
        // Signal accent — molten ember (single brand accent)
        ember: {
          50: "#fff5ee",
          100: "#ffe6d3",
          200: "#ffc69e",
          300: "#ff9b5e",
          400: "#ff7434",
          500: "#ff5e1a",   // primary
          600: "#e74508",
          700: "#bf3406",
          800: "#982a08",
          900: "#7a240a",
        },
        // Status signals
        signal: {
          green: "#22c55e",
          red: "#ef4444",
          amber: "#f59e0b",
          cyan: "#06b6d4",
        },
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight: "-0.02em",
        wide: "0.04em",
        wider: "0.08em",
        widest: "0.16em",
      },
      borderRadius: {
        "2xs": "2px",
        xs: "4px",
      },
      boxShadow: {
        "ember-glow": "0 0 32px -4px rgba(255, 94, 26, 0.35), 0 0 64px -16px rgba(255, 94, 26, 0.2)",
        "ember-glow-sm": "0 0 16px -2px rgba(255, 94, 26, 0.4)",
        "elevated": "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 0 0 1px rgba(255,255,255,0.02), 0 20px 40px -20px rgba(0,0,0,0.8)",
        "card": "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 0 0 1px rgba(255,255,255,0.02)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        "grid-md": "32px 32px",
        "grid-lg": "64px 64px",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "ticker": "ticker 40s linear infinite",
        "scan": "scan 6s ease-in-out infinite",
        "rise": "rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scan: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.3" },
          "50%": { transform: "translateY(8px)", opacity: "0.6" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
