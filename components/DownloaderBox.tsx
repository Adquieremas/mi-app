"use client";

import { useState } from "react";

type Props = {
  lang: string;
  type?: "video" | "mp3";
};

export default function DownloaderBox({ lang, type = "video" }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const translations: Record<string, any> = {
    es: {
      title: type === "mp3" ? "TikTok a MP3" : "Descargador de Videos TikTok",
      subtitle:
        type === "mp3"
          ? "Convierte videos de TikTok a MP3 y descarga audio en segundos."
          : "Descarga videos de TikTok sin marca de agua",
      placeholder: "Pega aquí el enlace de TikTok...",
      button: type === "mp3" ? "DESCARGAR MP3" : "DESCARGAR",
      loading: "Procesando...",
      errorVideo: "No se pudo cargar el video",
      downloadVideo: "Descargar Video",
      downloadAudio: "Descargar Audio (MP3)",
      previewTitle: "Vista previa del video",
      descriptionTitle: "Descripción",
      hashtagsTitle: "Hashtags",
    },
    en: {
      title: type === "mp3" ? "TikTok to MP3" : "TikTok Video Downloader",
      subtitle:
        type === "mp3"
          ? "Convert TikTok videos to MP3 and download audio in seconds."
          : "Download TikTok videos without watermark",
      placeholder: "Paste TikTok link here...",
      button: type === "mp3" ? "DOWNLOAD MP3" : "DOWNLOAD",
      loading: "Processing...",
      errorVideo: "Could not load video",
      downloadVideo: "Download Video",
      downloadAudio: "Download Audio (MP3)",
      previewTitle: "Video preview",
      descriptionTitle: "Description",
      hashtagsTitle: "Hashtags",
    },
    pt: {
      title: type === "mp3" ? "TikTok para MP3" : "Baixar vídeos do TikTok",
      subtitle:
        type === "mp3"
          ? "Converta vídeos do TikTok em MP3 e baixe o áudio em segundos."
          : "Baixe vídeos do TikTok sem marca d’água",
      placeholder: "Cole o link do TikTok aqui...",
      button: type === "mp3" ? "BAIXAR MP3" : "BAIXAR",
      loading: "Processando...",
      errorVideo: "Não foi possível carregar o vídeo",
      downloadVideo: "Baixar Vídeo",
      downloadAudio: "Baixar Áudio (MP3)",
      previewTitle: "Pré-visualização do vídeo",
      descriptionTitle: "Descrição",
      hashtagsTitle: "Hashtags",
    },
  };

  const t = translations[lang] || translations.es;

  const previewVideo = result?.play || result?.video || result?.videoUrl || null;
  const previewImage = result?.cover || result?.thumbnail || result?.image || null;
  const descriptionText =
    result?.description || result?.desc || result?.title || result?.text || "";
  const hashtagList = Array.isArray(result?.hashtags)
    ? result.hashtags
    : typeof result?.hashtags === "string"
    ? result.hashtags.split(" ").filter(Boolean)
    : typeof result?.desc === "string"
    ? result.desc.split(" ").filter((item: string) => item.startsWith("#"))
    : typeof result?.description === "string"
    ? result.description.split(" ").filter((item: string) => item.startsWith("#"))
    : [];

  const handleDownload = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

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
    <section
      style={{
        maxWidth: "900px",
        margin: "0 auto 40px auto",
        textAlign: "center",
        background: "transparent",
        color: "inherit",
      }}
    >
      <h2
        style={{
          fontSize: "48px",
          fontWeight: 800,
          color: "#111",
          marginBottom: "10px",
        }}
      >
        {t.title}
      </h2>

      <p
        style={{
          color: "#333",
          marginBottom: "30px",
        }}
      >
        {t.subtitle}
      </p>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          background: "white",
          padding: "25px",
          borderRadius: "12px",
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
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginBottom: "15px",
            color: "black",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleDownload}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "8px",
            border: "none",
            color: "white",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #6366f1, #ec4899)",
            cursor: "pointer",
          }}
        >
          {loading ? t.loading : t.button}
        </button>

        {result && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            {(previewVideo || previewImage || descriptionText || hashtagList.length > 0) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "14px",
                  textAlign: "left",
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                {(previewVideo || previewImage) && (
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#111",
                        margin: "0 0 10px 0",
                      }}
                    >
                      {t.previewTitle}
                    </p>

                    {previewVideo ? (
                      <video
                        controls
                        playsInline
                        poster={previewImage || undefined}
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          background: "#000",
                          maxHeight: "420px",
                        }}
                      >
                        <source src={previewVideo} />
                        {t.errorVideo}
                      </video>
                    ) : (
                      <img
                        src={previewImage}
                        alt={t.previewTitle}
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                )}

                {descriptionText && (
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#111",
                        margin: "0 0 6px 0",
                      }}
                    >
                      {t.descriptionTitle}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#374151",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        wordBreak: "break-word",
                      }}
                    >
                      {descriptionText}
                    </p>
                  </div>
                )}

                {hashtagList.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#111",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {t.hashtagsTitle}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {hashtagList.map((tag: string, index: number) => (
                        <span
                          key={`${tag}-${index}`}
                          style={{
                            background: "#e0e7ff",
                            color: "#3730a3",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {type !== "mp3" && result?.video && (
              <button
                onClick={() => forceDownload(result.video, "video.mp4")}
                style={{
                  padding: "12px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
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
                  padding: "12px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {t.downloadAudio}
              </button>
            )}

            {result?.error && (
              <p style={{ color: "red", marginTop: "10px" }}>
                {t.errorVideo}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}