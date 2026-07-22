import "server-only"

import { readdir } from "node:fs/promises"
import path from "node:path"

import type { Track } from "@/data/criativo-zones"

/** Pasta onde os arquivos de áudio são guardados. Servida como `/musica/...`. */
export const MUSIC_DIR = "musica"

/** Extensões que os navegadores tocam sem plugin. */
const AUDIO_EXT = new Set([".mp3", ".m4a", ".ogg", ".oga", ".wav", ".flac"])

/**
 * Transforma o nome do arquivo em título e artista.
 *
 * Convenção: `Artista - Título.mp3`. Sem o hífen, o nome inteiro vira título e
 * o artista fica vazio — melhor mostrar o arquivo como está do que inventar
 * metadados a partir de um palpite.
 */
function parseName(file: string): { title: string; artist: string } {
  const base = file.replace(/\.[^.]+$/, "")

  // Os espaços à volta do hífen são obrigatórios: sem eles, um nome em
  // kebab-case (`esboco-sem-nome`) seria partido no meio da palavra e viraria
  // artista "esboco". Aceita hífen simples, meia-risca e travessão.
  const parts = base.split(/\s+[-–—]\s+/)

  if (parts.length >= 2 && parts[0] && parts[1]) {
    return { artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() }
  }
  return { artist: "", title: base.trim() }
}

/**
 * Lê a playlist da pasta `public/musica`.
 *
 * É `fs` e não Supabase de propósito: a pasta é a interface de edição pedida —
 * jogar o mp3 lá dentro e commitar já publica a faixa, sem passar pelo admin.
 * As faixas cadastradas na tabela `tracks` continuam válidas e são somadas a
 * estas em `ZoneRadio`.
 *
 * Sem `unstable_cache` de propósito: a página é prerenderizada, logo isto roda
 * uma vez por build, e a pasta vai dentro do bundle — o conteúdo não muda entre
 * deploys. Cachear só acrescentaria uma camada que precisa ser invalidada à
 * mão e que, em desenvolvimento, esconde o arquivo que acabou de ser colocado.
 */
export async function getPlaylistFromFolder(): Promise<Track[]> {
  const dir = path.join(process.cwd(), "public", MUSIC_DIR)

  let files: string[]
  try {
    files = await readdir(dir)
  } catch {
    // Pasta ainda não existe (projeto novo, deploy sem os arquivos):
    // a zona cai para as faixas do banco em vez de quebrar a página.
    return []
  }

  return files
    .filter((f) => AUDIO_EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))
    .map((file) => {
      const { title, artist } = parseName(file)
      return {
        id: `folder:${file}`,
        title,
        artist,
        // `encodeURIComponent`: nomes com espaço e acento são a regra aqui, e
        // sem isto o `<audio>` recebe uma URL inválida.
        audio_url: `/${MUSIC_DIR}/${encodeURIComponent(file)}`,
        cover_image: "",
        note: "",
      }
    })
}
