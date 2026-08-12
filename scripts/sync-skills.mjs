/**
 * Sincroniza src/data/skills.ts com ~/.claude/skills.
 *
 *  - Preserva categoria + descrição (pt-BR) das skills já curadas.
 *  - Adiciona skills novas (categoria 'orchestration', descrição do frontmatter).
 *  - NÃO remove nada por omissão. Ver abaixo.
 *
 * Uso:  node scripts/sync-skills.mjs [--prune]
 *
 * Por que é aditivo
 * -----------------
 * `src/data/skills.ts` é conteúdo publicado: alimenta a página
 * `/desenvolvedor/skills`. `~/.claude/skills` é o estado de UMA máquina, e
 * varia com a máquina, o perfil e o que foi instalado naquele dia.
 *
 * Tratar a pasta como fonte de verdade fazia o script apagar do site tudo que
 * não estivesse instalado ali. Em 12/08/2026 isso removeu 54 das 55 entradas
 * numa rodada — o autor tinha as skills quando o arquivo foi montado e já não
 * as tinha na máquina onde rodou.
 *
 * A assimetria é de propósito: acrescentar errado custa uma linha para apagar,
 * remover errado custa conteúdo que ninguém percebe que sumiu.
 *
 * `--prune` faz a limpeza antiga, para quando a intenção FOR remover. Ele
 * lista o que vai sair antes de escrever.
 */
import fs from "fs";
import os from "os";
import path from "path";

const SKILLS_DIR = path.join(os.homedir(), ".claude", "skills");
const DATA_FILE = path.join(process.cwd(), "src", "data", "skills.ts");

/** Lê name + description do frontmatter de um SKILL.md */
function readFrontmatter(dir) {
  const file = ["SKILL.md", "SKILL.MD"]
    .map((f) => path.join(SKILLS_DIR, dir, f))
    .find((p) => fs.existsSync(p));
  if (!file) return null;
  const txt = fs.readFileSync(file, "utf8");
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = m ? m[1] : "";
  const desc = (fm.match(/^description:\s*([\s\S]*?)(?:\r?\n[a-zA-Z_-]+:|\r?\n?$)/m) || [, ""])[1]
    .replace(/^["'>|-]+/, "")
    .replace(/["']$/, "")
    .replace(/\s+/g, " ")
    .trim();
  return { name: dir, description: desc };
}

/** Extrai as skills atuais do skills.ts (regex sobre o array literal). */
function readExisting(src) {
  const map = new Map();
  const re =
    /\{\s*name:\s*'([^']+)',\s*command:\s*'([^']+)',\s*category:\s*'([^']+)',\s*description:\s*'((?:[^'\\]|\\.)*)'\s*\}/g;
  let m;
  while ((m = re.exec(src))) {
    map.set(m[1], { name: m[1], command: m[2], category: m[3], description: m[4] });
  }
  return map;
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

const src = fs.readFileSync(DATA_FILE, "utf8");
const existing = readExisting(src);

const dirs = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((d) => readFrontmatter(d));

const prune = process.argv.includes("--prune");

const present = new Set(dirs);
const added = [];

/** Entradas do arquivo cuja pasta não existe nesta máquina. */
const ausentes = [...existing.keys()].filter((n) => !present.has(n));
const removed = prune ? ausentes : [];

// Parte do ARQUIVO, não da pasta: a base é o que já está publicado, e a
// varredura só acrescenta. Sem `--prune`, nenhuma entrada existente sai.
const merged = [];
for (const [name, entry] of existing) {
  if (prune && !present.has(name)) continue;
  merged.push(entry);
}

for (const name of [...dirs].sort()) {
  if (existing.has(name)) continue;
  const fm = readFrontmatter(name);
  const short = fm.description.length > 130 ? fm.description.slice(0, 127) + "..." : fm.description;
  merged.push({
    name,
    command: "/" + name,
    category: "orchestration", // revise a categoria manualmente
    description: short || "—",
  });
  added.push(name);
}

// Ordena por categoria (mantém o agrupamento visual). `sort` é estável, então
// dentro de cada categoria a ordem do arquivo é preservada e as skills novas
// entram no fim do seu grupo.
//
// Categoria desconhecida vai para o fim, e não para o começo: `indexOf`
// devolve -1, e -1 ordenaria antes de tudo — uma categoria digitada errado
// jogaria a entrada para o topo da página sem ninguém entender por quê.
const order = ["frontend", "design", "performance", "quality", "system", "git", "orchestration"];
const posicao = (c) => (order.indexOf(c) === -1 ? order.length : order.indexOf(c));
merged.sort((a, b) => posicao(a.category) - posicao(b.category));

const body = merged
  .map(
    (s) =>
      `  { name: '${esc(s.name)}', command: '${esc(s.command)}', category: '${s.category}', description: '${esc(
        s.description
      )}' },`
  )
  .join("\n");

// substitui o conteúdo do array `skills`
const out = src.replace(
  /export const skills: Skill\[\] = \[[\s\S]*?\n\]/,
  `export const skills: Skill[] = [\n${body}\n]`
);
fs.writeFileSync(DATA_FILE, out);

console.log(`✅ Sincronizado: ${merged.length} skills`);
if (added.length) console.log(`   + adicionadas (revisar categoria): ${added.join(", ")}`);
if (removed.length) console.log(`   - removidas (--prune): ${removed.join(", ")}`);

if (ausentes.length && !prune) {
  console.log(
    `   ⓘ ${ausentes.length} no arquivo sem pasta em ${SKILLS_DIR}:\n` +
      `     ${ausentes.join(", ")}\n` +
      `     Mantidas. Isto costuma significar "outra máquina", não "skill morta".\n` +
      `     Para remover mesmo: node scripts/sync-skills.mjs --prune`
  );
}

if (!added.length && !removed.length) console.log("   (nenhuma mudança de skills)");
