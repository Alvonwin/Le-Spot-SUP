import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LocationProvider } from "@/components/LocationProvider";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Le Spot SUP - Trouvez le Spot de Paddle Idéal",
  description: "Le Spot SUP vous aide à trouver les meilleurs endroits pour faire du stand-up paddle, grâce à l'IA et à une communauté d'explorateurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <LocationProvider>
              <Header />
              <main>{children}</main>
            </LocationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
