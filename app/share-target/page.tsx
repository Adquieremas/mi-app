import { redirect } from "next/navigation";

type ShareTargetSearchParams = {
  title?: string;
  text?: string;
  url?: string;
};

type PageProps = {
  searchParams: Promise<ShareTargetSearchParams>;
};

function normalizeValue(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

function isTikTokUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();

    return (
      host === "tiktok.com" ||
      host === "www.tiktok.com" ||
      host === "m.tiktok.com" ||
      host === "vm.tiktok.com" ||
      host === "vt.tiktok.com"
    );
  } catch {
    return false;
  }
}

function extractUrlFromText(value: string) {
  const match = value.match(/https?:\/\/[^\s]+/gi);
  if (!match?.length) return "";

  const found = match.find((item) => isTikTokUrl(item));
  return found || "";
}

function extractTikTokUrl(params: ShareTargetSearchParams) {
  const directUrl = normalizeValue(params.url);
  if (directUrl && isTikTokUrl(directUrl)) {
    return directUrl;
  }

  const textValue = normalizeValue(params.text);
  if (textValue) {
    const fromText = extractUrlFromText(textValue);
    if (fromText) return fromText;
  }

  const titleValue = normalizeValue(params.title);
  if (titleValue) {
    const fromTitle = extractUrlFromText(titleValue);
    if (fromTitle) return fromTitle;
  }

  return "";
}

export default async function ShareTargetPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sharedUrl = extractTikTokUrl(params);

  if (!sharedUrl) {
    redirect("/es?shared=1&share_error=1");
  }

  redirect(`/es?shared=1&url=${encodeURIComponent(sharedUrl)}`);
}