import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { HotelProvider } from "@/context/HotelContext";

export const metadata: Metadata = {
  title: "JustGoDev • Live Demo",
  description:
    "Next-Gen Luxury Boutique Hotel Management & Front Desk Suite by JustGoDev - Multilingual (Lao, Thai, English) with Realtime LocalStorage Sandbox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lo" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LanguageProvider>
            <HotelProvider>{children}</HotelProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
