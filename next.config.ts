import type { NextConfig } from "next";

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
  "script-src 'self' 'unsafe-inline'",
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

  images: {
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
