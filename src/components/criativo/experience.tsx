"use client"

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"

/**
 * A moldura cinematográfica da landing do Criativo.
 *
 * Client boundary fino: liga o smooth scroll (Lenis + ScrollTrigger) só nesta
 * página, envolvendo as zonas (que seguem server components). Fica aqui, e não
 * no layout do site, para o resto do portal continuar no scroll nativo.
 *
 * O cursor customizado foi desligado a pedido — o ponteiro nativo volta. O
 * componente ficou meses no repositório "caso se queira reativar", junto com
 * dez regras de CSS e os `data-cursor` espalhados pela capa: 84 linhas de
 * componente mais o CSS, tudo a ser lido, tipado e compilado por ninguém.
 * Código guardado por precaução é código que ninguém mantém e todos leem —
 * o histórico do git é onde ele fica bem guardado. Removido; `git log` sabe
 * onde encontrá-lo se um dia voltar a fazer falta.
 */
export function CriativoExperience({ children }: { children: React.ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>
}
