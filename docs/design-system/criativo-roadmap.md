# Roadmap do realm Criativo — próximos passos chamáveis

> Cada item tem um **ID**. Para eu executar, é só dizer o ID
> (ex.: _"faz o CR-8B2"_) ou o nome. Estimativas: 🟢 rápido (≤1 commit),
> 🟡 médio, 🔴 grande (vale piloto). Tudo abaixo vive no guia do Criativo
> em `/design-system/realms/creative`.

---

## ✅ Entregue nesta leva (referência)

| Bloco | Onde | Arquivos-chave |
|---|---|---|
| Catálogo **Comic FX** — 26 efeitos de título | 04.1 | `comic-fx.css`, `creative-typography-fx.tsx` |
| **Biblioteca de assets MULTIVERSO** — 9 cards | 04.1 | `creative-typography-fx.tsx` |
| **Web kit 8-bit** — janela, status, botões, badges, barras, form | 04.2 | `eightbit.css`, `creative-8bit-kit.tsx` |
| **Templates de zona** — hero split, grade, CTA | 04.3 | `creative-zone-templates.tsx` |
| **Faixas diagonais** nas 8 dimensões da landing | `/criativo` | `zone-band.css`, `comic/zone.tsx` |
| **Tipografia por dimensão** (estudo de cores) | `/criativo` | `criativo-landing.ts`, `glitch-title.tsx` |
| **Anomalia no "Lucas Riboldi"** | hero | `criativo/hero.tsx` |
| **Menu "fenda dimensional"** | site inteiro | `nav-rift.css`, `layout/comic-nav.tsx` |

Fontes adicionadas: Anton, Bebas, Bungee Shade, Rubik Glitch/Wet Paint/Distressed,
Monoton, Nabla, Pixelify Sans, Cinzel, Caveat Brush.

---

## 🎨 Mais efeitos de título (catálogo Comic FX)

Puxados das referências multiverso que ainda não viraram classe.

- **CR-FX1** 🟢 Retro 3D dourado (western/vintage) — blocos de ouro com sombra vermelha
- **CR-FX2** 🟢 Escova branca no escuro — traço de pincel branco (reusa Caveat Brush)
- **CR-FX3** 🟡 Teia de aranha — traço + fios de teia por trás (SVG/pseudo)
- **CR-FX4** 🟢 Dupla-exposição — trazer `sv-doubleexpose` para o catálogo `kfx-*`
- **CR-FX5** 🟢 Holograma — trazer `fx-holo` para o catálogo `kfx-*`
- **CR-FX6** 🟡 Neon-tubo animado (o brilho pulsa/acende) — variante do `kfx-neon`

## 🕹️ Mais peças do web kit 8-bit

- **CR-8B1** 🟡 Menu de pause (lista de opções com cursor ▶ selecionável)
- **CR-8B2** 🟡 Caixa de diálogo RPG (efeito máquina de escrever + seta "continuar")
- **CR-8B3** 🟡 Inventário / grade de itens (slots pixel)
- **CR-8B4** 🟢 Placar de recordes (tabela high-score monospace)
- **CR-8B5** 🟢 Ícones pixel em CSS (moeda, estrela, cogumelo, chave, poção)
- **CR-8B6** 🟢 Toggle / checkbox / radio pixel
- **CR-8B7** 🟡 Tooltip / balão de fala pixel (com rabicho serrilhado)

## 🧩 Mais templates de zona

- **CR-T1** 🟢 Rodapé de dimensão (links + selo + redes, no estilo faixa)
- **CR-T2** 🟡 Depoimentos em balão de fala comic
- **CR-T3** 🟡 Galeria masonry de arte (grade irregular)
- **CR-T4** 🟢 Faixa de estatísticas (contadores animados, reusa `Counter`)
- **CR-T5** 🟡 Timeline de dimensões (linha do tempo em quadros)
- **CR-T6** 🟡 Split art+texto invertível (alterna lado, como as faixas da landing)

## ✨ Landing / dimensões

- **CR-L1** 🟢 Ajuste fino das faixas diagonais (intensidade do corte por dimensão)
- **CR-L2** 🔴 Arte real por dimensão (ilustração no lado "arte" de cada faixa)
- **CR-L3** 🔴 Novas dimensões/zonas na landing (exige conteúdo real por trás)
- **CR-L4** 🟡 Selo de anomalia interativo (o burst reage ao hover/scroll)

## 🔧 Refino e dívida técnica

- **CR-M1** 🟡 Documentar 04.1–04.3 no `DESIGN_SYSTEM.md` + `registry.ts`
- **CR-M2** 🟢 Auditar `prefers-reduced-motion` dos novos efeitos (glitch/neon/anomalia)
- **CR-M3** 🟡 Contraste AA dos títulos em fundo claro (banca/mural/tirinhas) — Lighthouse
- **CR-M4** 🟢 Componentizar o ransom (`RansomText`) separado do `PunkName`
- **CR-M5** 🟡 Perf das faixas: lazy-load das imagens de conteúdo abaixo da dobra
- **CR-M6** 🟡 Stories de Storybook para os `kfx-*` e `bit-*` (com addon a11y)
- **CR-M7** 🟢 Teste unitário do mapeamento treatment→classe do `GlitchTitle`

---

## Como chamar

- **Um item:** _"faz o CR-8B2"_ ou _"faz a caixa de diálogo RPG"_.
- **Um grupo:** _"faz os efeitos CR-FX1 a CR-FX3"_ ou _"faz o lote de ícones 8-bit"_.
- **Prioridade minha (se pedir sugestão):** CR-M1 (documentar), depois CR-M3
  (contraste) e CR-8B5 (ícones) — fecham qualidade e dão base para o resto.
