/**
 * LivingPortrait — "foto que se mexe" do Profeta Diário. SVG gravado em
 * tinta (sépia/preto-e-branco) com elementos animados por CSS puro: névoa
 * que deriva, faíscas que sobem e a lua que pulsa. Sem JS, sem asset externo.
 * Classes/animações em prophet.css (.pr-portrait / .pp-*).
 */
export function LivingPortrait({ caption }: { caption?: string }) {
  return (
    <figure className="pr-frame">
      <div className="pr-portrait" role="img" aria-label={caption ?? "Ilustração animada do jornal"}>
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <radialGradient id="pp-sky" cx="50%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#c8b894" />
              <stop offset="100%" stopColor="#9c8c66" />
            </radialGradient>
          </defs>

          {/* céu */}
          <rect width="400" height="300" fill="url(#pp-sky)" />

          {/* lua */}
          <circle className="pp-moon" cx="312" cy="70" r="34" fill="#2b2418" opacity="0.85" />
          <circle cx="300" cy="62" r="30" fill="#efe6cf" opacity="0.9" />

          {/* névoa que deriva */}
          <g className="pp-fog" fill="#2b2418" opacity="0.14">
            <ellipse cx="120" cy="250" rx="150" ry="26" />
            <ellipse cx="300" cy="266" rx="170" ry="22" />
          </g>

          {/* castelo/silhueta ao fundo */}
          <g fill="#2b2418" opacity="0.5">
            <rect x="20" y="200" width="60" height="90" />
            <rect x="40" y="170" width="18" height="30" />
            <polygon points="20,200 50,176 80,200" />
            <rect x="330" y="210" width="50" height="80" />
            <polygon points="330,210 355,188 380,210" />
          </g>

          {/* coruja mensageira */}
          <g className="pp-owl" fill="#241d14">
            <ellipse cx="200" cy="150" rx="40" ry="50" />
            <ellipse cx="200" cy="120" rx="30" ry="28" />
            <circle cx="188" cy="116" r="9" fill="#efe6cf" />
            <circle cx="212" cy="116" r="9" fill="#efe6cf" />
            <circle cx="188" cy="117" r="3.5" />
            <circle cx="212" cy="117" r="3.5" />
            <polygon points="200,124 206,132 194,132" fill="#7c2d12" />
            {/* asas */}
            <path d="M160 150 q-34 6 -44 34 q30 -6 46 -14 z" />
            <path d="M240 150 q34 6 44 34 q-30 -6 -46 -14 z" />
            {/* carta no bico */}
            <rect x="186" y="132" width="28" height="18" fill="#efe6cf" stroke="#241d14" strokeWidth="1.5" />
            <path d="M186 132 l14 10 l14 -10" fill="none" stroke="#241d14" strokeWidth="1.5" />
          </g>

          {/* faíscas mágicas subindo */}
          <g fill="#9a7b28">
            <circle className="pp-spark" cx="150" cy="230" r="2.4" />
            <circle className="pp-spark2" cx="250" cy="240" r="2" />
            <circle className="pp-spark" cx="285" cy="225" r="1.8" />
          </g>
        </svg>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
