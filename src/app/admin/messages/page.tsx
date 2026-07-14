import { listContactMessages } from "@/lib/repos/messages"
import { MessageList } from "@/components/admin/message-list"

export default async function MessagesPage() {
  const messages = await listContactMessages()

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Mensagens</h1>
        <p className="text-sm text-white/50">Enviadas pelo formulário de contato.</p>
      </header>
      <MessageList messages={messages} />
    </div>
  )
}
