export type DownloadHistoryItem = {
  id: string;
  url: string;
  type: "video" | "mp3";
  createdAt: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  audioUrl?: string;
};

const STORAGE_KEY = "clipnexo_download_history";
const MAX_ITEMS = 10;

function isBrowser() {
  return typeof window !== "undefined";
}

export function getDownloadHistory(): DownloadHistoryItem[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean);
  } catch {
    return [];
  }
}

export function saveDownloadHistory(items: DownloadHistoryItem[]) {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // silencio para no romper UI
  }
}

export function addDownloadHistoryItem(
  item: Omit<DownloadHistoryItem, "id" | "createdAt">
) {
  const current = getDownloadHistory();

  const filtered = current.filter(
    (entry) => !(entry.url === item.url && entry.type === item.type)
  );

  const newItem: DownloadHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...item,
  };

  const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
  saveDownloadHistory(updated);

  return updated;
}

export function removeDownloadHistoryItem(id: string) {
  const current = getDownloadHistory();
  const updated = current.filter((item) => item.id !== id);
  saveDownloadHistory(updated);
  return updated;
}

export function clearDownloadHistory() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silencio
  }
}

export function formatHistoryDate(value: string, lang: string) {
  try {
    const locale =
      lang === "pt" ? "pt-PT" : lang === "en" ? "en-US" : "es-PE";

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}