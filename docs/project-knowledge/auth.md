# Autenticação e autorização

---

## 1. Modelo

**Um único administrador.** Não há cadastro, não há papéis, não há senha. O
acesso é por GitHub OAuth, e apenas a conta declarada em `ADMIN_GITHUB_LOGIN`
recebe sessão.

Isso é mais restritivo que o arranjo anterior (Supabase), onde qualquer conta
GitHub obtinha sessão e o `/admin` era barrado depois. Aqui, **quem não está na
allowlist não recebe cookie nenhum.**

---

## 2. Fluxo de login

```
1. Browser    signInWithPopup(GitHub)          → ID token do Firebase
2. Browser    POST /auth/session { idToken }
3. Servidor   verifyIdToken(idToken, true)
4. Servidor   getUser(uid) → providerData[github.com].uid  (id NUMÉRICO)
5. Servidor   GitHub API /user/{id}            → username
6. Servidor   username === ADMIN_GITHUB_LOGIN ?  senão 403
7. Servidor   setCustomUserClaims { admin, githubLogin }
8. Servidor   createSessionCookie → cookie httpOnly, 5 dias
9. Browser    router.push('/admin')
```

### Por que a consulta à API do GitHub

O Firebase **não propaga o username do GitHub** para o ID token — guarda apenas
o id numérico do provider. O username é o que a allowlist compara, então
resolvemos uma vez, na criação da sessão, e gravamos como custom claim.

**Nada vindo do cliente é usado nessa decisão.** O username poderia ter sido
enviado pelo browser, mas seria forjável.

Efeito colateral bom: o id numérico é imutável. Se a conta for renomeada no
GitHub, a identidade continua a mesma — o que o arranjo anterior, baseado só no
username, não garantia.

`GITHUB_TOKEN` é opcional e só eleva o rate limit (60/h → 5000/h) dessa
consulta, feita uma vez por login.

---

## 3. Sessão

Cookie `__session`, httpOnly, `sameSite: lax`, `secure` em produção, 5 dias.

Assinado e verificado pelo Admin SDK (`createSessionCookie` /
`verifySessionCookie`). O `signOut` também revoga os refresh tokens.

### Por que cookie e não o token do SDK

O Firebase Auth é client-first: guarda o ID token em IndexedDB, invisível para o
servidor. Server Components e Server Actions precisam de um cookie. O caminho
oficial é trocar o ID token (curto, 1h) por um session cookie (longo, httpOnly).
É o equivalente ao que o `@supabase/ssr` fazia por baixo dos panos.

### Por que as claims são lidas do registro, não do cookie

`verifySession()` valida o cookie, obtém o `uid` e então lê `customClaims` do
**registro do usuário**. Claims gravadas depois da emissão de um token só
apareceriam nele na renovação seguinte — até 1h de atraso.

Custa uma chamada ao Admin SDK por request autenticado. Num painel de um usuário
só, é aceitável e sempre correto.

---

## 4. Camadas de proteção

| Camada | Onde | O que faz |
|---|---|---|
| Middleware | `src/middleware.ts` | Só checa **presença** do cookie. Filtro barato. |
| `requireAdmin()` | topo de cada página/action do `/admin` | **A autorização real.** |
| Firestore Rules | `firestore.rules` | Nega escrita de cliente; a app não passa por elas. |

### Por que o middleware não valida

Ele roda no **Edge Runtime**, onde o Firebase Admin SDK não existe — não há como
verificar a assinatura do cookie ali.

Isso é seguro porque a verificação nunca esteve nele: `requireAdmin()` já era
chamado em toda Server Action. Um cookie forjado passa pelo middleware e morre
no `requireAdmin()`, com redirect para `/login`.

**Consequência prática:** se você criar uma rota nova sob `/admin`, o middleware
não a protege de verdade. Chame `requireAdmin()`.

---

## 5. Security Rules — o que elas realmente fazem

Nenhum cliente lê o Firestore neste projeto. As regras guardam uma porta que o
app não usa, para que ela não fique aberta.

| Padrão | Regra |
|---|---|
| Conteúdo com `published` | leitura se `published == true` ou admin |
| Conteúdo sem flag (`skills`, `tools`, `site_config`, `realms`, …) | leitura livre |
| `prophet_wire_news` | leitura se `status == 'publicado'` ou admin |
| `contact_messages`, `prophet_wire_runs` | só admin |
| **Escrita, em tudo** | **negada** |

### Diferenças herdadas da RLS

1. **A RLS filtrava linha a linha de forma transparente**: um `select *`
   devolvia só o permitido. No Firestore, uma query que peça documentos não
   permitidos é **rejeitada inteira**.
2. **`is_admin()` consultava uma tabela a cada query**; o custom claim é gravado
   no login e propaga na renovação do token.
3. **`messages_public_insert`** permitia insert anônimo. Agora o cupom público
   do jornal é uma Server Action que valida antes de gravar — continua sendo a
   única porta, e com validação melhor.

---

## 6. Configuração externa necessária

No console do Firebase:

1. **Authentication → provedor GitHub** habilitado, com Client ID e Secret.
2. **OAuth App no GitHub** com *Authorization callback URL* exatamente
   `https://<projeto>.firebaseapp.com/__/auth/handler`.
3. **Authorized domains** incluindo o domínio de produção — ver 6.1.

> Armadilha real, já vivida: reaproveitar o OAuth App da era Supabase deixa o
> callback apontando para `*.supabase.co`. O GitHub reconhece o app (a tela de
> login aparece) mas recusa o redirect **depois** do login — e a validação não
> acontece antes, então testar deslogado não detecta o problema.

### 6.1 `auth/unauthorized-domain` — e por que login não funciona em preview

O `signInWithPopup` só abre em origens que estejam na allowlist de
**Authentication → Settings → Authorized domains**. Fora dela, o SDK recusa
antes de qualquer ida ao GitHub, com `Firebase: Error (auth/unauthorized-domain)`.

A lista padrão traz apenas `localhost`, `<projeto>.firebaseapp.com` e
`<projeto>.web.app`. **O domínio da Vercel não entra sozinho** — tem de ser
acrescentado à mão no console. Não há caminho por CLI, por Admin SDK nem pelo
MCP do Firebase; a lista não é exposta por API pública.

**Vivido em 01/08/2026:** o login funcionava em `localhost` desde 31/07 e falhava
em produção. Isso confunde justamente porque parece bug de deploy — não é. É a
única peça da cadeia de auth que mora fora do repositório e não aparece em
nenhum arquivo de configuração. Se o login quebra só no ambiente hospedado e a
mensagem cita domínio, comece por aqui.

**Consequência estrutural:** cada deploy de preview da Vercel recebe uma URL
com hash único (`<projeto>-git-<branch>-<hash>.vercel.app`). Não há curinga na
allowlist do Firebase, então não dá para pré-autorizar cada preview
individualmente.

**Resolvido em 27/08/2026** com a saída que este documento já apontava: branch
fixa `preview` + alias estável na Vercel
(`portifolio2026-preview-lucasriboldis-projects.vercel.app`, reatribuído a cada
novo deploy manual com `vercel alias set`) + esse alias autorizado uma única
vez em Authentication → Settings → Authorized domains. Login e upload de
mídia validados fim a fim contra esse domínio no mesmo dia — ver
`PROJECT_STATE.md` §5.

**O que persiste:** o webhook Git→Vercel não dispara deploy automático para a
branch `preview` (investigar no dashboard); por ora o deploy dessa branch é
manual (`vercel deploy` + `vercel alias set`, comando completo no
`NEXT_STEPS.md` item 8 do histórico). Continua sem caminho por CLI, Admin SDK
ou MCP do Firebase para autorizar domínios — a autorização em si é sempre
manual, uma vez por domínio.

---

## 7. CSP

O popup do Firebase carrega o `gapi`. O `next.config.ts` precisa liberar:

- `script-src https://apis.google.com`
- `frame-src https://apis.google.com` + domínio de auth
- `connect-src identitytoolkit.googleapis.com securetoken.googleapis.com`

Sem isso o popup falha com `auth/internal-error` — mensagem que não menciona CSP
em momento nenhum.
