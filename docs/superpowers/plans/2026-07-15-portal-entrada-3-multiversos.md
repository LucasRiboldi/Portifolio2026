# Portal de Entrada — Os Três Multiversos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a porta de entrada `/portal` (exibida uma vez por navegador) onde o visitante escolhe entre O CRIATIVO, O DESENVOLVEDOR e O ANFITRIÃO, renomeando as rotas das personas para `/criativo`, `/desenvolvedor`, `/anfitriao`.

**Architecture:** Rota `/portal` com layout mínimo e 3 painéis (logos animados em SVG/CSS). Gate por `localStorage` via script inline no `<head>` que só roteia `/`. Renomeação de pastas do App Router com redirects 301 das rotas antigas. Reúso do `UniverseProvider`/`UniverseTransitionProvider` existentes.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, CSS. Testes: vitest (lógica pura) + Playwright (E2E de rota/gate).

**Spec:** `docs/superpowers/specs/2026-07-15-portal-entrada-3-multiversos-design.md`

---

## Ordem e dependências

1. Persistência (`portal.ts`) → 2. Realms/rotas + `realmFromPath` → 3. Renomear pastas + links → 4. Redirects 301 → 5. Home `/criativo` + `/` redirecionador + gate script → 6. Logos + CSS → 7. PortalGate + rota `/portal` → 8. Verificação E2E.

---

### Task 1: Helper de persistência (`portal.ts`)

**Files:**
- Create: `src/lib/portal.ts`
- Test: `src/lib/portal.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/portal.test.ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest"
import { PORTAL_KEY, hasEntered, markEntered } from "./portal"

describe("portal persistence", () => {
  beforeEach(() => localStorage.clear())

  it("hasEntered é false quando a chave não existe", () => {
    expect(hasEntered()).toBe(false)
  })

  it("markEntered grava a chave e hasEntered passa a true", () => {
    markEntered()
    expect(localStorage.getItem(PORTAL_KEY)).toBe("1")
    expect(hasEntered()).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/portal.test.ts`
Expected: FAIL — módulo `./portal` não encontrado.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/portal.ts
/** Persistência da porta de entrada (uma vez por navegador). */
export const PORTAL_KEY = "lr.portal.v1"

export function hasEntered(): boolean {
  try {
    return localStorage.getItem(PORTAL_KEY) === "1"
  } catch {
    return false
  }
}

export function markEntered(): void {
  try {
    localStorage.setItem(PORTAL_KEY, "1")
  } catch {
    /* localStorage indisponível — ignora */
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/portal.test.ts`
Expected: PASS (2 testes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/portal.ts src/lib/portal.test.ts
git commit -m "feat(portal): helper de persistencia (localStorage)"
```

---

### Task 2: Rotas novas nos realms + `realmFromPath`

**Files:**
- Modify: `src/lib/realms.ts` (routes, labels, aria, realmFromPath)
- Modify: `src/components/providers/universe-provider.tsx:31-34` (realmFromPath local)
- Test: `src/lib/realms.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/realms.test.ts
import { describe, it, expect } from "vitest"
import { REALMS, realmFromPath } from "./realms"

describe("realmFromPath (rotas novas)", () => {
  it("/desenvolvedor e subrotas → developer", () => {
    expect(realmFromPath("/desenvolvedor")).toBe("developer")
    expect(realmFromPath("/desenvolvedor/projetos")).toBe("developer")
  })
  it("/anfitriao e subrotas → arcane", () => {
    expect(realmFromPath("/anfitriao")).toBe("arcane")
    expect(realmFromPath("/anfitriao/oficina")).toBe("arcane")
  })
  it("/criativo, / e subpáginas da raiz → creative", () => {
    expect(realmFromPath("/criativo")).toBe("creative")
    expect(realmFromPath("/")).toBe("creative")
    expect(realmFromPath("/portfolio")).toBe("creative")
  })
  it("REALMS.route aponta para as rotas novas", () => {
    expect(REALMS.creative.route).toBe("/criativo")
    expect(REALMS.developer.route).toBe("/desenvolvedor")
    expect(REALMS.arcane.route).toBe("/anfitriao")
  })
  it("labels seguem a convenção", () => {
    expect(REALMS.creative.label).toBe("O CRIATIVO")
    expect(REALMS.developer.label).toBe("O DESENVOLVEDOR")
    expect(REALMS.arcane.label).toBe("O ANFITRIÃO")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/realms.test.ts`
Expected: FAIL — rotas/labels ainda são as antigas.

- [ ] **Step 3: Editar `src/lib/realms.ts`**

Em `REALMS.creative`: `label: "O CRIATIVO"`, `route: "/criativo"`, `aria: "O Criativo (multiverso comic)"`.
Em `REALMS.developer`: `label: "O DESENVOLVEDOR"`, `route: "/desenvolvedor"`, `aria: "O Desenvolvedor (Dracula)"`.
Em `REALMS.arcane`: `label: "O ANFITRIÃO"`, `route: "/anfitriao"`, `aria: "O Anfitrião (Daily Prophet)"`.

Substituir a função `realmFromPath` (linhas ~106-110) por:

```ts
export function realmFromPath(pathname: string): RealmId {
  if (pathname.startsWith("/desenvolvedor")) return "developer"
  if (pathname.startsWith("/anfitriao")) return "arcane"
  return "creative"
}
```

- [ ] **Step 4: Editar `src/components/providers/universe-provider.tsx`**

Substituir a `realmFromPath` local (linhas 31-34) por:

```ts
function realmFromPath(pathname: string): RealmId {
  if (pathname.startsWith("/desenvolvedor")) return "developer"
  if (pathname.startsWith("/anfitriao")) return "arcane"
  return "creative"
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/realms.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/realms.ts src/lib/realms.test.ts src/components/providers/universe-provider.tsx
git commit -m "feat(realms): rotas /criativo /desenvolvedor /anfitriao + relabel"
```

---

### Task 3: Renomear pastas de rota e atualizar links internos

**Files:**
- Rename: `src/app/dev/` → `src/app/desenvolvedor/`
- Rename: `src/app/prophet/` → `src/app/anfitriao/`
- Modify: `src/components/dev/dev-realm-dock.tsx`, `src/components/dev/dev-topbar.tsx`, `src/components/prophet/prophet-nav.tsx`, `src/components/prophet/mechanics-view.tsx`, `src/components/prophet/tutorials-view.tsx`
- Modify: `src/app/desenvolvedor/page.tsx`, `src/app/desenvolvedor/projetos/page.tsx`, `src/app/desenvolvedor/projetos/[slug]/page.tsx`
- Modify: `src/app/anfitriao/layout.tsx`, `src/app/anfitriao/page.tsx`, `src/app/anfitriao/mecanicas/[slug]/page.tsx`, `src/app/anfitriao/oficina/[slug]/page.tsx`

- [ ] **Step 1: Renomear as pastas (preservando histórico)**

```bash
git mv src/app/dev src/app/desenvolvedor
git mv src/app/prophet src/app/anfitriao
```

- [ ] **Step 2: Trocar `/dev` → `/desenvolvedor` nos links do realm developer**

Aplicar substituição literal `"/dev` → `"/desenvolvedor` e `` `/dev`` → `` `/desenvolvedor`` nestes pontos:
- `src/components/dev/dev-realm-dock.tsx:26` e demais `href` do array `ITEMS` (todos os `/dev/...`).
- `src/components/dev/dev-topbar.tsx:9` (`href="/dev"` → `href="/desenvolvedor"`).
- `src/app/desenvolvedor/page.tsx:100` (`href="/dev/devlogs"` → `/desenvolvedor/devlogs`).
- `src/app/desenvolvedor/projetos/page.tsx:41,59` (`` `/dev/projetos/${p.slug}` `` → `` `/desenvolvedor/projetos/${p.slug}` ``).
- `src/app/desenvolvedor/projetos/[slug]/page.tsx:33` (`href="/dev/projetos"` → `/desenvolvedor/projetos`).

- [ ] **Step 3: Trocar `/prophet` → `/anfitriao` nos links do realm arcane**

- `src/components/prophet/prophet-nav.tsx:8-13` (todos os `href` de `PROPHET_LINKS`) e linha 22 (`link.href === "/prophet"` → `"/anfitriao"`).
- `src/app/anfitriao/layout.tsx:29` (`href="/prophet"` → `/anfitriao`).
- `src/app/anfitriao/page.tsx:46,53,60` (`/prophet/oficina`, `/prophet/mecanicas`, `/prophet/laboratorio` → prefixo `/anfitriao`).
- `src/app/anfitriao/mecanicas/[slug]/page.tsx:25` (`/prophet/mecanicas` → `/anfitriao/mecanicas`).
- `src/app/anfitriao/oficina/[slug]/page.tsx:31` (`/prophet/oficina` → `/anfitriao/oficina`).
- `src/components/prophet/mechanics-view.tsx:35` (`` `/prophet/mecanicas/${m.slug}` `` → `/anfitriao/...`).
- `src/components/prophet/tutorials-view.tsx:33` (`` `/prophet/oficina/${t.slug}` `` → `/anfitriao/...`).

- [ ] **Step 4: Atualizar links que apontam para a raiz `/` das personas creative**

- `src/components/layout/navbar.tsx:32` — logo `Link href="/"` → `href="/criativo"`.
- `src/components/dev/sober-dock.tsx` — item "início" `href: "/"` → `href: "/criativo"`.

- [ ] **Step 5: Verificar que não sobrou nenhum link antigo**

Run:
```bash
grep -rn 'href="/dev\|href="/prophet\|`/dev\|`/prophet\|"/dev"\|"/prophet"' src --include=*.tsx | grep -v "/admin"
```
Expected: nenhuma linha (admin usa `/admin/pages/dev` etc., que NÃO mudam).

- [ ] **Step 6: Build para pegar rotas/imports quebrados**

Run: `npm run build`
Expected: `Compiled successfully`. As rotas agora aparecem como `/desenvolvedor/*` e `/anfitriao/*`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor(realms): renomeia rotas dev->desenvolvedor, prophet->anfitriao"
```

---

### Task 4: Redirects 301 das rotas antigas

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Adicionar `redirects()` ao `nextConfig`**

Dentro do objeto `nextConfig` (ao lado de `headers()`), acrescentar:

```ts
  async redirects() {
    return [
      { source: "/dev", destination: "/desenvolvedor", permanent: true },
      { source: "/dev/:path*", destination: "/desenvolvedor/:path*", permanent: true },
      { source: "/prophet", destination: "/anfitriao", permanent: true },
      { source: "/prophet/:path*", destination: "/anfitriao/:path*", permanent: true },
    ];
  },
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: `Compiled successfully`.

- [ ] **Step 3: Verificar o redirect (runtime)**

Run:
```bash
(npm run start -- -p 3123 > /tmp/next-portal.log 2>&1 &) ; sleep 4
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3123/dev
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3123/prophet/oficina
```
Expected: `308`/`301` com `redirect_url` para `/desenvolvedor` e `/anfitriao/oficina`. (Deixe o servidor rodando para as próximas verificações ou pare com o PID do log.)

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat(routing): redirects 301 de /dev e /prophet para as rotas novas"
```

---

### Task 5: Home `/criativo`, `/` redirecionador e script de gate

**Files:**
- Create: `src/app/(site)/criativo/page.tsx`
- Modify: `src/app/(site)/page.tsx` (vira redirecionador mínimo)
- Modify: `src/app/layout.tsx:78-82` (script inline: rotas novas + gate)

- [ ] **Step 1: Mover a home do criativo para `/criativo`**

Criar `src/app/(site)/criativo/page.tsx` com o conteúdo **atual** de `src/app/(site)/page.tsx` (o componente `HomePage`, incluindo `ArcaneGazette`, `SvCanvas`, `BentoGrid` e o `MotionDemo` já presentes). Manter os mesmos imports/paths (`@/...`). Renomear o componente para `CriativoHome`.

- [ ] **Step 2: Transformar `src/app/(site)/page.tsx` em redirecionador**

Substituir o conteúdo inteiro por:

```tsx
// A rota "/" é a porta da frente: o script de gate no <head> (src/app/layout.tsx)
// já redireciona antes do paint (primeiro acesso → /portal; com a chave → /criativo).
// Este componente é só o fallback para navegadores sem JS.
export default function FrontDoor() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", gap: "1rem" }}>
      <p>Escolha seu multiverso:</p>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <a href="/portal">Portal</a>
        <a href="/criativo">Criativo</a>
        <a href="/desenvolvedor">Desenvolvedor</a>
        <a href="/anfitriao">Anfitrião</a>
      </nav>
    </div>
  )
}
```

- [ ] **Step 3: Atualizar o script inline em `src/app/layout.tsx`**

Substituir a constante `antiFouc` (linhas ~78-82) por:

```ts
  // Script de gate + anti-FOUC (roda antes do paint).
  // Pinta data-realm pela rota nova e, só na porta da frente "/", roteia:
  // sem a chave → /portal; com a chave → /criativo.
  const antiFouc =
    "(function(){try{var p=location.pathname," +
    "r=p.indexOf('/desenvolvedor')===0?'developer':p.indexOf('/anfitriao')===0?'arcane':'creative';" +
    "document.documentElement.setAttribute('data-realm',r);" +
    "if(p==='/'){var e=false;try{e=localStorage.getItem('lr.portal.v1')==='1';}catch(x){}" +
    "location.replace(e?'/criativo':'/portal');}}catch(e){}})()";
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: `Compiled successfully`; rota `/criativo` listada.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/criativo/page.tsx" "src/app/(site)/page.tsx" src/app/layout.tsx
git commit -m "feat(portal): home em /criativo, '/' redirecionador e script de gate"
```

---

### Task 6: Logos animados + `portal.css`

**Files:**
- Create: `src/styles/portal.css`
- Create: `src/components/portal/logos/logo-criativo.tsx`
- Create: `src/components/portal/logos/logo-desenvolvedor.tsx`
- Create: `src/components/portal/logos/logo-anfitriao.tsx`

- [ ] **Step 1: Criar `src/styles/portal.css`**

```css
/* Portal de entrada — layout e logos animados. */
.portal { position: fixed; inset: 0; background: #08080c; color: #f4f4f6;
  font-family: var(--font-sans, ui-sans-serif, system-ui, sans-serif); overflow: hidden; }
.portal::after { content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 5;
  background: radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,.7) 100%); }
.portal-top { position: absolute; top: 0; left: 0; right: 0; z-index: 6; text-align: center; padding: 26px 16px 0; }
.portal-kick { font-size: 11px; letter-spacing: .42em; text-transform: uppercase; color: rgba(244,244,246,.42); }
.portal-title { font-weight: 300; font-size: 20px; letter-spacing: .06em; margin-top: 8px; opacity: .85; }
.portal-title b { font-weight: 600; }

.portal-stage { display: flex; height: 100vh; }
.portal-panel { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 26px; cursor: pointer; background: transparent; border: 0;
  border-right: 1px solid rgba(255,255,255,.06); color: inherit;
  transition: flex .6s cubic-bezier(.7,0,.2,1); }
.portal-panel:last-child { border-right: 0; }
.portal-panel::before { content: ""; position: absolute; inset: 0; opacity: 0; transition: opacity .6s ease;
  background: radial-gradient(90% 70% at 50% 55%, var(--glow) 0%, transparent 70%); }
.portal-stage:hover .portal-panel { flex: .8; }
.portal-stage:hover .portal-panel:hover { flex: 1.8; }
.portal-panel:hover::before, .portal-panel:focus-visible::before { opacity: .22; }
.portal-panel:focus-visible { outline: 2px solid var(--accent); outline-offset: -8px; }

.portal-logo { width: 130px; height: 130px; display: grid; place-items: center; }
.portal-name { font-weight: 300; font-size: 26px; letter-spacing: .14em; text-transform: uppercase; }
.portal-name b { font-weight: 700; }
.portal-role { font-size: 11px; letter-spacing: .3em; text-transform: uppercase; color: rgba(244,244,246,.42); }
.portal-enter { margin-top: 6px; font-size: 11px; letter-spacing: .28em; text-transform: uppercase;
  color: var(--accent); opacity: 0; transform: translateY(6px); transition: .5s ease; }
.portal-panel:hover .portal-enter, .portal-panel:focus-visible .portal-enter { opacity: 1; transform: none; }

/* CRIATIVO — mundos paralelos + aberração cromática */
.pl-cri { position: relative; width: 120px; height: 120px; }
.pl-cri svg { position: absolute; inset: 0; }
.pl-cri svg * { fill: none; stroke-width: 3; stroke-linecap: round; }
.pl-cri .base * { stroke: #fff; }
.pl-cri .r { mix-blend-mode: screen; animation: pl-gl 2.4s infinite steps(2); }
.pl-cri .c { mix-blend-mode: screen; animation: pl-gl 2.4s infinite steps(2) reverse; }
.pl-cri .r * { stroke: #ff2d95; } .pl-cri .c * { stroke: #00e5ff; }
@keyframes pl-gl { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-3px,1px)}
  50%{transform:translate(2px,-2px)} 75%{transform:translate(-2px,2px)} }
.portal-panel:hover .pl-cri .r, .portal-panel:hover .pl-cri .c { animation-duration: .5s; }

/* DESENVOLVEDOR — terminal */
.pl-dev { font-family: ui-monospace, monospace; font-size: 64px; font-weight: 700; color: #f8f8f2; }
.pl-dev .p { color: #50fa7b; }
.pl-dev .cur { display: inline-block; width: .55ch; background: #50fa7b; color: #50fa7b; animation: pl-blink 1s steps(1) infinite; }
@keyframes pl-blink { 50% { opacity: 0; } }

/* ANFITRIÃO — selo + d20 */
.pl-anf { width: 124px; height: 124px; position: relative; animation: pl-spin 30s linear infinite;
  filter: drop-shadow(0 0 10px rgba(201,162,74,.4)); }
@keyframes pl-spin { to { transform: rotate(360deg); } }
.pl-anf .ring { fill: none; stroke: #e8d9a8; stroke-width: 2; stroke-linecap: round; }
.pl-anf .draw { stroke-dasharray: 520; stroke-dashoffset: 520; animation: pl-draw 3.4s ease forwards infinite; }
@keyframes pl-draw { to { stroke-dashoffset: 0; } }
.pl-anf .inner { position: absolute; inset: 0; display: grid; place-items: center; animation: pl-spin 30s linear infinite reverse; }
.pl-anf .inner svg * { fill: none; stroke: #e8d9a8; stroke-linecap: round; stroke-linejoin: round; }
.pl-anf .out { stroke-width: 2.6; } .pl-anf .fac { stroke-width: 1.6; opacity: .85; } .pl-anf .face { stroke-width: 2.2; }

@media (prefers-reduced-motion: reduce) {
  .pl-cri .r, .pl-cri .c, .pl-dev .cur, .pl-anf, .pl-anf .inner, .pl-anf .draw { animation: none !important; }
  .pl-anf .draw { stroke-dashoffset: 0; }
  .portal-panel { transition: none; }
}
```

- [ ] **Step 2: Criar `logo-criativo.tsx`**

```tsx
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
```

- [ ] **Step 3: Criar `logo-desenvolvedor.tsx`**

```tsx
export function LogoDesenvolvedor() {
  return (
    <div className="pl-dev" aria-hidden>
      <span className="p">❯</span>_<span className="cur">&nbsp;</span>
    </div>
  )
}
```

- [ ] **Step 4: Criar `logo-anfitriao.tsx`**

```tsx
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
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `Compiled successfully` (os componentes ainda não são usados; garante que compilam).

- [ ] **Step 6: Commit**

```bash
git add src/styles/portal.css src/components/portal/logos/
git commit -m "feat(portal): logos animados e portal.css"
```

---

### Task 7: `PortalGate` + rota `/portal`

**Files:**
- Create: `src/components/portal/portal-gate.tsx`
- Create: `src/app/portal/layout.tsx`
- Create: `src/app/portal/page.tsx`

- [ ] **Step 1: Criar `portal-gate.tsx`**

```tsx
"use client"

import { useRouter } from "next/navigation"
import { markEntered } from "@/lib/portal"
import { LogoCriativo } from "./logos/logo-criativo"
import { LogoDesenvolvedor } from "./logos/logo-desenvolvedor"
import { LogoAnfitriao } from "./logos/logo-anfitriao"

const PANELS = [
  { id: "criativo", name: "Criativo", role: "Design · Arte · Multiverso", route: "/criativo",
    glow: "#ff2d95", accent: "#ff2d95", Logo: LogoCriativo },
  { id: "desenvolvedor", name: "Desenvolvedor", role: "Aprendizado · Código · Ferramentas", route: "/desenvolvedor",
    glow: "#50fa7b", accent: "#50fa7b", Logo: LogoDesenvolvedor },
  { id: "anfitriao", name: "Anfitrião", role: "Boardgame · Magia · Nostalgia", route: "/anfitriao",
    glow: "#9a7b28", accent: "#c9a24a", Logo: LogoAnfitriao },
] as const

export function PortalGate() {
  const router = useRouter()

  function enter(route: string) {
    markEntered()
    router.push(route)
  }

  return (
    <div className="portal">
      <div className="portal-top">
        <div className="portal-kick">Escolha seu multiverso</div>
        <p className="portal-title">Uma pessoa, <b>três</b> universos.</p>
      </div>
      <div className="portal-stage">
        {PANELS.map(({ id, name, role, route, glow, accent, Logo }) => (
          <button
            key={id}
            className="portal-panel"
            style={{ ["--glow" as string]: glow, ["--accent" as string]: accent }}
            onClick={() => enter(route)}
            aria-label={`Entrar no multiverso ${name}`}
          >
            <span className="portal-logo"><Logo /></span>
            <span className="portal-name"><b>{name}</b></span>
            <span className="portal-role">{role}</span>
            <span className="portal-enter">Entrar →</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Criar `src/app/portal/layout.tsx`**

```tsx
import "@/styles/portal.css"
import type { ReactNode } from "react"

export const metadata = { title: "Portal — Os Três Multiversos" }

export default function PortalLayout({ children }: { children: ReactNode }) {
  return children
}
```

- [ ] **Step 3: Criar `src/app/portal/page.tsx`**

```tsx
import { PortalGate } from "@/components/portal/portal-gate"

export default function PortalPage() {
  return <PortalGate />
}
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: `Compiled successfully`; rota `/portal` listada.

- [ ] **Step 5: Commit**

```bash
git add src/components/portal/portal-gate.tsx src/app/portal/
git commit -m "feat(portal): PortalGate e rota /portal"
```

---

### Task 8: Verificação E2E (Playwright) + smoke final

**Files:** nenhum (verificação).

- [ ] **Step 1: Subir a build de produção**

```bash
npm run build
(npm run start -- -p 3123 > /tmp/next-portal.log 2>&1 &) ; sleep 4
```

- [ ] **Step 2: Verificar redirects e rotas (curl)**

```bash
curl -s -o /dev/null -w "dev %{http_code} %{redirect_url}\n" http://localhost:3123/dev
curl -s -o /dev/null -w "prophet %{http_code} %{redirect_url}\n" http://localhost:3123/prophet/oficina
curl -s -o /dev/null -w "criativo %{http_code}\n" http://localhost:3123/criativo
curl -s -o /dev/null -w "portal %{http_code}\n" http://localhost:3123/portal
```
Expected: `/dev` e `/prophet/*` retornam 308/301 para as rotas novas; `/criativo` e `/portal` retornam 200.

- [ ] **Step 3: E2E do gate (Playwright)** — carregar via ToolSearch os tools `browser_navigate`, `browser_evaluate`, `browser_console_messages`, `browser_close`.

Fluxo a exercitar e o resultado esperado:
1. `localStorage.clear()` via `browser_evaluate`; navegar a `http://localhost:3123/` → URL final deve ser `/portal` (gate sem chave).
2. Em `/portal`, clicar no painel "Criativo" (`browser_click` no botão com aria-label "Entrar no multiverso Criativo") → URL vira `/criativo`; `localStorage.getItem('lr.portal.v1')` === `"1"`.
3. Navegar de novo a `http://localhost:3123/` → agora redireciona para `/criativo` (chave presente), **não** para `/portal`.
4. Navegar direto a `http://localhost:3123/desenvolvedor` → permanece em `/desenvolvedor` (deep link não sequestrado).
5. Coletar `browser_console_messages` nível `error` em `/portal`, `/criativo`, `/desenvolvedor`, `/anfitriao` → **zero violações de CSP** (ignorar 404 de favicon e do script do Vercel insights, que são locais).

- [ ] **Step 4: Encerrar o servidor**

```bash
netstat -ano | grep :3123 | grep LISTENING | awk '{print $5}' | sort -u | xargs -r -I{} taskkill //PID {} //F
```

- [ ] **Step 5: Atualizar memória do portal**

Criar `.../memory/portal-entrada-3-multiversos.md` (type project) descrevendo: rota `/portal`, gate `lr.portal.v1`, rotas renomeadas e redirects 301. Adicionar linha no `MEMORY.md`. (Linka de/para [[realm-naming-convention]].)

- [ ] **Step 6: Commit final (se houver ajustes) + push/deploy sob demanda**

```bash
git add -A && git commit -m "test(portal): verificacao E2E do gate e rotas" || echo "nada a commitar"
```

---

## Self-Review (cobertura do spec)

- Rota `/portal` + layout mínimo → Task 7. ✅
- Gate localStorage + script inline (só `/`) → Task 1 + Task 5. ✅
- Renomear `/dev`→`/desenvolvedor`, `/prophet`→`/anfitriao` → Task 3. ✅
- Home `/criativo`, subpáginas na raiz, `/` redirecionador → Task 5. ✅
- Redirects 301 → Task 4. ✅
- 3 logos animados + reduced-motion → Task 6. ✅
- Rerotulagem `label`/`aria` + `realmFromPath` → Task 2. ✅
- Reúso `UniverseTransitionProvider` → o `PortalGate` navega via `router.push`; a transição dimensional já é acionada pelo `UniverseProvider` na troca de rota (Task 2 mantém o provider). ✅
- A11y (teclado, aria, foco) → Task 7 (`<button>` + aria-label) + Task 6 (`:focus-visible`). ✅
- CSP (SVG/CSS por classe) → Task 6 (sem `style=` crítico; único `style` é `opacity` estático) + Task 8 (verificação). ✅
- Critérios de aceite 1-9 do spec → Task 8. ✅
