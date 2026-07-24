import "@/styles/globals.css";
import "@/styles/transition.css";

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider }
from "@/components/providers/theme-provider";
import { UniverseProvider } from "@/components/providers/universe-provider";
import { UniverseTransitionProvider } from "@/components/providers/universe-transition";
import {
  Geist,
  Bangers,
  Archivo_Black,
  Nabla,
  Monoton,
  Rubik_Glitch,
  Bungee_Shade,
  Anton,
  Bebas_Neue,
  Oswald,
  Inter,
  Rubik_Wet_Paint,
  Rubik_Distressed,
  Pixelify_Sans,
  Cinzel,
  Caveat_Brush,
  UnifrakturCook,
  Old_Standard_TT,
  Special_Elite,
} from "next/font/google";
import { cn } from "@/lib/utils";
import { getRealmSettings } from "@/lib/repos/realms";
import { getSiteConfig } from "@/lib/repos/site-config";
import { SiteConfigProvider } from "@/components/providers/site-config-provider";
import { REALMS } from "@/lib/realms";

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
    manifest: "/favicon/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon/favicon.ico", sizes: "any" },
        { url: "/favicon/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    },
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

// Tipografia da landing Comic 2026 (/criativo): manchete, kicker, subtítulo e corpo.
const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-anton' });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-bebas' });
const oswald = Oswald({ subsets: ['latin'], display: 'swap', variable: '--font-oswald' });
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

// Fontes do catálogo Comic FX (/design-system, seção Typography): letras que o
// CSS não replica — gotejamento de tinta e letra rachada. Da superfamília Rubik.
const rubikWetPaint = Rubik_Wet_Paint({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-drip' });
const rubikDistressed = Rubik_Distressed({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-cracked' });
// Pixel 8-bit (portal pixelado) e serifa de ouro (luxo/geometria sacra).
const pixelify = Pixelify_Sans({ weight: '700', subsets: ['latin'], display: 'swap', variable: '--font-pixel' });
const cinzel = Cinzel({ weight: '700', subsets: ['latin'], display: 'swap', variable: '--font-gold' });
// Pincel de rua (graffiti/brush) — para o traço bruto e o graffiti com coroa.
const caveatBrush = Caveat_Brush({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-brush' });

// Trio do jornal antigo (realm Anfitrião · Daily Prophet). São webfonts reais
// para o nameplate blackletter, o corpo old-style e a máquina de escrever não
// dependerem de fontes de sistema (Iowan/Playbill) que faltam na maioria das
// máquinas — sem elas a folha caía numa serifa genérica.
const unifraktur = UnifrakturCook({ weight: '700', subsets: ['latin'], display: 'swap', variable: '--font-fraktur' });
const oldStandard = Old_Standard_TT({ weight: ['400', '700'], style: ['normal', 'italic'], subsets: ['latin'], display: 'swap', variable: '--font-oldstyle' });
const specialElite = Special_Elite({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-typewriter' });


export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Config dos realms + do site controladas pelo admin.
  const [settings, site] = await Promise.all([getRealmSettings(), getSiteConfig()]);

  // Script de gate + anti-FOUC (roda antes do paint).
  // Lê as rotas do registry REALMS, pinta data-realm na <html>, redireciona "/" para o portal.
  const routeChecks = Object.entries(REALMS)
    .map(([_, realm]) => `if(p.indexOf('${realm.route}')===0)r='${realm.id}';`)
    .join("");

  const antiFouc =
    "(function(){try{var p=location.pathname,r='creative';" +
    routeChecks +
    "document.documentElement.setAttribute('data-realm',r);" +
    "if(p==='/'){location.replace('/portal');}}catch(e){}})()";

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning className={cn("font-sans", geist.variable, bangers.variable, archivo.variable, nabla.variable, monoton.variable, rubikGlitch.variable, bungeeShade.variable, anton.variable, bebas.variable, oswald.variable, inter.variable, rubikWetPaint.variable, rubikDistressed.variable, pixelify.variable, cinzel.variable, caveatBrush.variable, unifraktur.variable, oldStandard.variable, specialElite.variable)}
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
        <Analytics />
      </body>
    </html>
  );
}
