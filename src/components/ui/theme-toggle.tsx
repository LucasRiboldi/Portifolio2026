"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const BUTTON_CLASSES =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // O tema só é conhecido no cliente. Renderizamos um placeholder estável até
  // montar para que o HTML do servidor case com o primeiro render do cliente
  // (evita "Hydration failed").
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button type="button" className={BUTTON_CLASSES} aria-label="Alternar tema">
        <span className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={BUTTON_CLASSES}
      aria-label="Alternar tema"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
