"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const type = "video";

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
    } catch (err) {
      console.error("Error descargando archivo:", err);
    }
  };

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

    const data = await res.json();
    setResult(data);
    setLoading(false);
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

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #4f46e5, #ec4899)",
        padding: "40px 20px",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "38px", fontWeight: "bold" }}>
          Descargador de Videos TikTok
        </h1>
        <p style={{ marginTop: 10 }}>
          Descarga videos de TikTok sin marca de agua
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
          placeholder="Pega aquí el enlace de TikTok..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: 15,
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 15,
            color: "black",
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
          DESCARGAR
        </button>

        {loading && (
          <p style={{ marginTop: 15, textAlign: "center" }}>
            Procesando...
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
          {/* IZQUIERDA (VIDEO / INFO) */}
          <div style={{ flex: 1 }}>
            {result?.video ? (
              <video
                src={result.video}
                controls
                style={{ width: "100%", borderRadius: 10 }}
              />
            ) : (
              <p style={{ color: "black" }}>No se pudo cargar el video</p>
            )}
          </div>

          {/* DERECHA (BOTONES) */}
          <div style={{ flex: 1 }}>
            {result?.raw && (
              <div style={{ marginBottom: 15 }}>
                {result.raw.title && (
                  <p style={{ color: "black", fontWeight: "bold", marginBottom: 8 }}>
                    {result.raw.title}
                  </p>
                )}

                {result.raw.title && (
                  <p style={{ color: "#555", fontSize: 14 }}>
                    {result.raw.title.match(/#\w+/g)?.join(" ") || ""}
                  </p>
                )}
              </div>
            )}
            {result?.video && (
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
                    Descargar Video (Sin Marca)
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
                    Descargar Audio (MP3)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}