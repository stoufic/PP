import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        danger: "var(--danger)",
        success: "var(--success)"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(15, 23, 42, 0.08)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.8)"
      },
      borderRadius: {
        panel: "1.5rem"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
