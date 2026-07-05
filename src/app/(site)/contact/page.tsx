"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { Onoma } from "@/components/spiderverse/decor"
import { siteConfig } from "@/constants/site"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  message: z.string().min(10, "Mensagem muito curta"),
})

type FormData = z.infer<typeof schema>
type Status = 'idle' | 'loading' | 'success' | 'error' | 'unavailable'

const inputClasses =
  "w-full border-[3px] border-black bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:shadow-[4px_4px_0_0_#ff2d95] transition-shadow"

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
    <SvCanvas dimension="punk">
     <div className="mx-auto max-w-lg">
      <Onoma color="magenta" className="pointer-events-none absolute right-0 top-0 z-[2] hidden rotate-12 sm:block">
        WHAM!
      </Onoma>
      <div className="mb-10">
        <span className="sv-sticker sv-sticker-lime text-sm">Terra-138B · Spider-Punk</span>
        <h1 className="sv-page-title mt-4 text-white">
          Entrar em <span className="sv-rainbow">contato</span>
        </h1>
        <p className="sv-heavy mt-3 text-sm uppercase tracking-wide text-white/80">
          Mande uma mensagem — respondo em até 48h.
        </p>
      </div>

      {status === 'success' ? (
        <div className="sv-panel p-6 text-center">
          <p className="sv-display text-2xl uppercase">Mensagem enviada!</p>
          <p className="mt-1 text-sm">Obrigado pelo contato.</p>
        </div>
      ) : status === 'unavailable' ? (
        <div className="sv-panel p-6 text-center">
          <p className="sv-display text-xl uppercase">E-mail indisponível</p>
          <p className="mt-2 text-sm">
            Fale direto:{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-bold underline">
              {siteConfig.email}
            </a>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="sv-heavy mb-1.5 block text-xs uppercase tracking-wide" htmlFor="name">Nome</label>
            <input
              id="name"
              {...register('name')}
              placeholder="Seu nome"
              className={inputClasses}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className="sv-heavy mb-1.5 block text-xs uppercase tracking-wide" htmlFor="email">E-mail</label>
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
            <label className="sv-heavy mb-1.5 block text-xs uppercase tracking-wide" htmlFor="message">Mensagem</label>
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
            className="sv-display border-[3px] border-black bg-[var(--sv-yellow)] px-6 py-3 text-lg uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:rotate-[-1deg] disabled:opacity-50"
          >
            {status === 'loading' ? 'Enviando…' : 'Enviar mensagem →'}
          </button>
        </form>
      )}
     </div>
    </SvCanvas>
  )
}
