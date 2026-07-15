/**
 * SvIcons — conjunto de ícones próprios do Design System.
 * Traço comic (2.5px, cantos redondos), currentColor, opção "rough"
 * (borda tremida via #art-rough). Fecha o item "Ícones" das Foundations.
 */
import * as React from "react"

type IconProps = React.SVGProps<SVGSVGElement> & { rough?: boolean }

function Base({ rough, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={props["aria-label"] ? undefined : true}
      style={rough ? { filter: "url(#art-rough)", ...props.style } : props.style}
      {...props}
    >
      {children}
    </svg>
  )
}

export const SvIconWeb = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Base>
)
export const SvIconMail = (p: IconProps) => (
  <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8-6" /></Base>
)
export const SvIconRocket = (p: IconProps) => (
  <Base {...p}><path d="M12 3c3 2 5 6 5 10l-5 3-5-3c0-4 2-8 5-10Z" /><circle cx="12" cy="10" r="1.6" /><path d="M8 16l-2 4 4-2M16 16l2 4-4-2" /></Base>
)
export const SvIconStar = (p: IconProps) => (
  <Base {...p}><path d="M12 3l2.6 5.6 6 .7-4.4 4 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4 6-.7Z" /></Base>
)
export const SvIconCode = (p: IconProps) => (
  <Base {...p}><path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" /></Base>
)
export const SvIconPalette = (p: IconProps) => (
  <Base {...p}><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.4-2.2-.6-1.3.3-2.3 1.6-2.3H17a4 4 0 0 0 4-4c0-5-4-7.5-9-7.5Z" /><circle cx="8" cy="11" r="1" fill="currentColor" /><circle cx="12" cy="8" r="1" fill="currentColor" /><circle cx="16" cy="11" r="1" fill="currentColor" /></Base>
)
export const SvIconBolt = (p: IconProps) => (
  <Base {...p}><path d="M13 3L5 14h6l-2 7 8-11h-6l2-7Z" /></Base>
)
export const SvIconWeb2 = (p: IconProps) => (
  <Base {...p}><path d="M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15" /></Base>
)

export const SvIconGuitar = (p: IconProps) => (
  <Base {...p}><path d="M14 4l3 3-6 6M8 13a3 3 0 1 0 3 3c0-1-1-2-1-3l3-3" /><circle cx="8" cy="16" r="1.2" fill="currentColor" /></Base>
)
export const SvIconHeadphone = (p: IconProps) => (
  <Base {...p}><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></Base>
)
export const SvIconMask = (p: IconProps) => (
  <Base {...p}><ellipse cx="12" cy="12" rx="8" ry="9" /><path d="M8 9l3 2-3 2M16 9l-3 2 3 2" /></Base>
)
export const SvIconSkull = (p: IconProps) => (
  <Base {...p}><path d="M5 11a7 7 0 0 1 14 0c0 3-2 4-2 5v2H7v-2c0-1-2-2-2-5Z" /><circle cx="9" cy="11" r="1.4" fill="currentColor" /><circle cx="15" cy="11" r="1.4" fill="currentColor" /></Base>
)
export const SvIconHeart = (p: IconProps) => (
  <Base {...p}><path d="M12 20S4 14 4 9a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5-8 11-8 11Z" /></Base>
)
export const SvIconPin = (p: IconProps) => (
  <Base {...p}><path d="M7 17q-4-2-2-6t7-3l6 1q3 .5 2-2" /><circle cx="7" cy="17" r="1.6" /></Base>
)
export const SvIconTerminal = (p: IconProps) => (
  <Base {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 15h4" /></Base>
)
export const SvIconLayers = (p: IconProps) => (
  <Base {...p}><path d="M12 3l9 5-9 5-9-5 9-5Z" /><path d="M3 13l9 5 9-5" /></Base>
)
export const SvIconCursor = (p: IconProps) => (
  <Base {...p}><path d="M5 3l6 16 2.5-6L20 10.5 5 3Z" /></Base>
)
export const SvIconSparkle = (p: IconProps) => (
  <Base {...p}><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" /></Base>
)
export const SvIconBug = (p: IconProps) => (
  <Base {...p}><rect x="8" y="8" width="8" height="10" rx="4" /><path d="M12 8V5M9 6L7 4M15 6l2-2M8 12H4M16 12h4M8 16l-3 2M16 16l3 2" /></Base>
)
export const SvIconCube = (p: IconProps) => (
  <Base {...p}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M12 3v9m0 9v-9m8-4.5L12 12 4 7.5" /></Base>
)

export const SV_ICONS = [
  { name: "Web", Comp: SvIconWeb },
  { name: "Mail", Comp: SvIconMail },
  { name: "Rocket", Comp: SvIconRocket },
  { name: "Star", Comp: SvIconStar },
  { name: "Code", Comp: SvIconCode },
  { name: "Palette", Comp: SvIconPalette },
  { name: "Bolt", Comp: SvIconBolt },
  { name: "Web2", Comp: SvIconWeb2 },
  { name: "Guitar", Comp: SvIconGuitar },
  { name: "Headphone", Comp: SvIconHeadphone },
  { name: "Mask", Comp: SvIconMask },
  { name: "Skull", Comp: SvIconSkull },
  { name: "Heart", Comp: SvIconHeart },
  { name: "Pin", Comp: SvIconPin },
  { name: "Terminal", Comp: SvIconTerminal },
  { name: "Layers", Comp: SvIconLayers },
  { name: "Cursor", Comp: SvIconCursor },
  { name: "Sparkle", Comp: SvIconSparkle },
  { name: "Bug", Comp: SvIconBug },
  { name: "Cube", Comp: SvIconCube },
] as const
