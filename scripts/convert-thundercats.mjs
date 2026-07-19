import sharp from "sharp"
import { readdirSync, mkdirSync } from "fs"
import path from "path"

const SRC = "C:/Users/lucas/Desktop/LR - Portifolio/public/cards-thundercats"
const OUT = path.join(SRC, "web")
const SHEET = process.argv[2] // caminho da folha de contato

mkdirSync(OUT, { recursive: true })

const slugify = (name) =>
  name
    .replace(/\.(png|jpe?g)$/i, "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ChatGPT Image /i, "custom ")
    .replace(/[,()._]/g, " ")
    .trim().toLowerCase()
    .replace(/\s+/g, "-")

const files = readdirSync(SRC).filter((f) => /\.(png|jpe?g)$/i.test(f))
const entries = []

for (const f of files) {
  const slug = slugify(f)
  const out = path.join(OUT, `${slug}.webp`)
  await sharp(path.join(SRC, f))
    .resize({ width: 734, height: 1024, fit: "cover" })
    .webp({ quality: 82 })
    .toFile(out)
  entries.push({ file: f, slug })
}

// folha de contato numerada para identificação visual
const thumbW = 150, thumbH = 209, cols = 9
const rows = Math.ceil(entries.length / cols)
const composites = []
for (let i = 0; i < entries.length; i++) {
  const buf = await sharp(path.join(OUT, `${entries[i].slug}.webp`))
    .resize(thumbW, thumbH, { fit: "cover" })
    .toBuffer()
  const label = Buffer.from(
    `<svg width="${thumbW}" height="26"><rect width="100%" height="100%" fill="black"/><text x="4" y="19" font-size="17" font-family="Arial" fill="white">${i + 1}</text></svg>`
  )
  composites.push(
    { input: buf, left: (i % cols) * thumbW, top: Math.floor(i / cols) * (thumbH + 26) },
    { input: label, left: (i % cols) * thumbW, top: Math.floor(i / cols) * (thumbH + 26) + thumbH }
  )
}
await sharp({
  create: { width: cols * thumbW, height: rows * (thumbH + 26), channels: 3, background: "#222" },
})
  .composite(composites)
  .jpeg({ quality: 82 })
  .toFile(SHEET)

entries.forEach((e, i) => console.log(`${i + 1}\t${e.slug}\t${e.file}`))
