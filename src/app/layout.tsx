import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { BlockMonitor } from "@/components/block-monitor";
import { Nav } from "@/components/nav";

const sans = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono" });
export const metadata: Metadata = { title: "Sổ kỷ luật" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        <AuthProvider>
          <Nav />
          {children}
          <BlockMonitor />
        </AuthProvider>
      </body>
    </html>
  );
}
