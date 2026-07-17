/**
 * As 20 dimensões de arte do realm Criativo — dado puro.
 *
 * Vive fora de `sv-canvas.tsx` de propósito: isto é catálogo, não componente.
 * Enquanto morava no .tsx, qualquer consumidor (o registro de variantes, um
 * teste em node) arrastava JSX junto e não conseguia sequer importar a lista.
 *
 * `sv-canvas.tsx` reexporta tudo, então os imports antigos continuam válidos.
 */

export type Dimension =
  | 'multiverse'
  | 'neon'
  | 'renaissance'
  | 'nouveau'
  | 'noir'
  | 'punk'
  | '2099'
  | 'horror'
  | 'manga'
  | 'cartoon'
  | 'graffiti'
  | 'pixel'
  | 'blueprint'
  | 'spot'
  | 'lego'
  | 'prowler'
  | 'glitch'
  | 'portal'
  | 'society'
  | 'riso'

/** Classe de arte por dimensão — fonte única (SvCanvas, cards e styleguide). */
export const dimClass: Record<Dimension, string> = {
  multiverse: '',
  neon: 'sv-dim-neon',
  renaissance: 'sv-dim-renaissance',
  nouveau: 'sv-dim-nouveau',
  noir: 'sv-dim-noir sv-grain',
  punk: 'sv-dim-punk',
  '2099': 'sv-dim-2099',
  horror: 'sv-dim-horror',
  manga: 'sv-dim-manga',
  cartoon: 'sv-dim-cartoon',
  graffiti: 'sv-dim-graffiti',
  pixel: 'sv-dim-pixel',
  blueprint: 'sv-dim-blueprint',
  spot: 'sv-dim-spot',
  lego: 'sv-dim-lego',
  prowler: 'sv-dim-prowler',
  glitch: 'sv-dim-glitch',
  portal: 'sv-dim-portal',
  society: 'sv-dim-society',
  riso: 'sv-dim-riso',
}

/** Metadata for every dimension — drives the styleguide & switcher. */
export const DIMENSIONS: { id: Dimension; label: string; earth: string; desc: string }[] = [
  { id: 'multiverse', label: 'Multiverso', earth: 'HUB', desc: 'Mashup geral — glitch, arco-íris, 90s' },
  { id: 'neon', label: 'Mumbattan', earth: '50101', desc: 'Neon fluorescente, glow, saturação' },
  { id: 'renaissance', label: 'Renascença', earth: '65 · Abutre', desc: 'Pergaminho sépia, hachura Da Vinci' },
  { id: 'nouveau', label: 'Gwen / Nouveau', earth: '65', desc: 'Aquarela wet-on-wet, ornamento' },
  { id: 'noir', label: 'Noir', earth: '42', desc: 'P&B alto contraste, granulado' },
  { id: 'punk', label: 'Spider-Punk', earth: '138B', desc: 'Xerox zine, papel rasgado' },
  { id: '2099', label: 'Nueva York 2099', earth: '928', desc: 'Brutalismo, grid holográfico' },
  { id: 'manga', label: 'Manga', earth: '14512 · Peni', desc: 'Screentone P&B, blush anime' },
  { id: 'cartoon', label: 'Spider-Ham', earth: '8311', desc: 'Looney Tunes, primárias, rubber-hose' },
  { id: 'graffiti', label: 'Graffiti', earth: '1610 · Miles', desc: 'Spray, tijolo, tags, drips' },
  { id: 'pixel', label: '8-bit', earth: 'PIXL', desc: 'Retro game, dither, CRT' },
  { id: 'blueprint', label: 'Blueprint', earth: 'BYTE', desc: 'Wireframe técnico, guias tracejadas' },
  { id: 'spot', label: 'The Spot', earth: 'VOID', desc: 'Tinta viva, linhas de construção, vazios' },
  { id: 'lego', label: 'LEGO', earth: '13122', desc: 'Tijolos plásticos, studs, brilho ABS' },
  { id: 'prowler', label: 'Prowler', earth: '42 · Aaron', desc: 'Roxo + ouro, garras, sombra urbana' },
  { id: 'glitch', label: 'Evento Canônico', earth: 'ANOM', desc: 'Datamosh vermelho-ciano, VHS' },
  { id: 'portal', label: 'Colisor', earth: 'RIFT', desc: 'Caleidoscópio arco-íris, fenda' },
  { id: 'society', label: 'Spider-Society', earth: 'HQ', desc: 'Branco clean, holo-ciano, brutalismo' },
  { id: 'riso', label: 'Risografia', earth: 'RISO', desc: 'Impressão 2 cores, offset, granulado' },
  { id: 'horror', label: 'Horror', earth: '???', desc: 'Vermelho sangue, colapso' },
]
