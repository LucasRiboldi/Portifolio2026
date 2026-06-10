import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { siteConfig } from "@/constants/site"

const contactSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  message: z.string().min(10, "Mensagem muito curta"),
})

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    )
  }

  const body = await req.json()
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { name, email, message } = parsed.data
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: "Portfólio <onboarding@resend.dev>",
      to: siteConfig.email,
      subject: `Nova mensagem de ${name}`,
      text: `De: ${name} <${email}>\n\n${message}`,
    })
  } catch {
    return NextResponse.json(
      { error: "Falha ao enviar e-mail" },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
