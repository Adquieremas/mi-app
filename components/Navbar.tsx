"use client";

import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  lang: string;
};

export default function Navbar({ lang }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const labels = {
    es: {
      download: "Descargar video",
      mp3: "TikTok a MP3",
      language: "Idioma",
    },
    en: {
      download: "Download video",
      mp3: "TikTok to MP3",
      language: "Language",
    },
    pt: {
      download: "Baixar vídeo",
      mp3: "TikTok a MP3",
      language: "Idioma",
    },
  } as const;

  const t = labels[lang as keyof typeof labels] ?? labels.es;

  const handleLangChange = (value: string) => {
    window.location.href = `/${value}`;
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link href={`/${lang}`} className="logo">
          Clipnexo
        </Link>

        <nav className="nav-right-desktop" aria-label="Desktop menu">
          <Link href={`/${lang}/descargar-tiktok`} className="nav-link">
            {t.download}
          </Link>
          <Link href={`/${lang}/descargar-tiktok-mp3`} className="nav-link">
            {t.mp3}
          </Link>

          <select
            className="lang-select"
            value={lang}
            onChange={(e) => handleLangChange(e.target.value)}
            aria-label={t.language}
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
            <option value="pt">PT</option>
          </select>
        </nav>

        <button
          type="button"
          className="mobile-toggle"
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? "×" : "≡"}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-panel">
          <Link
            href={`/${lang}/descargar-tiktok`}
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            {t.download}
          </Link>

          <Link
            href={`/${lang}/descargar-tiktok-mp3`}
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            {t.mp3}
          </Link>

          <div className="mobile-language-block">
            <span className="mobile-language-label">{t.language}</span>

            <select
              className="lang-select mobile-lang-select"
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
              aria-label={t.language}
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
              <option value="pt">PT</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}