/**
 * DESIGN TOKENS — fonte única em TypeScript
 * ------------------------------------------------------------
 * Espelha `src/styles/tokens.css`. Consumido por:
 *   - páginas de /design-system (tabelas de token "live")
 *   - scripts/export-tokens.mjs (gera JSON W3C DTCG + Figma)
 *
 * Regra de ouro: ao mudar um valor, mude AQUI e no tokens.css
 * (o CSS é o runtime; este arquivo é a documentação tipada +
 * origem do export). Mantê-los em sincronia é validado no CI
 * futuramente. Ver docs/design-system/tokens.md.
 */

export const color = {
  primary: {
    50: "#fff0f7", 100: "#ffd6ea", 200: "#ffadd4", 300: "#ff85bf",
    400: "#ff5aa8", 500: "#ff2d95", 600: "#e01a7d", 700: "#b31363",
    800: "#850e49", 900: "#5c0a33", 950: "#33061c",
  },
  secondary: {
    50: "#e6feff", 100: "#b8fbff", 200: "#7df6ff", 300: "#3deffb",
    400: "#00e5ff", 500: "#00c4e0", 600: "#009cb3", 700: "#007587",
    800: "#004f5c", 900: "#002e36", 950: "#00171b",
  },
  accent: {
    50: "#f3ecff", 100: "#e0ccff", 200: "#c4a0ff", 300: "#a570ff",
    400: "#8c47fb", 500: "#7b2ff7", 600: "#6417d6", 700: "#4e11a8",
    800: "#380c78", 900: "#23074c", 950: "#130428",
  },
  neutral: {
    0: "#ffffff", 50: "#f7f5fb", 100: "#ece8f2", 200: "#d6cfe0",
    300: "#b3a9c4", 400: "#8b7fa0", 500: "#6a5f7d", 600: "#4f4660",
    700: "#382f47", 800: "#241d30", 900: "#140a24", 950: "#0a0612",
  },
  success: {
    50: "#edfce8", 100: "#d0f7c4", 200: "#a6ee8f", 300: "#74e057",
    400: "#4bc72f", 500: "#2ea818", 600: "#218012", 700: "#19600f",
    800: "#12400c", 900: "#0b2606",
  },
  warning: {
    50: "#fffde6", 100: "#fff8b3", 200: "#fff073", 300: "#ffe600",
    400: "#f5c400", 500: "#d9a600", 600: "#a67e00", 700: "#735700",
    800: "#403000", 900: "#1f1700",
  },
  danger: {
    50: "#fff0eb", 100: "#ffd6c7", 200: "#ffb199", 300: "#ff855a",
    400: "#ff5a1f", 500: "#e63c00", 600: "#b32f00", 700: "#852300",
    800: "#571700", 900: "#2e0c00",
  },
  info: {
    50: "#e6f1ff", 100: "#b8d6ff", 200: "#7db0ff", 300: "#4a90ff",
    400: "#1f6fff", 500: "#0078ff", 600: "#0060cc", 700: "#004899",
    800: "#003066", 900: "#001833",
  },
} as const

export const typography = {
  family: {
    sans: "var(--font-sans)",
    display: "var(--font-display)",
    heavy: "var(--font-heavy)",
    mono: "var(--font-mono)",
  },
  size: {
    "2xs": "0.625rem", xs: "0.75rem", sm: "0.875rem", md: "1rem",
    lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem",
    "4xl": "2.25rem", "5xl": "3rem", "6xl": "3.75rem", "7xl": "4.5rem",
  },
  lineHeight: {
    none: "1", tight: "1.15", snug: "1.3", normal: "1.5", relaxed: "1.7",
  },
  weight: {
    normal: "400", medium: "500", semibold: "600", bold: "700", black: "900",
  },
  tracking: {
    tighter: "-0.03em", tight: "-0.01em", normal: "0em",
    wide: "0.03em", wider: "0.06em", widest: "0.12em",
  },
} as const

export const spacing = {
  0: "0", 1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem", 5: "1.25rem",
  6: "1.5rem", 8: "2rem", 10: "2.5rem", 12: "3rem", 16: "4rem", 20: "5rem",
  24: "6rem", 32: "8rem",
} as const

export const radius = {
  none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem",
  xl: "1rem", "2xl": "1.5rem", full: "9999px",
} as const

export const borderWidth = {
  0: "0", 1: "1px", 2: "2px", 3: "3px", 4: "4px",
} as const

export const shadow = {
  xs: "0 1px 2px rgba(0,0,0,0.30)",
  sm: "0 2px 6px rgba(0,0,0,0.35)",
  md: "0 6px 16px rgba(0,0,0,0.40)",
  lg: "0 12px 32px rgba(0,0,0,0.45)",
  xl: "0 24px 56px rgba(0,0,0,0.50)",
  primary: "0 8px 24px rgba(255,45,149,0.35)",
  focus: "0 0 0 3px rgba(0,229,255,0.55)",
} as const

export const elevation = {
  0: "none",
  1: "2px 2px 0 0 #000",
  2: "4px 4px 0 0 #000",
  3: "6px 6px 0 0 #000",
  4: "8px 8px 0 0 #000",
  5: "10px 10px 0 0 #000",
} as const

export const opacity = {
  0: "0", 5: "0.05", 10: "0.10", 20: "0.20", 40: "0.40",
  60: "0.60", 80: "0.80", 100: "1",
} as const

export const blur = {
  sm: "4px", md: "8px", lg: "16px", xl: "24px",
} as const

export const zIndex = {
  base: "0", docked: "10", dropdown: "1000", sticky: "1100",
  banner: "1200", overlay: "1300", modal: "1400", popover: "1500",
  toast: "1600", tooltip: "1700",
} as const

export const motion = {
  duration: {
    instant: "75ms", fast: "150ms", normal: "250ms",
    slow: "350ms", slower: "500ms",
  },
  ease: {
    linear: "linear",
    in: "cubic-bezier(0.4,0,1,1)",
    out: "cubic-bezier(0,0,0.2,1)",
    inOut: "cubic-bezier(0.4,0,0.2,1)",
    spring: "cubic-bezier(0.34,1.56,0.64,1)",
  },
} as const

export const breakpoint = {
  mobile: "375px",
  "large-mobile": "425px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
} as const

export const gradient = {
  accent: "linear-gradient(90deg, #ffe600, #ff2d95, #00e5ff)",
  text: "linear-gradient(90deg, #ff2d95, #7b2ff7)",
  rainbow: "linear-gradient(90deg, #ffe600, #ff2d95, #00e5ff, #4bc72f)",
} as const

export const tokens = {
  color, typography, spacing, radius, borderWidth, shadow,
  elevation, opacity, blur, zIndex, motion, breakpoint, gradient,
} as const

export type Tokens = typeof tokens
export default tokens
