import type { Metadata } from "next";
import { ReactNode } from "react";

const seoByLang: Record<string, Metadata> = {
  es: {
    title: "Descargar videos de TikTok sin marca de agua | Clipnexo",
    description:
      "Descarga videos de TikTok sin marca de agua y audios MP3 gratis. Rápido, online y compatible con celular y PC.",
  },
  en: {
    title: "Download TikTok videos without watermark | Clipnexo",
    description:
      "Download TikTok videos without watermark and MP3 audio for free. Fast, online, and compatible with mobile and PC.",
  },
  pt: {
    title: "Baixar vídeos do TikTok sem marca d'água | Clipnexo",
    description:
      "Baixe vídeos do TikTok sem marca d’água e áudio MP3 grátis. Rápido, online e compatível com celular e PC.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const currentLang = ["es", "en", "pt"].includes(lang) ? lang : "es";
  const seo = seoByLang[currentLang];

  return {
    metadataBase: new URL("https://clipnexo.com"),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `/${currentLang}`,
      languages: {
        "es-PE": "/es",
        "en-US": "/en",
        "pt-BR": "/pt",
        "x-default": "/es",
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const currentLang = ["es", "en", "pt"].includes(lang) ? lang : "es";

  return <section lang={currentLang}>{children}</section>;
}