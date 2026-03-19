"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Kanban, 
  Settings, 
  Zap,
  ChevronRight
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Chat", href: "/chat", icon: MessageSquare },
  { name: "CRM Kanban", href: "/crm", icon: Kanban },
  { name: "Integrações", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground shadow-sm">
      <div className="flex h-16 items-center border-b px-6">
        <Zap className="mr-2 h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight text-primary">LF7 AI Flow</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                {item.name}
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center space-x-3 rounded-md bg-muted/50 p-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
            S
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">Sandeco</p>
            <p className="truncate text-xs text-muted-foreground">sandeco@lf7.ai</p>
          </div>
        </div>
      </div>
    </div>
  )
}
