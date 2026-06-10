import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],

  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/content/**/*.{md,mdx}"
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-secondary":
          "var(--background-secondary)",

        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",

        border: "var(--border-color)",

        foreground: "var(--text-primary)",

        muted: "var(--text-muted)",

        primary: {
          DEFAULT: "var(--primary-500)",
          foreground: "#ffffff"
        },

        secondary: {
          DEFAULT: "var(--secondary-500)",
          foreground: "#ffffff"
        },

        success: "var(--success-500)",
        warning: "var(--warning-500)",
        danger: "var(--danger-500)"
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)"
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        primary: "var(--shadow-primary)"
      },

      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },

      maxWidth: {
        container: "var(--container-2xl)"
      },

      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "500ms"
      }
    }
  },

  plugins: []
};

export default config;
