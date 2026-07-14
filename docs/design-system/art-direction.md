# Direção de Arte — Multiverso de Estilos

> Evolução artística do Aranhaverso. **Enriquecer, não refazer.** A identidade
> atual permanece reconhecível; adicionamos camadas, personalidade e emoção.

---

## 1. Auditoria (estado atual)

| Camada | O que existe | Oportunidade de enriquecimento |
|---|---|---|
| **Arquitetura visual** | `.sv-canvas` com glows + halftone + speedlines; painéis comic com hard-shadow | Falta variação de textura por seção; superfícies ainda muito "limpas" |
| **Dimensões (universos)** | ~20 dimensões (`sv-dim-neon/noir/punk/renaissance/nouveau/2099…`) que trocam bg/ink/dots | **Subutilizadas** — só aparecem em `/dimensoes` e `/styleguide`. Deveriam colorir cada seção |
| **Cores** | Tokens completos (magenta/cyan/yellow/lime/violet/orange + neutros + semânticos) | Falta a lógica de **contorno colorido** (hoje contorno é preto por padrão) |
| **Tipografia** | Bebas/Bangers/Archivo (display) + Geist (sans) + Nabla/Monoton/Glitch/Shade (lab) | Falta escrita manual / stencil / graffiti distribuídos com propósito |
| **Grid & spacing** | Escala de tokens sólida | Composições muito ortogonais — faltam diagonais e cortes editoriais |
| **Motion** | `motion.ts` (popTilt/glitch/dimSwap) + keyframes | Falta **motion visual em elementos estáticos** (linhas cinéticas, ghosting) |
| **Assets/Ilustrações** | SVG do Lab (spider, portal, burst) | Bem; expandir com grafismos (setas, carimbos, fitas, recortes) |
| **Backgrounds/Overlays** | halftone único (dots magenta) + speedlines | **Falta pluralidade de halftones** (linhas, losango, hexágono, retícula irregular) e texturas físicas (papel, grão, tinta) |
| **Contornos** | preto 3px sólido (comic) | Introduzir contornos coloridos + linhas irregulares/tremidas |
| **Sombras** | hard-shadow sólida (elevation) + soft | Adicionar hachura, cross-hatch, pontilhismo, halftone como sombra |
| **Estados/Feedback** | completos e acessíveis (Fase 2) | Micro-detalhes ilustrados por componente; hover states únicos |
| **Efeitos (Lab)** | glitch, holo, neon, VHS, chroma, portal | Levar dose **discreta** ao app (RGB offset, grão, bloom localizado) |

**Diagnóstico:** a fundação é forte e coerente, mas a expressividade está **concentrada** no Lab e no styleguide. As telas "de produção" (home, portfólio, sobre, contato) ainda leem como template limpo. A direção de arte precisa **distribuir** riqueza gráfica — com imperfeição controlada — sem quebrar usabilidade.

---

## 2. Princípios da intervenção

1. **Imperfeição controlada** — nenhuma superfície grande 100% lisa; papel, grão, tinta, offset sutis.
2. **Pluralidade coerente** — técnicas convivem (quadrinho + pintura + grafite + offset + 3D estilizado) sem virar colagem aleatória.
3. **Cada tela, um universo** — mapear seções às dimensões existentes (abaixo).
4. **Contorno é cor** — preto deixa de ser padrão; contornos coloridos quando fizer sentido.
5. **Movimento no estático** — linhas cinéticas, ghosting, duplicação, fragmentação.
6. **Narrativa com propósito** — balões, setas, carimbos, onomatopeias só quando contribuem.
7. **Discrição no pós** — glow/chroma/grão presentes, nunca exagerados.
8. **Regra de ouro** — cada tela funciona como interface + página de quadrinho + pôster + quadro + frame.

---

## 3. Mapa de universos por seção

Aproveita as dimensões existentes (`sv-dim-*`) como "art direction" de cada rota.

| Seção / rota | Universo | Linguagem |
|---|---|---|
| Home `/` | **Multiverso** (base) | mistura assinatura: neon + halftone + speedlines |
| Portfólio `/portfolio` | **Pop Art** | halftones gigantes, primárias, onomatopeias |
| Sobre `/about` | **Aquarela / Nouveau** | pigmentação, papel, bordas molhadas |
| Contato `/contact` | **Grafite** | spray, stencil, muro, escorridos |
| Blog `/blog` | **Offset editorial** | papel, retícula CMYK, colunas |
| Skills/Tools | **Cyberpunk / 2099** | neon, glitch, RGB, vidro |
| Design System | **Multiverso** (atual) | mantém identidade do DS |
| Style Guide / Dimensões | já são vitrine multiverso | manter |
| 404 | **Noir/Horror** (já é) | manter |

> Regra: o universo **colore** a tela (bg, dots, contorno, textura), mas os
> componentes do DS continuam os mesmos — só herdam a atmosfera.

---

## 4. Sistema visual reutilizável (`src/styles/sv-artdirection.css`)

Tokens + utilitários `.art-*`, todos com `prefers-reduced-motion` e custo de GPU baixo.

**Texturas** — `.art-paper`, `.art-grain`, `.art-fiber`, `.art-ink-splatter`, `.art-offset`
**Halftones** — `.art-ht-dots`, `.art-ht-lines`, `.art-ht-diamond`, `.art-ht-hex`, `.art-ht-irregular` (+ cor via `--ht-color`)
**Contornos** — `.art-outline-cyan|magenta|violet|lime|red|white` + `.art-line-rough` (tremida) via SVG filter
**Sombras desenhadas** — `.art-shadow-hatch`, `.art-shadow-cross`, `.art-shadow-dots`, `.art-shadow-flat`
**Motion estático** — `.art-kinetic` (linhas de velocidade), `.art-ghost` (duplicação RGB), `.art-fragment`
**Bordas imperfeitas** — `.art-deckle` (papel rasgado), `.art-torn`
**Grafismos/adesivos** — `.art-tape`, `.art-stamp`, `.art-sticker`, `.art-scribble`, `.art-arrow`
**Pós** — `.art-rgb-offset`, `.art-bloom`, `.art-chroma-soft`
**Filtros SVG** — `#art-rough` (deslocamento de borda), `#art-ink` (turbulência de tinta)

Convenção: prefixo `art-` (distinto de `fx-` do Lab, que é extremo). `art-*` é a
camada **sutil/produção**; `fx-*` é o **exagero/Lab**.

---

## 5. Rollout (progressivo)

- **Onda 1 — Sistema + fundação** ✅ : `sv-artdirection.css`, filtros SVG globais, tokens; aplicar em `DsCard`, divisores de seção e no hero da home. Documentar.
- **Onda 2 — Universos por rota** ✅ : `ArtOverlay` (presets por universo) sobre a dimensão existente de cada rota — portfólio (renaissance→offset pictórico), sobre (nouveau→aquarela), contato (punk→grafite), blog (noir→filme antigo), skills/tools (neon→cyberpunk). Sem trocar dimensões (identidade preservada); textura via overlay sem tocar no halftone-assinatura do canvas.
- **Onda 3 — Narrativa & micro-detalhes** ✅ : micro-interações `.art-*` (sublinhado desenhado à mão nos títulos de seção, hover artesanal `art-hover-jitter`/`art-hover-ink`, link ilustrado); grafismos narrativos reutilizáveis (`ArtArrow`, `ArtCircleMark`, `ArtScribble`, `ArtStarMark`) via `#art-rough`, usados **com propósito** (ex.: círculo à mão no marco "Fase 1 entregue").
- **Onda 4 — Pós & refino** ✅ : bloom discreto no destaque do `ComicHeader` (todas as telas); grão/RGB por universo já vêm do `ArtOverlay`. **Auditoria:** contraste verificado ao vivo (`ContrastMatrix`, WCAG AA) — texto sempre sobre superfícies escuras; **performance** — texturas 100% CSS/SVG data-URI (sem raster), overlays `pointer-events-none`, `prefers-reduced-motion` em toda animação; build sem regressão.

Cada onda: implementar → revisar coerência estética + funcional → documentar aqui.

---

## 6. Requisitos mantidos

Acessibilidade (WCAG AA), performance (texturas via CSS/SVG leves, sem imagens
pesadas), reuso de componentes, tokens reutilizáveis, consistência e documentação.
