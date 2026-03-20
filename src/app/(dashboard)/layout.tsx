import { Sidebar } from "@/components/sidebar"
import { Rocket, User } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-200 bg-white px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm">Painel Principal</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
              <Rocket className="h-4 w-4" /> Seja um Afiliado
            </button>
            <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner">
              <User className="h-6 w-6" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
