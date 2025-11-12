import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

// 英文和通用字体
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// 中文字体
const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Kuku Inspired Blog",
  description:
    "A personal publishing hub with Firebase-powered authoring and a KukuBlog inspired interface.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Kuku Inspired Blog",
    description:
      "A multilingual personal blog, portfolio and resume experience backed by Firebase.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansSC.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
