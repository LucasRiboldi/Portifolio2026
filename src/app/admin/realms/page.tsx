import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { REALMS, REALM_ORDER } from "@/lib/realms"
import type { RealmRow } from "@/lib/supabase/types"
import { AdminForm } from "@/components/admin/admin-form"
import { saveRealms } from "./actions"

async function loadRealms(): Promise<Record<string, RealmRow>> {
  if (!isSupabaseConfigured) return {}
  const supabase = await createClient()
  const { data } = await supabase.from("realms").select("*")
  const map: Record<string, RealmRow> = {}
  for (const r of (data ?? []) as RealmRow[]) map[r.id] = r
  return map
}

const cls =
  "w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-white/40"

export default async function RealmsPage() {
  const rows = await loadRealms()
  const defaultId = REALM_ORDER.find((id) => rows[id]?.is_default) ?? "creative"
  const arcane = rows.arcane?.arcane_content
    ? JSON.stringify(rows.arcane.arcane_content, null, 2)
    : ""

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Realms</h1>
        <p className="text-sm text-white/50">
          Os 3 universos. Controle qual é o padrão, quais estão ativos e os textos
          da metamorfose. (Popule o banco no Dashboard se estiver vazio.)
        </p>
      </header>

      <AdminForm action={saveRealms} submitLabel="Salvar realms">
        <fieldset className="space-y-4">
          {REALM_ORDER.map((id) => {
            const meta = REALMS[id]
            const row = rows[id]
            return (
              <div key={id} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {meta.glyph} {meta.label}
                  </span>
                  <label className="flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      name={`enabled_${id}`}
                      defaultChecked={row ? row.enabled : true}
                      className="size-4"
                    />
                    Ativo
                  </label>
                </div>
                <label className="mb-1 block text-xs text-white/50">Legenda da metamorfose</label>
                <input
                  name={`morph_${id}`}
                  defaultValue={row?.morph_label ?? meta.morphLabel}
                  className={cls}
                />
                <label className="mt-3 flex items-center gap-2 text-sm text-white/70">
                  <input type="radio" name="default" value={id} defaultChecked={id === defaultId} />
                  Realm padrão
                </label>
              </div>
            )
          })}
        </fieldset>

        <div className="space-y-1.5">
          <label htmlFor="arcane_content" className="block text-sm font-medium text-white/80">
            Conteúdo do Arcane (JSON — masthead, artigos, sidebar, almanaque)
          </label>
          <textarea
            id="arcane_content"
            name="arcane_content"
            defaultValue={arcane}
            rows={14}
            className={`${cls} font-mono text-xs`}
            placeholder="{ ... } — deixe vazio para manter o atual"
          />
          <p className="text-xs text-white/40">
            Edição avançada. JSON inválido é rejeitado ao salvar. Vazio = mantém o atual.
          </p>
        </div>
      </AdminForm>
    </div>
  )
}
