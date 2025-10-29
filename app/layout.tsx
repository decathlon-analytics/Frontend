import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { TopNav } from "@/components/top-nav"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SettingsProvider } from "@/contexts/settings-context"
import { QueryProvider } from "@/lib/query"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "decathlon-analytics",
  description: "A modern, responsive sports analytics dashboard",
  generator: 'v0.app',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <SettingsProvider>
              <TooltipProvider delayDuration={0}>
                <div className="flex flex-col min-h-screen lg:flex-row">
                  <Sidebar />
                  <div className="flex-1 min-w-0">
                    <TopNav />
                    <div className="container p-3 mx-auto sm:p-4 lg:p-6 max-w-7xl">
                      <main className="w-full overflow-hidden">{children}</main>
                    </div>
                  </div>
                </div>
              </TooltipProvider>
            </SettingsProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
