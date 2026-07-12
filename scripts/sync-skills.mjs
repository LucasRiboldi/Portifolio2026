/**
 * Sincroniza src/data/skills.ts com ~/.claude/skills.
 *
 *  - Preserva categoria + descrição (pt-BR) das skills já curadas.
 *  - Adiciona skills novas (categoria 'orchestration', descrição do frontmatter).
 *  - Remove skills que não existem mais na pasta.
 *
 * Uso:  node scripts/sync-skills.mjs
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

const present = new Set(dirs);
const added = [];
const removed = [...existing.keys()].filter((n) => !present.has(n));

const merged = [];
for (const name of dirs.sort()) {
  if (existing.has(name)) {
    merged.push(existing.get(name));
  } else {
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
}

// ordena por categoria (mantém agrupamento visual)
const order = ["frontend", "design", "performance", "quality", "system", "git", "orchestration"];
merged.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));

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
if (removed.length) console.log(`   - removidas: ${removed.join(", ")}`);
if (!added.length && !removed.length) console.log("   (nenhuma mudança de skills)");
