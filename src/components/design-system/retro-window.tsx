/**
 * RetroWindow — chrome de janela em três skins retrô (recriação original).
 * os: "95" | "xp" | "mac". Sem logos/ícones de marca.
 */
import { cn } from "@/lib/utils"

type OS = "95" | "xp" | "mac"

export function RetroWindow({
  os,
  title,
  className,
  children,
}: {
  os: OS
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("os-window", `os-${os}`, className)}>
      <div className="os-titlebar">
        {os === "mac" && (
          <span className="os-lights" aria-hidden>
            <span className="l-red" />
            <span className="l-yellow" />
            <span className="l-green" />
          </span>
        )}
        <span className="os-title">{title}</span>
        {os !== "mac" && (
          <span className="os-btns" aria-hidden>
            <button tabIndex={-1}>_</button>
            <button tabIndex={-1}>▢</button>
            <button tabIndex={-1} className={os === "xp" ? "os-close" : ""}>✕</button>
          </span>
        )}
      </div>
      <div className="os-body">{children}</div>
    </div>
  )
}
