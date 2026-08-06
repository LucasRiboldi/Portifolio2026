import { cn }
from "@/lib/utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({
  children,
  className
}: ContainerProps) {

  return (
    <div
      className={cn(
        "mx-auto",
        "w-full",
        "max-w-container",
        // Goteira responsiva, e não `px-6` fixo: estes três degraus são os
        // mesmos de `--cp-gutter` (comic-layout.css) e os mesmos do cabeçalho.
        // Com o padding fixo, o rodapé começava 8px à esquerda do conteúdo da
        // página no desktop — perto o bastante para não parecer intencional e
        // longe o bastante para se notar.
        "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
