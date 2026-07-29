import "@/styles/anfitriao-caderno.css"

import type { Metadata } from "next"

import { getResources } from "@/lib/repos/prophet"
import { Caderno, CadernoVazio } from "@/components/anfitriao/caderno"

export const metadata: Metadata = {
  title: "Imprensa do Inventor",
  description: "Print & play: cartas, tabuleiros e livrinhos de regra para imprimir e cortar em casa.",
}

/**
 * A Imprensa do Inventor.
 *
 * Caderno novo: `getResources()` não era chamado em lugar nenhum, então os
 * arquivos para impressão existiam no banco sem porta de saída.
 */

const FORMATO: Record<string, string> = {
  pnp: "Print & play",
  cartas: "Cartas",
  tabuleiro: "Tabuleiro",
  regras: "Livrinho de regras",
  outro: "Avulso",
}

export default async function ImprensaPage() {
  const materiais = await getResources()

  return (
    <Caderno
      caderno="Imprensa do Inventor"
      page="VII"
      kicker="Para Imprimir e Cortar"
      titulo="A IMPRENSA"
      olho="Folhas prontas para o prelo caseiro. Imprima em cartão de prova, corte à tesoura e leve à mesa antes de gastar com o linho."
    >
      {materiais.length === 0 ? (
        <CadernoVazio>
          O prelo está em manutenção. Nenhuma folha para impressão nesta edição.
        </CadernoVazio>
      ) : (
        <div className="dpx-verbetes">
          {materiais.map((r) => (
            <article key={r.id} className="dpx-verbete">
              <h3>
                {/* O título é o link quando há arquivo: num caderno de
                    downloads, o que o leitor quer é o arquivo, e obrigá-lo a
                    caçar um "baixar" solto embaixo é fricção sem motivo. */}
                {r.file_url ? (
                  <a href={r.file_url} download>
                    {r.title}
                  </a>
                ) : (
                  r.title
                )}
              </h3>
              <p>{r.description}</p>
              <dl className="dpx-verbete-dados">
                <div>
                  <dt>Formato</dt>
                  <dd>{FORMATO[r.type] ?? r.type}</dd>
                </div>
                <div>
                  <dt>Folha</dt>
                  {/* Sem arquivo o verbete continua valendo — anuncia o que
                      está no prelo. Fingir um link que não existe seria pior. */}
                  <dd>{r.file_url ? "disponível" : "no prelo"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </Caderno>
  )
}
