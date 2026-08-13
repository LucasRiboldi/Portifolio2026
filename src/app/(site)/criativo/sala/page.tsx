import type { Metadata } from "next"
import Link from "next/link"

import { ZoneRadio } from "@/components/criativo/zone-radio"
import { ZoneVideoteca } from "@/components/criativo/zone-videoteca"
import { ZoneTirinhas } from "@/components/criativo/zone-tirinhas"
import { CriativoExperience } from "@/components/criativo/experience"
import { ComicPage } from "@/components/layout/comic/comic-page"
import { Caption, Halftone, SpeedLines } from "@/components/comic/atoms"
import { getStrips, getTracks, getVideos } from "@/lib/repos/criativo"
import { getPlaylistFromFolder } from "@/lib/repos/playlist"
import { SALA } from "@/constants/criativo-landing"

export const metadata: Metadata = {
  title: "A sala",
  description:
    "O fascículo de fruição do multiverso: a rádio, a videoteca e as tirinhas. O que se ouve, o que roda na fita e o que se lê em dois quadros.",
}

/**
 * A SALA — fascículo #2 do Criativo.
 *
 * Três zonas que moravam na capa (rádio, videoteca, tirinhas) e saíram dela em
 * 06/08/2026. O corte não foi por tamanho: as cinco que ficaram são de FAZER
 * — desenhar, construir, ler para estudar, anotar — e estas três são de
 * CONSUMIR. Separadas, a capa ganhou um fio narrativo e esta página ganhou um
 * assunto próprio.
 *
 * Reaproveita `ComicPage`, então herda a moldura da revista, o papel, a tinta
 * de fundo e a câmara — é outro fascículo do mesmo exemplar, não outro site. Os
 * capítulos renumeram de 01 a 03 porque a numeração é a ordem de leitura DESTA
 * página (ver o comentário em `ZONES`).
 */
export default async function SalaPage() {
  const [dbTracks, folderTracks, videos, strips] = await Promise.all([
    getTracks(),
    getPlaylistFromFolder(),
    getVideos(),
    getStrips(),
  ])

  // Mesma regra da capa: a pasta manda, e as faixas do banco que apontam para o
  // mesmo arquivo são descartadas para não aparecerem duas vezes.
  const folderUrls = new Set(folderTracks.map((t) => t.audio_url))
  const tracks = [...folderTracks, ...dbTracks.filter((t) => !folderUrls.has(t.audio_url))]

  return (
    <>
      {/* Mesma rede de segurança da capa: as entradas nascem em `opacity: 0` e
          só acendem quando o IntersectionObserver dispara. */}
      <noscript>
        <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <CriativoExperience>
        <div className="realm-hide-arcane k-body overflow-x-clip">
          <ComicPage>
            <section
              aria-labelledby="sala-title"
              className="k-zone k-zone--radio k-grain relative overflow-hidden py-20 sm:py-28"
            >
              <SpeedLines x={64} y={28} color="rgba(255,255,255,0.08)" />
              <Halftone color="rgba(255,255,255,0.28)" step={10} />

              <div className="cp-bleed relative z-10">
                <Caption>{SALA.kicker}</Caption>

                {/* Letra vazada com contorno pesado (ref. wvgNVeJ) — um dos
                    dois pontos em que o efeito entra nesta página. */}
                <h1
                  id="sala-title"
                  className="k-knockout mt-5 text-[clamp(2.6rem,8vw,calc(var(--cp-mag)*0.08))] leading-[0.95]"
                >
                  {SALA.titleTop} <span className="block">{SALA.titleGlitch}</span>
                </h1>

                <p className="k-body mt-6 max-w-2xl text-base leading-relaxed opacity-80 sm:text-lg">
                  {SALA.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <p className="k-say text-sm">{SALA.bubble}</p>
                  {/* Tinta da zona, não `--k-lime`.

                      O lime é acento de fundo escuro; aqui a zona pinta claro
                      (menta/creme) e o link media 1,02:1 — invisível na
                      prática. Mesmo defeito das setas da galeria: token de
                      acento global sobre superfície de zona, ignorando o
                      `--k-zone-ink` que a própria zona declara. Agora 14,9:1.

                      Escurecer o lime até passar exigiria levá-lo a #457015,
                      que já é oliva e não preserva acento nenhum. O caráter
                      de link fica por conta da seta e do deslocamento no
                      hover, que já existiam. */}
                  <Link
                    href={SALA.backCta.href}
                    className="k-sub group inline-flex items-center gap-2 text-sm text-[var(--k-zone-ink,var(--k-ink))]"
                  >
                    <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
                      ←
                    </span>
                    {SALA.backCta.label}
                  </Link>
                </div>
              </div>
            </section>

            <ZoneRadio tracks={tracks} />
            <ZoneVideoteca videos={videos} />
            <ZoneTirinhas strips={strips} />
          </ComicPage>
        </div>
      </CriativoExperience>
    </>
  )
}
