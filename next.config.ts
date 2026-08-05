import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * `next dev` compila com devtool baseado em eval (HMR + source maps). Sem
 * 'unsafe-eval' o bundle lança EvalError, a hidratação nunca acontece e a
 * aplicação fica inerte — HTML renderizado, nada clicável. Só em dev:
 * produção continua sem eval.
 *
 * O va.vercel-scripts.com também é dev-only: em produção a Vercel serve o
 * script de analytics do próprio domínio (/_vercel/insights), coberto por 'self'.
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  // O Firebase Auth carrega o gapi para montar o iframe do popup de OAuth.
  // Sem esta origem o popup abre e morre com `auth/internal-error` — que não
  // diz nada sobre CSP, e por isso custa caro de diagnosticar.
  "https://apis.google.com",
  isDev && "'unsafe-eval'",
  isDev && "https://va.vercel-scripts.com",
]
  .filter(Boolean)
  .join(" ");

/** Domínio que o Firebase usa para hospedar o handler do OAuth. */
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "";

/**
 * Content-Security-Policy — permissiva o suficiente para o Next App Router
 * (scripts/estilos inline de hidratação), Vercel Analytics e o login do
 * Firebase, mas bloqueando origens externas de script.
 *
 * O login exige três aberturas, todas por causa do popup de OAuth:
 *  - `script-src https://apis.google.com` — o gapi que monta o iframe;
 *  - `frame-src` do domínio de auth e do apis.google.com — onde o popup vive;
 *  - `connect-src` do identitytoolkit e do securetoken — as chamadas da API.
 * Sem elas o popup falha como `auth/internal-error`, mensagem que não menciona
 * CSP em momento nenhum.
 *
 * Nota: 'unsafe-inline' em script-src é o compromisso de um CSP por header
 * (sem nonce por-request). Um CSP estrito por nonce exigiria middleware em
 * todas as rotas — evoluir depois se necessário.
 */
const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    "https://identitytoolkit.googleapis.com",
    "https://securetoken.googleapis.com",
    "https://vitals.vercel-insights.com",
    "https://va.vercel-scripts.com",
  ].join(" "),
  ["frame-src 'self'", "https://apis.google.com", authDomain && `https://${authDomain}`]
    .filter(Boolean)
    .join(" "),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * O Admin SDK fica FORA do bundle do servidor.
   *
   * `firebase-admin` é CommonJS mas arrasta dependências que são ESM puro.
   * Quando o empacotador serverless o inclui, o resultado tenta `require()`
   * nessas dependências e o runtime lança
   * `Error: require() of ES Module /var/task/node_modules/...`.
   *
   * Isso não aparece em `next dev` nem em `next build` local — o Node resolve
   * os dois formatos sem ajuda. Só quebra no empacotamento da Vercel, e só na
   * primeira rota dinâmica que toca o SDK (`/login`); as demais páginas são
   * pré-renderizadas no build e nunca chegam a executá-lo em runtime.
   *
   * Declarar como externo faz o Next deixá-lo em node_modules e carregá-lo
   * pelo resolvedor do Node, que sabe lidar com a mistura.
   *
   * ATENÇÃO: isto sozinho NÃO resolveu o 500 do `/login` (31/07/2026). O
   * culpado real era `jwks-rsa@4.1.0`, dependência do Admin SDK: ele é
   * `type: commonjs` e faz `require('jose')` na primeira linha de
   * `src/utils.js`, mas declara `jose: ^6.1.3` — e o jose 6 é ESM puro (sem
   * condição `require` no mapa de exports). O pacote é internamente
   * inconsistente.
   *
   * Localmente passa porque o Node 22+ suporta `require()` de ESM nativamente;
   * na Vercel a função é empacotada e carregada pelo shim do bundler
   * (`/opt/rust/nodejs.js` no stack trace), que não implementa esse suporte.
   * A diferença é de carregador de módulos, não de código.
   *
   * A correção está no `overrides` do package.json, que prende o jose do
   * jwks-rsa na v5 — a última com build CommonJS. Se algum dia o jwks-rsa
   * corrigir o próprio require, esse override pode sair.
   */
  serverExternalPackages: ["firebase-admin"],

  // Fixa a raiz do workspace neste projeto. Sem isto o Next detecta o
  // package-lock.json órfão em C:\Users\lucas e infere a raiz errada,
  // emitindo o warning de "multiple lockfiles" a cada boot.
  outputFileTracingRoot: import.meta.dirname,

  experimental: {
    serverActions: {
      // ATENÇÃO: este número NÃO é o teto real de upload, e acreditar que era
      // custou um bug. Quem corta primeiro é a PLATAFORMA, em ~4,5 MB, antes
      // do Next ver o request — medido em produção em 04/08/2026:
      //
      //     corpo de 4 MB → chega ao nosso código
      //     corpo de 6 MB → 413 FUNCTION_PAYLOAD_TOO_LARGE
      //
      // O teto que vale para o roteamento é `SERVER_ACTION_LIMIT`, em
      // lib/admin/media-accept: acima dele o arquivo vai direto ao Blob por
      // api/admin/blob-upload, sem passar pelo corpo da action. **Subir este
      // valor não aumenta o que sobe** — só afrouxa uma segunda barreira que
      // nunca é a primeira a fechar.
      //
      // Fica em 26mb porque o default de 1 MB rejeitaria arquivo legítimo
      // antes da nossa validação rodar, e a folga cobre o overhead do
      // multipart. Quem barra de fato é o validador.
      bodySizeLimit: "26mb",
    },
  },

  images: {
    // AVIF primeiro, WebP como rede de segurança. O default do Next é só
    // WebP; as cartas já são AVIF na origem, e sem isto o otimizador as
    // reencodava para WebP — maior que o arquivo que entrou.
    formats: ["image/avif", "image/webp"],

    // As galerias de cartas pedem `quality={60}` (são dezenas de imagens
    // hi-res; a 75 o peso da página duplicava sem diferença visível no foil).
    // A partir do Next 16 uma qualidade não declarada aqui é recusada, e até lá
    // cada imagem emite um aviso — eram 122 numa visita à página /cards.
    qualities: [60, 75],

    // As capas da landing /criativo são SVG gerados por `scripts/generate-covers`
    // e o otimizador recusa SVG sem este consentimento explícito. O risco que a
    // flag sinaliza é servir SVG de terceiros (podem trazer script embutido);
    // aqui a única origem de SVG é o próprio repositório — o upload do /admin
    // aceita apenas png/jpg/gif/webp/avif (ver `lib/admin/media-validate`).
    //
    // As duas linhas seguintes são a mitigação recomendada e não são opcionais:
    // o CSP neutraliza qualquer script dentro do ficheiro e o
    // `contentDispositionType` impede que um SVG servido pelo otimizador seja
    // renderizado como documento na própria origem.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      { source: "/dev", destination: "/desenvolvedor", permanent: true },
      { source: "/dev/:path*", destination: "/desenvolvedor/:path*", permanent: true },
      { source: "/prophet", destination: "/anfitriao", permanent: true },
      { source: "/prophet/:path*", destination: "/anfitriao/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
