/**
 * Repõe os caminhos das capas de /criativo nas linhas que já existem no Supabase.
 *
 * ------------------------------------------------------------------
 * POR QUE ESTE SCRIPT EXISTE
 * ------------------------------------------------------------------
 * O sync do /admin ("Publicar conteúdo novo do código") é *insert-only* por
 * desenho: compara pela chave natural e só insere o que falta, para nunca
 * pisar em conteúdo editado pelo painel (`inserirFaltantes`, em
 * `src/lib/admin/sync-content.ts`). O wiki do projeto chama isso de "A
 * armadilha" — corrigir um campo em `src/data/` e publicar NÃO muda produção.
 *
 * As capas placeholder (`c1-c5.svg`, `m1-m4.svg`, `v1.svg`) foram trocadas por
 * arte real em WebP e os SVGs foram apagados do repo. As linhas que já estavam
 * no banco continuam apontando para os arquivos mortos — 404 em produção. Só um
 * UPDATE deliberado resolve, e é exatamente o que o sync se recusa a fazer.
 *
 * É uma correção pontual, não uma rotina: depois de rodar uma vez, este script
 * não tem mais o que fazer (ele mesmo relata "tudo em dia").
 *
 * ------------------------------------------------------------------
 * USO
 * ------------------------------------------------------------------
 *   node scripts/fix-criativo-covers.mjs           → só relata o que mudaria
 *   node scripts/fix-criativo-covers.mjs --write   → grava
 *
 * Precisa de `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`, lidos de
 * `.env.local`, de `.env` ou do ambiente. A service role ignora RLS: rode com o
 * .env de PRODUÇÃO só quando for produção que você quer consertar.
 *
 * Depois de gravar, o cache do Next (`unstable_cache`, por tag) ainda serve o
 * valor velho. Force a revalidação: um deploy novo, ou qualquer ação do /admin
 * que chame `revalidateTag` nas tags de criativo.
 */
import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { createClient } from "@supabase/supabase-js"

const WRITE = process.argv.includes("--write")

/**
 * Mapa explícito em vez de importar os seeds.
 *
 * Os seeds vivem em TypeScript e este script é .mjs (o projeto não tem tsx nem
 * ts-node). Mas o motivo real de ser explícito é outro: isto é um UPDATE em
 * produção, e quem roda tem de conseguir auditar exatamente quais linhas serão
 * tocadas lendo o próprio arquivo — sem seguir import nenhum.
 *
 * A chave é o `title`, a mesma chave natural que o sync usa.
 */
const ALVOS = [
  {
    tabela: "comics",
    coluna: "cover_image",
    capas: {
      "Homem-Aranha: Aranhaverso": "/covers/revistas/amazing-spider-man.webp",
      Sandman: "/covers/revistas/sandman.webp",
      Watchmen: "/covers/revistas/watchmen.webp",
      // Sem arte no arquivo: vazio aciona o fallback `themed` da MediaFrame.
      Saga: "",
      "Batman: Ano Um": "/covers/revistas/batman-year-one.webp",
    },
  },
  {
    tabela: "movies",
    coluna: "poster_image",
    capas: {
      Aranhaverso: "/covers/filmes/aranhaverso-1.webp",
      "Através do Aranhaverso": "/covers/filmes/aranhaverso-2.webp",
      "Blade Runner 2049": "/covers/filmes/blade-runner-2049.webp",
      Akira: "/covers/filmes/akira.webp",
    },
  },
  {
    tabela: "videos",
    coluna: "poster_image",
    capas: {
      "Making of: as 20 dimensões": "/covers/videos/fita-rodando.webp",
    },
  },
]

/** Lê KEY=valor de um .env sem depender de dotenv (que o projeto não tem). */
async function carregarEnv() {
  for (const arquivo of [".env.local", ".env"]) {
    if (!existsSync(arquivo)) continue
    const texto = await readFile(arquivo, "utf8")
    for (const linha of texto.split("\n")) {
      const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (!m) continue
      const valor = m[2].trim().replace(/^["']|["']$/g, "")
      if (valor && !process.env[m[1]]) process.env[m[1]] = valor
    }
  }
}

/**
 * O arquivo tem de existir antes de virar caminho no banco.
 *
 * Este script nasceu justamente de linhas apontando para arquivos apagados;
 * gravar um caminho novo sem conferir repetiria o defeito em outro endereço.
 */
function conferirArquivos() {
  const faltando = ALVOS.flatMap(({ capas }) =>
    Object.values(capas).filter((p) => p && !existsSync(`public${p}`)),
  )
  if (faltando.length) {
    console.error("Arquivos que o mapa cita mas não existem em public/:")
    for (const f of faltando) console.error("  " + f)
    process.exit(1)
  }
}

async function run() {
  await carregarEnv()
  conferirArquivos()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error(
      "Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY.\n" +
        "Coloque num .env.local (ou exporte no ambiente) e rode de novo.",
    )
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  let mudariam = 0
  let jaOk = 0
  const ausentes = []

  for (const { tabela, coluna, capas } of ALVOS) {
    const { data, error } = await supabase.from(tabela).select(`id, title, ${coluna}`)
    if (error) throw new Error(`${tabela}: ${error.message}`)

    const porTitulo = new Map((data ?? []).map((r) => [r.title, r]))
    console.log(`\n── ${tabela} (${data?.length ?? 0} linhas no banco)`)

    for (const [titulo, novo] of Object.entries(capas)) {
      const linha = porTitulo.get(titulo)
      if (!linha) {
        ausentes.push(`${tabela}: "${titulo}"`)
        console.log(`  ?  ${titulo} — não existe no banco (o sync do /admin insere)`)
        continue
      }
      const atual = linha[coluna] ?? ""
      if (atual === novo) {
        jaOk++
        console.log(`  =  ${titulo}`)
        continue
      }

      mudariam++
      console.log(`  ~  ${titulo}`)
      console.log(`       de: ${atual || "(vazio)"}`)
      console.log(`      para: ${novo || "(vazio)"}`)

      if (WRITE) {
        const { error: upErr } = await supabase
          .from(tabela)
          .update({ [coluna]: novo })
          .eq("id", linha.id)
        if (upErr) throw new Error(`${tabela} / ${titulo}: ${upErr.message}`)
      }
    }
  }

  console.log(
    `\n${WRITE ? "Gravado" : "Simulação"}: ${mudariam} para atualizar, ${jaOk} já em dia` +
      (ausentes.length ? `, ${ausentes.length} ausente(s)` : ""),
  )
  if (!WRITE && mudariam > 0) console.log("Rode de novo com --write para aplicar.")
  if (ausentes.length) {
    console.log(
      "\nAusentes entram pelo /admin → “Publicar conteúdo novo do código”,\n" +
        "junto com 21st Century Boys e Além do Aranhaverso.",
    )
  }
  if (WRITE && mudariam > 0) {
    console.log("\nO cache do Next ainda serve o valor velho — faça um deploy ou revalide as tags.")
  }
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
