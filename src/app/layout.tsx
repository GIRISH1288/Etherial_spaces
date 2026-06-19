import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import AutoContactPopup from "@/components/AutoContactPopup";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Ethereal Spaces",
    default: "Ethereal Spaces | Luxury Interior Design Studio",
  },
  description: "Ethereal Spaces is a premium interior design studio specializing in creating timeless, sophisticated, and emotionally engaging spaces.",
  keywords: ["Interior Designer", "Luxury Interior Design", "Residential Interior Design", "Commercial Interior Design", "Home Interior Design", "Modern Interior Design", "Interior Design Studio"],
  metadataBase: new URL("https://etherealspaces.com"),
  openGraph: {
    title: "Ethereal Spaces | Luxury Interior Design Studio",
    description: "Premium interior design studio creating timeless, sophisticated, and emotionally engaging spaces.",
    type: "website",
    locale: "en_US",
    siteName: "Ethereal Spaces",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased bg-dark-bg text-ivory min-h-screen flex flex-col font-sans select-none">
        <CustomCursor />
        <AutoContactPopup />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
