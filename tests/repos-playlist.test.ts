import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * A playlist vem da pasta `public/musica`: jogar o mp3 lá e commitar já
 * publica a faixa. Toda a inteligência está em `parseName` (nome do arquivo →
 * artista/título) e na filtragem/ordenação — lógica pura que estes testes
 * fixam. O `node:fs/promises` é mockado para não tocar o disco.
 */
const { readdir } = vi.hoisted(() => ({ readdir: vi.fn<(dir: string) => Promise<string[]>>() }))
vi.mock("node:fs/promises", () => ({ readdir }))

// Importado depois do mock (vi.mock é içado, mas deixamos explícito).
const { getPlaylistFromFolder, MUSIC_DIR } = await import("@/lib/repos/playlist")

beforeEach(() => readdir.mockReset())

describe("getPlaylistFromFolder — convenção do nome", () => {
  it("parte `Artista - Título` no hífen com espaços", async () => {
    readdir.mockResolvedValue(["Radiohead - Weird Fishes.mp3"])
    const [t] = await getPlaylistFromFolder()
    expect(t.artist).toBe("Radiohead")
    expect(t.title).toBe("Weird Fishes")
  })

  it("aceita meia-risca e travessão como separador", async () => {
    readdir.mockResolvedValue(["A – Um.mp3", "B — Dois.mp3"])
    const list = await getPlaylistFromFolder()
    expect(list.map((t) => [t.artist, t.title])).toEqual([
      ["A", "Um"],
      ["B", "Dois"],
    ])
  })

  it("NÃO parte kebab-case (hífen sem espaços) — vira só título", async () => {
    readdir.mockResolvedValue(["esboco-sem-nome.mp3"])
    const [t] = await getPlaylistFromFolder()
    expect(t.artist).toBe("")
    expect(t.title).toBe("esboco-sem-nome")
  })

  it("com vários ` - `, o primeiro é artista e o resto remonta o título", async () => {
    readdir.mockResolvedValue(["Sufjan - Todo - Menos Isto.mp3"])
    const [t] = await getPlaylistFromFolder()
    expect(t.artist).toBe("Sufjan")
    expect(t.title).toBe("Todo - Menos Isto")
  })
})

describe("getPlaylistFromFolder — filtro, ordem e URL", () => {
  it("ignora arquivos que não são áudio tocável", async () => {
    readdir.mockResolvedValue(["a.mp3", "capa.png", "leia.txt", "b.flac", "c.m4a"])
    const ids = (await getPlaylistFromFolder()).map((t) => t.id)
    expect(ids).toEqual(["folder:a.mp3", "folder:b.flac", "folder:c.m4a"])
  })

  it("ordena numericamente/local (10 depois de 2)", async () => {
    readdir.mockResolvedValue(["10 - Dez.mp3", "2 - Dois.mp3", "1 - Um.mp3"])
    const titles = (await getPlaylistFromFolder()).map((t) => t.title)
    expect(titles).toEqual(["Um", "Dois", "Dez"])
  })

  it("codifica espaço e acento na audio_url e serve por /musica", async () => {
    readdir.mockResolvedValue(["Céu - Nção.mp3"])
    const [t] = await getPlaylistFromFolder()
    expect(t.audio_url.startsWith(`/${MUSIC_DIR}/`)).toBe(true)
    expect(t.audio_url).toBe(`/${MUSIC_DIR}/${encodeURIComponent("Céu - Nção.mp3")}`)
    expect(t.audio_url).not.toContain(" ")
  })
})

describe("getPlaylistFromFolder — sem faixas", () => {
  it("pasta vazia → []", async () => {
    readdir.mockResolvedValue([])
    expect(await getPlaylistFromFolder()).toEqual([])
  })

  it("pasta só com arquivos não-áudio → []", async () => {
    readdir.mockResolvedValue(["capa.png", "notas.txt", ".DS_Store"])
    expect(await getPlaylistFromFolder()).toEqual([])
  })
})
