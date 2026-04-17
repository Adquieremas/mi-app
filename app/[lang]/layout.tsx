import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const currentLang = ["es", "en", "pt"].includes(lang) ? lang : "es";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar lang={currentLang} />

      <main style={{ flex: 1 }}>{children}</main>

      <Footer lang={currentLang} />
    </div>
  );
}
