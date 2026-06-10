"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Container } from "@/components/layout/container"
import { siteConfig } from "@/constants/site"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  message: z.string().min(10, "Mensagem muito curta"),
})

type FormData = z.infer<typeof schema>
type Status = 'idle' | 'loading' | 'success' | 'error' | 'unavailable'

const inputClasses =
  "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-orange-500/50 focus:outline-none transition-colors"

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.status === 503) {
        setStatus('unavailable')
        return
      }
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <Container className="max-w-lg py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold">
          Entrar em <span className="gradient-text">contato</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Mande uma mensagem — respondo em até 48h.
        </p>
      </div>

      {status === 'success' ? (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <p className="font-semibold text-green-400">Mensagem enviada!</p>
          <p className="mt-1 text-sm text-muted-foreground">Obrigado pelo contato.</p>
        </div>
      ) : status === 'unavailable' ? (
        <div className="rounded-xl border border-border p-6 text-center">
          <p className="font-semibold">Serviço de e-mail indisponível</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre em contato diretamente:{" "}
            <a href={`mailto:${siteConfig.email}`} className="gradient-text underline">
              {siteConfig.email}
            </a>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="name">Nome</label>
            <input
              id="name"
              {...register('name')}
              placeholder="Seu nome"
              className={inputClasses}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="email">E-mail</label>
            <input
              id="email"
              {...register('email')}
              type="email"
              placeholder="seu@email.com"
              className={inputClasses}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              {...register('message')}
              rows={5}
              placeholder="Sua mensagem..."
              className={`${inputClasses} resize-none`}
            />
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
          </div>

          {status === 'error' && (
            <p className="text-xs text-red-400">Erro ao enviar. Tente novamente.</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)' }}
          >
            {status === 'loading' ? 'Enviando…' : 'Enviar mensagem'}
          </button>
        </form>
      )}
    </Container>
  )
}
