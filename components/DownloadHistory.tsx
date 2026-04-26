"use client";

import {
  DownloadHistoryItem,
  formatHistoryDate,
} from "@/lib/download-history";

type Props = {
  lang: string;
  items: DownloadHistoryItem[];
  onReuse: (item: DownloadHistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export default function DownloadHistory({
  lang,
  items,
  onReuse,
  onRemove,
  onClear,
}: Props) {
  const translations = {
    es: {
      title: "Historial reciente",
      empty: "Aún no tienes elementos en el historial.",
      reuse: "Usar de nuevo",
      remove: "Eliminar",
      clearAll: "Vaciar historial",
      typeVideo: "Video",
      typeMp3: "MP3",
    },
    en: {
      title: "Recent history",
      empty: "You do not have history items yet.",
      reuse: "Use again",
      remove: "Remove",
      clearAll: "Clear history",
      typeVideo: "Video",
      typeMp3: "MP3",
    },
    pt: {
      title: "Histórico recente",
      empty: "Você ainda não tem itens no histórico.",
      reuse: "Usar novamente",
      remove: "Remover",
      clearAll: "Limpar histórico",
      typeVideo: "Vídeo",
      typeMp3: "MP3",
    },
  };

  const t = translations[lang as "es" | "en" | "pt"] || translations.es;

  return (
    <div
      style={{
        marginTop: "18px",
        textAlign: "left",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {t.title}
        </p>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            style={{
              border: "none",
              background: "transparent",
              color: "#dc2626",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
            }}
          >
            {t.clearAll}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: 1.6,
          }}
        >
          {t.empty}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "12px",
                background: "#f8fafc",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title || "Thumbnail"}
                    style={{
                      width: "72px",
                      height: "72px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                      background: "#e5e7eb",
                    }}
                  />
                ) : null}

                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#111827",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.title || item.description || item.url}
                  </p>

                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "13px",
                      color: "#6b7280",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.url}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    {item.type === "mp3" ? t.typeMp3 : t.typeVideo} ·{" "}
                    {formatHistoryDate(item.createdAt, lang)}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onReuse(item)}
                      style={{
                        border: "none",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {t.reuse}
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#dc2626",
                        padding: "8px 0",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}