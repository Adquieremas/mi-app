import { NextResponse } from "next/server";

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
      raw: data?.data || null,
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