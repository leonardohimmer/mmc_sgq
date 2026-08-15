import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MMC LAB | ISO/IEC 17025",
  description: "Sistema de Gestão da Qualidade e Controle Documental.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { Suspense } from "react";
import { Toaster } from "sonner";
import ClickTracker from "@/components/ClickTracker";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalNavigationLoader from "@/components/GlobalNavigationLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${jakartaSans.variable} font-sans antialiased bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Toaster richColors closeButton position="top-right" />
          <AuthProvider>
            <Suspense fallback={null}>
              <GlobalNavigationLoader />
            </Suspense>
            <ClickTracker />
            {children}
            <ScrollToTop />
          </AuthProvider>
        </ThemeProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FSJBXGRSMZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-FSJBXGRSMZ');
          `}
        </Script>
      </body>
    </html>
  );
}
