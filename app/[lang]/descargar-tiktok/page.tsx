import { getDictionary } from "@/lib/dictionary";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    lang: string;
  }>;
};

export async function generateMetadata({ params }: any) {
  const { lang } = await params;

  const currentLang = ["es", "en", "pt"].includes(lang) ? lang : "es";

  const dict = getDictionary(currentLang);
  const t = (dict as any).descargarTikTok;

  return {
    title: t.title,
    description: t.intro,
  };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const currentLang = ["es", "en", "pt"].includes(lang) ? lang : "es";

  const dict = getDictionary(currentLang);
  const t = (dict as any).descargarTikTok;

  if (!t) {
    return null;
  }

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{t.title}</h1>
      <p>{t.intro}</p>

      <h2>{t.stepsTitle}</h2>
      <ol>
        {t.steps.map((step: string, i: number) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <h2>{t.benefitsTitle}</h2>
      <ul>
        {t.benefits.map((b: string, i: number) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      {t.extraTitle && (
        <>
          <h2>{t.extraTitle}</h2>
          <p>{t.extraContent}</p>
        </>
      )}

      <h2>{t.faqTitle}</h2>
      {t.faq.map((item: { q: string; a: string }, i: number) => (
        <div key={i}>
          <h3>{item.q}</h3>
          <p>{item.a}</p>
        </div>
      ))}

      <hr style={{ margin: "40px 0" }} />

      <h2>Más herramientas TikTok</h2>

      <ul>
        <li>
          <a href={`/${lang}/descargar-tiktok-mp3`}>
            Convertir TikTok a MP3
          </a>
        </li>
        <li>
          <a href={`/${lang}/descargar-tiktok-sin-marca`}>
            Descargar TikTok sin marca de agua
          </a>
        </li>
      </ul>
    </main>
  );
}