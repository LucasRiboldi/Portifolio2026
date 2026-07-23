import { ArcaneProphet } from "@/components/realms/arcane-prophet"
import { Hero } from "@/components/criativo/hero"
import { KitStrip } from "@/components/criativo/kit-strip"
import { ZoneAtelie } from "@/components/criativo/zone-atelie"
import { ZoneOficina } from "@/components/criativo/zone-oficina"
import { ZoneBanca } from "@/components/criativo/zone-banca"
import { ZoneCine } from "@/components/criativo/zone-cine"
import { ZoneRadio } from "@/components/criativo/zone-radio"
import { ZoneVideoteca } from "@/components/criativo/zone-videoteca"
import { ZoneMural } from "@/components/criativo/zone-mural"
import { ZoneTirinhas } from "@/components/criativo/zone-tirinhas"
import { Outro } from "@/components/criativo/outro"
import { CriativoExperience } from "@/components/criativo/experience"
import { ComicPage } from "@/components/layout/comic/comic-page"
import { getProjects } from "@/lib/repos/projects"
import {
  getArtworks,
  getComics,
  getMovies,
  getNotes,
  getStrips,
  getTracks,
  getVideos,
} from "@/lib/repos/criativo"
import { getPlaylistFromFolder } from "@/lib/repos/playlist"

export const metadata = {
  title: "O Multiverso",
  description:
    "O repositório de ideias do Lucas Riboldi: artes, sites, componentes, quadrinhos, filmes, música e experimentos. Nada à venda — só registro.",
}

/**
 * Landing do realm Creative — "Edição #2026".
 *
 * Página pessoal, não de venda: cada zona é uma dimensão visual com paleta
 * própria (ateliê, oficina, banca, cine, rádio, videoteca, mural, tirinhas).
 *
 * Server Component: as sete leituras partem em paralelo num único `Promise.all`
 * — encadeá-las somaria as latências e a página tem oito zonas para encher.
 * Só o hero (parallax), o player de áudio e os painéis com tilt são clientes.
 */
export default async function CriativoHome() {
  const [projects, artworks, comics, movies, dbTracks, folderTracks, videos, notes, strips] =
    await Promise.all([
      getProjects(),
      getArtworks(),
      getComics(),
      getMovies(),
      getTracks(),
      getPlaylistFromFolder(),
      getVideos(),
      getNotes(),
      getStrips(),
    ])

  // A playlist tem duas fontes: os arquivos de `public/musica` (jogar o mp3 lá
  // já publica) e as faixas cadastradas no /admin, que carregam capa e
  // comentário. A pasta vem primeiro, e as do banco que apontam para o mesmo
  // arquivo são descartadas para a faixa não aparecer duas vezes.
  const folderUrls = new Set(folderTracks.map((t) => t.audio_url))
  const tracks = [...folderTracks, ...dbTracks.filter((t) => !folderUrls.has(t.audio_url))]

  return (
    <>
      {/*
        As animações de entrada são renderizadas no servidor já em `opacity: 0`
        e só acendem quando o IntersectionObserver dispara. Sem JavaScript esse
        disparo nunca acontece e a página ficaria em branco a partir da capa —
        o `noscript` devolve tudo ao estado final.
      */}
      <noscript>
        <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      {/* Realm ARCANE (Game Design) — jornal antigo, só em data-realm="arcane" */}
      <ArcaneProphet className="realm-only-arcane" />

      {/* Realms Creative + Developer (somem no Arcane).
          `overflow-x-clip` (e não `hidden`) porque os blocos entram deslizando
          da lateral: sem o clipe, o estado inicial da animação cria uma barra
          de scroll horizontal — e `hidden` quebraria o `position: sticky`. */}
      <CriativoExperience>
        <div className="realm-hide-arcane k-body overflow-x-clip">
          {/*
            `ComicPage` é a revista: medidas do papel, superfície impressa, fundo
            de tinta em WebGL e a câmara que persegue os capítulos. As zonas já
            migradas (Ateliê, Cine) renderizam como `Chapter`; as restantes
            continuam em `Zone` e ganham na mesma o papel e a câmara, porque
            ambos vivem aqui e não dentro de cada bloco.
          */}
          <ComicPage>
            <Hero />
            <KitStrip />
            <ZoneAtelie artworks={artworks} />
            <ZoneOficina projects={projects} />
            <ZoneBanca comics={comics} />
            <ZoneCine movies={movies} />
            <ZoneRadio tracks={tracks} />
            <ZoneVideoteca videos={videos} />
            <ZoneMural notes={notes} />
            <ZoneTirinhas strips={strips} />
            <Outro />
          </ComicPage>
        </div>
      </CriativoExperience>
    </>
  )
}
