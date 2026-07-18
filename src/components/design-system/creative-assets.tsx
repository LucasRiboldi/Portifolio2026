/**
 * Assets do Criativo em PARES — dois tipos por categoria.
 * ---------------------------------------------------------------------
 * O realm já tinha 23 ilustrações SVG (illustrations, illustrations-styles,
 * punk-illustrations, art-graphics). Acrescentar a vigésima quarta peça solta
 * não resolveria nada: o que faltava não era quantidade, era **sistema**.
 *
 * Por isso cada categoria abaixo vem em dois tipos que respondem a
 * necessidades diferentes, e a documentação diz qual usar quando. Um par
 * ensina uma decisão; vinte peças soltas ensinam um catálogo.
 *
 *   Ícones      → contorno (UI) e adesivo (destaque) — o MESMO desenho
 *   Ilustrações → spot (acompanha texto) e cena (ocupa a página)
 *   Imagens     → retrato e paisagem, ambas geradas, sem arquivo
 *
 * Nada aqui carrega imagem: tudo é SVG inline, pelo mesmo motivo das
 * texturas de 09.8 — não custa rede e herda a tinta da dimensão.
 */
import * as React from "react"

type P = { className?: string }

/* ═══════════════ ÍCONES — o mesmo desenho, dois tratamentos ═══════════════ */
/**
 * A decisão que faz disto um sistema e não dois conjuntos: a geometria é
 * IDÊNTICA nos dois tipos. Só muda o tratamento — contorno vazado de 2px
 * contra sólido com borda preta e sombra chapada. Trocar de tipo nunca muda
 * o desenho, então o usuário reconhece o mesmo ícone nos dois contextos.
 *
 * Grade de 24, traço de 2, cantos vivos: o mesmo raio 0 do resto do realm.
 */

/** Os caminhos, uma vez só. É daqui que os dois tipos saem. */
const GLIFOS: { id: string; nome: string; d: React.ReactNode }[] = [
  {
    id: "teia",
    nome: "Teia",
    d: (
      <>
        <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
        <path d="M12 7.5 16.5 12 12 16.5 7.5 12Z" />
      </>
    ),
  },
  {
    id: "portal",
    nome: "Portal",
    d: (
      <>
        <ellipse cx="12" cy="12" rx="9" ry="6" />
        <ellipse cx="12" cy="12" rx="4.5" ry="2.8" />
      </>
    ),
  },
  {
    id: "raio",
    nome: "Raio",
    d: <path d="M13.5 2 5 13h5.5L9.5 22 19 10h-5.8Z" />,
  },
  {
    id: "painel",
    nome: "Painel",
    d: (
      <>
        <path d="M3 4h18v16H3Z" />
        <path d="M3 10h11M14 10v10" />
      </>
    ),
  },
  {
    id: "balao",
    nome: "Balão",
    d: <path d="M3 5h18v11H9l-5 4v-4H3Z" />,
  },
  {
    id: "estrela",
    nome: "Estrela",
    d: <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />,
  },
  {
    id: "camera",
    nome: "Câmera",
    d: (
      <>
        <path d="M3 7h4l1.5-2h7L17 7h4v13H3Z" />
        <circle cx="12" cy="13" r="3.6" />
      </>
    ),
  },
  {
    id: "spray",
    nome: "Spray",
    d: (
      <>
        <path d="M8 8h7v13H8Z" />
        <path d="M10 8V4h3v4M17 4h2M17 7h2M17 10h2" />
      </>
    ),
  },
]

/** Tipo 1 — contorno. Para UI: herda a tinta do texto, não pesa. */
export function IconeContorno({ id, className }: P & { id: string }) {
  const g = GLIFOS.find((x) => x.id === id)
  if (!g) return null
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label={g.nome}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="miter"
      strokeLinecap="butt"
    >
      {g.d}
    </svg>
  )
}

/** Tipo 2 — adesivo. Para destaque: preenchido, borda preta e sombra chapada. */
export function IconeAdesivo({ id, className, cor = "var(--sv-yellow)" }: P & { id: string; cor?: string }) {
  const g = GLIFOS.find((x) => x.id === id)
  if (!g) return null
  return (
    <span
      className={`inline-grid place-items-center border-[3px] border-black p-1.5 shadow-[3px_3px_0_0_#000] ${className ?? ""}`}
      style={{ background: cor }}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-full"
        role="img"
        aria-label={g.nome}
        fill="none"
        stroke="#000"
        strokeWidth="2.4"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      >
        {g.d}
      </svg>
    </span>
  )
}

export const ICONES = GLIFOS.map((g) => ({ id: g.id, nome: g.nome }))

/* ═══════════════ ILUSTRAÇÕES — spot e cena ═══════════════ */

/**
 * Tipo 1 — SPOT. Pequena, uma cor, sem cenário. Acompanha um parágrafo sem
 * disputar com ele; funciona a 32px. É o equivalente ilustrado de um ícone
 * com personalidade.
 *
 * NORMA DE MASSA ÓPTICA: cada spot preenche ~50 dos 64 do viewBox na sua
 * dimensão dominante. Sem essa regra os três saem com pesos diferentes na
 * mesma linha — foi o que aconteceu na primeira versão, em que a fita ocupava
 * só uma faixa central e parecia dois pontos menor que a máscara ao lado.
 */
export function SpotMascara({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Máscara">
      <path
        d="M32 6c14 0 24 7 24 16 0 12-10 26-24 36C18 48 8 34 8 22 8 13 18 6 32 6Z"
        fill="currentColor"
      />
      <path d="M20 24c4-4 8-4 10 0-3 5-7 5-10 0Z" fill="#0a0612" />
      <path d="M44 24c-4-4-8-4-10 0 3 5 7 5 10 0Z" fill="#0a0612" />
    </svg>
  )
}

export function SpotFita({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Fita">
      <rect x="6" y="12" width="52" height="40" rx="2" fill="currentColor" />
      <circle cx="22" cy="28" r="7.5" fill="#0a0612" />
      <circle cx="42" cy="28" r="7.5" fill="#0a0612" />
      <rect x="16" y="42" width="32" height="5" fill="#0a0612" opacity="0.5" />
    </svg>
  )
}

export function SpotLata({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Lata de spray">
      <rect x="14" y="18" width="26" height="40" fill="currentColor" />
      <rect x="20" y="6" width="14" height="12" fill="currentColor" />
      <circle cx="50" cy="12" r="4" fill="currentColor" opacity="0.85" />
      <circle cx="58" cy="20" r="2.8" fill="currentColor" opacity="0.65" />
      <circle cx="48" cy="24" r="2.2" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

/**
 * Tipo 2 — CENA. Multi-camada, com profundidade e paleta própria. Ocupa a
 * página: hero, estado vazio, página de erro. Abaixo de 200px vira mancha —
 * é o inverso exato do spot, e é por isso que os dois tipos existem.
 */
export function CenaSalto({ className }: P) {
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-label="Salto entre prédios">
      {/* céu em camadas */}
      <rect width="240" height="160" fill="#1a0033" />
      <circle cx="196" cy="34" r="22" fill="var(--sv-magenta)" opacity="0.55" />
      {/* retícula do céu */}
      <rect width="240" height="160" fill="url(#cs-dots)" opacity="0.35" />
      <defs>
        <pattern id="cs-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill="var(--sv-cyan)" opacity="0.5" />
        </pattern>
      </defs>
      {/* prédios ao fundo */}
      <g fill="#33004d">
        <rect x="8" y="70" width="34" height="90" />
        <rect x="50" y="52" width="26" height="108" />
        <rect x="168" y="60" width="30" height="100" />
        <rect x="206" y="80" width="26" height="80" />
      </g>
      {/* prédios da frente */}
      <g fill="#0a0612">
        <rect x="0" y="96" width="46" height="64" />
        <rect x="192" y="104" width="48" height="56" />
      </g>
      {/* teia */}
      <path
        d="M40 96 L118 58"
        stroke="var(--sv-cyan)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* figura em silhueta */}
      <g fill="var(--sv-magenta)">
        <circle cx="122" cy="54" r="9" />
        <path d="M122 62 L112 84 L120 84 L124 72 L130 84 L138 82 Z" />
        <path d="M114 66 L98 60 L96 66 L112 74 Z" />
      </g>
      {/* linhas de velocidade */}
      <g stroke="var(--sv-yellow)" strokeWidth="1.6" opacity="0.75">
        <path d="M146 44h30M152 52h26M158 60h20" />
      </g>
    </svg>
  )
}

export function CenaOficina({ className }: P) {
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-label="Oficina de protótipos">
      <rect width="240" height="160" fill="#0b1220" />
      <rect width="240" height="160" fill="url(#co-grid)" opacity="0.5" />
      <defs>
        <pattern id="co-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0v16" fill="none" stroke="var(--sv-cyan)" strokeWidth="0.6" opacity="0.5" />
        </pattern>
      </defs>
      {/* bancada */}
      <rect x="16" y="106" width="208" height="10" fill="#1c2b45" />
      <rect x="30" y="116" width="8" height="34" fill="#1c2b45" />
      <rect x="202" y="116" width="8" height="34" fill="#1c2b45" />
      {/* monitor */}
      <rect x="52" y="52" width="76" height="52" fill="#08101c" stroke="var(--sv-cyan)" strokeWidth="2" />
      <path d="M60 62h48M60 70h34M60 78h56M60 86h28" stroke="var(--sv-lime)" strokeWidth="2.4" />
      <rect x="82" y="104" width="16" height="4" fill="#1c2b45" />
      {/* papéis */}
      <g fill="var(--sv-paper)" opacity="0.9">
        <rect x="146" y="76" width="42" height="28" transform="rotate(-6 167 90)" />
        <rect x="156" y="70" width="42" height="28" transform="rotate(5 177 84)" />
      </g>
      {/* caneca */}
      <rect x="196" y="88" width="16" height="18" fill="var(--sv-magenta)" />
      <path d="M212 92h6v8h-6" fill="none" stroke="var(--sv-magenta)" strokeWidth="3" />
      {/* luminária */}
      <path d="M30 26v34" stroke="#1c2b45" strokeWidth="3" />
      <path d="M18 26h24l-6 12H24Z" fill="var(--sv-yellow)" />
      <path d="M30 38 L14 106 L46 106 Z" fill="var(--sv-yellow)" opacity="0.12" />
    </svg>
  )
}

/* ═══════════════ IMAGENS DE EXEMPLO — retrato e paisagem ═══════════════ */

/**
 * Placeholder gerado, não arquivo. Dois formatos porque são dois problemas:
 * o retrato precisa sugerir uma PESSOA sem inventar um rosto (as iniciais
 * resolvem), e a paisagem precisa preencher área sem competir com o texto
 * por cima.
 *
 * A cor sai do próprio texto (hash das iniciais), então duas pessoas
 * diferentes nunca recebem a mesma — e a mesma pessoa recebe sempre a sua.
 */
const PALETA = [
  "var(--sv-magenta)",
  "var(--sv-cyan)",
  "var(--sv-violet)",
  "var(--sv-lime)",
  "var(--sv-orange)",
  "var(--sv-yellow)",
]

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export function ImagemRetrato({ nome, className }: P & { nome: string }) {
  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
  const cor = PALETA[hash(nome) % PALETA.length]
  return (
    <span
      className={`relative grid aspect-square place-items-center overflow-hidden border-[3px] border-black ${className ?? ""}`}
      style={{ background: cor }}
      role="img"
      aria-label={`Retrato de ${nome}`}
    >
      <span
        className="art-ht-dots pointer-events-none absolute inset-0 opacity-45"
        style={{ ["--ht-color" as string]: "rgba(0,0,0,0.5)", ["--ht-size" as string]: "6px" }}
        aria-hidden
      />
      <span className="sv-display relative text-[2.2em] uppercase leading-none text-black">
        {iniciais}
      </span>
    </span>
  )
}

export function ImagemPaisagem({ seed = "capa", className }: P & { seed?: string }) {
  const h = hash(seed)
  const a = PALETA[h % PALETA.length]
  const b = PALETA[(h >> 3) % PALETA.length]
  return (
    <span
      className={`relative block overflow-hidden border-[3px] border-black ${className ?? ""}`}
      role="img"
      aria-label="Imagem de exemplo"
    >
      <svg viewBox="0 0 240 135" className="block w-full" aria-hidden>
        <rect width="240" height="135" fill="#0a0612" />
        <circle cx={40 + (h % 60)} cy="44" r="46" fill={a} opacity="0.75" />
        <circle cx={170 - (h % 40)} cy="92" r="54" fill={b} opacity="0.6" />
        <path d="M0 104 L60 74 L108 100 L164 66 L240 96 V135 H0Z" fill="#0a0612" opacity="0.85" />
      </svg>
      <span
        className="art-ht-dots pointer-events-none absolute inset-0 opacity-35"
        style={{ ["--ht-color" as string]: "rgba(0,0,0,0.6)", ["--ht-size" as string]: "5px" }}
        aria-hidden
      />
    </span>
  )
}
