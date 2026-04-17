export default function sitemap() {
  const baseUrl = "https://clipnexo.com";

  const routes = [
    "/es/descargar-tiktok",
    "/es/descargar-tiktok-mp3",
    "/es/descargar-tiktok-sin-marca",

    "/en/descargar-tiktok",
    "/en/descargar-tiktok-mp3",
    "/en/descargar-tiktok-sin-marca",

    "/pt/descargar-tiktok",
    "/pt/descargar-tiktok-mp3",
    "/pt/descargar-tiktok-sin-marca",

    "/pt/acerca-de",
    "/pt/acerca-de",
    "/pt/acerca-de",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}