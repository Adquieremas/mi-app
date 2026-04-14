"use client";

import { useState, useEffect } from "react";

import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const lang = params?.lang as string;
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const type = "video";

  const translations: any = {
    es: {
      title: "Descargador de Videos TikTok",
      subtitle: "Descarga videos de TikTok sin marca de agua",
      placeholder: "Pega aquí el enlace de TikTok...",
      button: "DESCARGAR",
      loading: "Procesando...",
      errorVideo: "No se pudo cargar el video",
      downloadVideo: "Descargar Video (Sin Marca)",
      downloadAudio: "Descargar Audio (MP3)",
    },
    en: {
      title: "TikTok Video Downloader",
      subtitle: "Download TikTok videos without watermark",
      placeholder: "Paste TikTok link here...",
      button: "DOWNLOAD",
      loading: "Processing...",
      errorVideo: "Could not load video",
      downloadVideo: "Download Video (No Watermark)",
      downloadAudio: "Download Audio (MP3)",
    },
    pt: {
      title: "Baixar vídeos do TikTok",
      subtitle: "Baixe vídeos do TikTok sem marca d’água",
      placeholder: "Cole o link do TikTok aqui...",
      button: "BAIXAR",
      loading: "Processando...",
      errorVideo: "Não foi possível carregar o vídeo",
      downloadVideo: "Baixar Vídeo (Sem Marca)",
      downloadAudio: "Baixar Áudio (MP3)",
    },
  };

  const t = translations[lang] || translations.en;

  const contentByLang: any = {
    es: {
      h2_1: "¿Qué es Clipnexo descargar videos de TikTok sin marca de agua?",
      p1: "Clipnexo es una herramienta online gratuita que te permite descargar videos de TikTok sin marca de agua en alta calidad. Solo necesitas copiar el enlace del video, pegarlo en el campo superior y descargarlo en segundos.",

      h2_2: "¿Cómo descargar videos de TikTok?",
      steps: [
        "Copia el enlace del video desde TikTok",
        "Pégalo en el campo de arriba",
        "Haz clic en descargar",
        "Guarda el video sin marca de agua",
      ],

      h2_3: "Ventajas de usar Clipnexo",
      benefits: [
        "Descarga sin marca de agua",
        "Compatible con celular y PC",
        "No necesitas instalar nada",
        "Rápido y gratis",
      ],

      faqTitle: "Preguntas frecuentes",
      faqs: [
        {
          q: "¿Por qué no puedo descargar el video?",
          a: "Verifica que el enlace sea correcto y que el video sea público.",
        },
        {
          q: "¿Se puede descargar en HD?",
          a: "Sí, siempre que el video original tenga alta calidad.",
        },
        {
          q: "¿Es seguro usar Clipnexo?",
          a: "Sí, no necesitas instalar nada ni registrarte.",
        },
        {
          q: "¿Funciona en celular?",
          a: "Sí, puedes usarlo en Android, iPhone y PC.",
        },
      ],
    },

    en: {
      h2_1: "What is Clipnexo TikTok video downloader without watermark?",
      p1: "Clipnexo is a free online tool that allows you to download TikTok videos without watermark in high quality. Just copy the video link, paste it above, and download it in seconds.",

      h2_2: "How to download TikTok videos?",
      steps: [
        "Copy the TikTok video link",
        "Paste it in the input above",
        "Click download",
        "Save the video without watermark",
      ],

      h2_3: "Benefits of using Clipnexo",
      benefits: [
        "Download without watermark",
        "Compatible with mobile and PC",
        "No installation required",
        "Fast and free",
      ],

      faqTitle: "Frequently asked questions",
      faqs: [
        {
          q: "Why can't I download the video?",
          a: "Make sure the link is correct and the video is public.",
        },
        {
          q: "Can I download in HD?",
          a: "Yes, as long as the original video is high quality.",
        },
        {
          q: "Is Clipnexo safe?",
          a: "Yes, no installation or registration is required.",
        },
        {
          q: "Does it work on mobile?",
          a: "Yes, it works on Android, iPhone and PC.",
        },
      ],
    },

    pt: {
      h2_1: "O que é Clipnexo downloader de vídeos do TikTok sem marca d’água?",
      p1: "Clipnexo é uma ferramenta online gratuita que permite baixar vídeos do TikTok sem marca d’água em alta qualidade. Basta copiar o link do vídeo, colar acima e baixar em segundos.",

      h2_2: "Como baixar vídeos do TikTok?",
      steps: [
        "Copie o link do vídeo do TikTok",
        "Cole no campo acima",
        "Clique em baixar",
        "Salve o vídeo sem marca d’água",
      ],

      h2_3: "Vantagens de usar Clipnexo",
      benefits: [
        "Download sem marca d’água",
        "Compatível com celular e PC",
        "Não precisa instalar nada",
        "Rápido e grátis",
      ],

      faqTitle: "Perguntas frequentes",
      faqs: [
        {
          q: "Por que não consigo baixar o vídeo?",
          a: "Verifique se o link está correto e se o vídeo é público.",
        },
        {
          q: "É possível baixar em HD?",
          a: "Sim, desde que o vídeo original tenha alta qualidade.",
        },
        {
          q: "É seguro usar o Clipnexo?",
          a: "Sim, não é necessário instalar nada nem se registrar.",
        },
        {
          q: "Funciona no celular?",
          a: "Sim, funciona em Android, iPhone e PC.",
        },
      ],
    },
  };

  const c = contentByLang[lang] || contentByLang.en;

  const handleDownload = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, type }),
    });

    try {
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "Error procesando respuesta" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result?.embed) {
      const existingScript = document.querySelector(
        'script[src="https://www.tiktok.com/embed.js"]'
      );

      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;

      document.body.appendChild(script);
    }
  }, [result]);

  const forceDownload = async (fileUrl: string, filename: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Error al descargar el archivo");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #4f46e5, #ec4899)",
        padding: "40px 0 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        body { margin: 0; }
      `}</style>
      {/* HEADER */}
      <div style={{ textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "800", textAlign: "center" }}>
          {t.title}
        </h1>
        <p style={{ marginTop: 10 }}>
          {t.subtitle}
        </p>
      </div>

      {/* CARD */}
      <div
        style={{
          maxWidth: 500,
          margin: "40px auto",
          background: "white",
          padding: 25,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <input
          type="text"
          placeholder={t.placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: 15,
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 15,
            color: "black",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleDownload}
          style={{
            width: "100%",
            padding: 15,
            borderRadius: 8,
            border: "none",
            color: "white",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #6366f1, #ec4899)",
            cursor: "pointer",
          }}
        >
          {t.button}
        </button>

        {loading && (
          <p style={{ marginTop: 15, textAlign: "center" }}>
            {t.loading}
          </p>
        )}
      </div>

      {/* RESULTADO */}
      {result && (
        <div
          style={{
            maxWidth: 900,
            margin: "40px auto",
            background: "white",
            padding: 25,
            borderRadius: 12,
            display: "flex",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* VIDEO */}
          <div style={{ flex: 1 }}>
            {result?.video ? (
              <video
                src={result.video}
                controls
                style={{ width: "100%", borderRadius: 10 }}
              />
            ) : (
              <p style={{ color: "black" }}>{t.errorVideo}</p>
            )}
          </div>

          {/* INFO + BOTONES */}
          <div style={{ flex: 1 }}>
            {result?.raw?.title && (
              <p style={{ color: "black", fontWeight: "bold", marginBottom: 10 }}>
                {result.raw.title}
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result?.video && (
                <button
                  onClick={() => forceDownload(result.video, "video.mp4")}
                  style={{
                    padding: 12,
                    background: "#2563eb",
                    color: "white",
                    textAlign: "center",
                    borderRadius: 8,
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {t.downloadVideo}
                </button>
              )}

              {result?.audio && (
                <button
                  onClick={() => forceDownload(result.audio, "audio.mp3")}
                  style={{
                    padding: 12,
                    background: "#16a34a",
                    color: "white",
                    textAlign: "center",
                    borderRadius: 8,
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {t.downloadAudio}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* CONTENIDO SEO */}
      <div style={{
        maxWidth: 900,
        margin: "40px auto",
        background: "white",
        padding: 25,
        borderRadius: 12,
        color: "black",
        lineHeight: 1.6
      }}>
        <h2 style={{ fontSize: "30px", fontWeight: "700", marginTop: 20 }}>
          {c.h2_1}
        </h2>
        <p>{c.p1}</p>

        <h2 style={{ fontSize: "30px", fontWeight: "700", marginTop: 20 }}>
          {c.h2_2}
        </h2>
        <ol>
          {c.steps.map((step: string, i: number) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        <h2 style={{ fontSize: "30px", fontWeight: "700", marginTop: 20 }}>
          {c.h2_3}
        </h2>
        <ul>
          {c.benefits.map((b: string, i: number) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 900, margin: "40px auto" }}>
        <h2 style={{ color: "white", textAlign: "center", fontSize: "32px", fontWeight: "800" }}>
          {c.faqTitle}
        </h2>

        {c.faqs.map((item: any, i: number) => (
          <details key={i} style={{
            background: "white",
            padding: 15,
            borderRadius: 8,
            marginBottom: 10
          }}>
            <summary style={{ fontWeight: "bold", cursor: "pointer", color: "black", fontSize: "16px" }}>
              {item.q}
            </summary>
            <p style={{ marginTop: 10, color: "black" }}>{item.a}</p>
          </details>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{
        background: "#000",
        color: "white",
        padding: "30px 0",
        marginTop: "auto",
        width: "100%",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <h3>Clipnexo</h3>
          <p>Descargador de videos de TikTok sin marca de agua.</p>

          <p style={{ marginTop: 10 }}>
            Contacto: Hola@clipnexo.com
          </p>

          <div style={{ marginTop: 20, fontSize: 12, opacity: 0.7 }}>
            © 2026 Clipnexo. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}