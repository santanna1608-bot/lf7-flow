"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, usePathname } from "next/navigation"

import Link from "next/link"
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
  User,
  Building2,
  Users,
  CreditCard,
  Crown,
  X
} from "lucide-react"

const userMenuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Chat", href: "/chat", icon: MessageSquare },
  { name: "CRM Kanban", href: "/crm", icon: Kanban },
  { name: "Integrações", href: "/settings", icon: Settings },
]

const adminMenuItems = [
  { name: "Empresas", href: "/admin", icon: Building2 },
  { name: "Usuários", href: "/admin/users", icon: Users },
  { name: "Financeiro", href: "/admin/financial", icon: CreditCard },
  { name: "Assinaturas", href: "/admin/subscriptions", icon: Zap },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  // Fechar sidebar ao mudar de rota em mobile
  useEffect(() => {
    if (onClose) onClose()
  }, [pathname])
  
  // O modo é definido pela URL atual
  const isAdminView = pathname.startsWith('/admin')

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

    window.addEventListener('profile-updated', getUser)
    return () => window.removeEventListener('profile-updated', getUser)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const currentMenuItems = isAdminView ? adminMenuItems : userMenuItems

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Header do Sidebar */}
      <div className="p-6 border-b flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">LF7 AI Flow</h2>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Switcher Admin/User (Apenas para Admins) */}
        {(user?.role?.toLowerCase() === 'admin' || user?.email === 'lf7.marketingdigital@gmail.com') && (
          <div className="flex p-1 bg-muted rounded-xl gap-1">
            <button 
              onClick={() => router.push('/dashboard')}
              className={cn(
                "flex-1 px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider",
                !isAdminView ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50"
              )}
            >
              Cliente
            </button>
            <button 
              onClick={() => router.push('/admin')}
              className={cn(
                "flex-1 px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1",
                isAdminView ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50"
              )}
            >
              <Crown className="h-2.5 w-2.5" /> Admin
            </button>
          </div>
        )}
      </div>

      {/* Menu Body */}
      <div className="flex-1 overflow-y-auto py-4">
        {isAdminView && (
          <div className="px-6 mb-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Super Admin</span>
          </div>
        )}
        <nav className="space-y-1 px-3">
          {currentMenuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer do Sidebar */}
      <div className="border-t p-4 space-y-3">
        <Link 
          href="/profile"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors group"
        >
           <div className="h-8 w-8 rounded-full bg-muted border border-slate-200 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors overflow-hidden">
             {user?.avatarUrl ? (
               <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
             ) : (
               <User className="h-4 w-4" />
             )}
           </div>
           <div className="flex-1 overflow-hidden">
             <p className="text-sm font-medium leading-none truncate">{user?.name || "Meu Perfil"}</p>
             <p className="text-xs text-muted-foreground truncate group-hover:text-primary transition-colors">Minha Conta</p>
           </div>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </div>
  )
}
