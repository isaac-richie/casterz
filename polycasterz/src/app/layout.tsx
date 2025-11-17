import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThirdwebProviderWrapper } from "@/components/ThirdwebProviderWrapper";
import { ThemeProvider } from "@/components/theme-provider";
// import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PolyCaster 🤖 AI-Powered Prediction Markets",
  description: "Get AI-powered insights on Polymarket prediction markets with real-time signals, analysis, and trading recommendations",
  keywords: ["PolyCaster", "prediction markets", "AI", "Polymarket", "signals", "trading", "analysis", "crypto"],
  authors: [{ name: "PolyCaster Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <ThirdwebProviderWrapper>
              <Providers>
                {children}
              </Providers>
            </ThirdwebProviderWrapper>
          </ThemeProvider>
        </body>
      </html>
    );
  }
