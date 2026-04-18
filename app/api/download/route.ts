import { NextResponse } from "next/server";

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\p{L}\p{N}_]+/gu);
  return matches ? Array.from(new Set(matches)) : [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: "Debes enviar un enlace de TikTok",
        },
        { status: 400 }
      );
    }

    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo consultar el servidor externo",
        },
        { status: 502 }
      );
    }

    const data = await res.json();

    const candidates = [
      data?.data?.hdplay,
      data?.data?.play,
      data?.data?.wmplay,
      data?.data?.playwm,
      data?.data?.wm_size,
    ].filter((value) => typeof value === "string" && value.startsWith("http"));

    const audioCandidates = [
      data?.data?.music,
      data?.data?.music_info?.play,
      data?.data?.music_info?.url,
    ].filter((value) => typeof value === "string" && value.startsWith("http"));

    const video = candidates[0] || null;
    const audio = audioCandidates[0] || null;

    const rawData = data?.data || null;

    const description =
      typeof rawData?.title === "string"
        ? rawData.title.trim()
        : typeof rawData?.desc === "string"
        ? rawData.desc.trim()
        : "";

    const hashtags =
      Array.isArray(rawData?.hashtags) && rawData.hashtags.length > 0
        ? rawData.hashtags
            .map((item: unknown) => {
              if (typeof item === "string") return item.trim();
              if (item && typeof item === "object" && "name" in item) {
                const value = (item as { name?: unknown }).name;
                return typeof value === "string" ? value.trim() : "";
              }
              return "";
            })
            .filter(Boolean)
            .map((tag: string) => (tag.startsWith("#") ? tag : `#${tag}`))
        : extractHashtags(description);

    const cover =
      typeof rawData?.cover === "string" && rawData.cover.startsWith("http")
        ? rawData.cover
        : typeof rawData?.origin_cover === "string" && rawData.origin_cover.startsWith("http")
        ? rawData.origin_cover
        : null;

    const author = rawData?.author && typeof rawData.author === "object"
      ? {
          uniqueId:
            typeof rawData.author.unique_id === "string"
              ? rawData.author.unique_id
              : null,
          nickname:
            typeof rawData.author.nickname === "string"
              ? rawData.author.nickname
              : null,
          avatar:
            typeof rawData.author.avatar === "string" && rawData.author.avatar.startsWith("http")
              ? rawData.author.avatar
              : null,
        }
      : null;

    console.log("TIKWM RESPONSE:", JSON.stringify(data, null, 2));
    console.log("VIDEO CANDIDATES:", candidates);
    console.log("AUDIO CANDIDATES:", audioCandidates);

    if (!video && !audio) {
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo obtener contenido descargable",
          debug: data?.data || data || null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      video,
      audio,
      play: video,
      cover,
      thumbnail: cover,
      description,
      desc: description,
      title: description,
      hashtags,
      author,
      raw: rawData,
    });
  } catch (error) {
    console.error("DOWNLOAD API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error en servidor",
      },
      { status: 500 }
    );
  }
}