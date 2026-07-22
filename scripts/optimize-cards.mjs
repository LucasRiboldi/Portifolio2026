/**
 * Converte as imagens das cartas para AVIF.
 *
 * As faces vinham como PNG de scan (a maior tinha 1,7 MB) — o pior formato
 * possível para fotografia, e servido tal e qual num card de ~320px. Este
 * script reamostra para uma largura compatível com o maior tamanho de exibição
 * (a carta amplia até 1,75× no popover) e reencoda em AVIF.
 *
 * Uso:
 *   node scripts/optimize-cards.mjs           → só relata o que faria
 *   node scripts/optimize-cards.mjs --write   → grava os .avif
 *   node scripts/optimize-cards.mjs --write --replace  → grava e apaga a origem
 *
 * O `--replace` é separado de propósito: apagar o original é o passo
 * irreversível, e quem roda deve poder conferir o resultado antes.
 */
import { readFile, readdir, stat, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const WRITE = process.argv.includes("--write")
const REPLACE = process.argv.includes("--replace")

/**
 * Teto de largura. As cartas atuais têm 734px e passam intactas (ver
 * `withoutEnlargement`); o teto existe para o dia em que entrar um scan em
 * resolução de impressão. A carta é exibida a ~320px e amplia até 1,75× no
 * popover (≈560px CSS), então 1024 cobre telas 2× com folga.
 */
const MAX_WIDTH = 1024

/** AVIF a 52 mantém o foil limpo; acima disso o ganho de tamanho some. */
const AVIF = { quality: 52, effort: 4, chromaSubsampling: "4:2:0" }

const TARGETS = [
  { dir: "public/poke-holo", match: /_hires\.png$/i },
  { dir: "public/cards-thundercats/web", match: /\.webp$/i },
]

const mb = (n) => (n / 1024 / 1024).toFixed(2)

async function run() {
  let before = 0
  let after = 0
  let count = 0

  for (const target of TARGETS) {
    let files
    try {
      files = (await readdir(target.dir)).filter((f) => target.match.test(f))
    } catch {
      console.log(`· ${target.dir} não existe, pulando`)
      continue
    }

    console.log(`\n${target.dir} — ${files.length} arquivo(s)`)

    for (const file of files) {
      const src = path.join(target.dir, file)
      const out = src.replace(/\.(png|webp|jpe?g)$/i, ".avif")

      const srcSize = (await stat(src)).size

      // Lê para buffer em vez de passar o caminho ao sharp: no Windows o
      // decodificador mantém o handle aberto e o `unlink` do --replace falha
      // com EBUSY.
      const input = await readFile(src)
      const image = sharp(input)
      const meta = await image.metadata()

      const pipeline = image
        // `withoutEnlargement`: uma carta que já venha menor que o teto não é
        // esticada — reamostrar para cima só adiciona bytes sem detalhe.
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .avif(AVIF)

      if (!WRITE) {
        const buf = await pipeline.toBuffer()
        before += srcSize
        after += buf.length
        count++
        console.log(
          `  ${file.padEnd(34)} ${String(meta.width).padStart(5)}px  ` +
            `${mb(srcSize).padStart(6)} MB → ${mb(buf.length).padStart(6)} MB`,
        )
        continue
      }

      const buf = await pipeline.toBuffer()
      await writeFile(out, buf)
      const outSize = buf.length
      before += srcSize
      after += outSize
      count++
      console.log(
        `  ${file.padEnd(34)} ${mb(srcSize).padStart(6)} MB → ${mb(outSize).padStart(6)} MB`,
      )

      if (REPLACE) await unlink(src)
    }
  }

  const saved = before - after
  console.log(
    `\n${count} imagem(ns): ${mb(before)} MB → ${mb(after)} MB ` +
      `(−${mb(saved)} MB, ${((saved / before) * 100).toFixed(1)}%)`,
  )
  if (!WRITE) console.log("Simulação. Use --write para gravar.")
  else if (!REPLACE) console.log("Originais mantidos. Use --replace para apagá-los.")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
