/* ------------------------------------------------------------------
   A camada de interface do Anfitrião — matérias 09.9 a 09.13.
   ------------------------------------------------------------------
   Estas peças são NOVAS, e a distinção importa. As matérias anteriores do
   caderno 09 documentavam classes que já existiam e ninguém achava; estas
   documentam CSS escrito agora, em `daily-prophet-ui.css`, porque a
   auditoria encontrou um buraco maior que a falta de documentação: o realm
   não tinha um único botão, campo, caixa de marcar, tabela ou selo.

   Um design system que descreve lindamente uma primeira página e não
   consegue montar um formulário de contato está pela metade — e a metade
   que falta é justamente a que o visitante toca.

   A física de onde tudo abaixo sai: papel não levanta, mas o tipo de metal
   MORDE a folha. Por isso nada aqui sobe com sombra; o que se pressiona
   afunda com sombra interna. É o oposto exato dos outros dois realms, e é a
   leitura honesta do material.
   ------------------------------------------------------------------ */
import { SubChapter, Folha, Nota } from "./arcane-chapters"

function Classes({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
      {children}
    </p>
  )
}

function Rotulo({ children, tom = "sepia" }: { children: React.ReactNode; tom?: "sepia" | "erro" }) {
  return (
    <p
      className="mb-2 text-[11px] uppercase tracking-wide"
      style={{ color: tom === "erro" ? "#7a2a1c" : "var(--dp-sepia)" }}
    >
      {children}
    </p>
  )
}

/* ══════════════ 09.9 · BOTÕES ══════════════ */
export function ArcaneBotoes() {
  return (
    <SubChapter
      id="botoes"
      n="09.9"
      title="Botões"
      lead="O realm não tinha botão nenhum — a folha sabia noticiar, não sabia pedir uma ação. A peça nasce da física da prensa: como papel não levanta, o botão pressionado não sobe com sombra, ele afunda. O tipo de metal morde a folha, e numa prova de tipografia você sente o relevo com o dedo."
    >
      <Rotulo>Variantes — o que cada tinta autoriza</Rotulo>
      <Folha>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="dp-btn dp-btn--primary">Publicar edição</button>
          <button type="button" className="dp-btn">Guardar prova</button>
          <button type="button" className="dp-btn dp-btn--ghost">Ver arquivo</button>
          <button type="button" className="dp-btn dp-btn--danger">Recolher tiragem</button>
          <button type="button" className="dp-btn" disabled>Na prensa…</button>
        </div>
        <Nota>
          Pressione qualquer um e repare: ele <strong>desce</strong>. É{" "}
          <code className="font-mono">inset box-shadow</code> com{" "}
          <code className="font-mono">translateY(1px)</code> — a mordida do tipo no papel. Nenhum
          outro realm pode fazer isso, porque nos outros a superfície é luz.
        </Nota>
      </Folha>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Folha>
          <Rotulo>Quando usar cada uma</Rotulo>
          <div className="space-y-2 text-xs" style={{ color: "var(--dp-ink-2)" }}>
            <p>
              <b style={{ color: "var(--dp-ink)" }}>Chapa entintada</b> — a ação que a página existe
              para realizar. Uma por página; duas e a folha não diz mais qual importa.
            </p>
            <p>
              <b style={{ color: "var(--dp-ink)" }}>Fio simples</b> — apoio legítimo. Quantas fizerem
              sentido, lado a lado.
            </p>
            <p>
              <b style={{ color: "var(--dp-ink)" }}>Sem chapa</b> — navegação disfarçada. Se leva a
              outro lugar, considere um link de verdade.
            </p>
            <p>
              <b style={{ color: "#7a2a1c" }}>Tinta da errata</b> — só o irreversível. O vermelho da
              folha pede confirmação; nunca convida.
            </p>
          </div>
        </Folha>

        <Folha>
          <Rotulo>Tamanhos e cerimônia</Rotulo>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="dp-btn dp-btn--sm">pequeno</button>
            <button type="button" className="dp-btn">médio</button>
            <button type="button" className="dp-btn dp-btn--lg">grande</button>
          </div>
          <div className="mt-3">
            <button type="button" className="dp-btn dp-btn--double dp-btn--lg">
              Assinar a edição
            </button>
          </div>
          <Nota>
            O fio duplo (<code className="font-mono">.dp-btn--double</code>) é o botão de maior
            cerimônia da folha — o mesmo fio que fecha o masthead. Reserve-o para a ação única de uma
            página inteira, senão a cerimônia vira ruído.
          </Nota>
        </Folha>
      </div>

      <Folha className="mt-3">
        <Rotulo>O foco — corrigindo uma dívida que a seção 12 registrava</Rotulo>
        <p className="mb-3 text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
          Até aqui só <code className="font-mono">.dp-press</code> declarava{" "}
          <code className="font-mono">:focus-visible</code>; todo o resto caía no anel azul do
          navegador sobre papel sépia. A folha nova torna o foco pontilhado sistemático — botão,
          campo, caixa de marcar e caderno usam o mesmo. Tabule pelos botões acima para ver.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="dp-btn"
            style={{ outline: "1px dotted var(--dp-sepia)", outlineOffset: "2px" }}
          >
            foco pontilhado
          </span>
          <Nota>
            Pontilhado porque é o que a prensa sabia fazer, e em sépia para pertencer à folha.
          </Nota>
        </div>
      </Folha>

      <Classes>
        .dp-btn · --primary · --ghost · --danger · --sm · --lg · --double · [disabled] ·
        :active (inset) · :focus-visible
      </Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.10 · FORMULÁRIO ══════════════ */
export function ArcaneFormulario() {
  return (
    <SubChapter
      id="formulario"
      n="09.10"
      title="O formulário impresso"
      lead="A decisão que define esta camada: o campo não é uma caixa, é uma LINHA para escrever em cima. Formulário de repartição, de 1920, não tem retângulo com fundo — tem pauta. A caixa existe só onde o texto precisa de área, e a marca de seleção é ✕, não ✓, porque o impresso pedia “marque com um X”."
    >
      <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
        <Folha>
          <Rotulo>Requerimento de assinatura</Rotulo>
          <div className="dp-field">
            <label className="dp-label" data-required="true" htmlFor="dp-nome">
              Nome completo
            </label>
            <input id="dp-nome" className="dp-input" placeholder="como deve sair impresso" />
          </div>
          <div className="dp-field">
            <label className="dp-label" htmlFor="dp-praca">
              Praça
            </label>
            <input id="dp-praca" className="dp-input" defaultValue="Terra-2026" />
          </div>
          <div className="dp-field">
            <label className="dp-label" htmlFor="dp-obs">
              Observações ao compositor
            </label>
            <textarea
              id="dp-obs"
              rows={3}
              className="dp-input dp-input--boxed"
              placeholder="entrega pela manhã, se possível"
            />
            <p className="dp-help">A caixa aparece só aqui: texto longo precisa de área.</p>
          </div>
          <div className="dp-field">
            <label className="dp-label" htmlFor="dp-erro">
              Tiragem desejada
            </label>
            <input id="dp-erro" className="dp-input" aria-invalid="true" defaultValue="0" />
            <p className="dp-error">A tiragem mínima desta casa é de quinhentos exemplares.</p>
          </div>
          <button type="button" className="dp-btn dp-btn--primary">Enviar requerimento</button>
        </Folha>

        <div className="space-y-3">
          <Folha>
            <Rotulo>Escolha — a marca feita à mão</Rotulo>
            <div className="space-y-1.5">
              <label className="dp-choice">
                <input type="checkbox" className="dp-check" defaultChecked />
                <span>Receber a edição da manhã</span>
              </label>
              <label className="dp-choice">
                <input type="checkbox" className="dp-check" />
                <span>Receber o caderno de classificados</span>
              </label>
              <label className="dp-choice">
                <input type="checkbox" className="dp-check" disabled />
                <span style={{ color: "var(--dp-ink-3)" }}>Edição vespertina (suspensa)</span>
              </label>
            </div>
            <div className="my-3 dp-rule dp-rule--hair" />
            <div className="space-y-1.5">
              <label className="dp-choice">
                <input type="radio" name="dp-entrega" className="dp-check dp-check--radio" defaultChecked />
                <span>Entrega ao domicílio</span>
              </label>
              <label className="dp-choice">
                <input type="radio" name="dp-entrega" className="dp-check dp-check--radio" />
                <span>Levantar na oficina</span>
              </label>
            </div>
            <div className="my-3 dp-rule dp-rule--hair" />
            <div>
              <label className="dp-choice dp-choice--inline">
                <input type="radio" name="dp-turno" className="dp-check dp-check--radio" defaultChecked />
                <span>Manhã</span>
              </label>
              <label className="dp-choice dp-choice--inline">
                <input type="radio" name="dp-turno" className="dp-check dp-check--radio" />
                <span>Tarde</span>
              </label>
            </div>
            <Nota>
              O ✕ da caixa entra girado −6°, sempre para o mesmo lado: marca de caneta não sai reta,
              mas a mesma mão erra igual. O botão redondo enche de tinta, sem girar.
              <br />
              O grupo empilha por padrão — <code className="font-mono">.dp-choice</code> é{" "}
              <code className="font-mono">flex</code>, não <code className="font-mono">inline-flex</code>.
              Com <code className="font-mono">inline-flex</code>, dois rótulos curtos corriam lado a
              lado sem ninguém pedir, e só empilhavam por acidente quando o texto era comprido. Para o
              caso horizontal legítimo, como o par acima, existe{" "}
              <code className="font-mono">.dp-choice--inline</code>.
            </Nota>
          </Folha>

          <Folha>
            <Rotulo>Cadernos — as abas do fichário</Rotulo>
            {/* role="tablist"/"tab" não é enfeite: `aria-selected` só é válido
                em role=tab, e sem o par o leitor de tela anuncia quatro botões
                soltos em vez de "aba 1 de 4, selecionada". */}
            <div className="dp-tabs" role="tablist" aria-label="Cadernos da folha">
              {["Manchete", "Mecânicas", "Oficina", "Classificados"].map((c, i) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  className="dp-tab"
                  aria-selected={i === 0}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  {c}
                </button>
              ))}
            </div>
            <Nota>
              O caderno aberto ganha fio grosso por baixo — como a aba física que se levanta no
              fichário. Não acende, não muda de fundo: continua sendo papel. Em código,{" "}
              <code className="font-mono">role=&quot;tablist&quot;</code> e{" "}
              <code className="font-mono">tabIndex=-1</code> nas inativas: setas navegam entre
              abas, Tab sai do grupo.
            </Nota>
          </Folha>
        </div>
      </div>

      <Classes>
        .dp-field · .dp-label[data-required] · .dp-input · --boxed · [aria-invalid] · .dp-help ·
        .dp-error · .dp-choice · .dp-check · --radio · .dp-tabs · .dp-tab[aria-selected]
      </Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.11 · SELOS, CARIMBOS E ASSINATURAS ══════════════ */
export function ArcaneSelos() {
  return (
    <SubChapter
      id="selos"
      n="09.11"
      title="Selos, carimbos e assinaturas"
      lead="O que dá autoridade a um papel: o selo em relevo, o carimbo da repartição e a rubrica de quem responde. São as peças que transformam uma folha impressa em documento — e as três existem justamente porque, no papel, não há sessão nem login para provar quem fez o quê."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Folha className="flex flex-col items-center justify-center text-center">
          <Rotulo>Selo em relevo</Rotulo>
          <div className="dp-seal">
            Prelo &amp; Vinco
            <br />
            MCMVIII
          </div>
          <Nota>Dois fios concêntricos e versalete girado. O de sépia é o corrente.</Nota>
        </Folha>

        <Folha className="flex flex-col items-center justify-center text-center">
          <Rotulo>Variantes</Rotulo>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="dp-seal dp-seal--ink" style={{ width: "4rem", height: "4rem" }}>
              Aprovado
            </div>
            <div className="dp-seal dp-seal--void" style={{ width: "4rem", height: "4rem" }}>
              Sem efeito
            </div>
          </div>
          <Nota>Tinta cheia para o que vale; vermelho da errata para o que foi anulado.</Nota>
        </Folha>

        <Folha className="flex flex-col items-center justify-center text-center">
          <Rotulo>Carimbo da repartição</Rotulo>
          <div className="dp-postmark">
            Expedido
            <b>18 · VII · 26</b>
            Terra-2026
          </div>
          <Nota>
            Retangular e com data — o irmão do <code className="font-mono">.dp-stamp</code>, para
            quando o que importa é <em>quando</em>.
          </Nota>
        </Folha>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Folha>
          <Rotulo>A assinatura</Rotulo>
          <div className="dp-signature">
            <p className="dp-autograph">L. Riboldi</p>
            <div className="dp-signature-line">
              <p className="dp-signature-name">Lucas Floriano Riboldi</p>
              <p className="dp-signature-role">Compositor-chefe desta casa</p>
            </div>
          </div>
          <Nota>
            A rubrica é itálico inclinado em <code className="font-mono">skewX(-8deg)</code>, não uma
            face manuscrita: o projeto não serve nenhuma, e fingir que serve é o tipo de mentira que
            este guia recusa. Se um dia entrar uma face de punho, troca-se aqui e a peça inteira
            melhora sozinha.
          </Nota>
        </Folha>

        <Folha>
          <Rotulo tom="erro">Contraste — a medida antes da estética</Rotulo>
          <div className="overflow-x-auto">
            <table className="dp-table">
              <caption>Tintas desta camada, sobre as duas folhas</caption>
              <thead>
                <tr>
                  <th>peça</th>
                  <th className="num">papel</th>
                  <th className="num">papel-2</th>
                  <th>veredito</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vermelho da errata</td>
                  <td className="num">7,08</td>
                  <td className="num">6,31</td>
                  <td>AA nas duas</td>
                </tr>
                <tr>
                  <td>Selo em sépia</td>
                  <td className="num">4,52</td>
                  <td className="num">4,03</td>
                  <td style={{ color: "#7a2a1c" }}>cai no papel-2</td>
                </tr>
                <tr>
                  <td>Chapa entintada</td>
                  <td className="num">13,07</td>
                  <td className="num">11,64</td>
                  <td>AA nas duas</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Nota>
            O <code className="font-mono">#7a2a1c</code> da errata foi escolhido medindo, não a
            olho: dá 7,08:1 contra os 6,11:1 do vermelho antigo. Já o selo em sépia{" "}
            <strong>reprova no papel-2</strong> — por isso ele é ornamento de autoridade, nunca
            portador de informação única. Se o selo diz algo que o leitor precisa saber, repita em
            tinta cheia ao lado.
          </Nota>
        </Folha>
      </div>

      <Classes>
        .dp-seal · --ink · --void · .dp-postmark · .dp-signature · .dp-autograph ·
        .dp-signature-line · .dp-signature-name · .dp-signature-role · .dp-table
      </Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.12 · LETRAS E MARCADORES ══════════════ */
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
