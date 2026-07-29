/**
 * Gera as versões AVIF/WebP da textura de mesa de /anfitriao.
 *
 * ------------------------------------------------------------------
 * POR QUE SÓ ESTE ARQUIVO
 * ------------------------------------------------------------------
 * Todas as demais imagens da rota passaram a ser servidas por `next/image`,
 * que converte para AVIF/WebP sob demanda e gera a escada de larguras — não
 * há o que pré-processar nelas, e reencodar a origem só somaria uma geração
 * de perda. A medição confirmou: reencodar no MESMO formato não rende nada
 * (o PNG do brasão até cresce); o ganho está inteiro na troca de formato,
 * que é o que o otimizador faz.
 *
 * `woodtile2.jpg` é a exceção, e por um motivo estrutural: é `background-image`
 * de CSS. O otimizador do Next atende `<Image>`, não `url()` — este arquivo
 * seria servido cru, exatamente como está, em toda visita à rota. É também o
 * que mais se repete: é o ladrilho da mesa sob a folha inteira.
 *
 * A troca de formato num fundo de CSS se faz por `image-set()`, com o JPEG
 * como último item — quem não entender AVIF nem WebP continua recebendo o
 * arquivo original.
 *
 * Uso (a mesma convenção de `optimize-cards.mjs`):
 *   node scripts/optimize-anfitriao-assets.mjs           → só relata
 *   node scripts/optimize-anfitriao-assets.mjs --write   → grava
 */
import { readFile, stat, writeFile } from "node:fs/promises"
import sharp from "sharp"

const WRITE = process.argv.includes("--write")

const SOURCE = "public/dporiginal/images/woodtile2.jpg"

/**
 * É um ladrilho que se repete: o olho nunca o vê inteiro nem parado, e
 * artefato de compressão nessa condição não é perceptível. Daí a qualidade
 * mais baixa do que se usaria numa fotografia editorial.
 */
const AVIF = { quality: 45, effort: 6 }
const WEBP = { quality: 72 }

const kb = (n) => `${(n / 1024).toFixed(1)}k`

const buf = await readFile(SOURCE)
const original = (await stat(SOURCE)).size

const saidas = [
  { ext: "avif", buf: await sharp(buf).avif(AVIF).toBuffer() },
  { ext: "webp", buf: await sharp(buf).webp(WEBP).toBuffer() },
]

console.log(`${SOURCE}  ${kb(original)}`)
for (const s of saidas) {
  const alvo = SOURCE.replace(/\.jpg$/, `.${s.ext}`)
  const ganho = (100 * (1 - s.buf.length / original)).toFixed(0)
  console.log(`  → ${alvo}  ${kb(s.buf.length)}  (−${ganho}%)`)
  if (WRITE) await writeFile(alvo, s.buf)
}

console.log(
  WRITE
    ? "\nGravado. O `image-set()` em `dp-original-extras.css` já aponta para estes arquivos."
    : "\nNada gravado — rode com --write para gerar."
)
