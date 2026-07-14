import { ImageResponse } from "next/og"

export const alt = "Lucas Riboldi — Product Designer & Developer · Portfólio 2026"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 20% 15%, #7b2ff7 0%, transparent 45%), radial-gradient(circle at 85% 80%, #ff2d95 0%, transparent 45%), linear-gradient(160deg, #0a0612, #140a24)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* halftone */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(0,229,255,0.35) 2px, transparent 2.5px)",
            backgroundSize: "24px 24px",
            display: "flex",
          }}
        />
        {/* barra arco-íris */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, background: "linear-gradient(90deg,#ffe600,#ff5a1f,#ff2d95,#7b2ff7,#00e5ff,#b6ff00)", display: "flex" }} />

        <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, color: "#00e5ff", textTransform: "uppercase", fontWeight: 700 }}>
          {"// TERRA-2026 · MULTIVERSE"}
        </div>
        <div style={{ display: "flex", fontSize: 150, fontWeight: 900, color: "#fff8e7", lineHeight: 1, marginTop: 12, letterSpacing: -2 }}>
          LUCAS
        </div>
        <div style={{ display: "flex", fontSize: 150, fontWeight: 900, color: "#ff2d95", lineHeight: 1, letterSpacing: -2 }}>
          RIBOLDI<span style={{ color: "#ffe600" }}>.</span>
        </div>
        <div style={{ display: "flex", fontSize: 40, color: "rgba(255,248,231,0.85)", marginTop: 24, fontWeight: 700 }}>
          Product Designer &amp; Developer
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#b6ff00", marginTop: 12, fontFamily: "monospace" }}>
          portfólio + design system comic-first · do átomo ao delírio
        </div>

        {/* chips de paleta */}
        <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
          {["#ff2d95", "#00e5ff", "#ffe600", "#b6ff00", "#7b2ff7", "#ff5a1f"].map((c) => (
            <div key={c} style={{ width: 70, height: 40, background: c, border: "3px solid #000", display: "flex" }} />
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
