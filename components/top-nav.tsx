"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import { ThemeToggle } from "./theme-toggle"

export function TopNav() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="hidden md:block">
          <nav className="flex items-center space-x-2">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={segment}>
                <span className="text-muted-foreground">/</span>
                <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`} className="text-sm font-medium">
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
