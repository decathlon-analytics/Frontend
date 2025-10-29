"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Bot, ChevronLeft, Footprints, Home, Menu, Mountain } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navigation = [
  { name: "홈", href: "/", icon: Home },
  { name: "러닝", href: "/running", icon: Footprints },
  { name: "등산/하이킹", href: "/hiking", icon: Mountain },
  { name: "챗봇", href: "/chatbot", icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const NavItem = ({ item, isBottom = false }: { item: typeof navigation[0], isBottom?: boolean }) => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
            isCollapsed && "justify-center px-2",
          )}
        >
          <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>{item.name}</span>}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.name}
        </TooltipContent>
      )}
    </Tooltip>
  )

  return (
    <TooltipProvider>
      <>
        <button
          className="fixed z-50 p-2 rounded-md shadow-md lg:hidden top-4 left-4 bg-background"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div
          className={cn(
            "fixed inset-y-0 z-20 flex flex-col bg-background transition-all duration-300 ease-in-out lg:static",
            isCollapsed ? "w-[72px]" : "w-72",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="border-b border-border">
            <div className={cn("flex h-16 items-center gap-2 px-4", isCollapsed && "justify-center px-2")}>
              {!isCollapsed && (
                <Link href="/" className="flex items-center gap-2 font-semibold flex-nowrap">
                  <img 
                    src="/decathlon-logo.png" 
                    alt="Decathlon Analytics" 
                    className="flex-shrink-0 w-10 h-7"
                  />
                  <span className="text-sm whitespace-nowrap">decathlon-analytics</span>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={cn("ml-auto h-8 w-8", isCollapsed && "ml-0")}
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
                <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} Sidebar</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </>
    </TooltipProvider>
  )
}
