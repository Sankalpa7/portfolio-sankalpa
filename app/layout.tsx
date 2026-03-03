import type { Metadata } from 'next'
import { Inter, Syne, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { LangProvider } from '@/lib/i18n/LangContext'
import Navbar from '@/components/layout/Navbar'
import AppShell from '@/components/layout/AppShell'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Sankalpa Neupane — Computer Engineering',
  description:
    'Personal portfolio of Sankalpa Neupane, Computer Engineering Masters student and Full Stack Developer.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}
        bg-slate-50 text-slate-900
        dark:bg-[#0a0a0a] dark:text-gray-100
        transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <LangProvider>
            <AppShell accentColor="#22d3ee">
              <Navbar />
              <main>{children}</main>
            </AppShell>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}