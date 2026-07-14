import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

import { getSiteConfig } from "@/lib/repos/site-config"
import { saveContactMessage } from "@/lib/repos/messages"
import { isSupabaseConfigured } from "@/lib/supabase/config"

const contactSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  message: z.string().min(10, "Mensagem muito curta"),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { name, email, message } = parsed.data

  // 1) Persiste no inbox do admin (se o Supabase estiver configurado).
  const persisted = await saveContactMessage({ name, email, message })

  // 2) Envia e-mail (best-effort — não impede a persistência).
  let emailed = false
  if (process.env.RESEND_API_KEY) {
    try {
      const site = await getSiteConfig()
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "Portfólio <onboarding@resend.dev>",
        to: process.env.CONTACT_TO_EMAIL || site.email,
        subject: `Nova mensagem de ${name}`,
        replyTo: email,
        text: `De: ${name} <${email}>\n\n${message}`,
      })
      emailed = true
    } catch {
      emailed = false
    }
  }

  // Falha só se nada aconteceu (nem gravou nem enviou).
  if (!persisted && !emailed) {
    const reason = !isSupabaseConfigured && !process.env.RESEND_API_KEY
      ? "Nenhum destino configurado (Supabase ou Resend)."
      : "Falha ao registrar a mensagem."
    return NextResponse.json({ error: reason }, { status: 502 })
  }

  return NextResponse.json({ success: true, persisted, emailed })
}
