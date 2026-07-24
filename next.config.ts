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
  isDev && "'unsafe-eval'",
  isDev && "https://va.vercel-scripts.com",
]
  .filter(Boolean)
  .join(" ");

/**
 * Content-Security-Policy — permissiva o suficiente para o Next App Router
 * (scripts/estilos inline de hidratação), Vercel Analytics e Supabase
 * (REST + realtime via wss), mas bloqueando origens externas de script.
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
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com",
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

  // Fixa a raiz do workspace neste projeto. Sem isto o Next detecta o
  // package-lock.json órfão em C:\Users\lucas e infere a raiz errada,
  // emitindo o warning de "multiple lockfiles" a cada boot.
  outputFileTracingRoot: import.meta.dirname,

  experimental: {
    serverActions: {
      // O upload de mídia passa por Server Action e o teto do arquivo é 5 MB
      // (ver lib/admin/media-validate). O default de 1 MB rejeitaria imagens
      // legítimas antes da nossa validação rodar; a folga cobre o overhead do
      // multipart. Quem barra de fato é o validador, não este limite.
      bodySizeLimit: "6mb",
    },
  },

  images: {
    // AVIF primeiro, WebP como rede de segurança. O default do Next é só
    // WebP; as cartas já são AVIF na origem, e sem isto o otimizador as
    // reencodava para WebP — maior que o arquivo que entrou.
    formats: ["image/avif", "image/webp"],

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
