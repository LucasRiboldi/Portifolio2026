# THE THREE REALMS — Arquitetura

Um único site, três universos completamente distintos, alternados por uma
metamorfose cinematográfica. Mesma base de código, mesmos componentes, mesma
arquitetura — só trocam **configuração + CSS**. Zero duplicação.

## Os três realms

| Realm | `data-realm` | Base reaproveitada | Identidade |
|---|---|---|---|
| **Creative** | `creative` | Aranhaverso atual (default) | Design/ilustração, comic, psicodélico |
| **Developer** | `developer` | classe legada `.sober` (`styles/sober.css` + `dev-mode.css`) | Terminal/dev, futurista, minimalista |
| **Arcane** | `arcane` | novo (`styles/realms.css`) | Jornal 1920, pergaminho, serifada |

## Fluxo dos universos

```
Botão Transform (VibeToggle)
   └─ cycle() ──▶ UniverseProvider.setRealm(next)
                    ├─ add .morphing no <html>
                    ├─ monta TransitionOverlay (to-<realm>)
                    ├─ t=380ms: applyRealm(next)  → data-realm + .sober? + persist
                    └─ t=840ms: remove .morphing + desmonta overlay
```

Ciclo: `creative → developer → arcane → creative`.

## Engine (mapa dos providers)

```
app/layout.tsx
 └─ <ThemeProvider>            (next-themes: light/dark, attribute="class")
     └─ <UniverseProvider>     ◀── o "Experience Engine"
         ├─ estado: realm, morphing
         ├─ API: setRealm(id), cycle()
         ├─ efeitos: aplica data-realm + .sober no <html>, persiste, deep-link ?realm=
         └─ <TransitionOverlay/>   (overlay único da metamorfose)
```

Script anti-FOUC inline (`app/layout.tsx`) pinta `data-realm` no `<html>` **antes**
da hidratação, lendo `localStorage("realm")` (com fallback da chave legada `vibe`).

## Árvore de componentes (relevante ao engine)

```
UniverseProvider            components/providers/universe-provider.tsx
├─ useUniverse()            hook de consumo (throw fora do provider)
├─ REALMS / REALM_ORDER     lib/realms.ts   ◀── configuração central
└─ VibeToggle               components/providers/vibe-toggle.tsx  (botão Transform 3-vias)
```

## Mapa das animações

| Efeito | Onde | Notas |
|---|---|---|
| Sweep do painel de morph | `dev-mode.css` `@keyframes vibe-sweep` | 0.82s, cubic-bezier |
| Flicker da legenda | `dev-mode.css` `@keyframes vibe-flick` | steps(6) |
| Painéis por realm | `realms.css` `.to-creative/.to-developer/.to-arcane` | fundo próprio de cada universo |
| Transição de cores | `dev-mode.css` `html.morphing *` | 0.4s ease |
| Cursor por realm | `realms.css` `@media (hover:hover)` | SVG inline, sem asset |

`prefers-reduced-motion` é respeitado em `dev-mode.css` e `realms.css`.

## Decisões técnicas

1. **`data-realm` + `.sober` legada** — em vez de refatorar todo o CSS `.sober`
   existente, o realm `developer` só reativa a classe legada. 100% de reuso.
2. **CSS-first, sem WebGL/som** — identidades são pura CSS (paletas, tipografia,
   texturas, cursor via SVG inline). Build 100% estático, ~102 kB JS compartilhado,
   Lighthouse-safe. Three.js/som ficam como incremento futuro opcional.
3. **Overlay único na raiz** — a metamorfose vive no provider, não em cada botão.
4. **Deep-link `?realm=`** — cada universo é compartilhável por URL.

## Guia — adicionar um 4º realm

1. **`lib/realms.ts`**: adicione uma entrada em `REALMS` (id, label, glyph, `next`,
   `sober`, `morphLabel`, `aria`) e inclua o id em `REALM_ORDER`. Ajuste os `next`
   para fechar o ciclo.
2. **`RealmId`** (mesmo arquivo): acrescente o novo literal ao union type e a
   `isRealmId`.
3. **CSS**: em `styles/realms.css`, adicione o painel de morph
   `.vibe-morph-overlay.to-<id> .vibe-morph-panel` + `.to-<id> .vibe-morph-label`,
   e o bloco de identidade `[data-realm="<id>"] { ... }` (espelhe o Arcane).
4. **Script anti-FOUC** (`app/layout.tsx`): inclua o novo id na validação.
5. **VibeToggle**: se quiser skin própria do botão, adicione o ramo `realm === "<id>"`.

Nenhuma mudança no engine é necessária — ele é agnóstico à aparência dos realms.

## Admin / CMS (Supabase)

O conteúdo saiu dos arquivos estáticos para o **Supabase** (Postgres + Auth +
Storage), controlado por um painel `/admin` protegido por **GitHub OAuth**.
Design completo em [`docs/superpowers/specs/2026-07-14-admin-cms-supabase-design.md`](superpowers/specs/2026-07-14-admin-cms-supabase-design.md);
setup em [`supabase/README.md`](../supabase/README.md).

### Camadas

```
site público (Server Components)
  └─ src/lib/repos/*        leitura cacheada (unstable_cache + tags)
       ├─ Supabase configurado → lê do Postgres
       └─ senão               → fallback ao seed estático (src/data/*.ts)

/admin (dinâmico, guard requireAdmin)
  ├─ src/lib/admin/resources.ts   config declarativa (campos + zod + tag)
  ├─ /admin/[resource]            CRUD genérico (projects/posts/skills/tools)
  ├─ /admin/{site,realms,media,messages}   seções bespoke
  └─ Server Actions → escreve (RLS) → revalidateTag → site atualiza em segundos
```

### Princípios

1. **Fallback ao seed** — sem `.env`, o site roda com o conteúdo estático e o
   build permanece verde. O CMS "liga" quando o Supabase é configurado.
2. **Segurança em profundidade** — `middleware` barra `/admin`, `requireAdmin()`
   revalida em toda action, e **RLS** (`is_admin()` via allowlist) protege o banco.
3. **DRY** — os `src/data/*.ts` são a única fonte do seed; o CRUD é dirigido por
   config, não por página duplicada.
4. **ISR on-demand** — páginas públicas estáticas + `revalidateTag` ao salvar.

### Realms via banco

`src/lib/repos/realms.ts` expõe `getRealmSettings()` (padrão/ativos/conteúdo do
Arcane). O admin edita esses valores; o engine (client) continua agnóstico —
ainda lê `lib/realms.ts` como config de aparência. Ligar o default/enabled do
banco ao provider é o próximo incremento natural.
