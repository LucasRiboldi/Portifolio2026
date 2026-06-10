"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme }
from "next-themes";

export function ThemeToggle() {

  const {
    theme,
    setTheme
  } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(
          theme === "dark"
            ? "light"
            : "dark"
        )
      }

      className="
      flex h-9 w-9
      items-center
      justify-center
      rounded-lg
      border border-border
      bg-card
      text-muted-foreground
      transition-colors
      hover:text-foreground
      "
      aria-label="Alternar tema"
    >
      {theme === "dark"
        ? <Sun size={18}/>
        : <Moon size={18}/>
      }
    </button>
  );
}
