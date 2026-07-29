"use client"

/**
 * O CUPOM — a camada de formulário, impressa.
 *
 * Saiu de dentro de `page.tsx` porque deixou de ser desenho e virou
 * formulário de verdade: precisa de estado (enviando, aceito, recusado), e
 * estado exige cliente. A página segue sendo componente de servidor; só este
 * quadro atravessa a fronteira.
 *
 * O que a peça garante, além de enviar:
 *   • Cada erro é dito NO CAMPO, ligado a ele por `aria-describedby`, e o
 *     campo se marca com `aria-invalid` — quem usa leitor de tela ouve o
 *     motivo ao chegar nele, não só um aviso genérico no fim.
 *   • O resultado vive numa região `aria-live`: o leitor de tela é avisado
 *     sem que o foco seja arrancado de onde está.
 *   • Enquanto envia, o botão diz o que está fazendo e o formulário inteiro
 *     fica `inert` — dois cliques não viram duas assinaturas.
 *   • A validação daqui é conveniência. Quem decide é o servidor
 *     (`anfitriao/actions.ts`); esta camada nunca é a última palavra.
 */

import { useActionState } from "react"

import { assinarFolha, type CouponState } from "@/app/anfitriao/actions"
import { coupon } from "@/lib/anfitriao-prophet"

const inicial: CouponState = { status: "idle" }

/** Um campo de texto do cupom, com o seu recado de erro. */
function Campo({
  id,
  name,
  label,
  placeholder,
  erro,
  valor,
  type = "text",
  required = true,
}: {
  id: string
  name: string
  label: string
  placeholder?: string
  erro?: string
  /** O que o leitor havia digitado, devolvido pelo servidor numa recusa. */
  valor?: string
  type?: string
  required?: boolean
}) {
  return (
    <div className="dpx-field">
      <label className="dpx-label" data-required={required} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className="dpx-input"
        placeholder={placeholder}
        required={required}
        defaultValue={valor}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
      />
      {erro ? (
        <p className="dpx-erro" id={`${id}-erro`}>
          {erro}
        </p>
      ) : null}
    </div>
  )
}

export function SubscriptionCoupon() {
  const [estado, enviar, enviando] = useActionState(assinarFolha, inicial)
  const erros = estado.status === "error" ? (estado.fields ?? {}) : {}
  /**
   * O que o leitor digitou, devolvido pelo servidor. Um `<form action>` do
   * React 19 reinicia os campos não controlados quando a action termina — sem
   * isto, uma recusa por um campo apagaria os outros cinco. A `key` no
   * formulário força a remontagem quando os valores voltam, para que os
   * `defaultValue` novos sejam de fato aplicados (React ignora mudança de
   * `defaultValue` num campo já montado).
   */
  const valores = estado.status === "error" ? (estado.values ?? {}) : {}
  const tentativa = estado.status === "error" ? JSON.stringify(valores) : "limpo"

  return (
    <form action={enviar} aria-labelledby="cupom-titulo">
      <div className="dpx-box dpx-box--heavy">
        <p className="dpx-box-title" id="cupom-titulo">
          {coupon.title}
        </p>
        <p className="dpx-help">{coupon.standfirst}</p>

        {/* `inert` durante o envio: impede o segundo clique sem esconder nada
            e sem tirar o foco de onde o leitor deixou. */}
        <fieldset key={tentativa} className="dpx-fieldset" inert={enviando}>
          <Campo
            id="cp-nome"
            name="nome"
            label={coupon.fields.name.label}
            placeholder={coupon.fields.name.placeholder}
            erro={erros.nome}
            valor={valores.nome}
          />

          <Campo
            id="cp-coruja"
            name="email"
            type="email"
            label={coupon.fields.email.label}
            placeholder={coupon.fields.email.placeholder}
            erro={erros.email}
            valor={valores.email}
          />

          <Campo
            id="cp-praca"
            name="praca"
            label={coupon.fields.place.label}
            placeholder={coupon.fields.place.placeholder}
            erro={erros.praca}
            valor={valores.praca}
          />

          <fieldset className="dpx-field">
            <legend className="dpx-label">{coupon.cadence.legend}</legend>
            {coupon.cadence.options.map((o) => (
              <label key={o.id} className="dpx-choice">
                <input
                  type="radio"
                  name="cadencia"
                  value={o.id}
                  className="dpx-check"
                  defaultChecked={valores.cadencia ? valores.cadencia === o.id : o.default}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="dpx-field">
            <legend className="dpx-label">{coupon.extras.legend}</legend>
            {coupon.extras.options.map((o) => (
              <label key={o.id} className="dpx-choice">
                <input
                  type="checkbox"
                  name={o.id}
                  className="dpx-check"
                  defaultChecked={
                    estado.status === "error" ? Boolean(valores[o.id]) : o.default
                  }
                />
                <span>{o.label}</span>
              </label>
            ))}
          </fieldset>

          <div className="dpx-field">
            <label className="dpx-label" htmlFor="cp-recado">
              {coupon.fields.note.label}
            </label>
            <textarea
              id="cp-recado"
              name="recado"
              rows={2}
              className="dpx-input dpx-input--boxed"
              defaultValue={valores.recado}
              aria-invalid={erros.recado ? true : undefined}
              aria-describedby={erros.recado ? "cp-recado-erro" : "cp-recado-ajuda"}
            />
            {erros.recado ? (
              <p className="dpx-erro" id="cp-recado-erro">
                {erros.recado}
              </p>
            ) : (
              <p className="dpx-help" id="cp-recado-ajuda">
                {coupon.fields.note.help}
              </p>
            )}
          </div>

          {/* Armadilha de robô — escondida do leitor e do leitor de tela.
              Ver o motivo em `anfitriao/actions.ts`. */}
          <div className="dpx-fecho" aria-hidden>
            <label htmlFor="cp-fecho">Não preencha este campo</label>
            <input id="cp-fecho" name="fecho" type="text" tabIndex={-1} autoComplete="off" />
          </div>
        </fieldset>

        <div className="dpx-actions">
          <button type="submit" className="dpx-btn dpx-btn--primary" disabled={enviando}>
            {enviando ? "Levando ao balcão…" : coupon.submit}
          </button>
          <button type="reset" className="dpx-btn dpx-btn--ghost" disabled={enviando}>
            {coupon.reset}
          </button>
        </div>

        {/*
          A resposta do balcão. `aria-live="polite"` avisa o leitor de tela
          quando o texto aparece, sem interromper o que ele estiver lendo; a
          região existe desde o primeiro desenho (vazia) porque um `aria-live`
          inserido junto com o conteúdo costuma não ser anunciado.
        */}
        <p
          className={estado.status === "error" ? "dpx-erro" : "dpx-aviso"}
          role="status"
          aria-live="polite"
        >
          {estado.status !== "idle" ? estado.message : ""}
        </p>

        <p className="dpx-help">{coupon.fineprint}</p>
      </div>
    </form>
  )
}
