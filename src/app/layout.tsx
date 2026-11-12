import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { BlockMonitor } from "@/components/block-monitor";
import { Nav } from "@/components/nav";

const sans = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono" });
export const metadata: Metadata = { title: "Sổ kỷ luật" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`dark ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AuthProvider><div className="mx-auto max-w-5xl p-4"><Nav />{children}</div><BlockMonitor /></AuthProvider>
      </body>
    </html>
  );
}
