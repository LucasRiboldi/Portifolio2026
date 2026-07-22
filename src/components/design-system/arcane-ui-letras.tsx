/* ------------------------------------------------------------------
   Matérias 09.12 e 09.13 da camada de interface do Anfitrião — letras
   desenhadas/marcadores e o movimento da prensa. Extraídas de
   arcane-ui.tsx para manter cada arquivo sob 500 linhas. Reusa as
   primitivas de ./arcane-chapters e os rótulos de ./arcane-ui-helpers.
   ------------------------------------------------------------------ */
import { SubChapter, Folha, Nota } from "./arcane-chapters"
import { Classes, Rotulo } from "./arcane-ui-helpers"

/* ══════════════ 09.12 · LETRAS DESENHADAS E MARCADORES ══════════════ */
export function ArcaneLetras() {
  return (
    <SubChapter
      id="letras"
      n="09.12"
      title="Letras desenhadas e marcadores"
      lead="A inicial iluminada herdada do manuscrito, e os recursos que a própria face já traz e quase ninguém liga: versalete verdadeiro, algarismos antigos que descem abaixo da linha, ligaduras históricas e frações diagonais. Não são desenhos — são instruções à fonte, e é isso que os torna sustentáveis."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Folha>
          <Rotulo>A inicial em caixa</Rotulo>
          <p className="text-sm leading-snug" style={{ fontFamily: "var(--dp-body)" }}>
            <span className="dp-initial">O</span>
            compositor que abre uma matéria com inicial em caixa está a citar o manuscrito
            iluminado, onde a letra ganhava moldura de ouro. Aqui a moldura é fio, e a diferença
            para a capitular solta é que esta ocupa área própria.
          </p>
          <div className="mt-4 flex items-start gap-4">
            <span className="dp-initial dp-initial--ornate !float-none">A</span>
            <span className="dp-initial dp-initial--wood !float-none">M</span>
            <Nota>
              Fio duplo para matéria de abertura; chapa entintada para o caderno inteiro. Uma por
              matéria — duas e o olho não sabe por onde entrar.
            </Nota>
          </div>
        </Folha>

        <Folha>
          <Rotulo>Recursos da face — instrução, não desenho</Rotulo>
          <table className="dp-table">
            <tbody>
              <tr>
                <td style={{ width: "38%" }}>
                  <span className="dp-sc">Versalete verdadeiro</span>
                </td>
                <td>
                  <code className="font-mono text-[10px]">font-variant-caps</code>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="dp-oldstyle">1908 · 1926 · 31.000</span>
                </td>
                <td>
                  <code className="font-mono text-[10px]">oldstyle-nums</code>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="dp-lining">1908 · 1926 · 31.000</span>
                </td>
                <td>
                  <code className="font-mono text-[10px]">lining tabular-nums</code>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="dp-liga">fi · fl · ffi · ct · st</span>
                </td>
                <td>
                  <code className="font-mono text-[10px]">historical-ligatures</code>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="dp-frac">1/2 · 3/4 · 7/8</span>
                </td>
                <td>
                  <code className="font-mono text-[10px]">diagonal-fractions</code>
                </td>
              </tr>
            </tbody>
          </table>
          <Nota>
            Algarismo antigo desce abaixo da linha e convive com o texto sem gritar — use no corpo.
            O alinhado e tabular serve para tabela, onde as casas precisam encaixar. Trocar um pelo
            outro é a diferença entre uma tabela legível e uma coluna torta.
          </Nota>
        </Folha>
      </div>

      <Folha className="mt-3">
        <Rotulo>Marcadores — cada lista com o seu sinal</Rotulo>
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["dp-list--fleuron", "Fleurão", ["Composição", "Impressão", "Expedição"]],
            ["dp-list--aldus", "Aldus", ["Manhã", "Tarde", "Edição extra"]],
            ["dp-list--hand", "Manícula", ["Ler o expediente", "Conferir a prova"]],
            ["dp-list--dash", "Travessão", ["Papel", "Tinta", "Chumbo"]],
            ["dp-list--roman", "Romano", ["Primeira página", "Página interna", "Classificados"]],
          ].map(([cls, nome, itens]) => (
            <div key={cls as string}>
              <p className="mb-1 text-[11px]" style={{ color: "var(--dp-ink-3)" }}>
                {nome as string}
              </p>
              <ul className={`dp-list ${cls}`}>
                {(itens as string[]).map((i) => (
                  <li key={i} style={{ color: "var(--dp-ink-2)" }}>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Nota>
          O marcador não é enfeite: o fleurão fecha, a manícula manda fazer, o travessão só enumera.
          Escolher pelo significado é o que impede a folha de virar mostruário de ornamento — regra
          que a seção 07 já estabelece para os sinais soltos.
        </Nota>
      </Folha>

      <Classes>
        .dp-initial · --ornate · --wood · .dp-sc · .dp-oldstyle · .dp-lining · .dp-liga · .dp-frac ·
        .dp-list · --fleuron · --aldus · --hand · --dash · --roman · .dp-tag
      </Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.13 · MOVIMENTO DA PRENSA ══════════════ */
export function ArcanePrensa() {
  return (
    <SubChapter
      id="prensa"
      n="09.13"
      title="O movimento da prensa"
      lead="Este realm declara que a página não anima, e continua verdade. Mas havia uma distinção por fazer: a PÁGINA não se move — a PRENSA se move, e só no instante em que imprime. Essa fronteira é o que permite ter movimento sem trair o material."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Folha>
          <Rotulo>O que é permitido</Rotulo>
          <div className="flex flex-wrap items-center gap-5">
            <span className="dp-anim-settle text-2xl" style={{ fontFamily: "var(--dp-head)" }}>
              A tinta assenta
            </span>
            <span className="dp-anim-press dp-seal" style={{ width: "4rem", height: "4rem" }}>
              Prensado
            </span>
          </div>
          <Nota>
            Recarregue a página para ver de novo — as duas tocam <strong>uma vez</strong> e param.
            Nenhuma tem <code className="font-mono">infinite</code>, nenhuma responde ao ponteiro.
          </Nota>
          <div className="my-3 dp-rule dp-rule--hair" />
          <table className="dp-table">
            <tbody>
              <tr>
                <td>
                  <code className="font-mono text-[10px]">dp-ink-settle</code>
                </td>
                <td className="num">0,28s</td>
                <td>
                  <code className="font-mono text-[10px]">steps(3)</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code className="font-mono text-[10px]">dp-press</code>
                </td>
                <td className="num">0,16s</td>
                <td>
                  <code className="font-mono text-[10px]">steps(2)</code>
                </td>
              </tr>
            </tbody>
          </table>
          <Nota>
            Ambas em <code className="font-mono">steps()</code>, nunca em curva suave: a prensa desce
            de uma vez. Uma folha que faz <em>fade-in</em> está a fingir ser luz — e este realm finge
            ser papel. É a mesma lógica que faz o _Dev usar steps no cursor, chegando lá por outro
            caminho.
          </Nota>
        </Folha>

        <Folha>
          <Rotulo tom="erro">O que é proibido, sem exceção</Rotulo>
          <div className="space-y-2 text-xs" style={{ color: "var(--dp-ink-2)" }}>
            {[
              ["Hover que levanta", "Papel sobre a mesa não sobe porque um ponteiro passou perto."],
              ["Parallax", "A folha é uma superfície só. Camadas a velocidades diferentes são vidro, não papel."],
              ["Spring / bounce", "Elasticidade é borracha. Papel amassa, não quica."],
              ["Skeleton pulsante", "Escreva “Compondo…”. A folha diz o que está a acontecer, com palavra."],
              ["Spinner girando", "Nada gira numa oficina de tipos. Use texto e um fio."],
              ["Qualquer infinite", "Se ainda se mexe depois de impresso, não é papel."],
            ].map(([t, o]) => (
              <p key={t} className="flex gap-2">
                <span style={{ color: "#7a2a1c" }}>✕</span>
                <span>
                  <b style={{ color: "var(--dp-ink)" }}>{t}</b> — {o}
                </span>
              </p>
            ))}
          </div>
          <div className="my-3 dp-rule dp-rule--hair" />
          <Rotulo>Movimento reduzido</Rotulo>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            As duas animações desligam em{" "}
            <code className="font-mono">prefers-reduced-motion</code> e o leitor{" "}
            <strong>não perde nada</strong>: não há informação no gesto, só a lembrança de que a
            folha saiu da prensa. É o teste que separa movimento decorativo de movimento funcional —
            se desligar custa compreensão, o gesto estava a carregar significado que devia estar
            escrito.
          </p>
        </Folha>
      </div>

      <Classes>
        @keyframes dp-ink-settle · dp-press · .dp-anim-settle · .dp-anim-press ·
        @media (prefers-reduced-motion)
      </Classes>
    </SubChapter>
  )
}
