import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json(
        { success: false, error: "Debes enviar un enlace de TikTok" },
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
        { success: false, error: "No se pudo consultar el servidor externo" },
        { status: 502 }
      );
    }

    const data = await res.json();

    const video =
      data?.data?.hdplay ||
      data?.data?.play ||
      data?.data?.wmplay ||
      null;

    const audio =
      data?.data?.music ||
      data?.data?.music_info?.play ||
      null;

    if (!video && !audio) {
      return NextResponse.json(
        { success: false, error: "No se pudo obtener contenido descargable" },
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
    return NextResponse.json(
      { success: false, error: "Error en servidor" },
      { status: 500 }
    );
  }
}