# DESIGN_SYSTEM.md

> 📚 **Documentação viva do Design System:** a fundação completa (arquitetura,
> Design Tokens, convenções, estados, responsividade, acessibilidade e roadmap)
> está em [`docs/design-system/`](./docs/design-system/README.md) e navegável em
> `/design-system`. Este arquivo mantém os princípios de alto nível.

# Personal Portal Design System

Versão: 1.0

---

# Objetivo

Este documento define o sistema de design oficial da plataforma Personal Portal.

Todos os componentes, páginas e funcionalidades devem seguir estas regras.

Objetivos:

* Consistência visual
* Escalabilidade
* Acessibilidade
* Reutilização
* Facilidade de manutenção
* Compatibilidade com IA Agents

---

# Princípios

## 1. Simplicidade

Interfaces devem ser limpas.

Evitar excesso de elementos.

Priorizar clareza.

---

## 2. Hierarquia Visual

O usuário deve identificar imediatamente:

* Título
* Conteúdo principal
* Ações disponíveis

---

## 3. Responsividade

Mobile First.

Todo componente deve funcionar em:

* Mobile
* Tablet
* Desktop
* Ultrawide

---

## 4. Performance

Evitar:

* CSS excessivo
* Renderizações desnecessárias
* Dependências pesadas

---

## 5. Acessibilidade

Todos os componentes devem possuir:

* aria-label
* focus states
* navegação por teclado
* contraste AA

---

# Temas

## Light

Uso:

* ambientes corporativos
* leitura prolongada

Classe:

```html
<html class="light">
```

---

## Dark

Tema padrão.

Classe:

```html
<html class="dark">
```

---

# Tokens

Fonte única da verdade:

```text
src/styles/tokens.css
```

Jamais utilizar:

```css
color: #3b82f6;
```

Utilizar:

```css
color: var(--primary-500);
```

---

# Cores

## Primary

Utilizada para:

* botões principais
* links
* destaque

```css
--primary-50
--primary-100
--primary-200
--primary-300
--primary-400
--primary-500
--primary-600
--primary-700
--primary-800
--primary-900
```

---

## Secondary

Uso complementar.

```css
--secondary-50
...
--secondary-900
```

---

## Success

```css
--success-500
```

Uso:

* sucesso
* concluído
* publicado

---

## Warning

```css
--warning-500
```

Uso:

* alerta
* atenção

---

## Danger

```css
--danger-500
```

Uso:

* exclusão
* erro

---

# Superfícies

## Background

```css
--background
```

Página principal.

---

## Background Secondary

```css
--background-secondary
```

Seções alternadas.

---

## Surface

```css
--surface
```

Cards.

---

## Surface Hover

```css
--surface-hover
```

Hover de cards.

---

# Tipografia

Fonte principal:

```css
--font-sans
```

Sugestão:

```text
Inter
```

---

Fonte monoespaçada:

```css
--font-mono
```

Sugestão:

```text
JetBrains Mono
```

---

# Escala Tipográfica

## Display

```css
--text-6xl
```

Hero.

---

## H1

```css
--text-5xl
```

---

## H2

```css
--text-4xl
```

---

## H3

```css
--text-3xl
```

---

## Body

```css
--text-md
```

---

## Small

```css
--text-sm
```

---

# Espaçamento

Utilizar exclusivamente:

```css
--space-1
--space-2
--space-3
--space-4
--space-5
--space-6
--space-8
--space-10
--space-12
--space-16
--space-20
--space-24
```

Proibido:

```css
padding: 13px;
```

---

# Radius

```css
--radius-sm
--radius-md
--radius-lg
--radius-xl
--radius-2xl
--radius-full
```

---

# Sombras

```css
--shadow-sm
--shadow-md
--shadow-lg
--shadow-primary
```

---

# Gradientes

Disponíveis:

```css
--gradient-primary
--gradient-hero
--gradient-card
```

---

# Glassmorphism

Tokens:

```css
--glass-bg
--glass-border
--glass-blur
```

Classe:

```css
.glass
```

---

# Componentes

Todos os componentes devem ser:

* reutilizáveis
* desacoplados
* tipados

---

# Button

Arquivo:

```text
components/ui/button.tsx
```

Variantes:

```text
primary
secondary
ghost
outline
danger
success
```

Tamanhos:

```text
sm
md
lg
xl
```

---

# Card

Arquivo:

```text
components/ui/card.tsx
```

Subcomponentes:

```text
Card
CardHeader
CardContent
CardFooter
```

---

# Badge

Arquivo:

```text
components/ui/badge.tsx
```

Variantes:

```text
default
primary
success
warning
danger
```

---

# Input

Arquivo:

```text
components/ui/input.tsx
```

Suporte:

```text
error
success
disabled
loading
```

---

# Textarea

Arquivo:

```text
components/ui/textarea.tsx
```

---

# Modal

Arquivo:

```text
components/ui/modal.tsx
```

Recursos:

* ESC fecha
* click fora fecha
* trap focus

---

# Dropdown

Arquivo:

```text
components/ui/dropdown.tsx
```

---

# Tooltip

Arquivo:

```text
components/ui/tooltip.tsx
```

---

# Toast

Arquivo:

```text
components/ui/toast.tsx
```

Posições:

```text
top-right
top-left
bottom-right
bottom-left
```

---

# Navbar (ComicNav)

Arquivo:

```text
components/layout/comic-nav.tsx
```

Substituiu `navbar.tsx` + `mobile-menu.tsx` (removidos). Barra **inline**, com
os destinos sempre à vista — o overlay em tela cheia que existia antes foi
descartado: abrir uma tela só para escolher para onde ir esconde o destino
atrás de um clique extra e tira o visitante da página.

Elementos:

* Fio de cor do multiverso no topo (4px)
* Logo + barra segmentada + Theme Toggle
* **Desktop:** pílula que desliza entre os itens com `layoutId` — um só
  elemento animado, em vez de quatro fundos acendendo e apagando
* **Mobile:** painel que desce logo abaixo da barra, sem cobrir a página

Altura total (67px = fio 4 + barra 60 + borda 3) vive no token
`--k-header-h`, consumido também pelo `padding-top` do `<main>` e pela altura
mínima do hero. Se a barra mudar de altura, os três acompanham.

Acessibilidade:

* `aria-expanded` + `aria-controls` no gatilho mobile
* `aria-current="page"` no item ativo
* `Esc` fecha o painel mobile
* Sem trava de scroll nem focus trap — **o painel não é modal**; a página
  atrás continua visível e utilizável, que é o objetivo do formato

Fonte dos links: `lib/nav.ts` (`SITE_LINKS`), incluindo a `description` — que
vira `title` no desktop e linha de apoio no painel mobile.

---

# Abas de seção (CardsSections)

Arquivo:

```text
components/cards/cards-sections.tsx
```

Padrão de abas com carregamento adiado, usado em `/cards`. As três galerias
somam ~30 imagens hi-res mais as folhas do motor de foil; carregadas de uma
vez, o visitante pagava por três seções para ver uma.

* Cada galeria entra por `next/dynamic` com `ssr: false` — o efeito holográfico
  depende do ponteiro e não produz nada de útil no HTML do servidor
* Só a aba ativa é montada: trocar de aba desmonta a anterior e libera as
  imagens dela
* `role="tablist"` / `tab` / `tabpanel`, setas navegam, Home/End vão às pontas,
  e só a aba ativa fica no fluxo de tabulação
* Placeholder com altura próxima da galeria real, para o conteúdo abaixo não
  saltar quando ela entra

Reaproveitar este padrão em qualquer página que empilhe seções pesadas.

---

# Imagens das cartas

Script:

```text
scripts/optimize-cards.mjs
```

As faces vinham como PNG de scan — a maior tinha 1,7 MB, servida tal e qual num
card de ~320px. PNG é o pior formato possível para fotografia. O script
reencoda em AVIF (q52) com teto de 1024px de largura:

```bash
node scripts/optimize-cards.mjs                    # simula
node scripts/optimize-cards.mjs --write            # grava os .avif
node scripts/optimize-cards.mjs --write --replace  # grava e apaga a origem
```

`--replace` é um passo separado de propósito: apagar o original é
irreversível, e quem roda deve poder conferir antes.

Resultado: **`public/` de 19,20 MB para 7,16 MB** (60 imagens, −12,0 MB).

## Regras para cartas novas

* Colocar o arquivo em `public/poke-holo/` ou `public/cards-thundercats/web/`
  e rodar o script — não commitar PNG de carta.
* A face é servida por `next/image` com `sizes` e `quality={60}`.
* **Não subir a `quality` para o default 75.** A origem já é AVIF q52;
  reencodar acima disso gasta bytes tentando preservar artefacto de
  compressão. Medido no recorte de 640px: q75 = 90 KB, q60 = 43 KB, sem
  diferença visível.
* `next.config.ts` declara `formats: ["image/avif", "image/webp"]` — sem isso o
  otimizador reencodava para WebP, **maior** que o AVIF que entrou.
* O verso da carta continua em `<img>` cru: é SVG, que o otimizador não
  processa nem precisa.

O que ficou de fora e ainda pesa: os foils (`*_foil_*.webp`, ~0,77 MB) são
consumidos por `url()` em CSS, fora do alcance do `next/image`; e `public/font`
(0,72 MB) merece auditoria de `.otf` sobrando ao lado do `.woff2`.

---

# Sidebar

Arquivo:

```text
components/layout/sidebar.tsx
```

Utilizada:

* dashboard
* admin

---

# Cards Específicos

## ProjectCard

Exibe:

* imagem
* nome
* descrição
* tecnologias
* github
* demo

---

## GithubCard

Exibe:

* stars
* forks
* linguagem
* atualização

---

## ToolCard

Exibe:

* ícone
* descrição
* categoria

---

## BlogCard

Exibe:

* capa
* data
* categoria
* leitura estimada

---

## GalleryCard

Exibe:

* thumbnail
* categoria
* resolução

---

# Animações

Arquivo:

```text
styles/animations.css
```

Permitidas:

```text
fade-in
fade-up
fade-down
scale-in
slide-left
slide-right
```

Duração padrão:

```css
250ms
```

---

# Ícones

Biblioteca oficial:

```text
lucide-react
```

Não misturar bibliotecas.

---

# Layout

Container padrão:

```css
max-width: 1400px;
```

Classe:

```text
Container
```

---

# SEO

Toda página deve possuir:

```ts
metadata
```

Campos:

```text
title
description
keywords
openGraph
twitter
```

---

# Convenções

## Componentes

```text
PascalCase
```

Exemplo:

```text
ProjectCard.tsx
```

---

## Hooks

```text
useHook.ts
```

Exemplo:

```text
useGithub.ts
```

---

## Tipos

Um arquivo por entidade.

Exemplo:

```text
types/project.ts
```

---

# Lighthouse

Meta mínima:

```text
Performance 95+
Accessibility 100
Best Practices 100
SEO 100
```

---

# Camada Comic 2026 — o multiverso pessoal (/criativo)

Arquivo de estilo:

```text
src/styles/comic-2026.css   → importado por globals.css
```

Namespace próprio (`--k-*` / `.k-*`), isolado de propósito: os tokens `--sv-*` e
as classes `.sv-*` continuam servindo o resto do site sem alteração.

A direção de arte é **revista em quadrinhos colorida e alegre**: papel saturado,
tinta grossa, retícula visível, sombra dura e letragem de capa. Nada de fundo
preto — a página é colorida do topo ao rodapé.

## Conceito de ZONA

Cada seção da landing é uma **dimensão** com paleta própria — a mesma ideia das
20 dimensões de `spiderverse-dimensions.css`, aqui aplicada ao fluxo vertical.
A zona expõe cinco variáveis que todos os componentes internos consomem:

```css
--k-zone-bg     /* fundo da dimensão (gradiente) */
--k-zone-ink    /* cor do texto — clara ou escura conforme o fundo */
--k-zone-a      /* acento primário */
--k-zone-b      /* acento secundário */
--k-zone-c      /* acento de destaque (botão, caption, onomatopeia) */
--k-zone-card   /* papel dos requadros */
--k-zone-dot    /* cor da retícula benday */
```

| Classe | Dimensão | Assinatura | Paleta |
|---|---|---|---|
| `k-zone--multiverso` | Capa e contracapa | Terra-LR | Arco-íris quente (amarelo → laranja → magenta) |
| `k-zone--atelie` | Artes e imagens | Terra-1610 · Spray | Roxo graffiti + lima |
| `k-zone--oficina` | Sites e componentes | Terra-BYTE · Blueprint | Azul técnico + ciano |
| `k-zone--banca` | Quadrinhos lendo | Terra-616 · Banca | Amarelo/laranja de banca + vermelho |
| `k-zone--cine` | Filmes | Terra-42 · Projeção | Roxo escuro + laranja de projetor |
| `k-zone--radio` | Música | Terra-1969 · Onda | Cônico psicodélico de 7 cores |
| `k-zone--videoteca` | Vídeo | Terra-VHS · Fita | Verde fósforo sobre tubo |
| `k-zone--mural` | Recados | Terra-CORTIÇA · Papel | Cortiça + post-it |
| `k-zone--tirinhas` | Piadas | Terra-8311 · Piada | Céu cartoon + primárias |

**Regra de contraste:** ao criar uma zona nova, o `--k-zone-ink` tem que bater
AA (4.5:1) contra **todos** os pontos do gradiente, não só contra o do meio.
Duas zonas já foram ajustadas por isso — o roxo do ateliê parou em `#7a1bc4`, e
a cônica da rádio ganhou uma lavagem clara no miolo porque o setor violeta
derrubava a tinta para ~3:1.

## Paleta base

| Token | Valor | Uso |
|---|---|---|
| `--k-ink` | `#12100e` | Traço e texto escuro (nunca `#000` puro) |
| `--k-paper` | `#fff6e0` | Papel jornal / texto claro |
| `--k-yellow` | `#ffd200` | Destaque, CTA |
| `--k-orange` | `#ff6b1f` | Cine, energia |
| `--k-red` | `#ff2f4e` | Vermelho HQ |
| `--k-magenta` | `#ff2d95` | Acento quente |
| `--k-violet` | `#8b3dff` | Neon roxo |
| `--k-blue` | `#1b6cff` | Azul elétrico |
| `--k-cyan` | `#00d4ff` | Técnico, foco |
| `--k-lime` | `#9dff2f` | Spray, VHS |
| `--k-green` / `--k-pink` | `#00c96b` / `#ff8fd0` | Apoio |
| `--k-ease` / `--k-bounce` | curvas | Movimento (uma para tudo) |

## Tipografia

| Classe | Fonte | Papel |
|---|---|---|
| `.k-title` | Anton | Manchetes — capas de HQ |
| `.k-kicker` | Bebas Neue | Kickers e etiquetas |
| `.k-num` | Bebas Neue | Números, contadores, índices |
| `.k-sub` | Oswald | Subtítulos, navegação, botões |
| `.k-body` | Inter | Corpo de texto |

**Letragem** (modificadores de `.k-title`):

| Classe | Efeito |
|---|---|
| `.k-3d` | **Letras 3D** — extrusão por camadas na cor de acento da zona |
| `.k-3d--deep` | Extrusão longa, para manchetes de capa |
| `.k-3d--up` | Extrusão invertida (para cima e à esquerda) |
| `.k-letter` | Contorno de tinta + dupla sombra dura na cor da zona |
| `.k-letter-rainbow` | Preenchimento arco-íris animado com contorno |
| `.k-glitch` | Datamosh vermelho-ciano em faixas (ver abaixo) |
| `.k-shout` | Palavra em bloco de cor girado, tipo carimbo |
| `.k-outline` | Texto vazado — números-fantasma das zonas |
| `.k-onoma` | Onomatopeia (POW!, ZAP!) com contorno e rotação |

### Glitch

Duas cópias do texto em `::before`/`::after`, recortadas por `clip-path` em
faixas que trocam a cada passo, em ciclos de duração diferente. O conteúdo vem
de `data-text` — daí o componente aceitar `string` e não `ReactNode`.

Os passos ficam quase todos em `inset(50% 0 50% 0)` (nada visível) de propósito:
o efeito tem que ser um susto ocasional, não um tremor constante que impeça a
leitura. As cópias são pseudo-elementos, logo o título é anunciado uma vez só
pelo leitor de tela.

Usar em **uma ou duas manchetes por página**, nunca em todas. Hoje: capa,
oficina, videoteca e contracapa. O resto usa `3d`, que é o padrão da `Zone`.

### Letras 3D

Extrusão por 9 a 14 camadas de `text-shadow`, cada uma 1px na diagonal, com a
última fechando a peça em `--k-ink`. A lateral usa `--k-3d-side`, que por
omissão é o acento da zona — a mesma manchete muda de cor conforme a dimensão
onde está.

É `text-shadow` e não `transform: translateZ` de propósito: o transform criaria
contexto 3D e arrastaria junto os pseudo-elementos do glitch, quebrando o
alinhamento das faixas quando os dois tratamentos aparecem perto.

### Anomalia Terra-138 · Punk

```text
components/comic/punk-name.tsx  →  <PunkName>Lucas Riboldi</PunkName>
```

A assinatura do autor na capa. Cada letra é um recorte de revista com fundo,
rotação e `clip-path` irregular próprios — bilhete de resgate, não tipografia.
Três posições fixas recebem `k-punk-glitch`, o salto da anomalia (passos
discretos, não interpolação: é erro de registro, não movimento).

A paleta de recortes e as posições com glitch são **fixas por índice**, nunca
sorteadas: `Math.random()` no render daria markup diferente no servidor e no
cliente e a hidratação reclamaria.

Acessibilidade: as letras são `aria-hidden` dentro de um contêiner com
`aria-label`. Sem isso o leitor de tela soletraria "L… U… C… A… S" — que é o
efeito visual desejado e exatamente o que não se quer no áudio.

## Primitivos

| Classe | Efeito |
|---|---|
| `.k-panel` | Requadro: papel da zona, tinta grossa, sombra dura deslocada |
| `.k-panel--lit` | Levanta e acende no hover/focus |
| `.k-panel--glass` | Papel translúcido (`color-mix` + blur) |
| `.k-cut-tr` / `.k-cut-bl` | Recorte diagonal do requadro |
| `.k-tilt-l` / `.k-tilt-r` | Inclinação de diagramação |
| `.k-halftone` | Retícula benday (`--k-dot`, `--k-dot-step`) |
| `.k-grain` | Grão de impressão |
| `.k-speedlines` | Linhas de velocidade a partir de um foco |
| `.k-burst` | Explosão em estrela (22 pontas em `clip-path`) |
| `.k-pulse-ring` | Anéis de impacto pulsando |
| `.k-scanlines` | Linhas de tubo (videoteca) |
| `.k-swirl` | Cônico girando (rádio) |
| `.k-wobble` | Texto ondulando |
| `.k-caption` | Selo de legenda girado |
| `.k-bubble` / `.k-bubble--thought` | Balão de fala / de pensamento |
| `.k-btn` + `--primary` / `--ghost` | Botão que afunda ao clicar |
| `.k-ink-divider` | Separador de tinta entre zonas |
| `.k-stars` | Nota em estrelas |

## Componentes React

```text
components/comic/              primitivos (Atomic: átomos e moléculas)
  atoms.tsx                      Halftone, SpeedLines, Burst, Onoma,
                                 PulseRings, InkDivider, Caption, Bubble,
                                 Stars, ComicButton, ACCENT_VAR
  glitch-title.tsx               GlitchTitle (glitch | rainbow | letter | 3d)
  punk-name.tsx                  PunkName — anomalia Terra-138 (recortes)
  zone.tsx                       Zone — wrapper de dimensão + cabeçalho
  comic-panel.tsx                Requadro com tilt 3D
  media-frame.tsx                Imagem com fallback desenhado
  counter.tsx                    Contador (IntersectionObserver + rAF)
  reveal.tsx                     Reveal, RevealItem, RevealGroup
  motion.ts                      EASE, STAGGER, REVEAL, PANEL_IN, slideIn

components/criativo/           organismos (uma zona = um componente)
  hero.tsx  kit-strip.tsx  outro.tsx
  zone-atelie.tsx  zone-oficina.tsx  zone-banca.tsx  zone-cine.tsx
  zone-radio.tsx   zone-videoteca.tsx zone-mural.tsx zone-tirinhas.tsx
  music-player.tsx               playlist + controles + Web Audio API

constants/criativo-landing.ts  copy editorial e metadados das zonas
data/criativo-zones.ts         seeds das tabelas (fallback de leitura)
lib/repos/criativo.ts          leitores cacheados por tag
lib/repos/playlist.ts          varredura de public/musica
public/musica/                 pasta da trilha sonora (ver README lá dentro)
```

### Zone

Wrapper que carrega a paleta, o cabeçalho (kicker + assinatura Terra-XXX +
manchete + número vazado) e o separador de tinta que fecha o bloco. Centralizar
isto é o que garante que uma zona nova herde o ritmo inteiro em vez de cada
seção reinventar o seu.

```tsx
<Zone {...ZONES.atelie}>{/* conteúdo */}</Zone>
```

### MediaFrame

Muito conteúdo entra sem capa. Em vez de retângulo cinzento, o fallback vira
requadro de HQ: inicial gigante sobre retícula, na paleta da zona. O buraco
deixa de parecer defeito e passa a parecer diagramação.

### MusicPlayer

Player local da zona Rádio (`<audio>`, sem embed de terceiros): playlist,
play/pause, anterior/próxima, barra de progresso, volume e visualizador de 48
barras reagindo ao som via Web Audio API.

Decisões que não são óbvias no código:

* **Um só elemento `<audio>` para a playlist inteira**, trocando o `src`.
  `createMediaElementSource` só pode ser chamado uma vez por elemento — montar
  um `<audio>` por faixa quebraria o visualizador na segunda música.
* **O `AudioContext` nasce no primeiro play**, não na montagem: a política de
  autoplay exige gesto do utilizador, e criar antes deixa um contexto suspenso
  que nunca produz dados. O `resume()` cobre a suspensão após pausa longa.
* **Progresso e volume são `<input type="range">` nativos** — arrastar, setas e
  Home/End já vêm prontos e acessíveis, sem reimplementar teclado.
* **A última faixa para em vez de voltar ao início**: repetir a playlist sem o
  utilizador pedir é comportamento surpreendente numa página de arquivo.
* Faixa sem arquivo mostra aviso e desabilita os controles; sem faixa nenhuma,
  o visualizador entra em **modo demo** (barras por seno) para a zona não ficar
  com espaço morto.

### Playlist a partir de pasta

```text
public/musica/        →  lib/repos/playlist.ts  →  getPlaylistFromFolder()
```

Qualquer `.mp3`/`.m4a`/`.ogg`/`.oga`/`.wav`/`.flac` colocado em
`public/musica/` vira faixa automaticamente — a pasta **é** a interface de
edição: jogar o arquivo lá e commitar já publica.

Convenção de nome: `Artista - Título.mp3`. O separador exige **espaços à
volta** do hífen; sem isso um nome em kebab-case (`esboco-sem-nome`) seria
partido no meio da palavra. Sem separador, o nome inteiro vira o título.

Ordenação alfabética com números tratados como números (`Faixa 2` antes de
`Faixa 10`).

Sem `unstable_cache` de propósito: a página é prerenderizada, logo a varredura
roda uma vez por build, e a pasta vai dentro do bundle — o conteúdo não muda
entre deploys. Cachear só acrescentaria uma camada para invalidar à mão que, em
desenvolvimento, esconderia o arquivo recém-colocado.

As duas fontes são somadas em `page.tsx`: a pasta primeiro, depois as faixas da
tabela `tracks` (que carregam capa e comentário), descartando as do banco que
apontem para o mesmo arquivo.

## Conteúdo (Supabase)

Sete tabelas novas em `supabase/migrations/0006_criativo_zones.sql`:
`artworks`, `comics`, `movies`, `tracks`, `videos`, `notes`, `strips`.

Todas seguem o contrato das anteriores: `published` + `sort`, RLS com leitura
pública do publicado e escrita só para admin. `notes` é **somente leitura
pública** — sem formulário de visitante não há superfície de spam nem fila de
moderação.

O CRUD sai de graça: cada uma é uma entrada em `lib/admin/resources.ts`, que
dirige lista, formulário, validação zod e tag de cache. O seed de
`data/criativo-zones.ts` popula as tabelas pelo botão do dashboard.

## Movimento

Uma única curva (`--k-ease`) atravessa CSS e JS. Variar a curva por componente é
o que faz uma página parecer montada por pessoas diferentes.

Toda animação de entrada roda **uma vez** (`viewport.once`) e respeita
`prefers-reduced-motion`: com a preferência ligada, os componentes renderizam
direto no estado final e glitch, arco-íris, giro e ondulação param. Não basta
encurtar a duração — quem liga a preferência costuma fazê-lo por enjoo de
movimento, e um fade rápido ainda é movimento.

---

# Regra Final

Qualquer novo componente deve:

1. Utilizar tokens CSS.
2. Suportar Dark e Light Theme.
3. Ser acessível.
4. Ser responsivo.
5. Ser reutilizável.
6. Possuir tipagem TypeScript strict.
7. Seguir a estrutura deste documento.
8. Ter um arquivo de teste unitário.
9. Ter um arquivo README.md com instruções
10. Ter uma documentação do componente no próprio arquivo
