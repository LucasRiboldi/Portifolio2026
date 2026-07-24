/**
 * Gerador das capas da landing /criativo.
 * ---------------------------------------------------------------------------
 * Desenha um SVG por item (arte, projeto, revista, filme, faixa, vídeo, tira)
 * em `public/covers/<coleção>/<id>.svg`, na paleta da dimensão a que o item
 * pertence.
 *
 * Uso:
 *   node scripts/generate-covers.mjs          # escreve os ficheiros
 *   node scripts/generate-covers.mjs --check  # só verifica se estão em dia
 *
 * ## Porque SVG desenhado e não imagem gerada
 *
 * A alternativa testada (gerar cada capa numa ferramenta de design com IA)
 * devolvia o texto *pintado* em vez de composto: os títulos em português
 * saíam com acentos trocados e letras a mais ("RETÉPCULA NÉO OBEECE"). Aqui a
 * tipografia é tipografia, a paleta é a mesma dos tokens da zona, e o
 * resultado é determinístico — o mesmo item dá sempre a mesma capa, o que
 * mantém o diff limpo e permite versionar as capas com o código.
 *
 * ## Porque a arte é abstrata e quase sem texto
 *
 * O card já mostra o título, o autor e a nota em HTML, onde são texto real,
 * pesquisável e legível por leitor de ecrã. Repeti-los dentro da imagem seria
 * duplicá-los numa camada que ninguém consegue ler nem traduzir. A capa fica
 * com a inicial e a linguagem gráfica da casa; o resto é conteúdo da página.
 *
 * E há um segundo motivo, este de correção: numa imagem consumida via `<img>`
 * o SVG é um documento isolado que não herda as fontes do site. Uma manchete
 * inteira ali dentro cairia numa fonte de sistema e desalinharia com o resto
 * da página. Uma inicial sobrevive a essa substituição; uma frase não.
 *
 * ## Sobre as obras de terceiros
 *
 * Revistas e filmes são obras reais. Estas capas são peças autorais e
 * abstratas com a inicial do título — nunca uma reprodução ou imitação da
 * capa/cartaz oficial.
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = join(ROOT, "public", "covers")

/* ==========================================================================
   1 · Paleta — espelha os tokens de `styles/comic-2026.css`
   ========================================================================== */

const INK = "#12100e"
const PAPER = "#fff6e0"

/** Cada dimensão: fundo escuro (dois tons) e três acentos. */
const ZONE = {
  atelie: { bg: ["#2b0a4d", "#7a1bc4"], a: "#9dff2f", b: "#ff2d95", c: "#00d4ff" },
  oficina: { bg: ["#041c3a", "#0b4a8f"], a: "#00d4ff", b: "#9dff2f", c: "#ffd200" },
  banca: { bg: ["#3a1206", "#a8340f"], a: "#ff2f4e", b: "#1b6cff", c: "#ffffff" },
  cine: { bg: ["#12043a", "#4a1178"], a: "#ff6b1f", b: "#00d4ff", c: "#ff8fd0" },
  radio: { bg: ["#2a0740", "#6b1bb0"], a: "#8b3dff", b: "#9dff2f", c: "#ffd200" },
  videoteca: { bg: ["#04180b", "#0d5226"], a: "#9dff2f", b: "#ff2d95", c: "#00d4ff" },
  tirinhas: { bg: ["#063a5e", "#0e86c4"], a: "#ff2f4e", b: "#1b6cff", c: "#ffd200" },
}

/* ==========================================================================
   2 · Aleatoriedade determinística
   O mesmo item tem de dar sempre a mesma capa: se a variação viesse de
   `Math.random`, cada execução do script reescrevia as 27 imagens e o diff
   ficava impossível de rever.
   ========================================================================== */

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32 — PRNG curto e estável, semeado pelo id do item. */
function rng(seed) {
  let t = seed
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (r, arr) => arr[Math.floor(r() * arr.length)]
const between = (r, min, max) => min + r() * (max - min)

/* ==========================================================================
   3 · Camadas de desenho
   ========================================================================== */

/** Raios de velocidade a sair de um ponto focal. */
function rays(r, w, h, color) {
  const cx = between(r, w * 0.3, w * 0.7)
  const cy = between(r, h * 0.3, h * 0.6)
  const n = Math.floor(between(r, 26, 44))
  const reach = Math.hypot(w, h)
  let d = ""

  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + between(r, -0.05, 0.05)
    const spread = between(r, 0.012, 0.05)
    const start = between(r, 0.12, 0.4) * reach
    const x1 = cx + Math.cos(angle - spread) * start
    const y1 = cy + Math.sin(angle - spread) * start
    const x2 = cx + Math.cos(angle) * reach
    const y2 = cy + Math.sin(angle) * reach
    const x3 = cx + Math.cos(angle + spread) * start
    const y3 = cy + Math.sin(angle + spread) * start
    d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${x3.toFixed(1)} ${y3.toFixed(1)}Z`
  }

  return { path: `<path d="${d}" fill="${color}" opacity="0.85"/>`, cx, cy }
}

/**
 * A forma que segura a inicial. Três motivos, sorteados por item.
 *
 * Um motivo só torna a fila inteira uma variação da mesma capa — que é
 * exatamente o que se quer evitar numa página que finge ser feita à mão. Três
 * chegam para a estante deixar de parecer template sem perder a família.
 */
function motif(r, cx, cy, radius, color) {
  switch (Math.floor(r() * 3)) {
    // Explosão de pontas alternadas — a onomatopeia clássica.
    case 0: {
      const spikes = Math.floor(between(r, 9, 15))
      const pts = []
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i / (spikes * 2)) * Math.PI * 2
        const len = i % 2 === 0 ? radius : radius * between(r, 0.5, 0.72)
        pts.push(`${(cx + Math.cos(angle) * len).toFixed(1)},${(cy + Math.sin(angle) * len).toFixed(1)}`)
      }
      return `<polygon points="${pts.join(" ")}" fill="${color}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`
    }

    // Anéis concêntricos — o impacto visto de cima.
    case 1: {
      const n = Math.floor(between(r, 3, 5))
      let out = ""
      for (let i = n; i >= 1; i--) {
        const rr = radius * (i / n)
        out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rr.toFixed(1)}" fill="${i % 2 ? color : "none"}" stroke="${INK}" stroke-width="7"/>`
      }
      return out
    }

    // Requadro torto — a página de HQ dentro da própria capa.
    default: {
      const s = radius * 1.5
      const tilt = between(r, -10, 10).toFixed(2)
      const cut = s * between(r, 0.12, 0.24)
      return `<g transform="rotate(${tilt} ${cx.toFixed(1)} ${cy.toFixed(1)})"><path d="M${(cx - s / 2).toFixed(1)} ${(cy - s / 2).toFixed(1)}H${(cx + s / 2 - cut).toFixed(1)}L${(cx + s / 2).toFixed(1)} ${(cy - s / 2 + cut).toFixed(1)}V${(cy + s / 2).toFixed(1)}H${(cx - s / 2).toFixed(1)}Z" fill="${color}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`
    }
  }
}

/**
 * Uma capa. `ratio` decide a forma: a proporção da coleção, para a imagem
 * chegar ao `object-fit: cover` já quase na medida certa e o corte tirar pouco.
 */
function cover({ id, title, zone, ratio }) {
  const z = ZONE[zone]
  const r = rng(hash(`${zone}:${id}:${title}`))
  const [w, h] = ratio
  const initial = (title.trim()[0] ?? "?").toUpperCase()

  const { path: raysPath, cx, cy } = rays(r, w, h, "rgba(18,16,14,0.55)")
  const burstR = Math.min(w, h) * between(r, 0.3, 0.42)
  const dot = between(r, 14, 22).toFixed(1)
  const rotate = between(r, -8, 8).toFixed(2)
  const letterSize = Math.min(w, h) * between(r, 0.52, 0.68)

  // Desalinho de impressão: a inicial é impressa três vezes, as duas cópias de
  // chapa deslocadas um fio. É o defeito que faz o olho ler "impresso".
  const off = between(r, 5, 9).toFixed(1)
  const font = "Impact, Haettenschweiler, 'Arial Narrow Bold', 'Franklin Gothic Heavy', sans-serif"
  const letter = (fill, dx, dy, opacity = 1) =>
    `<text x="${(w / 2 + Number(dx)).toFixed(1)}" y="${(h / 2 + Number(dy)).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="${font}" font-size="${letterSize.toFixed(0)}" font-weight="700" fill="${fill}" opacity="${opacity}">${initial}</text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Capa gerada para ${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="${z.bg[0]}"/>
      <stop offset="1" stop-color="${z.bg[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${(cx / w).toFixed(3)}" cy="${(cy / h).toFixed(3)}" r="0.75">
      <stop offset="0" stop-color="${z.a}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${z.a}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="${dot}" height="${dot}" patternUnits="userSpaceOnUse">
      <circle cx="${(dot / 2).toFixed(1)}" cy="${(dot / 2).toFixed(1)}" r="${(dot / 5).toFixed(1)}" fill="${INK}" opacity="0.5"/>
    </pattern>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${raysPath}
  <g transform="rotate(${rotate} ${(w / 2).toFixed(1)} ${(h / 2).toFixed(1)})">
    ${motif(r, w / 2, h / 2, burstR, z.b)}
    ${letter(z.c, -off, -off, 0.75)}
    ${letter(z.a, off, off, 0.75)}
    ${letter(PAPER, 0, 0)}
  </g>
  <rect width="${w}" height="${h}" fill="url(#dots)" opacity="0.22"/>
  <rect x="6" y="6" width="${w - 12}" height="${h - 12}" fill="none" stroke="${INK}" stroke-width="12"/>
</svg>
`
}

function escapeXml(s) {
  return s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c])
}

/* ==========================================================================
   4 · Os itens
   Lidos dos seeds por regex e não por `import`: os seeds são TypeScript e
   arrastariam um passo de transpilação para um script que só precisa de dois
   campos por item. O par (id, title) é estável e simples de extrair.
   ========================================================================== */

function items(file, exportName) {
  const src = readFileSync(join(ROOT, "src", "data", file), "utf8")
  const start = src.indexOf(`export const ${exportName}`)
  if (start === -1) throw new Error(`Coleção não encontrada: ${exportName} em ${file}`)

  // Até ao próximo `export const` (ou fim do ficheiro).
  const rest = src.slice(start + 1)
  const nextExport = rest.indexOf("\nexport const ")
  const block = nextExport === -1 ? rest : rest.slice(0, nextExport)

  const out = []
  const re = /id:\s*["'`]([^"'`]+)["'`][\s\S]*?title:\s*["'`]([^"'`]+)["'`]/g
  let m
  while ((m = re.exec(block))) out.push({ id: m[1], title: m[2] })
  return out
}

/** Coleção → pasta, zona da paleta e proporção da peça. */
const COLLECTIONS = [
  { name: "artes", file: "criativo-zones.ts", exportName: "artworks", zone: "atelie", ratio: [1200, 900] },
  { name: "projetos", file: "projects.ts", exportName: "projects", zone: "oficina", ratio: [1600, 1000] },
  { name: "revistas", file: "criativo-zones.ts", exportName: "comics", zone: "banca", ratio: [800, 1200] },
  { name: "filmes", file: "criativo-zones.ts", exportName: "movies", zone: "cine", ratio: [800, 1200] },
  { name: "faixas", file: "criativo-zones.ts", exportName: "tracks", zone: "radio", ratio: [1000, 1000] },
  { name: "videos", file: "criativo-zones.ts", exportName: "videos", zone: "videoteca", ratio: [1600, 900] },
  { name: "tirinhas", file: "criativo-zones.ts", exportName: "strips", zone: "tirinhas", ratio: [1600, 800] },
]

/* ==========================================================================
   5 · Execução
   ========================================================================== */

const check = process.argv.includes("--check")
let written = 0
let stale = []

for (const col of COLLECTIONS) {
  const dir = join(OUT, col.name)
  if (!check) mkdirSync(dir, { recursive: true })

  for (const item of items(col.file, col.exportName)) {
    const svg = cover({ id: item.id, title: item.title, zone: col.zone, ratio: col.ratio })
    const file = join(dir, `${item.id}.svg`)

    if (check) {
      if (!existsSync(file) || readFileSync(file, "utf8") !== svg) {
        stale.push(`covers/${col.name}/${item.id}.svg`)
      }
      continue
    }

    writeFileSync(file, svg, "utf8")
    written++
  }
}

if (check) {
  if (stale.length) {
    console.error(`Capas desatualizadas (${stale.length}):`)
    for (const f of stale) console.error(`  ${f}`)
    console.error("\nCorre `node scripts/generate-covers.mjs` e commita o resultado.")
    process.exit(1)
  }
  console.log("Capas em dia.")
} else {
  console.log(`${written} capas escritas em public/covers/`)
}
