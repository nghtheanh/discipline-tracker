import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
const c = (n: string) => `hsl(var(--${n}))`;
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { background: c("background"), foreground: c("foreground"),
      card: { DEFAULT: c("card"), foreground: c("card-foreground") },
      popover: { DEFAULT: c("card"), foreground: c("card-foreground") },
      primary: { DEFAULT: c("primary"), foreground: c("primary-foreground") },
      secondary: { DEFAULT: c("secondary"), foreground: c("foreground") },
      muted: { DEFAULT: c("muted"), foreground: c("muted-foreground") },
      accent: { DEFAULT: c("accent"), foreground: c("foreground") },
      destructive: { DEFAULT: c("destructive"), foreground: c("foreground") },
      border: c("border"), input: c("border"), ring: c("primary") },
    borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
    fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"], mono: ["var(--font-mono)", "ui-monospace", "monospace"] },
  } },
  plugins: [animate],
} satisfies Config;
