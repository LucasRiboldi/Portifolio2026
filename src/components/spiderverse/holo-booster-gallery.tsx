"use client"

import { HoloTcgCard, HoloTcgStylesheets, type TcgCardDef } from "./holo-tcg-card"
import { PokeHand } from "./poke-hand"

/**
 * Booster completo — as cartas restantes do acervo, agrupadas por família
 * de raridade.
 *
 * Cada carta foi identificada abrindo a imagem (nome, set, número e
 * formato), não deduzida do nome do arquivo: o número sozinho não diz se a
 * 51 é uma VMAX comum ou uma do Shiny Vault. O foil de quem tem vem da
 * derivação por nome de arquivo (ver poke-foil.ts).
 *
 * O `subtypes` e o `supertype` não são decoração: são eles que escolhem o
 * clip-path da janela holo (ver passo 11 do tutorial), então uma carta de
 * Treinador marcada como Pokémon teria o brilho no lugar errado.
 */

const P = "/poke-holo"

interface Grupo {
  titulo: string
  descricao: string
  cartas: TcgCardDef[]
}

const GRUPOS: Grupo[] = [
  {
    titulo: "Amazing rare",
    descricao:
      "A raridade de arte mais reconhecível da era Sword & Shield: respingos de tinta em todas as cores, e um foil que ignora a moldura e vaza para a carta inteira.",
    cartas: [
      { img: `${P}/9_hires.avif`, name: "Celebi", rarity: "amazing rare", label: "Celebi", desc: "Vivid Voltage 009/185" },
      { img: `${P}/17_hires.avif`, name: "Reshiram", rarity: "amazing rare", label: "Reshiram", desc: "Shining Fates 017/072" },
      { img: `${P}/46_hires.avif`, name: "Yveltal", rarity: "amazing rare", label: "Yveltal", desc: "Shining Fates 046/072" },
      { img: `${P}/50_hires.avif`, name: "Raikou", rarity: "amazing rare", label: "Raikou", desc: "Vivid Voltage 050/185" },
      { img: `${P}/102_hires.avif`, name: "Zamazenta", rarity: "amazing rare", label: "Zamazenta", desc: "Vivid Voltage 102/185" },
      { img: `${P}/119_hires.avif`, name: "Jirachi", rarity: "amazing rare", label: "Jirachi", desc: "Vivid Voltage 119/185" },
    ],
  },
  {
    titulo: "Rainbow rare",
    descricao:
      "Pastel iridescente com purpurina densa por cima. O efeito é o mesmo para Pokémon e para Treinador — o que muda é a moldura, e com ela o recorte do brilho.",
    cartas: [
      { img: `${P}/175_hires.avif`, name: "Whimsicott VSTAR", rarity: "rare rainbow", label: "Whimsicott VSTAR", desc: "Brilliant Stars 175/172" },
      { img: `${P}/188_hires.avif`, name: "Pikachu VMAX", rarity: "rare rainbow", label: "Pikachu VMAX", desc: "Vivid Voltage 188/185", subtypes: "vmax" },
      { img: `${P}/197_hires.avif`, name: "Alolan Vulpix VSTAR", rarity: "rare rainbow", label: "Alolan Vulpix VSTAR", desc: "Silver Tempest 197/195" },
      { img: `${P}/268_hires.avif`, name: "Mew VMAX", rarity: "rare rainbow", label: "Mew VMAX", desc: "Fusion Strike 268/264", subtypes: "vmax" },
      { img: `${P}/204_hires.avif`, name: "Irida", rarity: "rare rainbow", label: "Irida", desc: "Astral Radiance 204/189", supertype: "trainer", subtypes: "supporter" },
      { img: `${P}/205_hires.avif`, name: "Furisode Girl", rarity: "rare rainbow", label: "Furisode Girl", desc: "Silver Tempest 205/195", supertype: "trainer", subtypes: "supporter" },
    ],
  },
  {
    titulo: "Secreta dourada",
    descricao:
      "As duas camadas de glitter deslizando em sentidos opostos, sobre ouro. Repare que a raridade se aplica a qualquer tipo de carta: aqui há um Pokémon, uma Energia especial e um Estádio.",
    cartas: [
      { img: `${P}/280_hires.avif`, name: "Flaaffy", rarity: "rare secret", label: "Flaaffy", desc: "Fusion Strike 280/264", subtypes: "stage1" },
      { img: `${P}/184_hires.avif`, name: "Arceus VSTAR", rarity: "rare secret", label: "Arceus VSTAR", desc: "Brilliant Stars 184/172" },
      { img: `${P}/209_hires.avif`, name: "Twin Energy", rarity: "rare secret", label: "Twin Energy", desc: "Rebel Clash 209/192", supertype: "energy" },
      { img: `${P}/213_hires.avif`, name: "Path to the Peak", rarity: "rare secret", label: "Path to the Peak", desc: "Astral Radiance 213/189", supertype: "trainer", subtypes: "stadium" },
    ],
  },
  {
    titulo: "VSTAR",
    descricao:
      "Diagonais sobre textura, como a V full art, mas em tom pastel e mais claro — o que deixa tanto o gradiente quanto a textura mais discretos.",
    cartas: [
      { img: `${P}/18_hires.avif`, name: "Charizard VSTAR", rarity: "rare holo vstar", label: "Charizard VSTAR", desc: "Brilliant Stars 018/172" },
      { img: `${P}/31_hires.avif`, name: "Mewtwo VSTAR", rarity: "rare holo vstar", label: "Mewtwo VSTAR", desc: "Pokémon GO 031/078" },
      { img: `${P}/SWSH214_hires.avif`, name: "Lucario VSTAR", rarity: "rare holo vstar", label: "Lucario VSTAR", desc: "Promo SWSH214" },
    ],
  },
  {
    titulo: "V — full art e alt art",
    descricao:
      "As faixas diagonais que correm em sentidos opostos ao inclinar, mais a textura gravada que só aparece em certos ângulos. Todas estas têm foil próprio no repositório.",
    cartas: [
      { img: `${P}/110_hires.avif`, name: "Rayquaza V", rarity: "rare ultra", label: "Rayquaza V", desc: "Evolving Skies 110/203" },
      { img: `${P}/177_hires.avif`, name: "Origin Forme Dialga V", rarity: "rare ultra", label: "Dialga V", desc: "Astral Radiance 177/189" },
      { img: `${P}/183_hires.avif`, name: "Scizor V", rarity: "rare ultra", label: "Scizor V", desc: "Darkness Ablaze 183/189" },
      { img: `${P}/245_hires.avif`, name: "Celebi V", rarity: "rare ultra", label: "Celebi V", desc: "Fusion Strike 245/264" },
      { img: `${P}/SWSH179_hires.avif`, name: "Flareon V", rarity: "rare ultra", label: "Flareon V", desc: "Promo SWSH179" },
      { img: `${P}/SWSH183_hires.avif`, name: "Jolteon V", rarity: "rare ultra", label: "Jolteon V", desc: "Promo SWSH183" },
    ],
  },
  {
    titulo: "VMAX em arte alternativa",
    descricao:
      "O gradiente da VMAX é maior e mais lento que o da V, o que dá a sensação de foil de tela cheia — e a textura, em compensação, fica mais marcada.",
    cartas: [
      { img: `${P}/215_hires.avif`, name: "Umbreon VMAX", rarity: "rare holo vmax", label: "Umbreon VMAX", desc: "Evolving Skies 215/203", subtypes: "vmax" },
      { img: `${P}/270_hires.avif`, name: "Espeon VMAX", rarity: "rare holo vmax", label: "Espeon VMAX", desc: "Fusion Strike 270/264", subtypes: "vmax" },
    ],
  },
  {
    titulo: "Treinador em arte completa",
    descricao:
      "Mesma gravação das V full art, moldura de Treinador. É o caso em que marcar o data-supertype importa: sem ele o recorte do brilho usaria a janela de um Pokémon.",
    cartas: [
      { img: `${P}/167_hires.avif`, name: "Barry", rarity: "rare ultra", label: "Barry", desc: "Brilliant Stars 167/172", supertype: "trainer", subtypes: "supporter" },
      { img: `${P}/196_hires.avif`, name: "Peonia", rarity: "rare ultra", label: "Peonia", desc: "Chilling Reign 196/198", supertype: "trainer", subtypes: "supporter" },
      { img: `${P}/200_hires.avif`, name: "Marnie", rarity: "rare ultra", label: "Marnie", desc: "Sword & Shield 200/202", supertype: "trainer", subtypes: "supporter" },
    ],
  },
  {
    titulo: "Shiny Vault — o resto da família",
    descricao:
      "Os Pokémon shiny do Shining Fates, com o fundo prateado obtido por subtração. Aqui aparecem os quatro formatos: básico, estágio 1 e as duas VMAX.",
    cartas: [
      { img: `${P}/SV076_hires.avif`, name: "Koffing", rarity: "rare shiny", label: "Koffing", desc: "Shining Fates SV076", subtypes: "basic" },
      { img: `${P}/SV093_hires.avif`, name: "Minccino", rarity: "rare shiny", label: "Minccino", desc: "Shining Fates SV093", subtypes: "basic" },
      { img: `${P}/51_hires.avif`, name: "Ditto VMAX", rarity: "rare shiny vmax", label: "Ditto VMAX", desc: "Shining Fates 051/072", subtypes: "vmax" },
      { img: `${P}/SV107_hires.avif`, name: "Charizard VMAX", rarity: "rare shiny vmax", label: "Charizard VMAX", desc: "Shining Fates SV107", subtypes: "vmax" },
    ],
  },
  {
    titulo: "Trainer gallery — a subsérie inteira",
    descricao:
      "A galeria de treinadores tem numeração própria (TG) e cobre todos os formatos: Pokémon comum, V, VMAX, Supporter e a dourada de fecho da série.",
    cartas: [
      { img: `${P}/TG02_hires.avif`, name: "Milotic", rarity: "trainer gallery rare holo", label: "Milotic", desc: "Silver Tempest TG02", trainerGallery: true, subtypes: "stage1" },
      { img: `${P}/TG03_hires.avif`, name: "Charizard", rarity: "trainer gallery rare holo", label: "Charizard", desc: "Lost Origin TG03", trainerGallery: true, subtypes: "stage2" },
      { img: `${P}/TG18_hires.avif`, name: "Single Strike Urshifu V", rarity: "rare ultra", label: "Urshifu V", desc: "Brilliant Stars TG18", trainerGallery: true },
      { img: `${P}/TG19_hires.avif`, name: "Single Strike Urshifu VMAX", rarity: "rare holo vmax", label: "Urshifu VMAX", desc: "Brilliant Stars TG19", subtypes: "vmax", trainerGallery: true },
      { img: `${P}/TG27_hires.avif`, name: "Nessa", rarity: "rare ultra", label: "Nessa", desc: "Lost Origin TG27", supertype: "trainer", subtypes: "supporter", trainerGallery: true },
      { img: `${P}/TG30_hires.avif`, name: "Mew VMAX", rarity: "rare secret", label: "Mew VMAX", desc: "Lost Origin TG30", subtypes: "vmax", trainerGallery: true },
    ],
  },
  {
    titulo: "Radiant e holo clássica",
    descricao:
      "A Radiant é o efeito que o autor do projeto original assume não ter conseguido reproduzir fielmente — o cross-hatch é uma aproximação. Ao lado, duas holo clássicas para comparar o feixe vertical.",
    cartas: [
      { img: `${P}/11_hires.avif`, name: "Radiant Charizard", rarity: "radiant rare", label: "Radiant Charizard", desc: "Pokémon GO 011/078" },
      { img: `${P}/43_hires.avif`, name: "Tyranitar", rarity: "rare holo", label: "Tyranitar", desc: "Pokémon GO 043/078", subtypes: "stage2" },
      { img: `${P}/132_hires.avif`, name: "Boss's Orders", rarity: "rare holo", label: "Boss's Orders", desc: "Brilliant Stars 132/172", supertype: "trainer", subtypes: "supporter" },
    ],
  },
  {
    titulo: "Reverse holo e sem foil",
    descricao:
      "O piso da coleção. As duas primeiras têm foil de reverse holo no repositório; as demais não têm foil nenhum — só o tilt e o glare, que é a linha de base contra a qual todo o resto se mede.",
    cartas: [
      { img: `${P}/120_hires.avif`, name: "Bidoof", rarity: "reverse holo", label: "Bidoof", desc: "Brilliant Stars 120/172", subtypes: "basic" },
      { img: `${P}/127_hires.avif`, name: "Togedemaru", rarity: "reverse holo", label: "Togedemaru", desc: "Silver Tempest 127/195", subtypes: "basic" },
      { img: `${P}/1_hires.avif`, name: "Bulbasaur", rarity: "common", label: "Bulbasaur", desc: "Shining Legends 1/73" },
      { img: `${P}/7_hires.avif`, name: "Charmander", rarity: "common", label: "Charmander", desc: "Hidden Fates 7/68" },
      { img: `${P}/12_hires.avif`, name: "Moltres", rarity: "rare holo", label: "Moltres", desc: "Pokémon GO 012/078" },
      { img: `${P}/24_hires.avif`, name: "Articuno", rarity: "rare holo", label: "Articuno", desc: "Pokémon GO 024/078" },
      { img: `${P}/60_hires.avif`, name: "Professor's Research", rarity: "rare holo", label: "Professor's Research", desc: "Shining Fates 060/072", supertype: "trainer", subtypes: "supporter" },
      { img: `${P}/SWSH127_hires.avif`, name: "Eevee", rarity: "common", label: "Eevee", desc: "Promo SWSH127" },
    ],
  },
]

function Grupo({ grupo }: { grupo: Grupo }) {
  return (
    <section className="border-t-2 border-white/12 pt-8" aria-label={`Grupo: ${grupo.titulo}`}>
      <h3 className="sv-display text-xl uppercase text-white">{grupo.titulo}</h3>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/75">{grupo.descricao}</p>
      <PokeHand className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {grupo.cartas.map((c) => (
          <HoloTcgCard key={c.img} def={c} />
        ))}
      </PokeHand>
    </section>
  )
}

export function HoloBoosterGallery() {
  return (
    <div className="mt-10 space-y-12">
      <HoloTcgStylesheets />
      {GRUPOS.map((g) => (
        <Grupo key={g.titulo} grupo={g} />
      ))}
    </div>
  )
}
