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
        
        // Fallback de segurança: Se for o e-mail autorizado, forçar super_admin internamente para a UI
        const AUTHORIZED_ADMIN = 'santanna1608@gmail.com'
        const effectiveRole = session.user.email === AUTHORIZED_ADMIN ? 'super_admin' : (profile?.role || 'user')
        
        setUser({
          name: profile?.full_name || session.user.email?.split('@')[0],
          email: session.user.email,
          role: effectiveRole,
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
    <div className="flex h-full w-64 flex-col border-r border-slate-100 bg-white text-slate-900">
      {/* Header do Sidebar */}
      <div className="p-6 border-b border-slate-50 flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">LF7 AI Flow</h2>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Switcher Admin/User (Apenas para o Administrador Autorizado) */}
        {(user?.role === 'super_admin' && user?.email === 'santanna1608@gmail.com') && (
          <div className="flex p-1 bg-slate-50 rounded-xl gap-1 border border-slate-100">
            <button 
              onClick={() => router.push('/dashboard')}
              className={cn(
                "flex-1 px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider",
                !isAdminView 
                  ? "bg-white text-primary shadow-sm border border-slate-100" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Cliente
            </button>
            <button 
              onClick={() => router.push('/admin')}
              className={cn(
                "flex-1 px-2 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1.5",
                isAdminView 
                  ? "bg-white text-primary shadow-sm border border-slate-100" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Crown className="h-3 w-3" /> Admin
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
                    ? "bg-premium-gradient text-white shadow-lg shadow-primary/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
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
          className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
        >
           <div className="h-10 w-10 rounded-full bg-premium-gradient p-[2px] shadow-lg shadow-primary/20">
             <div className="h-full w-full rounded-full bg-[#0a0e1b] flex items-center justify-center overflow-hidden">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
               ) : (
                 <User className="h-5 w-5 text-slate-400" />
               )}
             </div>
           </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black leading-none truncate text-white mb-1.5">{user?.name || "Meu Perfil"}</p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-secondary font-black uppercase tracking-widest truncate group-hover:text-white transition-colors">Minha Conta</p>
                {user?.role && (
                  <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded-md text-slate-500 font-black uppercase tracking-tighter">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex h-10 items-center justify-center gap-2 rounded-lg bg-premium-gradient text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/10"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </div>
  )
}
