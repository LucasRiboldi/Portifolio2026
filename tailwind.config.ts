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
      screens: {
        mobile: "375px",
        "mobile-lg": "425px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1440px"
      },

      colors: {
        background: "var(--background)",
        "background-secondary":
          "var(--background-secondary)",

        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",

        border: "var(--border-color)",

        foreground: "var(--text-primary)",

        muted: "var(--text-muted)",

        // Escalas completas (50→950) apontando para os tokens primitivos
        primary: {
          50: "var(--c-primary-50)",
          100: "var(--c-primary-100)",
          200: "var(--c-primary-200)",
          300: "var(--c-primary-300)",
          400: "var(--c-primary-400)",
          500: "var(--c-primary-500)",
          600: "var(--c-primary-600)",
          700: "var(--c-primary-700)",
          800: "var(--c-primary-800)",
          900: "var(--c-primary-900)",
          950: "var(--c-primary-950)",
          DEFAULT: "var(--c-primary-500)",
          foreground: "#ffffff"
        },

        secondary: {
          50: "var(--c-secondary-50)",
          100: "var(--c-secondary-100)",
          200: "var(--c-secondary-200)",
          300: "var(--c-secondary-300)",
          400: "var(--c-secondary-400)",
          500: "var(--c-secondary-500)",
          600: "var(--c-secondary-600)",
          700: "var(--c-secondary-700)",
          800: "var(--c-secondary-800)",
          900: "var(--c-secondary-900)",
          950: "var(--c-secondary-950)",
          DEFAULT: "var(--c-secondary-500)",
          foreground: "#001b1f"
        },

        accent: {
          50: "var(--c-accent-50)",
          100: "var(--c-accent-100)",
          200: "var(--c-accent-200)",
          300: "var(--c-accent-300)",
          400: "var(--c-accent-400)",
          500: "var(--c-accent-500)",
          600: "var(--c-accent-600)",
          700: "var(--c-accent-700)",
          800: "var(--c-accent-800)",
          900: "var(--c-accent-900)",
          950: "var(--c-accent-950)",
          DEFAULT: "var(--c-accent-500)"
        },

        neutral: {
          0: "var(--c-neutral-0)",
          50: "var(--c-neutral-50)",
          100: "var(--c-neutral-100)",
          200: "var(--c-neutral-200)",
          300: "var(--c-neutral-300)",
          400: "var(--c-neutral-400)",
          500: "var(--c-neutral-500)",
          600: "var(--c-neutral-600)",
          700: "var(--c-neutral-700)",
          800: "var(--c-neutral-800)",
          900: "var(--c-neutral-900)",
          950: "var(--c-neutral-950)"
        },

        success: {
          DEFAULT: "var(--c-success-500)",
          soft: "var(--c-success-100)",
          strong: "var(--c-success-700)"
        },
        warning: {
          DEFAULT: "var(--c-warning-400)",
          soft: "var(--c-warning-100)",
          strong: "var(--c-warning-700)"
        },
        danger: {
          DEFAULT: "var(--c-danger-500)",
          soft: "var(--c-danger-100)",
          strong: "var(--c-danger-700)"
        },
        info: {
          DEFAULT: "var(--c-info-500)",
          soft: "var(--c-info-100)",
          strong: "var(--c-info-700)"
        }
      },

      spacing: {
        "ds-1": "var(--space-1)",
        "ds-2": "var(--space-2)",
        "ds-3": "var(--space-3)",
        "ds-4": "var(--space-4)",
        "ds-6": "var(--space-6)",
        "ds-8": "var(--space-8)",
        "ds-12": "var(--space-12)",
        "ds-16": "var(--space-16)",
        "ds-24": "var(--space-24)"
      },

      zIndex: {
        dropdown: "1000",
        sticky: "1100",
        banner: "1200",
        overlay: "1300",
        modal: "1400",
        popover: "1500",
        toast: "1600",
        tooltip: "1700"
      },

      blur: {
        ds: "var(--blur-md)"
      },

      opacity: {
        disabled: "0.5"
      },

      fontSize: {
        "2xs": "var(--font-size-2xs)"
      },

      backgroundImage: {
        "gradient-accent": "var(--gradient-accent)",
        "gradient-rainbow": "var(--gradient-rainbow)"
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)"
      },

      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        primary: "var(--shadow-primary)",
        focus: "var(--shadow-focus)",
        "elevation-1": "var(--elevation-1)",
        "elevation-2": "var(--elevation-2)",
        "elevation-3": "var(--elevation-3)",
        "elevation-4": "var(--elevation-4)",
        "elevation-5": "var(--elevation-5)"
      },

      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        heavy: ["var(--font-heavy)"],
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
