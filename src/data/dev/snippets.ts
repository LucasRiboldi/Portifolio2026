/**
 * Snippets — código que já resolveu um problema real neste projeto.
 *
 * Critério de entrada: o trecho precisa ter saído de um arquivo que existe, ou
 * de um problema que de fato apareceu. Snippet genérico de tutorial não entra —
 * a internet já tem, e não diz nada sobre como este sistema é construído.
 *
 * `language` alimenta o filtro da página e o destaque de sintaxe (sugar-high).
 */

export interface Snippet {
  title: string
  language: string
  description: string
  code: string
  tags: string[]
}

export const snippets: Snippet[] = [
  {
    title: "Leitor público cacheado por tabela",
    language: "ts",
    description:
      "Fábrica que devolve um leitor Supabase já filtrado por published e amarrado a uma tag de cache. Toda tabela de conteúdo do site passa por aqui — é o motivo de não haver cinco variações do mesmo select espalhadas pelos repositórios.",
    code: `function publishedReader<T>(table: string, tag: string, order: string, asc: boolean) {
  return unstable_cache(
    async (): Promise<T[]> => {
      const supabase = createPublicClient()
      // Sem env de Supabase (preview local, CI), a página renderiza vazia
      // em vez de estourar: conteúdo ausente não é erro de aplicação.
      if (!supabase) return []

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("published", true)
        .order(order, { ascending: asc })

      if (error || !data) return []
      return data as T[]
    },
    [table],
    { tags: [tag] },
  )
}

export const getDevlogs = publishedReader<DevlogRow>("devlogs", CACHE_TAGS.devlogs, "date", false)`,
    tags: ["supabase", "next.js", "cache"],
  },
  {
    title: "Sync incremental que nunca sobrescreve",
    language: "ts",
    description:
      "Insere de src/data o que falta no banco, comparando por chave natural. A regra inegociável: conteúdo editado no painel jamais é atropelado pelo código. Rodar duas vezes não duplica nada.",
    code: `const { data: rows } = await supabase.from("snippets").select("title, sort")

const jaTem = new Set((rows ?? []).map((r) => r.title))
const maiorSort = Math.max(0, ...(rows ?? []).map((r) => r.sort ?? 0))
const faltando = snippets.filter((s) => !jaTem.has(s.title))

if (faltando.length) {
  await supabase.from("snippets").insert(
    // Entra no fim da fila: a ordem que você arrumou no painel continua valendo.
    faltando.map((s, i) => ({ ...paraLinha(s), sort: maiorSort + 1 + i })),
  )
}`,
    tags: ["supabase", "idempotência", "cms"],
  },
  {
    title: "Anel de foco para um realm inteiro",
    language: "css",
    description:
      "Um seletor cobre todo elemento focável dentro do escopo do realm. Escrito depois de descobrir que o universo dev inteiro era navegável por teclado sem nenhuma indicação visual de onde o foco estava.",
    code: `.dracula :is(a, button, input, textarea, select, summary, [tabindex]):focus-visible {
  outline: var(--dev-ring-width) solid var(--dev-ring-color);
  outline-offset: var(--dev-ring-offset);
  border-radius: var(--dev-radius-sm);
}

/* Quem desenha o próprio arredondamento precisa que o anel acompanhe,
   senão o retângulo corta a quina do elemento. */
.dracula :is(.dv-dock a, .dv-filter, .dv-tab, .dv-copy):focus-visible {
  border-radius: var(--dev-radius-pill);
}`,
    tags: ["css", "acessibilidade", "focus-visible"],
  },
  {
    title: "Movimento reduzido sem varrer o DOM",
    language: "css",
    description:
      "Substitui o padrão comum [class*=\"prefixo-\"] { animation: none !important }, que casa por substring, atinge classes futuras por acidente e não admite exceção. Aqui as animações saem pelo nome, e as transições viram instantâneas — o que a versão por substring esquecia.",
    code: `@media (prefers-reduced-motion: reduce) {
  .dracula .dv-caret,
  .dracula .dv-logo .blink,
  .dracula .dv-versao-led {
    animation: none;
  }

  /* 0.01ms e não 0s: mantém o evento transitionend disparando, de que
     algum componente depende para saber que terminou. */
  .dracula *,
  .dracula *::before,
  .dracula *::after {
    transition-duration: 0.01ms;
  }
}`,
    tags: ["css", "acessibilidade", "motion"],
  },
  {
    title: "Teste que lê o fonte, não o navegador",
    language: "ts",
    description:
      "Checagem de marcação declarada sem subir browser: roda em dois segundos no CI. O filtro de comentários é essencial — os comentários deste projeto citam marcação ao explicar mudanças, e sem ele o teste acusa a própria documentação.",
    code: `const semComentarios = (s: string) =>
  s
    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, "")
    .replace(/\\{\\/\\*[\\s\\S]*?\\*\\/\\}/g, "")
    .replace(/^\\s*\\/\\/.*$/gm, "")

it("todo seletor expõe o próprio estado", () => {
  for (const arquivo of COMPONENTES) {
    const botoes = [...semComentarios(ler(arquivo)).matchAll(/<button[\\s\\S]*?>/g)]
      .map((m) => m[0])
      .filter((b) => /dv-(?:filter|tab)\\b/.test(b))

    for (const b of botoes) {
      expect(b, \`\${arquivo}: seletor sem aria-pressed\`).toContain("aria-pressed")
    }
  }
})`,
    tags: ["vitest", "testes", "acessibilidade"],
  },
  {
    title: "Escala tipográfica fluida só onde convém",
    language: "css",
    description:
      "Títulos escalam com a janela; corpo e metadados não. Texto de leitura com tamanho fluido prejudica volume longo — que é exatamente o caso de uso de um acervo de documentação.",
    code: `.dracula {
  /* Fixos: o olho precisa de âncora em texto longo. */
  --dev-text-sm: 0.82rem;
  --dev-text-base: 0.9rem;

  /* Fluidos: título é ponto de respiro, pode acompanhar a janela. */
  --dev-text-xl: clamp(1.6rem, 1.2rem + 1.6vw, 1.9rem);
  --dev-text-2xl: clamp(1.8rem, 1.2rem + 2.6vw, 2.8rem);
}`,
    tags: ["css", "tipografia", "design-tokens"],
  },
  {
    title: "Grade que não abre coluna fantasma",
    language: "css",
    description:
      "auto-fit em vez de auto-fill: com três cartões numa tela larga, o auto-fill deixava colunas vazias reservadas e a grade parecia ter itens faltando. O min() interno evita transbordo abaixo de 360px.",
    code: `.dv-objects {
  display: grid;
  gap: var(--dev-space-4);
  /* min(100%, 17.5rem) é o que impede a coluna de ficar mais larga que a
     tela em 320px — minmax(17.5rem, 1fr) sozinho transborda. */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17.5rem), 1fr));
}`,
    tags: ["css", "grid", "responsividade"],
  },
  {
    title: "Migration com RLS de leitura pública",
    language: "sql",
    description:
      "Padrão repetido em todas as tabelas de conteúdo do site: quem não é admin lê só o publicado; admin lê e escreve tudo. A função is_admin() centraliza a checagem de papel.",
    code: `create table if not exists public.lab_experiments (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  status      text not null default 'wip'
                check (status in ('wip','playtest','stable','archived')),
  stack       text[] not null default '{}',
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.lab_experiments enable row level security;

create policy "lab_read" on public.lab_experiments
  for select using (published or public.is_admin());

create policy "lab_admin_write" on public.lab_experiments
  for all using (public.is_admin()) with check (public.is_admin());`,
    tags: ["sql", "supabase", "rls"],
  },
]
