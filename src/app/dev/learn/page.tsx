import { DevHeader } from "@/components/dev/dev-header"
import { LEARN_LANGUAGES } from "@/data/learn"
import { LearnView } from "@/components/dev/learn-view"

export const metadata = {
  title: "Learn",
  description: "Trilhas de aprendizado de linguagens de programação.",
}

export default function LearnPage() {
  return (
    <div>
      <DevHeader
        fn="learn"
        title="Aprender"
        accent="linguagens"
        subtitle="Trilhas estruturadas por fases, com progresso salvo no navegador. Comece pelo C — Java a caminho."
      />
      <LearnView languages={LEARN_LANGUAGES} />
    </div>
  )
}
