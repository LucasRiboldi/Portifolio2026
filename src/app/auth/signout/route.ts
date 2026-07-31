import { NextResponse } from "next/server"

import { destroySession } from "@/lib/auth/session"

export async function POST(request: Request) {
  const { origin } = new URL(request.url)
  await destroySession()
  return NextResponse.redirect(`${origin}/login`, { status: 303 })
}
