# Memória do projeto

Conhecimento **estável** do repositório. Escrito para humanos e para sessões
futuras do Claude Code, de modo que ninguém precise reanalisar o código inteiro
para entender uma decisão.

| Documento | Responde |
|---|---|
| [architecture.md](architecture.md) | Como o sistema é organizado e por quê |
| [business-rules.md](business-rules.md) | O que o produto faz e quais regras valem |
| [database.md](database.md) | Coleções, ids, índices, seed e sync |
| [auth.md](auth.md) | Login, sessão, autorização e Security Rules |
| [integrations.md](integrations.md) | Serviços externos e criticidade |
| [deployment.md](deployment.md) | Ambientes, variáveis, deploy e armadilhas |
| [conventions.md](conventions.md) | Padrões de código, testes e commits |
| [technical-debt.md](technical-debt.md) | Problemas conhecidos, por prioridade |
| [migrations/](migrations/) | Mudanças estruturais grandes |

## Documentos vizinhos

- **`CLAUDE.md`** (raiz) — resumo de alto valor para começar uma sessão.
- **`PROJECT_STATE.md`** (raiz) — estado do momento: bugs abertos, o que falta,
  o que nunca foi verificado. Muda com frequência.
- **`DESIGN_SYSTEM.md`** e **`COMPONENT_GUIDE.md`** (raiz) — camada visual, que
  esta pasta deliberadamente não cobre.

## Como manter

Descobriu algo relevante — uma restrição de plataforma, uma armadilha, uma
decisão com alternativa descartada? **Registre aqui**, não só no código e nunca
só no chat.

Três regras:

1. **Uma fonte de verdade por assunto.** Se já existe seção, atualize-a.
2. **Documento vazio é pior que ausente** — promete e não entrega.
3. **O que não foi verificado deve dizer que não foi.** Documentação que
   afirma mais do que se sabe custa mais caro que a ausência dela.
