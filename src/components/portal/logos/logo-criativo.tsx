export function LogoCriativo() {
  return (
    <div className="pl-cri" aria-hidden>
      <svg viewBox="0 0 120 120" className="base">
        <g id="pl-pw">
          <circle cx="46" cy="68" r="28" />
          <circle cx="74" cy="68" r="28" />
          <circle cx="60" cy="46" r="28" />
        </g>
      </svg>
      <svg viewBox="0 0 120 120" className="r"><use href="#pl-pw" /></svg>
      <svg viewBox="0 0 120 120" className="c"><use href="#pl-pw" /></svg>
    </div>
  )
}
