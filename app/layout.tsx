import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterProvider from "./components/layout/ToasterProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "命理分析助手 - AI驱动的八字、紫微斗数、星座分析",
  description: "专业命理分析工具，基于AI技术提供八字排盘、紫微斗数、星座分析服务，免费在线使用",
  keywords: ["八字", "紫微斗数", "星座分析", "命理", "AI分析", "免费算命"],
  authors: [{ name: "命理分析助手" }],
  openGraph: {
    type: "website",
    title: "命理分析助手 - AI驱动的命理分析",
    description: "专业命理分析工具，基于AI技术提供八字排盘、紫微斗数、星座分析服务",
    siteName: "命理分析助手",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
