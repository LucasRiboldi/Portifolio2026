/* ------------------------------------------------------------------
   Rótulos de apoio compartilhados pelas matérias de UI do Anfitrião
   (arcane-ui / arcane-ui-letras). Extraídos para uma fonte única em vez
   de cada arquivo redefinir a sua cópia — o mesmo motivo que moveu Nota
   para arcane-chapters.
   ------------------------------------------------------------------ */

/** A linha de classes CSS ao pé de uma matéria (o "veja no CSS"). */
export function Classes({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
      {children}
    </p>
  )
}

/** Rótulo em versalete acima de um bloco — sépia por padrão, tinta de erro no tom "erro". */
export function Rotulo({ children, tom = "sepia" }: { children: React.ReactNode; tom?: "sepia" | "erro" }) {
  return (
    <p
      className="mb-2 text-[11px] uppercase tracking-wide"
      style={{ color: tom === "erro" ? "#7a2a1c" : "var(--dp-sepia)" }}
    >
      {children}
    </p>
  )
}
