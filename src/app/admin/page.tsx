"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Building2, Users, CreditCard, LayoutDashboard, Search } from "lucide-react"

export default function SuperAdminDashboard() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*, profiles(count)')
      
      if (!error) setCompanies(data)
      setLoading(false)
    }
    fetchCompanies()
  }, [])

  if (loading) return <div className="p-8">Carregando painel global...</div>

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 border-b flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">S</div>
          <span className="font-bold">Super Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="bg-primary/10 text-primary p-2 rounded-lg flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Empresas
          </div>
          <div className="text-muted-foreground hover:bg-muted p-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
            <Users className="h-4 w-4" /> Usuários
          </div>
          <div className="text-muted-foreground hover:bg-muted p-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
            <CreditCard className="h-4 w-4" /> Assinaturas
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Empresas</h1>
            <p className="text-muted-foreground">Monitore e gerencie todas as instâncias do LF7 AI Flow.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Buscar empresa..."
                className="pl-10 pr-4 py-2 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium text-sm">
              + Nova Empresa
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-card border rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{company.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>ID: {company.id.slice(0, 8)}...</span>
                    <span>•</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium uppercase">
                      {company.plan_type || 'FREE'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-sm font-medium">Usuários</div>
                  <div className="text-xl font-bold">1</div> {/* Simplificado por enquanto */}
                </div>
                <div className="h-8 w-px bg-border"></div>
                <button className="text-primary font-semibold hover:underline text-sm">
                  Gerenciar Dashboard
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
