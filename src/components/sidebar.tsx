"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Kanban, 
  Settings, 
  Zap,
  ChevronRight,
  LogOut,
  ShieldCheck,
  User
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Chat", href: "/chat", icon: MessageSquare },
  { name: "CRM Kanban", href: "/crm", icon: Kanban },
  { name: "Integrações", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role, avatar_url, company_id, companies(name)')
          .eq('user_id', session.user.id)
          .single()
        
        setUser({
          name: profile?.full_name || session.user.email?.split('@')[0],
          email: session.user.email,
          role: profile?.role,
          avatarUrl: profile?.avatar_url,
          companyName: (profile as any)?.companies?.name || "LF7 AI Flow"
        })
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-20 items-center justify-center border-b px-6">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">LF7 AI Flow</h2>
        </div>
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
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t p-4 space-y-3">
        <Link 
          href="/profile"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors group"
        >
           <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
             <User className="h-4 w-4" />
           </div>
           <div className="flex-1 overflow-hidden">
             <p className="text-sm font-medium leading-none truncate">{user?.name || "Meu Perfil"}</p>
             <p className="text-xs text-muted-foreground truncate group-hover:text-primary transition-colors">Minha Conta</p>
           </div>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </div>
  )
}
