import fs from "fs";

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
    "src/lib/supabase",
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
