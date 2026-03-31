import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Braverman tokens
        "brav-bg": "hsl(var(--brav-bg))",
        "brav-warm": "hsl(var(--brav-warm))",
        "brav-text": "hsl(var(--brav-text))",
        "brav-mid": "hsl(var(--brav-mid))",
        "brav-light": "hsl(var(--brav-light))",
        "brav-accent": "hsl(var(--brav-accent))",
        "brav-border": "hsl(var(--brav-border))",
        "brav-border-light": "hsl(var(--brav-border-light))",
        // Neurotransmitter colors
        "neuro-dopa": "hsl(var(--neuro-dopa))",
        "neuro-dopa-bg": "hsl(var(--neuro-dopa-bg))",
        "neuro-dopa-border": "hsl(var(--neuro-dopa-border))",
        "neuro-ach": "hsl(var(--neuro-ach))",
        "neuro-ach-bg": "hsl(var(--neuro-ach-bg))",
        "neuro-ach-border": "hsl(var(--neuro-ach-border))",
        "neuro-gaba": "hsl(var(--neuro-gaba))",
        "neuro-gaba-bg": "hsl(var(--neuro-gaba-bg))",
        "neuro-gaba-border": "hsl(var(--neuro-gaba-border))",
        "neuro-sero": "hsl(var(--neuro-sero))",
        "neuro-sero-bg": "hsl(var(--neuro-sero-bg))",
        "neuro-sero-border": "hsl(var(--neuro-sero-border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      width: {
        '13': '3.25rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
