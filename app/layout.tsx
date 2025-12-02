import type { Metadata } from "next";
import { Bagel_Fat_One } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const bagel = Bagel_Fat_One({
  subsets: ["latin"],
  weight: "400", // 이 폰트는 weight가 하나뿐입니다.
  variable: "--font-bagel", // 3. Tailwind에서 쓸 변수 이름 정의
});

const kblFont = localFont({
  src: "./fonts/KBLCourt_EB.woff", // 파일 경로 (layout.tsx 기준)
  variable: "--font-kbl", // Tailwind에서 쓸 변수 이름
  display: "swap",
});

export const metadata: Metadata = {
  title: "Run Duel",
  description: "다 함께, 더 멀리",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased ${bagel.variable} ${kblFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
