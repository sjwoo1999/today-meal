import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans for numbers and English
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FF8C5A", // Today Coral
};

export const metadata: Metadata = {
  title: "오늘한끼 - TodayMeal",
  description: "오늘 저녁 뭐 먹지? 그럼 아침엔 이거! AI 기반 개인화 식단 관리 플랫폼",
  keywords: ["식단관리", "다이어트", "PT", "피트니스", "영양관리", "헬스"],
  authors: [{ name: "TodayMeal Team" }],
  openGraph: {
    title: "오늘한끼 - TodayMeal",
    description: "AI가 당신의 식단을 책임집니다. 먹고 싶은 것 포기하지 마세요!",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard Font from CDN */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className={`${plusJakarta.variable} font-sans antialiased bg-canvas text-text-primary`}>
        {/* Mobile: Centered container with max-width */}
        <div className="lg:hidden max-w-lg mx-auto min-h-screen bg-cream shadow-2xl">
          {children}
        </div>

        {/* Desktop: Full width */}
        <div className="hidden lg:block min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}

