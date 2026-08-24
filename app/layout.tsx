import type { Metadata, Viewport } from "next";
import "./globals.css";
import { apology } from "@/data/apology";

export const metadata: Metadata = {
  title: `A Message for ${apology.herName}`,
  description: "A private personal message.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: apology.theme.ivory
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
