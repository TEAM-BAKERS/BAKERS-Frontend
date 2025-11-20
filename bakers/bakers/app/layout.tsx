import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Run Duel",
  description: "러닝 기록 경쟁 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
