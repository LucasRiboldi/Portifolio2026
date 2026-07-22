"use client"

import { HoloTcgCard, HoloTcgStylesheets, type TcgCardDef } from "./holo-tcg-card"

/**
 * Catálogo de raridades — a apresentação do poke-holo.simey.me: cada
 * efeito com o seu título, um parágrafo dizendo COMO ele é feito, e a
 * carta real ao lado para conferir.
 *
 * As descrições não são tradução da página original: foram escritas a
 * partir do CSS vendorizado em /public/poke-holo/css/cards, e cada uma
 * cita o arquivo onde a regra vive. Onde a explicação do autor e o código
 * divergiam, vale o código.
 */

const P = "/poke-holo"

interface Entrada {
  titulo: string
  /** arquivo do sistema onde a regra mora — para o leitor conferir */
  fonte: string
  descricao: string
  cartas: TcgCardDef[]
}

const CATALOGO: Entrada[] = [
  {
    titulo: "Comum e Incomum",
    fonte: "basic.css",
    descricao:
      "A linha de base. Não há foil nenhum: a carta só ganha a rotação 3D e o glare que segue o cursor. Serve para calibrar o olho — é o quanto de efeito vem só do tilt e do reflexo.",
    cartas: [
      { img: `${P}/33_hires.png`, name: "Squirtle", rarity: "common", label: "Comum", desc: "Só tilt e glare" },
      { img: `${P}/116_hires.png`, name: "Morpeko", rarity: "common", label: "Incomum", desc: "Arte texturizada, sem foil" },
    ],
  },
  {
    titulo: "Reverse holo",
    fonte: "reverse-holo.css",
    descricao:
      "O inverso da holo clássica: o foil cobre o fundo da carta e a ilustração fica fosca. Usa a dupla foil + máscara, e o glare é recortado na janela de arte — assim a ilustração e o holofoil reagem à luz de formas diferentes.",
    cartas: [
      { img: `${P}/49_hires.png`, name: "Pikachu", rarity: "reverse holo", label: "Reverse holo", desc: "Foil no fundo, arte fosca" },
    ],
  },
  {
    titulo: "Holo clássica",
    fonte: "regular-holo.css",
    descricao:
      "O feixe vertical de luz dentro da janela de arte. É a combinação que dá nome ao truque: gradientes repetidos para a cor, scanlines em overlay para a textura, filtros para o acabamento metálico, e clip-path para limitar tudo à área que é holográfica em cada formato de moldura.",
    cartas: [
      { img: `${P}/29_hires.png`, name: "Zapdos", rarity: "rare holo", label: "Holo", desc: "Barras verticais + arco-íris" },
    ],
  },
  {
    titulo: "Cosmos / Galáxia",
    fonte: "cosmos-holo.css",
    descricao:
      "Igual à holo clássica na estrutura, mas troca o gradiente por uma imagem de galáxia, com um arco-íris por cima em color-dodge e color-burn. As três camadas do shine deslizam em velocidades diferentes, o que faz as 'estrelas' parecerem ter profundidade.",
    cartas: [
      { img: `${P}/SWSH012_hires.png`, name: "Morpeko", rarity: "rare holo cosmos", label: "Cosmos", desc: "Galáxia em três camadas", vars: { "--cosmosbg": "286px 232px" } },
    ],
  },
  {
    titulo: "Amazing rare",
    fonte: "amazing-rare.css",
    descricao:
      "O foil escapa da moldura e invade a carta inteira — e é bem mais brilhante que uma holo comum. Consegue-se isso com uma máscara própria (que libera a área fora do frame) mais uma camada de glitter com filtro lighten.",
    cartas: [
      { img: `${P}/21_hires.png`, name: "Kyogre", rarity: "amazing rare", label: "Amazing rare", desc: "Explosão além da moldura" },
      { img: `${P}/82_hires.png`, name: "Zacian", rarity: "amazing rare", label: "Amazing rare", desc: "Foil que vaza da arte" },
    ],
  },
  {
    titulo: "Radiant",
    fonte: "radiant-holo.css",
    descricao:
      "O efeito mais difícil de imitar da série — o autor do projeto original admite ter desistido de reproduzi-lo com fidelidade. A solução é um padrão de linhas cruzadas (cross-hatch) que atravessa a carta conforme ela gira.",
    cartas: [
      { img: `${P}/59_hires.png`, name: "Radiant Alakazam", rarity: "radiant rare", label: "Radiant", desc: "Cross-hatch metálico" },
    ],
  },
  {
    titulo: "Pokémon V",
    fonte: "v-regular.css",
    descricao:
      "Faixas diagonais que parecem correr em sentidos opostos quando você inclina a carta. A ilusão vem das camadas do shine terem multiplicadores de background-position com sinais trocados — uma sobe enquanto a outra desce.",
    cartas: [
      { img: `${P}/138_hires.png`, name: "Lugia V", rarity: "rare holo v", label: "V", desc: "Diagonais em sentidos opostos", foil: `${P}/138_foil_holo_sunpillar_2x.webp` },
    ],
  },
  {
    titulo: "V Full Art e Alt Art",
    fonte: "v-full-art.css",
    descricao:
      "As mesmas diagonais da V, mais uma textura que só aparece em certos ângulos. Essa textura é o --foil da carta entrando como imagem de fundo com blend de exclusão. Full art e alt art usam a mesma regra: muda só o desenho do foil.",
    cartas: [
      { img: `${P}/250_hires.png`, name: "Mew V", rarity: "rare ultra", label: "Full art", desc: "Gravação + brilho", foil: `${P}/250_foil_etched_sunpillar_2x.webp` },
      { img: `${P}/SWSH181_hires.png`, name: "Vaporeon V", rarity: "rare ultra", label: "Alt art", desc: "Mesmo efeito, outro foil", foil: `${P}/181_foil_etched_sunpillar_2x.webp` },
    ],
  },
  {
    titulo: "VMAX",
    fonte: "v-max.css",
    descricao:
      "O gradiente é maior e se move mais devagar que o da V — daí a sensação de foil amplo, de tela cheia. Em compensação a textura é bem mais marcada.",
    cartas: [
      { img: `${P}/271_hires.png`, name: "Gengar VMAX", rarity: "rare holo vmax", label: "VMAX alt", desc: "Foil amplo e lento", subtypes: "vmax", foil: `${P}/271_foil_etched_swsecret_2x.webp` },
    ],
  },
  {
    titulo: "Secreta (ouro)",
    fonte: "secret-rare.css",
    descricao:
      "Ouro. Duas camadas de glitter — a mesma imagem em posições diferentes — deslizam em sentidos opostos e cintilam ao se cruzarem. A imagem do foil é mascarada por um gradiente para que foil e glitter sejam mutuamente exclusivos: onde há um, não há o outro.",
    cartas: [
      { img: `${P}/160_hires.png`, name: "Pikachu", rarity: "rare secret", label: "Secreta", desc: "Dois glitters cruzados", foil: `${P}/160_foil_etched_swsecret_2x.webp` },
    ],
  },
  {
    titulo: "Trainer gallery",
    fonte: "trainer-gallery-holo.css",
    descricao:
      "Metálico com brilho iridescente. Um gradiente linear grande em color-dodge dá o metal, e um radial em hard-light na posição do cursor dá o cintilar por cima.",
    cartas: [
      { img: `${P}/TG05_hires.png`, name: "Pikachu & Akari", rarity: "trainer gallery rare holo", label: "Trainer gallery", desc: "Aquarela holográfica", trainerGallery: true, foil: `${P}/tg05_foil_holo_rainbow_2x.webp` },
      { img: `${P}/TG17_hires.png`, name: "Pikachu VMAX", rarity: "rare holo vmax", label: "TG VMAX", desc: "V/VMAX com outra textura", subtypes: "vmax", trainerGallery: true, foil: `${P}/tg17_foil_etched_sunpillar_2x.webp` },
    ],
  },
]

function Entrada({ entrada }: { entrada: Entrada }) {
  return (
    <section
      className="border-t-2 border-white/12 pt-8"
      aria-label={`Raridade: ${entrada.titulo}`}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <h3 className="sv-display text-xl uppercase text-white">{entrada.titulo}</h3>
          <p className="sv-heavy mb-3 text-[10px] uppercase tracking-widest text-white/35">
            {entrada.fonte}
          </p>
          <p className="text-sm leading-relaxed text-white/75">{entrada.descricao}</p>
        </div>
        <div
          className={`grid gap-x-5 gap-y-8 ${entrada.cartas.length > 1 ? "grid-cols-2" : "max-w-[240px] grid-cols-1"}`}
        >
          {entrada.cartas.map((c) => (
            <HoloTcgCard key={c.img} def={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function HoloRarityCatalog() {
  return (
    <div className="mt-10 space-y-12">
      {/* o catálogo não depende de outra galeria estar na página: React 19
          deduplica os <link> pelo `precedence`, então declarar de novo é
          barato e torna esta seção autossuficiente */}
      <HoloTcgStylesheets />
      {CATALOGO.map((e) => (
        <Entrada key={e.titulo} entrada={e} />
      ))}
    </div>
  )
}
