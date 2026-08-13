import {
  ads,
  awards,
  boxes,
  briefs,
  circulation,
  colophon,
  lineage,
  paper,
  playtests,
  registryNumber,
  servicebar,
  signature,
} from "@/lib/anfitriao-prophet"
import { PressMark } from "@/components/prophet/press-mark"
import { SubscriptionCoupon } from "@/components/anfitriao/subscription-coupon"

/**
 * O CADERNO — as bandas ao pé da folha.
 *
 * Quatro bandas que o `page.tsx` já descrevia como uma unidade: coleção da
 * casa, anúncios, serviço ao leitor e expediente. Saíram de lá porque o
 * arquivo passava de 700 linhas; o JSX veio VERBATIM, sem uma vírgula
 * mexida, e o HTML servido foi comparado antes e depois para provar isso.
 *
 * Por que uma peça só, e não quatro: as bandas dividem a mesma moldura
 * (`.dpx-band`) e a mesma posição editorial — são o caderno, não seções
 * avulsas. Quebrar em quatro arquivos daria quatro importações para
 * descrever o que é um bloco contínuo da diagramação.
 */
export function ProphetCaderno() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          COLEÇÃO — continuação da zona aberta pelo telegrama acima.
          ═══════════════════════════════════════════════════════════
          Sem âncora própria: a da zona "Coleção" está no telegrama, que é
          onde o menu deve pousar. Duas âncoras com o mesmo `id` seriam id
          duplicado — HTML inválido, e o navegador só enxerga a primeira.
          ═══════════════════════════════════════════════════════════ */}

      <section className="dpx-band" aria-labelledby="colecao-titulo">
        <header className="dpx-band-head">
          <h2 className="dpx-band-title" id="colecao-titulo">
            Coleção da Casa
          </h2>
          <p className="dpx-band-sub">
            Os premiados, a linhagem do ofício e o índice técnico das mesas
          </p>
        </header>

        <div className="dpx-zone dpx-zone--3">
          {/* Coluna I — o quadro de láureas e o primeiro classificado */}
          <div>
            <div className="dpx-box">
              <table className="dpx-table">
                <caption>{awards.caption}</caption>
                <thead>
                  <tr>
                    {awards.head.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {awards.rows.map((r) => (
                    <tr key={`${r.year}-${r.title}`}>
                      {/* Não usa `.num`: aquela classe zera o padding à direita
                          para encostar o número na borda da tabela, e serve à
                          ÚLTIMA coluna. Aqui o ano abre a linha — sem padding
                          ele colava no título ("2024Sky Team"). */}
                      <td className="year">{r.year}</td>
                      <td>{r.title}</td>
                      <td>{r.prize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coluna II — a linhagem, o quadro de playtests e a gravura */}
          <div>
            <div className="dpx-box">
              <p className="dpx-box-title">{lineage.title}</p>
              {lineage.items.map((l) => (
                <p key={l.title} className="dpx-term">
                  <b>
                    {l.title} <span className="dpx-term-year">{l.year}</span>
                  </b>{" "}
                  — <em>{l.note}</em>
                  <span className="dpx-term-author">{l.author}</span>
                </p>
              ))}
            </div>

            <div className="dpx-box">
              <table className="dpx-table">
                <caption>{playtests.caption}</caption>
                <thead>
                  <tr>
                    {playtests.head.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {playtests.rows.map((r) => (
                    <tr key={r.item}>
                      <td>{r.item}</td>
                      <td className="num">{r.players}</td>
                      <td className="num">{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <figure className="dpx-figure--flush">
              <svg
                className="dpx-chart"
                viewBox="0 0 200 84"
                role="img"
                aria-label={circulation.aria}
              >
                <line x1="22" y1="8" x2="22" y2="66" />
                <line x1="22" y1="66" x2="192" y2="66" />
                <polyline points={circulation.points} />
                {circulation.years.map(([x, ano]) => (
                  <text key={ano} x={x} y="76" textAnchor="middle">
                    {ano}
                  </text>
                ))}
                <text x="4" y="12">
                  {circulation.top}
                </text>
                <text x="4" y="66">
                  {circulation.bottom}
                </text>
              </svg>
              <figcaption className="dpx-figcaption">{circulation.caption}</figcaption>
            </figure>
          </div>

          {/* Coluna III — números da casa, telegramas e o índice técnico */}
          <div>
            <div className="dpx-box dpx-box--heavy">
              <p className="dpx-box-title">{boxes.numbers.title}</p>
              {boxes.numbers.rows.map(([k, v]) => (
                <p key={k} className="dpx-kv">
                  <b>{k}</b>
                  <span>{v}</span>
                </p>
              ))}
            </div>

            <div className="dpx-box">
              {/*
                Este quadro repetia o telegrama INTEIRO — mesmo título, mesmos
                seis itens que a chamada acima já traz —, e as duas peças ficam
                a uma rolagem de distância. Num impresso isso é erro de
                fechamento: a mesma nota composta duas vezes na mesma página.

                A relação entre as duas é a que o jornal já usava: a chamada
                anuncia as primeiras notas e manda para onde está o resto. O
                quadro passa a ser o RESTO — as que a chamada não deu — e diz
                isso no título. Nenhuma nota se perde e nenhuma sai duas vezes.
              */}
              <p className="dpx-box-title">{briefs.title} · continuação</p>
              <ul className="dpx-list dpx-list--dash">
                {briefs.items.slice(2).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="dpx-box">
              <p className="dpx-box-title">{boxes.curio.title}</p>
              <ul className="dpx-list dpx-list--fleuron">
                {boxes.curio.items.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="dpx-box">
              <p className="dpx-box-title">{boxes.grimoire.title}</p>
              {boxes.grimoire.items.map((t) => (
                <p key={t.term} className="dpx-term">
                  <b>{t.term}</b> — <em>{t.note}</em>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ANÚNCIOS PUBLICITÁRIOS — zona própria ═══
          Os três classificados estavam repartidos: um na banda da Coleção e
          dois na do Serviço ao Leitor. Uma zona do menu precisa ser UM lugar
          — clicar em "Anúncios Publicitários" levava a um deles e escondia os
          outros dois numa seção de outro assunto. Agora é uma faixa só. */}
      <section
        id="anf-anuncios"
        className="dpx-band dpx-anchor"
        aria-labelledby="anuncios-titulo"
        tabIndex={-1}
      >
        <header className="dpx-band-head">
          <h2 className="dpx-band-title" id="anuncios-titulo">
            Anúncios Publicitários
          </h2>
          <p className="dpx-band-sub">Os classificados desta praça</p>
        </header>

        <div className="dpx-zone dpx-zone--3">
          {ads.map((a) => (
            <div key={a.head} className="dpx-ad">
              <p className="dpx-ad-head">{a.head}</p>
              <p className="dpx-ad-body">{a.body}</p>
              <p className="dpx-ad-sign">{a.sign}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Serviço ao leitor: o cupom, o conselho e a rubrica ═══ */}
      <section
        id="anf-servico"
        className="dpx-band dpx-anchor"
        aria-labelledby="servico-titulo"
        tabIndex={-1}
      >
        <header className="dpx-band-head">
          <h2 className="dpx-band-title" id="servico-titulo">
            Serviço ao Leitor
          </h2>
          <p className="dpx-band-sub">Assinatura e conselho da casa</p>
        </header>

        <div className="dpx-zone dpx-zone--2">
          {/* O cupom — a camada de formulário, impressa. Saiu para um
              componente de cliente porque virou formulário de verdade: tem
              estado de envio, de aceite e de recusa. Ver
              `components/anfitriao/subscription-coupon.tsx`. */}
          <SubscriptionCoupon />

          {/* Conselho da casa e a rubrica do editor. Os classificados que
              viviam aqui mudaram para a faixa "Anúncios Publicitários". */}
          <div>
            <div className="dpx-box">
              <p className="dpx-box-title">{boxes.tip.title}</p>
              <p className="dpx-text">{boxes.tip.body}</p>
            </div>

            {/* As efemérides estavam no índice do rodapé, entre as entradas de
                navegação — pareciam links e não eram. Horários da casa são
                serviço ao leitor; é aqui que se informam, e é o que preenche
                esta coluna, antes vazia da metade para baixo. */}
            <div className="dpx-box">
              <p className="dpx-box-title">{servicebar.ephemeris.title}</p>
              <ul className="dpx-list dpx-list--dash">
                {servicebar.ephemeris.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>

            <div className="dpx-signature">
              <p className="dpx-autograph">{signature.autograph}</p>
              <p className="dpx-signature-name">{signature.name}</p>
              <p className="dpx-signature-role">{signature.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Expediente — abriga o acesso administrativo (PressMark) ═══ */}
      <section
        id="anf-expediente"
        className="dpx-band dpx-anchor"
        aria-labelledby="expediente-titulo"
        tabIndex={-1}
      >
        <header className="dpx-band-head">
          <h2 className="dpx-band-title" id="expediente-titulo">
            {colophon.title}
          </h2>
        </header>

        <div className="dpx-zone dpx-zone--3">
          <div>
            {colophon.lines.map(([k, v]) => (
              <p key={k} className="dpx-kv">
                <b>{k}</b>
                <span>{v}</span>
              </p>
            ))}
            <p className="dpx-kv">
              <b>{colophon.pressLabel}</b>
              <span>
                <PressMark label={colophon.pressValue} />
              </span>
            </p>
          </div>

          <div>
            <p className="dpx-box-title">Aviso aos Leitores</p>
            <p className="dpx-text">{colophon.notice}</p>
            <div className="dpx-orn" aria-hidden>
              ❦
            </div>
            <p className="dpx-text" style={{ textAlign: "center" }}>
              {paper.place}
            </p>
          </div>

          <div>
            <p className="dpx-box-title">Marcas de Registro</p>
            <p className="dpx-kv">
              <b>Edição</b>
              <span>{colophon.registry}</span>
            </p>
            <p className="dpx-kv">
              <b>Fecho</b>
              <span>à meia-noite</span>
            </p>
            <div className="dpx-stamp" aria-hidden>
              Expedido
              <br />
              {registryNumber}
              <br />
              Terra-2026
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
