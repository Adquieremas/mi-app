import { ReactNode } from "react";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const lang = headerList.get("x-lang") || "es";

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}