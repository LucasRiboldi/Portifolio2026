# Estados & Variantes

## Estados interativos canônicos

Todo componente interativo deve considerar (quando aplicável):

| Estado | Gatilho | Estilização | Acessibilidade |
|--------|---------|-------------|----------------|
| **Normal** | padrão | token base | — |
| **Hover** | `:hover` | `hover:` (elevação/cor) | não é o único indicador |
| **Focus** | `:focus-visible` | `focus-visible:ring-3 ring-ring/50` | **nunca remover** |
| **Active/Pressed** | `:active` | `active:translate-y-px` | — |
| **Selected** | seleção | `aria-selected` + `data-` | `aria-selected="true"` |
| **Disabled** | indisponível | `opacity-disabled pointer-events-none` | `disabled` / `aria-disabled` |
| **Loading** | assíncrono | spinner + `aria-busy` | `aria-busy="true"` |
| **Error** | validação falha | `border-danger ring-danger/20` | `aria-invalid="true"` |
| **Success** | validação ok | `border-success` | anúncio via `aria-live` |
| **Warning** | atenção | `border-warning` | `role="alert"` quando crítico |
| **Info** | informativo | `border-info` | — |
| **Readonly** | leitura | `bg-surface/50` | `readonly` |
| **Visited** | link visitado | `:visited` | — |

## Matriz por tipo de componente

- **Botões:** Normal · Hover · Active · Focus · Disabled · Loading
- **Inputs:** Normal · Hover · Focus · Error · Success · Disabled · Readonly
- **Seletores (checkbox/radio/switch):** todos os estados + Selected/Checked
- **Overlays (modal/drawer/popover):** Open · Closed · Focus-trap ativo

## Variantes canônicas

| Componente | Variantes |
|------------|-----------|
| **Button** | Primary · Secondary · Ghost · Outlined · Link · FAB · Icon |
| **Input** | Text · Email · Password · Textarea · Number · Date · Search · Phone · CPF · CEP · Select · Autocomplete |
| **Navbar** | Desktop · Tablet · Mobile · Sticky · Transparent |
| **Card** | Produto · Equipe · Notícia · Serviço · Blog · Cases |
| **Feedback** | Alert · Toast · Snackbar · Progress · Skeleton · Empty · 404 · 500 · Offline |

## Regra de ouro

Nenhum estado deve depender **apenas** de cor (WCAG 1.4.1). Combine cor + ícone,
borda, peso ou texto. Foco visível é obrigatório e nunca pode ser `outline: none`
sem substituto equivalente.
