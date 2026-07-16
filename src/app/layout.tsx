import "@/styles/globals.css";
import "@/styles/transition.css";

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider }
from "@/components/providers/theme-provider";
import { UniverseProvider } from "@/components/providers/universe-provider";
import { UniverseTransitionProvider } from "@/components/providers/universe-transition";
import { Geist, Bangers, Archivo_Black, Nabla, Monoton, Rubik_Glitch, Bungee_Shade } from "next/font/google";
import { cn } from "@/lib/utils";
import { getRealmSettings } from "@/lib/repos/realms";
import { getSiteConfig } from "@/lib/repos/site-config";
import { SiteConfigProvider } from "@/components/providers/site-config-provider";
import { AdminFab } from "@/components/layout/admin-fab";

const SITE_URL = "https://portifolio2026-two.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  const ogTitle = site.ogTitle ?? `${site.name} — ${site.title}`;
  const ogDescription = site.ogDescription ?? site.description;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.name} — ${site.title}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    keywords: ["Lucas Riboldi", "Product Designer", "Developer", "Design System", "Portfólio", "Game Design"],
    authors: [{ name: site.name, url: site.github }],
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: SITE_URL,
      siteName: `${site.name} · Portfólio 2026`,
      title: ogTitle,
      description: ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const archivo = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heavy',
});

// Fontes experimentais ("adversas") — usadas na ala Lab/Anomalias
const nabla = Nabla({ subsets: ['latin'], variable: '--font-nabla' });        // cromática COLRv1
const monoton = Monoton({ weight: '400', subsets: ['latin'], variable: '--font-monoton' });   // neon retrô
const rubikGlitch = Rubik_Glitch({ weight: '400', subsets: ['latin'], variable: '--font-glitch' });
const bungeeShade = Bungee_Shade({ weight: '400', subsets: ['latin'], variable: '--font-shade' });


export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Config dos realms + do site controladas pelo admin.
  const [settings, site] = await Promise.all([getRealmSettings(), getSiteConfig()]);

  // Script de gate + anti-FOUC (roda antes do paint).
  // Pinta data-realm pela rota nova (/desenvolvedor, /anfitriao, senão creative)
  // e, só na porta da frente "/", roteia: sem a chave → /portal; com a chave → /criativo.
  const antiFouc =
    "(function(){try{var p=location.pathname," +
    "r=p.indexOf('/desenvolvedor')===0?'developer':p.indexOf('/anfitriao')===0?'arcane':'creative';" +
    "document.documentElement.setAttribute('data-realm',r);" +
    "if(p==='/'){var e=false;try{e=localStorage.getItem('lr.portal.v1')==='1';}catch(x){}" +
    "location.replace(e?'/criativo':'/portal');}}catch(e){}})()";

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning className={cn("font-sans", geist.variable, bangers.variable, archivo.variable, nabla.variable, monoton.variable, rubikGlitch.variable, bungeeShade.variable)}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: antiFouc }} />
        <ThemeProvider>
          <SiteConfigProvider value={site}>
            <UniverseProvider settings={settings}>
              <UniverseTransitionProvider>{children}</UniverseTransitionProvider>
            </UniverseProvider>
          </SiteConfigProvider>
        </ThemeProvider>
        <AdminFab />
        <Analytics />
      </body>
    </html>
  );
}
