import type { Metadata } from "next";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/geist/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "FlowNote — Un espacio para tus ideas",
  description: "Un espacio para tus notas, ideas e inspiración de cada día.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-DO">
      <body>{children}</body>
    </html>
  );
}
