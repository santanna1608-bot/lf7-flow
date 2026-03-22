"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, Loader2, ArrowRight } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    companyName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
          }
        }
      })

      if (signUpError) throw signUpError

      // Redirecionamento direto (Verificação Desativada)
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-login-gradient px-4 py-12 font-sans relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />

      <div className="max-w-md w-full space-y-8 p-10 glass-card rounded-[2.5rem] shadow-2xl relative z-10 border border-white/5">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-6 transition-all duration-500 hover:scale-110">
            <Zap className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Criar Conta</h1>
          <p className="text-slate-400 font-medium tracking-wide">Cadastre sua empresa no LF7 AI Flow</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
              <input
                required
                className="appearance-none block w-full px-6 h-14 bg-white/5 border border-white/5 placeholder-slate-600 text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 focus:bg-white/10 transition-all sm:text-sm font-bold"
                placeholder="Seu Nome"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Nome da Empresa</label>
              <input
                required
                className="appearance-none block w-full px-6 h-14 bg-white/5 border border-white/5 placeholder-slate-600 text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 focus:bg-white/10 transition-all sm:text-sm font-bold"
                placeholder="Ex: Minha Empresa LTDA"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-6 h-14 bg-white/5 border border-white/5 placeholder-slate-600 text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 focus:bg-white/10 transition-all sm:text-sm font-bold"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Senha de Acesso</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-6 h-14 bg-white/5 border border-white/5 placeholder-slate-600 text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 focus:bg-white/10 transition-all sm:text-sm font-bold"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <p className="text-xs text-rose-400 font-bold text-center italic">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs font-black uppercase tracking-[0.2em] rounded-2xl text-white bg-premium-gradient shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center">
                  Criar minha conta
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 font-medium">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-black text-white hover:text-primary transition-colors uppercase tracking-widest ml-1">
                Fazer Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
