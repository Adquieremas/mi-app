"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  lang: string;
  type?: "video" | "mp3";
};

export default function DownloaderBox({ lang, type = "video" }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info">("info");
  const [isMobile, setIsMobile] = useState(false);

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
      paste: "Pegar enlace",
      clear: "Limpiar",
      success: "Video encontrado correctamente. Ya puedes descargarlo.",
      emptyTitle: type === "mp3" ? "Convierte TikTok a MP3 en segundos" : "Descarga videos de TikTok en segundos",
      emptyText:
        type === "mp3"
          ? "Pega el enlace de TikTok, procesa el contenido y descarga el audio listo para tu celular o PC."
          : "Pega el enlace de TikTok para ver la vista previa, los metadatos del video y los botones de descarga.",
      guideCta: "¿No sabes cómo usar Clipnexo? Mira la guía paso a paso aquí.",
      invalidUrl: "Pega un enlace válido de TikTok.",
      clipboardError: "No se pudo pegar desde el portapapeles.",
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
      paste: "Paste link",
      clear: "Clear",
      success: "Video found successfully. You can download it now.",
      emptyTitle: type === "mp3" ? "Convert TikTok to MP3 in seconds" : "Download TikTok videos in seconds",
      emptyText:
        type === "mp3"
          ? "Paste the TikTok link, process the content, and download the audio ready for your phone or PC."
          : "Paste the TikTok link to view the preview, video metadata, and download buttons.",
      guideCta: "Not sure how to use Clipnexo? View the step-by-step guide here.",
      invalidUrl: "Paste a valid TikTok link.",
      clipboardError: "Could not paste from clipboard.",
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
      paste: "Colar link",
      clear: "Limpar",
      success: "Vídeo encontrado com sucesso. Agora você pode baixá-lo.",
      emptyTitle: type === "mp3" ? "Converta TikTok para MP3 em segundos" : "Baixe vídeos do TikTok em segundos",
      emptyText:
        type === "mp3"
          ? "Cole o link do TikTok, processe o conteúdo e baixe o áudio pronto para o celular ou PC."
          : "Cole o link do TikTok para ver a prévia, os metadados do vídeo e os botões de download.",
      guideCta: "Não sabe como usar o Clipnexo? Veja o guia passo a passo aqui.",
      invalidUrl: "Cole um link válido do TikTok.",
      clipboardError: "Não foi possível colar da área de transferência.",
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

  const hasResultContent = Boolean(result && (previewVideo || previewImage || descriptionText || hashtagList.length > 0 || result?.video || result?.audio));

  const statusStyles = useMemo(
    () => ({
      success: {
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
        color: "#065f46",
      },
      error: {
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#991b1b",
      },
      info: {
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        color: "#1d4ed8",
      },
    }),
    []
  );

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setStatusType("info");
        setStatusMessage("");
      }
    } catch (error) {
      setStatusType("error");
      setStatusMessage(t.clipboardError);
    }
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setStatusMessage("");
    setStatusType("info");
  };

  const handleDownload = async () => {
    if (!url.trim() || !url.includes("tiktok.com")) {
      setStatusType("error");
      setStatusMessage(t.invalidUrl);
      return;
    }

    setLoading(true);
    setResult(null);
    setStatusMessage("");
    setStatusType("info");

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

      if (data?.error) {
        setStatusType("error");
        setStatusMessage(t.errorVideo);
      } else {
        setStatusType("success");
        setStatusMessage(t.success);
      }
    } catch (error) {
      setResult({ error: true });
      setStatusType("error");
      setStatusMessage(t.errorVideo);
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
        maxWidth: "1040px",
        margin: "0 auto 40px auto",
        textAlign: "center",
        background: "transparent",
        color: "inherit",
      }}
    >

      <div
        style={{
          maxWidth: hasResultContent ? "1040px" : "640px",
          margin: "0 auto",
          background: "white",
          padding: isMobile ? "16px" : "25px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          transition: "max-width 0.25s ease",
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

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handlePaste}
            style={{
              flex: "1 1 160px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#111",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.paste}
          </button>

          <button
            type="button"
            onClick={handleClear}
            style={{
              flex: "1 1 160px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#111",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.clear}
          </button>
        </div>

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

        {statusMessage && (
          <div
            style={{
              marginTop: "14px",
              borderRadius: "10px",
              padding: "12px 14px",
              fontSize: "14px",
              fontWeight: 600,
              textAlign: "left",
              ...statusStyles[statusType],
            }}
          >
            {statusMessage}
          </div>
        )}

        {!loading && !result && (
          <div
            style={{
              marginTop: "16px",
              textAlign: "left",
              border: "1px dashed #cbd5e1",
              background: "#f8fafc",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <p
              style={{
                margin: "0 0 6px 0",
                fontSize: "15px",
                fontWeight: 700,
                color: "#111",
              }}
            >
              {t.emptyTitle}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#475569",
              }}
            >
              {t.emptyText}
            </p>
            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              <a
                href={`/${lang}/como-descargar-videos-de-tiktok`}
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {t.guideCta}
              </a>
            </p>
          </div>
        )}

        {result && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            {hasResultContent && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : hasResultContent ? "minmax(0, 1.1fr) minmax(280px, 0.9fr)" : "1fr",
                  gap: isMobile ? "14px" : "16px",
                  textAlign: "left",
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div>
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
                            maxHeight: isMobile ? "360px" : "420px",
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
                            maxHeight: isMobile ? "360px" : "420px",
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    justifyContent: "space-between",
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                  </div>
                </div>
              </div>
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