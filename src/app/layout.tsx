import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-provider";
import { TranslationProvider } from "@/context/language-context";
import { ThemeProvider } from "@/context/theme-context";
import { LoadingProvider } from "@/context/loading-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { SplashScreen } from "@/components/layout/splash-screen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Le Spot SUP - La référence mondiale du stand-up paddle",
  description: "La plateforme mondiale de référence pour le SUP. Découvrez les meilleurs spots, météo en temps réel, guide de sécurité, suivi de sessions. Par Alain Gagné.",
  metadataBase: new URL('https://lespotsup.freeddns.org'),
  authors: [{ name: 'Alain Gagné' }],
  creator: 'Alain Gagné',
  keywords: ['SUP', 'Stand-up paddle', 'paddle boarding', 'spots SUP', 'météo', 'communauté mondiale', 'Québec', 'Canada', 'world reference'],
  openGraph: {
    title: "Le Spot SUP - La référence mondiale du stand-up paddle",
    description: "La plateforme mondiale de référence pour le SUP. Découvrez les meilleurs spots avec météo en temps réel, guide de sécurité et communauté active.",
    url: 'https://lespotsup.freeddns.org',
    siteName: 'Le Spot SUP',
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Le Spot SUP - La référence mondiale du SUP",
    description: "Découvrez les meilleurs spots SUP du monde avec météo en temps réel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-white flex flex-col min-h-screen`}>
        <SplashScreen />
        <AuthProvider>
          <TranslationProvider>
            <ThemeProvider>
              <LoadingProvider>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <Toaster />
              </LoadingProvider>
            </ThemeProvider>
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}