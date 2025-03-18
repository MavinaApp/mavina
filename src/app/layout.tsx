import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mavina - Mobil Araç Yıkama Hizmetleri",
  description: "Çevrenizdeki mobil araç yıkama hizmetlerini bulun, iletişime geçin ve randevu alın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen bg-white">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
