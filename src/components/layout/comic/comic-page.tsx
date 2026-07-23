import { cn } from "@/lib/utils"
import { CameraStage } from "./camera-stage"
import { InkBackdrop } from "@/components/effects/ink-backdrop"

/**
 * A revista — a raiz da experiência.
 *
 * Reúne, numa camada só, as quatro coisas que valem para a página inteira e que
 * nenhum capítulo devia repetir: as medidas do papel (`cp-page`), a superfície
 * impressa (`cp-paper` + `cp-offset`), o fundo de tinta em WebGL e a câmara que
 * persegue os capítulos.
 *
 * A ordem das camadas é a da impressão real: tinta ao fundo (fixa, atrás de
 * tudo), papel por cima, conteúdo a seguir, e o desalinho de offset no topo —
 * porque na prensa a má-registação acontece *depois* da imagem, não antes.
 *
 * Server component: só o `CameraStage` e o `InkBackdrop` cruzam para o cliente.
 * Os capítulos e requadros continuam a renderizar no servidor.
 */
export function ComicPage({
  children,
  className,
  /** Cor da mancha de tinta do fundo WebGL. */
  ink,
}: {
  children: React.ReactNode
  className?: string
  ink?: string
}) {
  return (
    <div className={cn("cp-page cp-paper cp-offset", className)}>
      <InkBackdrop color={ink} />
      <CameraStage>{children}</CameraStage>
    </div>
  )
}
