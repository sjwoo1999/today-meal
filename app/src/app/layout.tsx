import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
  themeColor: "#FF9500",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Mobile: Centered container with max-width */}
        <div className="lg:hidden max-w-lg mx-auto min-h-screen bg-white shadow-2xl">
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
