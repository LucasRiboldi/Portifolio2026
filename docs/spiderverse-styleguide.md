# Spider-Verse Style Guide — Portfólio LR

Sistema visual **multiestilo e disruptivo** inspirado em *Spider-Man: Into / Across the
Spider-Verse*, onde cada dimensão do multiverso possui sua própria linguagem de desenho.
Aqui, **cada página do portfólio é uma dimensão diferente**.

## Princípio

Nada segue o padrão "web normal". A base é HQ (halftone Ben-Day, painéis de contorno
preto, aberração cromática RGB, onomatopeias, balões de fala), e sobre ela cada rota
troca a *dimensão* — mudando fundo, cor de tinta, tratamento dos painéis e tipografia.

## Dimensões

| Dimensão | Classe | Página | Referência do filme | Linguagem |
|---|---|---|---|---|
| Multiverso | `sv-dim-*` (default) | Home | Mashup geral | Glitch RGB, arco-íris, 90s comic |
| Neon / Mumbattan | `sv-dim-neon` | Ferramentas | Terra-50101, Spider-Man Índia | Neon fluorescente, glow, saturação |
| Renascença | `sv-dim-renaissance` | Portfólio | O Abutre (Da Vinci) | Pergaminho sépia, hachura, tinta |
| Art Nouveau + Gwen | `sv-dim-nouveau` | Sobre | Terra-65 (aquarela) | Papel creme, wet-on-wet, ornamento |
| Noir | `sv-dim-noir` | Galeria / Blog | Terra-42 (Noir) | P&B alto contraste, granulado |
| Spider-Punk | `sv-dim-punk` | Contato | Terra-138B (Hobie) | Xerox, papel rasgado, colagem zine |
| Nueva York 2099 | `sv-dim-2099` | GitHub | Terra-928 (Miguel) | Brutalismo, grid holográfico Syd Mead |
| Horror | `sv-dim-horror` | 404 | Dimensão em colapso | Vermelho sangue, distorção, grime |
| Manga | `sv-dim-manga` | — | Terra-14512 (Peni) | Screentone P&B, blush anime, speed lines |
| Spider-Ham | `sv-dim-cartoon` | — | Terra-8311 | Looney Tunes, primárias, rubber-hose |
| Graffiti | `sv-dim-graffiti` | — | Terra-1610 (Miles) | Spray, tijolo, tags, drips |
| 8-bit | `sv-dim-pixel` | — | Retro | Pixel blocky, dither, CRT verde/magenta |
| Blueprint | `sv-dim-blueprint` | — | Spider-Byte | Wireframe técnico ciano, guias tracejadas |

> **Página viva:** `/styleguide` — switcher interativo que troca as 13 dimensões ao vivo,
> mostrando todos os componentes. `/dimensoes` — índice visual (portais).

## Arquitetura CSS

- `src/styles/spiderverse.css` — base: canvas dirigido por variáveis (`--c-bg`, `--c-ink`,
  `--c-dot`…), painéis (`.sv-panel`), tipografia (`.sv-display`, `.sv-heavy`, `.sv-glitch`,
  `.sv-rainbow`), stickers, balões (`.sv-bubble`), onomatopeias (`.sv-onoma`), tilts.
- `src/styles/spiderverse-dimensions.css` — cada `.sv-dim-*` sobrescreve as variáveis do
  canvas e re-estiliza os `.sv-panel` internos.

## Componentes React (`src/components/spiderverse/`)

- `SvCanvas` — wrapper full-bleed que aplica a dimensão via prop `dimension`.
  Exporta também `DIMENSIONS` (metadados de todas as dimensões) e o tipo `Dimension`.
- `ComicHeader` — cabeçalho de página (kicker sticker + título display + subtítulo).
- `Panel` — painel de HQ (`tilt={1|2|3}`), adapta-se à dimensão do canvas.
- `ComicButton` — botão comic (`color: yellow | cyan | magenta | lime`).
- `SpeechBubble` — balão de fala (`spiky` para grito).
- `Onoma` — onomatopeia (POW!, ZAP!, THWIP!) com cores `yellow | cyan | magenta | lime`.

### Animações (`motion.ts`)

- `popTilt` — entrada com tilt que assenta (padrão da casa).
- `tiltStack` — cards inclinam para lados opostos ao entrar.
- `dimSwap` — troca entre estilos (skew + fade), usada no switcher.
- Classes CSS: `.sv-shift` (tilt + hue-rotate contínuo entre estilos) e `.sv-jump`
  (glitch ao trocar de dimensão).

## Fontes

- **Bangers** (`--font-display`) — títulos/action-comic.
- **Archivo Black** (`--font-heavy`) — rótulos/UI.
- **Geist** (`--font-sans`) — corpo de texto.

## Paleta base (hiper-saturada)

`--sv-magenta #ff2d95` · `--sv-cyan #00e5ff` · `--sv-yellow #ffe600` ·
`--sv-orange #ff5a1f` · `--sv-violet #7b2ff7` · `--sv-lime #b6ff00`

## Acessibilidade

`prefers-reduced-motion` desativa glitch, drift do halftone, arco-íris e pulso das
onomatopeias.
