import fs from "fs";

// Nota de 12/08/2026: esta lista é do andaime inicial e envelheceu. Cinco
// entradas abaixo (`src/lib/ai`, `src/lib/analytics`, `src/services`,
// `src/content/blog`, `src/content/projects`) não existem no projeto — são
// pastas que nunca foram usadas. Rodar isto as cria vazias.
//
// Só `src/lib/supabase` foi corrigida aqui, para `src/lib/firebase`, por ser
// resíduo da migração de backend: recriar a pasta de um banco abandonado
// confunde de verdade. As demais ficam para uma revisão do andaime, que é
// outro assunto.
const dirs = [
    "src/app",
    "src/components/ui",
    "src/components/layout",
    "src/components/cards",
    "src/components/forms",
    "src/components/providers",
    "src/components/sections",
    "src/hooks",
    "src/lib/utils",
    "src/lib/github",
    "src/lib/firebase",
    "src/lib/analytics",
    "src/lib/ai",
    "src/services",
    "src/types",
    "src/constants",
    "src/content/blog",
    "src/content/projects",
    "src/data",
    "src/styles/themes",
    "public/images",
    "public/icons",
    "public/logos"
];

dirs.forEach(dir =>
    fs.mkdirSync(dir, { recursive: true })
);

const files = [
    "src/styles/tokens.css",
    "src/styles/globals.css",
    "src/styles/utilities.css",
    "src/styles/animations.css",
    "src/styles/themes/dark.css",
    "src/styles/themes/light.css"
];

files.forEach(file => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "");
    }
});

console.log("Estrutura criada com sucesso 🚀");
