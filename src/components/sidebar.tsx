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

    // Ouvir atualizações de perfil de outros componentes
    const handleProfileUpdate = () => getUser()
    window.addEventListener('profile-updated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const logoUrl = "https://framerusercontent.com/images/8rFk2V1QG1u1R1X1R1X1R1X1R1.png" // Placeholder ou similar

  return (
    <div className="flex h-full w-64 flex-col border-r border-white/5 bg-[#0a0c1a] text-white shadow-2xl">
      <div className="flex h-20 items-center justify-center border-b border-white/5 px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-white fill-current" />
          </div>
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent italic">
            EVOLUA
          </span>
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

        {user?.role === 'super_admin' && (
          <div className="mt-8 px-3">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Administração Global</p>
            <Link
              href="/admin"
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === '/admin' 
                  ? "bg-primary/20 text-primary border border-primary/20 shadow-sm" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <ShieldCheck className="mr-3 h-5 w-5" />
              Painel Global
            </Link>
          </div>
        )}
      </div>
      <div className="border-t p-4 space-y-3">
        <Link 
          href="/profile"
          className="flex items-center space-x-3 rounded-md hover:bg-muted/50 p-2 transition-all active:scale-95 group border border-transparent hover:border-border"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all flex-shrink-0 overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">{user?.name || "Meu Perfil"}</p>
            <p className="text-xs text-muted-foreground truncate">Minha Conta</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full h-11 flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-secondary to-primary rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
        >
          <LogOut className="h-4 w-4" /> Sair da Conta
        </button>
      </div>
    </div>
  )
}
