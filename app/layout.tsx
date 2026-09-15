import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Student Deadline Tracker",
  description: "Theo dõi bài tập, hạn nộp và tiến độ học tập cá nhân.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased"><Providers>{children}</Providers></body>
    </html>
  );
}
