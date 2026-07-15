import "@/styles/globals.css";

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider }
from "@/components/providers/theme-provider";
import { UniverseProvider } from "@/components/providers/universe-provider";
import { Geist, Bangers, Archivo_Black, Nabla, Monoton, Rubik_Glitch, Bungee_Shade } from "next/font/google";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/constants/site";
import { getRealmSettings } from "@/lib/repos/realms";

const SITE_URL = "https://portifolio2026-two.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Lucas Riboldi", "Product Designer", "Developer", "Design System", "Portfólio", "Aranhaverso"],
  authors: [{ name: siteConfig.name, url: siteConfig.github }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: `${siteConfig.name} · Portfólio 2026`,
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
  },
};

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
  // Config dos realms controlada pelo admin (default + habilitados).
  const settings = await getRealmSettings();
  const enabledJson = JSON.stringify(settings.enabled);

  // Script anti-FOUC: pinta data-realm antes da hidratação, respeitando o
  // default e os realms habilitados vindos do banco (injetados pelo server).
  const antiFouc =
    "(function(){try{var EN=" + enabledJson + ",DEF='" + settings.defaultRealm + "';" +
    "var r=localStorage.getItem('realm');" +
    "if(!r){r=localStorage.getItem('vibe')==='sober'?'developer':DEF;}" +
    "if(EN.indexOf(r)<0)r=DEF;" +
    "var d=document.documentElement;d.setAttribute('data-realm',r);" +
    "if(r==='developer')d.classList.add('sober');}catch(e){}})()";

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning className={cn("font-sans", geist.variable, bangers.variable, archivo.variable, nabla.variable, monoton.variable, rubikGlitch.variable, bungeeShade.variable)}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: antiFouc }} />
        <ThemeProvider>
          <UniverseProvider settings={settings}>{children}</UniverseProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
