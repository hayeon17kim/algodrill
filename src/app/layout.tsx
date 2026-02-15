import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoDrill — 라이브 코딩 면접 준비",
  description: "Duolingo-style algorithm interview prep. 매일 5분씩 패턴 인식, 접근법 정리, 말하기 연습.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AlgoDrill",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6366f1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="select-none">{children}</body>
    </html>
  );
}
