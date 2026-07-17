"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle } from "@/design-system/ds-ui"
import { SvInput, SvTextarea, SvSelect, masks } from "@/components/ui/sv-input"

/** valida CPF por dígito verificador. */
function isValidCpf(v: string) {
  const c = v.replace(/\D/g, "")
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false
  const d = c.split("").map(Number)
  const calc = (len: number) => {
    let s = 0
    for (let i = 0; i < len; i++) s += (d[i] ?? 0) * (len + 1 - i)
    const r = (s * 10) % 11
    return r === 10 ? 0 : r
  }
  return calc(9) === (d[9] ?? -1) && calc(10) === (d[10] ?? -1)
}

export function InputsContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  const [cpf, setCpf] = useState("")
  const [cep, setCep] = useState("")
  const [email, setEmail] = useState("")

  const cpfClean = cpf.replace(/\D/g, "")
  const cpfState =
    cpfClean.length < 11 ? {} : isValidCpf(cpf) ? { success: "CPF válido!" } : { error: "CPF inválido — confira os dígitos." }
  const emailState =
    email.length === 0 ? {} : /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? { success: "E-mail ok" } : { error: "Formato de e-mail inválido." }
  const cepState = cep.replace(/\D/g, "").length === 8 ? { success: "CEP completo" } : {}

  return (
    <div>
      <Link
        href="/design-system/components"
        className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]"
      >
        <ArrowLeft className="size-3.5" /> Componentes
      </Link>

      <ComicHeader as={headingAs} kicker="04 · Inputs & Forms" title="Campos que" highlight="reagem" />

      {/* ---- Validação BR ao vivo ---- */}
      <DsSectionTitle id="live">Máscaras BR & validação ao vivo</DsSectionTitle>
      <div className="grid gap-4 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-3)] sm:grid-cols-2">
        <SvInput
          label="CPF"
          type="cpf"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          hint="Digite para ver a validação por dígito verificador."
          {...cpfState}
        />
        <SvInput
          label="CEP"
          type="cep"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          {...cepState}
        />
        <SvInput
          label="E-mail"
          type="email"
          placeholder="voce@dominio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          {...emailState}
        />
        <SvInput label="Senha" type="password" placeholder="••••••••" hint="Clique no olho para revelar." />
      </div>

      {/* ---- Todos os tipos ---- */}
      <DsSectionTitle id="types">Tipos</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <SvInput label="Text" type="text" placeholder="Texto livre" />
        <SvInput label="Search" type="search" placeholder="Buscar no multiverso…" />
        <SvInput label="Number" type="number" placeholder="42" />
        <SvInput label="Date" type="date" />
        <SvInput label="Phone" type="phone" placeholder="(11) 90000-0000" />
        <SvSelect
          label="Select"
          placeholder="Escolha uma dimensão"
          options={[
            { value: "neon", label: "Terra-50101 · Neon" },
            { value: "noir", label: "Terra-90214 · Noir" },
            { value: "punk", label: "Terra-138 · Punk" },
          ]}
        />
      </div>
      <div className="mt-4">
        <SvTextarea label="Textarea" placeholder="Escreva sua mensagem…" hint="Redimensionável na vertical." />
      </div>

      {/* ---- Matriz de estados ---- */}
      <DsSectionTitle id="states">Estados</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SvInput label="Normal" placeholder="Normal" />
        <SvInput label="Focus (Tab)" placeholder="Foque aqui" />
        <SvInput label="Error" placeholder="Valor" error="Campo obrigatório." defaultValue="xyz" />
        <SvInput label="Success" placeholder="Valor" success="Tudo certo!" defaultValue="ok" />
        <SvInput label="Disabled" placeholder="Indisponível" disabled />
        <SvInput label="Readonly" defaultValue="Somente leitura" readOnly />
      </div>

      {/* ---- Snippet ---- */}
      <DsSectionTitle id="code">Como usar</DsSectionTitle>
      <pre className="overflow-x-auto rounded-md border-2 border-black bg-black/50 p-4 text-xs leading-relaxed text-white/80">
        <code>{`import { SvInput } from "@/components/ui/sv-input"

// Máscara BR automática por tipo
<SvInput label="CPF" type="cpf" value={cpf} onChange={e => setCpf(e.target.value)} />

// Estados
<SvInput label="E-mail" type="email" error="Formato inválido." />
<SvInput label="OK" success="Tudo certo!" />`}</code>
      </pre>

      <p className="mt-4 text-xs text-white/40">
        Máscaras exportadas como <code className="text-[var(--sv-cyan)]">masks.cpf / masks.cep / masks.phone</code>{" "}
        para reuso — ex.: <code>{masks.phone("11999998888")}</code>.
      </p>
    </div>
  )
}
