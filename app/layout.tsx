import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ViewerProvider } from "@/providers/viewer-provider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cosmic Card",
  description: "A message from the universe. Daily spiritual reflection.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cosmic Card",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Cosmic Card",
    description: "A message from the universe. Daily spiritual reflection.",
    siteName: "Cosmic Card",
  },
};

export const viewport: Viewport = {
  themeColor: "#140b30",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Enable safe area for notch/island
};

import { QueryProvider } from "@/providers/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased bg-cosmic-bg text-cosmic-text`}>
        <ViewerProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ViewerProvider>
      </body>
    </html>
  );
}
