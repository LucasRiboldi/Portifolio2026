"use client"

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"

/**
 * A moldura cinematográfica da landing do Criativo.
 *
 * Client boundary fino: liga o smooth scroll (Lenis + ScrollTrigger) só nesta
 * página, envolvendo as zonas (que seguem server components). Fica aqui, e não
 * no layout do site, para o resto do portal continuar no scroll nativo.
 *
 * O cursor customizado (`CustomCursor`) foi desligado a pedido — o ponteiro
 * nativo volta. O componente segue em `./custom-cursor.tsx` caso se queira
 * reativar.
 */
export function CriativoExperience({ children }: { children: React.ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>
}
