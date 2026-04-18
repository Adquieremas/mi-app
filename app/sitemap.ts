export default function sitemap() {
  const baseUrl = "https://clipnexo.com";

  const routes = [
    "/es/acerca-de",
    "/es/descargar-tiktok",
    "/es/descargar-tiktok-mp3",
    "/es/como-descargar-videos-de-tiktok",
    "/es/descargar-tiktok-sin-marca",

    "/en/acerca-de",
    "/en/descargar-tiktok",
    "/en/descargar-tiktok-mp3",
    "/en/como-descargar-videos-de-tiktok",
    "/en/descargar-tiktok-sin-marca",

    "/pt/acerca-de",
    "/pt/descargar-tiktok",
    "/pt/descargar-tiktok-mp3",
    "/pt/como-descargar-videos-de-tiktok",
    "/pt/descargar-tiktok-sin-marca",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}