import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LangProvider } from "@/lib/i18n/LangContext";
import IntroGate from "@/components/layout/IntroGate";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-loaded",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne-loaded",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sankalpa Neupane — Computer Engineering",
  description:
    "Personal portfolio of Sankalpa Neupane, Computer Engineering Masters student and Full Stack Developer.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={[
          inter.variable,
          syne.variable,
          jetbrainsMono.variable,
          "bg-slate-50 text-slate-900",
          "dark:bg-[#0a0a0a] dark:text-gray-100",
          "transition-colors duration-300",
        ].join(" ")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <LangProvider>
            <IntroGate />
            <Navbar />
            <main>{children}</main>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
