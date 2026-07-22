"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"
import { REVEAL, STAGGER, VIEWPORT } from "./motion"

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Variante de entrada; por omissão, a subida padrão. */
  variants?: Variants
  /** Atraso extra, para escalonar irmãos que não partilham container. */
  delay?: number
  as?: "div" | "section" | "li" | "article" | "header"
}

/**
 * Revela o conteúdo ao entrar no viewport, uma única vez.
 *
 * Com `prefers-reduced-motion` o componente não anima nada: renderiza direto
 * no estado final. Não basta encurtar a duração — quem liga a preferência
 * costuma fazê-lo por enjoo de movimento, e um fade rápido ainda é movimento.
 */
export function Reveal({ children, className, variants = REVEAL, delay = 0, as = "div" }: RevealProps) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Tag>
  )
}

/**
 * Filho de um `RevealGroup`. Declara só as variantes e deixa o estado vir do
 * pai — usar `Reveal` aqui dentro anularia o escalonamento, porque o seu
 * próprio `whileInView` assumiria o controlo.
 */
export function RevealItem({
  children,
  className,
  variants = REVEAL,
  as = "div",
}: {
  children: React.ReactNode
  className?: string
  variants?: Variants
  as?: "div" | "li" | "article"
}) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag className={className} variants={variants}>
      {children}
    </Tag>
  )
}

/**
 * Container que escalona os filhos `RevealItem` — cada filho herda o
 * estado de animação, por isso os itens internos não precisam de `whileInView`
 * próprio (o que causaria disparos concorrentes).
 */
export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode
  className?: string
  as?: "div" | "ul" | "section"
}) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag className={className} variants={STAGGER} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {children}
    </Tag>
  )
}
