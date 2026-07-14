/**
 * SkipLink — "pular para o conteúdo" (WCAG 2.4.1). Invisível até receber foco.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-tooltip focus:rounded-md focus:border-[3px] focus:border-black focus:bg-[var(--sv-yellow)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:uppercase focus:text-black focus:shadow-[var(--elevation-2)]"
    >
      Pular para o conteúdo
    </a>
  )
}
