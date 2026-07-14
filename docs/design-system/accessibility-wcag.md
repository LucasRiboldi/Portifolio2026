# Acessibilidade (WCAG 2.2 — nível AA)

Acessibilidade é requisito, não enfeite. Todo componente precisa passar neste
checklist antes de ser marcado como `ready`.

## Checklist por componente

- [ ] **Contraste** — texto normal ≥ 4.5:1; texto grande/ícones/bordas ≥ 3:1 (1.4.3, 1.4.11)
- [ ] **Foco visível** — `focus-visible` com anel ≥ 3:1; nunca `outline:none` sem substituto (2.4.7, 2.4.11)
- [ ] **Teclado** — toda ação operável por teclado, ordem de tabulação lógica (2.1.1, 2.4.3)
- [ ] **Sem armadilha de teclado** — foco sempre pode sair (2.1.2); overlays com focus-trap + Esc
- [ ] **Nome acessível** — todo controle tem label/`aria-label`/`aria-labelledby` (4.1.2)
- [ ] **Estados anunciados** — `aria-invalid`, `aria-busy`, `aria-expanded`, `aria-selected`
- [ ] **Não só cor** — estado nunca comunicado apenas por cor (1.4.1)
- [ ] **Alt text** — imagens informativas com `alt` significativo; decorativas com `alt=""` (1.1.1)
- [ ] **Skip link** — "pular para o conteúdo" no topo da página (2.4.1)
- [ ] **Movimento** — respeitar `prefers-reduced-motion` (2.3.3)
- [ ] **Alvo de toque** — ≥ 24×24px (2.5.8); recomendado 44×44px em mobile

## Cor do Aranhaverso — cuidado

A paleta é hiper-saturada. **Não** confie em amarelo/lime sobre branco nem magenta
sobre violeta para texto. Valide cada par com o token de escala adequado:
- Texto claro → use `--c-neutral-50` sobre superfícies `800/900/950`.
- Texto escuro → `--c-neutral-900` sobre `50/100/200`.
- Nunca use `-300/-400` de cores saturadas como texto sobre fundo claro.

## Padrões por família

| Família | ARIA essencial |
|---------|----------------|
| Button | `aria-busy` (loading), `aria-pressed` (toggle) |
| Input | `aria-invalid`, `aria-describedby` (erro/ajuda), `<label for>` |
| Checkbox/Radio/Switch | `role` nativo, `aria-checked`, fieldset+legend em grupos |
| Modal/Drawer | `role="dialog"` `aria-modal="true"`, focus-trap, retorno de foco, Esc |
| Tabs | `role="tablist/tab/tabpanel"`, `aria-selected`, setas do teclado |
| Tooltip | `role="tooltip"`, aparece em foco e hover, dismissível |
| Toast/Alert | `role="status"` (info) ou `role="alert"` (crítico), `aria-live` |

## Ferramentas de verificação

- Lighthouse / axe DevTools (plugin `chrome-devtools-mcp` disponível no ambiente)
- Navegação só por teclado (Tab/Shift+Tab/Enter/Espaço/Esc/setas)
- Leitor de tela (NVDA / VoiceOver) nos fluxos principais
