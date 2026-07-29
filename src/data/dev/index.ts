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
export { wikiDocs, type WikiDoc } from "./wiki"
export { ideas, type Idea } from "./ideas"
