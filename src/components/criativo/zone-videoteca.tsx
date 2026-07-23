import type { Video } from "@/lib/repos/criativo"
import { Onoma } from "@/components/comic/atoms"
import { ComicPanel } from "@/components/comic/comic-panel"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Zone } from "@/components/comic/zone"
import { ZONES } from "@/constants/criativo-landing"

/**
 * Converte a URL de YouTube/Vimeo para a forma de embed.
 * Devolve `null` quando o formato não é reconhecido — melhor não renderizar
 * iframe nenhum do que renderizar um que só mostra erro do provedor.
 */
function embedUrl(kind: Video["kind"], url: string): string | null {
  if (!url) return null
  if (kind === "youtube") {
    const id = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1]
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (kind === "vimeo") {
    const id = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  return null
}

/**
 * Videoteca — a fita rodando.
 *
 * Vídeo local usa `<video controls preload="none">` com pôster: sem o
 * `preload="none"`, quatro vídeos na página puxariam metadados de todos ao
 * carregar. Embeds de terceiros entram em `loading="lazy"` pela mesma razão.
 */
export function ZoneVideoteca({ videos }: { videos: Video[] }) {
  return (
    <Zone {...ZONES.videoteca} panel>
      <RevealGroup as="ul" className="grid gap-8 lg:grid-cols-2">
        {videos.map((v) => {
          const embed = embedUrl(v.kind, v.video_url)

          return (
            <RevealItem key={v.id} as="li" variants={PANEL_IN}>
              <ComicPanel accent="lime" className="relative overflow-hidden">
                <span className="relative block aspect-video bg-[var(--k-ink)]">
                  {v.kind === "local" && v.video_url ? (
                    <video
                      controls
                      preload="none"
                      poster={v.poster_image || undefined}
                      className="size-full object-cover"
                    >
                      <source src={v.video_url} />
                    </video>
                  ) : embed ? (
                    <iframe
                      src={embed}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="size-full border-0"
                    />
                  ) : (
                    <MediaFrame
                      src={v.poster_image}
                      fallback={v.title}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="absolute inset-0"
                    />
                  )}

                  {/* Scanlines de tubo por cima da imagem. */}
                  <span aria-hidden className="k-scanlines pointer-events-none absolute inset-0 opacity-40" />
                </span>

                <div className="border-t-[3px] border-[var(--k-ink)] p-5">
                  <h3 className="k-title text-2xl">{v.title}</h3>
                  {v.description && (
                    <p className="k-body mt-2 text-sm leading-relaxed opacity-75">{v.description}</p>
                  )}
                </div>
              </ComicPanel>
            </RevealItem>
          )
        })}
      </RevealGroup>

      <Onoma accent="magenta" className="pointer-events-none absolute right-8 top-24 hidden text-5xl xl:block">
        REC ●
      </Onoma>
    </Zone>
  )
}
