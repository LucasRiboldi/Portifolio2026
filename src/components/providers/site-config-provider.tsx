"use client"

import * as React from "react"

import type { SiteConfig } from "@/lib/repos/site-config"

/**
 * Disponibiliza a config do site (do banco, com fallback ao seed) para Client
 * Components — footer, contato, bento etc. — sem cada um importar o estático.
 * O valor é injetado pelo RootLayout (server) a cada request/revalidação.
 */
const SiteConfigContext = React.createContext<SiteConfig | null>(null)

export function SiteConfigProvider({
  value,
  children,
}: {
  value: SiteConfig
  children: React.ReactNode
}) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig(): SiteConfig {
  const ctx = React.useContext(SiteConfigContext)
  if (!ctx) throw new Error("useSiteConfig must be used within <SiteConfigProvider>")
  return ctx
}
