/**
 * Acervo do realm dev — ponto único de importação.
 *
 * Os cinco módulos são separados porque cada um cresce no seu ritmo e a regra
 * do projeto é manter arquivo abaixo de 500 linhas; quem consome (o seed e o
 * sync do /admin) importa daqui e não precisa saber da divisão.
 */

export { devlogs, type Devlog } from "./devlogs"
export { labExperiments, type LabExperiment } from "./lab"
export { snippets, type Snippet } from "./snippets"

/**
 * Acervo de referência — material de estudo, não conteúdo editorial.
 *
 * Diferente dos cinco acima, estes NÃO passam pelo Supabase: são revisados por
 * commit e lidos direto do arquivo. O raciocínio completo está no cabeçalho de
 * `java.ts`, e `tests/acervo-referencia.test.ts` guarda a coerência deles.
 */
export {
  javaRoadmap,
  javaCheatSheets,
  type RoadmapEtapa,
  type EtapaStatus,
  type CheatSheet,
  type CheatSheetItem,
} from "./java"
export { certificacoes, livros, type Certificacao, type CertStatus, type Livro, type LivroStatus } from "./estante"
export { designPatterns, type DesignPattern, type PatternCategoria } from "./patterns"
