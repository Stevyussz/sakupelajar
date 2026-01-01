import ClientLayout from '@/components/Layout/ClientLayout';
import { ToastProvider } from '@/components/UI/Toast';
import PageTransition from '@/components/UI/PageTransition';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SakuPelajar - Asisten Keuangan Siswa",
  description: "Aplikasi pencatat keuangan pintar untuk pelajar juara.",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SakuPelajar",
  },
};

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`antialiased bg-slate-50 text-slate-900`}
      >
        <ToastProvider>
          <ClientLayout isAuthenticated={!!session}>
            {children}
          </ClientLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
