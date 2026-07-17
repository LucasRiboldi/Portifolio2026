import { describe, expect, it } from "vitest"

import { REALM_VARIANTS, VARIANT_LABEL } from "@/design-system/realm-variants"
import { REALM_MOTION } from "@/design-system/realm-motion"
import { DIMENSIONS, dimClass } from "@/design-system/dimensions"
import { REALM_DESIGN_IDS } from "@/design-system/realms"

/**
 * Os registros de variante e motion são dados puros que alimentam os style
 * guides. Erram em silêncio: um id renomeado não quebra o build — o card
 * simplesmente some, ou o botão passa a tocar nada. Estes testes prendem os
 * invariantes que a UI assume.
 */

describe("REALM_VARIANTS", () => {
  it("cobre os três realms, sem lista vazia", () => {
    for (const realm of REALM_DESIGN_IDS) {
      expect(REALM_VARIANTS[realm], `realm ${realm}`).toBeDefined()
      expect(REALM_VARIANTS[realm].length, `realm ${realm} sem variantes`).toBeGreaterThan(0)
    }
  })

  it("tem ids únicos dentro de cada realm", () => {
    for (const realm of REALM_DESIGN_IDS) {
      const ids = REALM_VARIANTS[realm].map(v => v.id)
      expect(new Set(ids).size, `ids repetidos em ${realm}`).toBe(ids.length)
    }
  })

  it("descreve toda variante (o seletor mostra a descrição)", () => {
    for (const realm of REALM_DESIGN_IDS) {
      for (const v of REALM_VARIANTS[realm]) {
        expect(v.label.length, `${realm}/${v.id} sem label`).toBeGreaterThan(0)
        expect(v.desc.length, `${realm}/${v.id} sem desc`).toBeGreaterThan(0)
      }
    }
  })

  it("dá ao Criativo exatamente as dimensões de arte existentes", () => {
    // O guia promete "as 20 dimensões": se sv-canvas ganhar ou perder uma,
    // este teste falha antes de a página mentir.
    expect(REALM_VARIANTS.creative.map(v => v.id)).toEqual(DIMENSIONS.map(d => d.id))
  })

  it("usa, no Criativo, a mesma classe de arte que o SvCanvas aplica", () => {
    for (const v of REALM_VARIANTS.creative) {
      expect(v.className, `dimensão ${v.id}`).toBe(dimClass[v.id as keyof typeof dimClass])
    }
  })

  it("não força vocabulário de dimensão em Dev e Anfitrião", () => {
    // Um jornal de 1920 em "neon Mumbattan" não significa nada — o conceito
    // de dimensão é do Criativo e não deve vazar para os outros universos.
    const dimIds = new Set<string>(DIMENSIONS.map(d => d.id))
    for (const realm of ["developer", "arcane"] as const) {
      for (const v of REALM_VARIANTS[realm]) {
        expect(dimIds.has(v.id), `${realm} usa id de dimensão: ${v.id}`).toBe(false)
      }
    }
  })

  it("nomeia o seletor em cada realm", () => {
    for (const realm of REALM_DESIGN_IDS) {
      expect(VARIANT_LABEL[realm]?.length, `realm ${realm}`).toBeGreaterThan(0)
    }
  })
})

describe("REALM_MOTION", () => {
  it("cobre os três realms, sem lista vazia", () => {
    for (const realm of REALM_DESIGN_IDS) {
      expect(REALM_MOTION[realm].length, `realm ${realm} sem motion`).toBeGreaterThan(0)
    }
  })

  it("documenta valor, uso e onde cada gesto roda", () => {
    for (const realm of REALM_DESIGN_IDS) {
      for (const m of REALM_MOTION[realm]) {
        expect(m.value.length, `${realm}/${m.name} sem valor`).toBeGreaterThan(0)
        expect(m.use.length, `${realm}/${m.name} sem uso`).toBeGreaterThan(0)
        // `where` é o que impede o registro de virar teoria
        expect(m.where.length, `${realm}/${m.name} sem onde roda`).toBeGreaterThan(0)
      }
    }
  })

  it("tem nomes únicos por realm (o play é indexado pelo nome)", () => {
    for (const realm of REALM_DESIGN_IDS) {
      const nomes = REALM_MOTION[realm].map(m => m.name)
      expect(new Set(nomes).size, `nomes repetidos em ${realm}`).toBe(nomes.length)
    }
  })

  it("mantém o Anfitrião essencialmente imóvel", () => {
    // O realm é deliberadamente estático: papel não anima. Se alguém encher o
    // jornal de springs, isto acusa.
    const imoveis = REALM_MOTION.arcane.filter(m => m.demo === "none").length
    expect(imoveis).toBeGreaterThan(0)
  })
})
