import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConditionalShell } from "@/components/ConditionalShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proclaiming Praise | Advancing the Kingdom of Heaven",
  description:
    "Proclaiming Praise is a 501(c)(3) non-profit advancing the Kingdom of Heaven, one praise at a time. Join worship events, give online, and connect with our community.",
  keywords: ["worship", "praise", "non-profit", "faith", "community", "events"],
  openGraph: {
    title: "Proclaiming Praise | Advancing the Kingdom of Heaven",
    description:
      "Advancing the Kingdom of Heaven, one praise at a time.",
    type: "website",
    url: "https://www.proclaimingpraise.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
