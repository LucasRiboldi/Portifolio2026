/* ------------------------------------------------------------------
   As matérias do caderno 09 — a oficina completa da folha.
   ------------------------------------------------------------------
   Este arquivo nasceu de uma auditoria simples e constrangedora: contar as
   classes `.dp-*` que daily-prophet.css define (65) e comparar com as que o
   guia mostrava (cerca de metade). Faltavam a gravura, o carimbo, o
   editorial, a grade de reportagens, a barra de serviço, o gráfico, o
   verbete, a vinheta e o pé — trinta peças reais, em produção, que ninguém
   conseguia descobrir sem abrir o CSS.

   Um catálogo que documenta metade do sistema não é um catálogo incompleto:
   é um catálogo que mente por omissão, porque quem o lê conclui que o resto
   não existe e reinventa a peça do lado.

   Nada aqui é inventado para encher: cada matéria abaixo aponta para classes
   que já estão na folha. Onde a peça tem um defeito (o carimbo é pequeno
   demais para AA, a gravura depende de filter), está escrito.
   ------------------------------------------------------------------ */
import { SubChapter, Folha, Nota } from "./arcane-chapters"
import { Classes } from "./arcane-ui-helpers"

/* As matérias 09.8 (marcas) e 17.1 (cabeçalho) mudaram-se para
   arcane-marcas.tsx; o rótulo Classes vem de arcane-ui-helpers. */

/* ══════════════ 09.1 · A GRAVURA ══════════════ */
export function ArcaneGravura() {
  return (
    <SubChapter
      id="figura"
      n="09.1"
      title="A gravura e a legenda"
      lead="Foto de jornal antigo é retícula grossa, não fotografia: a chapa não conseguia meio-tom fino. A folha resolve isso em duas camadas — a moldura de chapa e o miolo, que dessatura, entinta de sépia e recebe a trama de pontos por cima. A legenda nunca é opcional: imagem sem legenda, na folha, é imagem sem procedência."
    >
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <Folha>
          <figure className="dp-figure">
            <div className="dp-plate">
              <div className="dp-plate-inner">
                {/* Um "negativo" desenhado: a chapa não sabe o que recebe —
                    aplica o mesmo tratamento a qualquer conteúdo. */}
                <svg viewBox="0 0 200 110" className="block w-full" aria-hidden>
                  <rect width="200" height="110" fill="#b9a071" />
                  <circle cx="150" cy="26" r="15" fill="#efe4c4" />
                  <path d="M0 88 L44 52 L78 78 L112 44 L152 74 L200 40 L200 110 L0 110 Z" fill="#6d5a37" />
                  <path d="M0 100 L52 74 L96 96 L140 70 L200 92 L200 110 L0 110 Z" fill="#40361f" />
                  <rect x="86" y="60" width="9" height="26" fill="#2a2216" />
                  <rect x="99" y="66" width="7" height="20" fill="#2a2216" />
                </svg>
              </div>
            </div>
            <figcaption className="dp-figcaption">
              A serra ao amanhecer, vista da janela da oficina — chapa de 1912.
            </figcaption>
          </figure>
          <Nota>
            A moldura (<code className="font-mono">.dp-plate</code>) é o filete de 1px com 3px de
            folga: a margem branca que a chapa deixava no papel. O miolo
            (<code className="font-mono">.dp-plate-inner</code>) aplica{" "}
            <code className="font-mono">grayscale(1) sepia(.55) contrast(1.35)</code> e sobrepõe a
            retícula em <code className="font-mono">mix-blend-mode: multiply</code>.
          </Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Por que duas camadas
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            Separar moldura de miolo é o que permite entintar a imagem sem entintar a margem. Se o
            filtro morasse na moldura, o filete cinzaria junto e a chapa perderia a borda — que é
            justamente o que prova que aquilo é uma gravura colada na página, e não a página.
          </p>
          <div className="my-3 dp-rule dp-rule--hair" />
          <p className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "#8a3020" }}>
            Limitação conhecida
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            O tratamento é <code className="font-mono">filter</code>, não uma imagem preparada: o
            arquivo original continua colorido. Serve para fotografia; num logotipo de traço fino a
            retícula de 3px come o desenho. Nesse caso, entregue a arte já em bitmap de 1 bit e use
            só a moldura.
          </p>
        </Folha>
      </div>

      <Classes>.dp-figure · .dp-plate · .dp-plate-inner · .dp-figcaption</Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.4 · A GRADE DE REPORTAGENS ══════════════ */
const REPORTAGENS = [
  {
    k: "Mecânicas",
    h: "Rotativa nova chega em março",
    s: "A casa dobra a tiragem sem dobrar o turno",
    b: "A máquina veio de Leeds em três vagões e levou nove dias para ser montada no subsolo.",
    n: "Apuração de L. Riboldi",
  },
  {
    k: "Oficina",
    h: "Fundição refaz a caixa alta",
    s: "Corpo 48 volta ao catálogo depois de doze anos",
    b: "O punção original tinha-se perdido; o novo foi cortado à mão a partir de uma prova de 1898.",
    n: "Com o compositor-chefe",
  },
  {
    k: "Expediente",
    h: "Assinaturas sobem 4%",
    s: "Preço do papel explica quase toda a diferença",
    b: "A direção garante que a folha mantém as doze páginas e não corta o caderno de classificados.",
    n: "Nota da direção",
  },
  {
    k: "Terra-2026",
    h: "Três universos, um só teto",
    s: "Especialistas divergem sobre a convivência",
    b: "O design system passou a documentar cada realm na própria língua, em vez de um guia neutro.",
    n: "Continua na pág. 7",
  },
]

export function ArcaneReportagens() {
  return (
    <SubChapter
      id="reportagens"
      n="09.4"
      title="A grade de reportagens"
      lead="O que não é manchete mas também não é breve: as matérias secundárias que ocupam o pé da página. Cada uma repete a mesma gramática da manchete em miniatura — chapéu, título, linha fina, corpo e nota —, e é essa repetição que deixa o olho comparar quatro assuntos sem reler nenhum."
    >
      <Folha className="!p-4">
        <div className="dp-reports !mt-0 !border-t-0 !pt-0">
          {REPORTAGENS.map((r) => (
            <div key={r.h} className="dp-report">
              <p className="dp-report-kicker">{r.k}</p>
              <p className="dp-report-head">{r.h}</p>
              <p className="dp-report-sub">{r.s}</p>
              <p className="dp-report-body">{r.b}</p>
              <p className="dp-report-note">{r.n}</p>
            </div>
          ))}
        </div>
      </Folha>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            A grade se dobra sozinha
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            Quatro colunas na folha larga, duas na média, uma no telefone — e o filete de separação
            muda de lado junto: vertical entre colunas, horizontal quando empilham. Não há variante
            a escolher; a peça sabe onde está.
          </p>
          <Nota>1 col · 2 col a partir de 680px · 4 col a partir de 1060px</Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            O “continua” — a única peça clicável da folha
          </p>
          <a href="#reportagens" className="dp-more">
            Leia a matéria completa <b>pág. 7</b>
          </a>
          <Nota>
            <code className="font-mono">.dp-more</code> é link e se anuncia como tal: filete acima,
            versalete, e o número da página empurrado à direita. Ao passar o ponteiro ele muda para
            sépia com um fundo de tinta muito diluída — é um dos quatro únicos gestos da folha
            inteira (ver a seção 12).
          </Nota>
        </Folha>
      </div>

      <Classes>
        .dp-reports · .dp-report · .dp-report-kicker · .dp-report-head · .dp-report-sub ·
        .dp-report-body · .dp-report-note · .dp-more
      </Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.5 · O EDITORIAL ══════════════ */
export function ArcaneEditorial() {
  return (
    <SubChapter
      id="editorial"
      n="09.5"
      title="O editorial"
      lead="A única peça da folha onde o jornal fala por si — e por isso a única composta em gótica. A distinção não é decorativa: o leitor precisa saber, antes de ler a primeira linha, que ali não há apuração, há posição. Fecha com assinatura, porque opinião sem assinatura é panfleto."
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
        <Folha>
          <div className="dp-editorial">
            <h3>Do valor de uma folha viva</h3>
            <p>
              Documentar um sistema é diferente de descrevê-lo. A descrição envelhece no dia em que
              alguém muda um valor e esquece o texto; a documentação viva quebra junto, e é essa
              quebra que a torna confiável.
            </p>
            <p>
              Esta casa escolheu o caminho incômodo: cada exemplo destas páginas usa a classe real
              da folha de estilo. Quando uma delas falhar, falha aqui, à vista de todos — e não em
              silêncio, três meses depois, na página de alguém que confiou no guia.
            </p>
            <p className="dp-sign">— A direção</p>
          </div>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Anatomia
          </p>
          <div className="space-y-2 text-xs" style={{ color: "var(--dp-ink-2)" }}>
            <p>
              <b style={{ color: "var(--dp-ink)" }}>Fio duplo acima.</b> Separa o editorial da
              matéria anterior com mais peso que um fio comum — muda a voz, não só o assunto.
            </p>
            <p>
              <b style={{ color: "var(--dp-ink)" }}>Título em gótica</b> (
              <code className="font-mono">--dp-black</code>), centrado, corpo pequeno. Nunca em tipo
              de madeira: o editorial não grita, afirma.
            </p>
            <p>
              <b style={{ color: "var(--dp-ink)" }}>Parágrafos com entrada.</b> Recuo de 0.9em na
              primeira linha, justificado e hifenizado — a densidade de um texto para ser lido
              inteiro, não varrido.
            </p>
            <p>
              <b style={{ color: "var(--dp-ink)" }}>Assinatura à direita</b> (
              <code className="font-mono">.dp-sign</code>), em itálico e tinta fraca.
            </p>
          </div>
          <div className="my-3 dp-rule dp-rule--hair" />
          <Nota>
            Lembrete honesto: <code className="font-mono">--dp-black</code> promete UnifrakturCook e
            o projeto não serve essa face — na prática o título cai em Georgia. A distinção de voz
            existe no código e não chega ao olho. Ver a bancada de provas, seção 19.
          </Nota>
        </Folha>
      </div>

      <Classes>.dp-editorial · .dp-editorial h3 · .dp-sign</Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.6 · A BARRA DE SERVIÇO ══════════════ */
export function ArcaneServico() {
  return (
    <SubChapter
      id="servico"
      n="09.6"
      title="A barra de serviço"
      lead="A faixa de utilidade que todo jornal carrega no alto: tempo, câmbio, marés, santo do dia. É a peça mais densa da folha em informação por centímetro, e a única que o leitor consulta sem ler — ele varre, encontra o número e sai. Por isso é tabela, não texto."
    >
      <Folha className="!p-4">
        <div className="dp-service">
          <div>
            <p className="dp-svc-title">O tempo</p>
            <p className="dp-svc-row"><span>Manhã</span><span>Névoa, 11°</span></p>
            <p className="dp-svc-row"><span>Tarde</span><span>Aberto, 19°</span></p>
            <p className="dp-svc-row"><span>Noite</span><span>Chuva fina</span></p>
          </div>
          <div>
            <p className="dp-svc-title">Praça</p>
            <p className="dp-svc-row"><span>Papel (resma)</span><span>4/6</span></p>
            <p className="dp-svc-row"><span>Tinta (libra)</span><span>1/3</span></p>
            <p className="dp-svc-row"><span>Chumbo</span><span>estável</span></p>
          </div>
          <div>
            <p className="dp-svc-title">Expediente</p>
            <p className="dp-svc-line">Oficina aberta das 6 às 22.</p>
            <p className="dp-svc-line">Fecho da edição à meia-noite.</p>
          </div>
        </div>
      </Folha>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Duas linhas, dois ofícios
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            <code className="font-mono">.dp-svc-row</code> é par: rótulo à esquerda em versalete
            apagado, valor à direita. Serve para o que se compara.{" "}
            <code className="font-mono">.dp-svc-line</code> é frase corrida, para o que não tem
            valor — um horário, um aviso. Misturar os dois na mesma coluna desalinha a varredura.
          </p>
        </Folha>
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "#8a3020" }}>
            Três colunas, sempre
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            A grade é fixa em <code className="font-mono">repeat(3, 1fr)</code> e não se dobra no
            telefone — a barra fica apertada em telas estreitas. É uma limitação real da peça, não
            uma escolha: numa folha impressa a largura nunca muda. Em tela, prefira três colunas
            curtas a quatro espremidas.
          </p>
        </Folha>
      </div>

      <Classes>.dp-service · .dp-svc-title · .dp-svc-row · .dp-svc-line</Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.7 · A GRAVURA DE DADOS ══════════════ */
export function ArcaneGrafico() {
  return (
    <SubChapter
      id="grafico"
      n="09.7"
      title="A gravura de dados"
      lead="O gráfico de jornal antigo não tem cor, preenchimento nem legenda flutuante: é traço de nanquim sobre a mesma folha. Toda a informação vem da linha e do rótulo ao lado dela — o que, por acidente feliz, é exatamente o que um gráfico acessível precisa ser."
    >
      <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
        <Folha>
          <figure className="dp-figure">
            <svg
              className="dp-chart"
              viewBox="0 0 200 84"
              role="img"
              aria-label="Tiragem da folha por ano: 1908, doze mil; 1912, dezoito mil; 1918, quinze mil; 1922, vinte e seis mil; 1926, trinta e um mil."
            >
              {/* eixos */}
              <line x1="22" y1="8" x2="22" y2="66" />
              <line x1="22" y1="66" x2="192" y2="66" />
              {/* a série */}
              <polyline points="22,52 60,38 98,45 136,22 174,12" />
              {/* marcas de ano */}
              {[
                ["22", "1908"],
                ["60", "1912"],
                ["98", "1918"],
                ["136", "1922"],
                ["174", "1926"],
              ].map(([x, ano]) => (
                <text key={ano} x={x} y="76" textAnchor="middle">
                  {ano}
                </text>
              ))}
              <text x="4" y="12">31m</text>
              <text x="4" y="66">10m</text>
            </svg>
            <figcaption className="dp-figcaption">
              Tiragem da folha, 1908–1926. Fonte: livro de expedição da casa.
            </figcaption>
          </figure>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            A folha de estilo pinta o SVG
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            Nenhum atributo de cor no marcador: <code className="font-mono">.dp-chart line</code> e{" "}
            <code className="font-mono">polyline</code> herdam traço em{" "}
            <code className="font-mono">--dp-ink</code> com{" "}
            <code className="font-mono">fill: none</code>, e o texto sai em old style, corpo 4.
            Trocar a tinta da folha reentinta o gráfico — não há um segundo lugar para atualizar.
          </p>
          <div className="my-3 dp-rule dp-rule--hair" />
          <p className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            O <code className="font-mono">aria-label</code> não é opcional
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            Uma polilinha é invisível para quem usa leitor de tela. O gráfico acima leva{" "}
            <code className="font-mono">role=&quot;img&quot;</code> e um rótulo que diz a série por
            extenso. Sem isso a peça entrega ao leitor cego exatamente nada — e a legenda
            (<code className="font-mono">.dp-figcaption</code>) não substitui, porque ela dá a
            fonte, não os valores.
          </p>
        </Folha>
      </div>

      <Classes>.dp-chart · .dp-chart line · .dp-chart polyline · .dp-chart text</Classes>
    </SubChapter>
  )
}
