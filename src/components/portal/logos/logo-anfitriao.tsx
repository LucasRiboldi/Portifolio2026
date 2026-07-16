export function LogoAnfitriao() {
  return (
    <div className="pl-anf" aria-hidden>
      <svg viewBox="0 0 124 124">
        <circle className="ring draw" cx="62" cy="62" r="54" />
        <circle className="ring" cx="62" cy="62" r="45" style={{ opacity: 0.5 }} />
      </svg>
      <div className="inner">
        <svg viewBox="0 0 124 124" width="124" height="124">
          <polygon className="out" points="62,31 88,47 88,77 62,93 36,77 36,47" />
          <polygon className="face" points="62,47 47,76 77,76" />
          <line className="fac" x1="62" y1="47" x2="62" y2="31" />
          <line className="fac" x1="62" y1="47" x2="36" y2="47" />
          <line className="fac" x1="62" y1="47" x2="88" y2="47" />
          <line className="fac" x1="47" y1="76" x2="36" y2="77" />
          <line className="fac" x1="47" y1="76" x2="62" y2="93" />
          <line className="fac" x1="77" y1="76" x2="88" y2="77" />
          <line className="fac" x1="77" y1="76" x2="62" y2="93" />
        </svg>
      </div>
    </div>
  )
}
