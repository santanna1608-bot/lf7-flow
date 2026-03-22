"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Rocket, User, Menu, X, Zap } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth/auth-guard"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden bg-background relative text-foreground">
        {/* Overlay para mobile quando sidebar está aberta */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar responsivo - Mantendo Dark Premium */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 w-64 border-r border-white/5 shadow-2xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header Mobile */}
          <header className="lg:hidden flex items-center justify-between px-6 h-16 bg-white border-b border-slate-100 shadow-sm z-30 sticky top-0">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">LF7 AI Flow</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -mr-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 lg:p-8 relative">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
