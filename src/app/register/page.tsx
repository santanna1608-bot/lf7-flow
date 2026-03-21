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
  const [isSuccess, setIsSuccess] = useState(false)
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
            role: 'admin'
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (signUpError) throw signUpError

      // Se não houver erro e o e-mail estiver configurado para confirmação no Supabase,
      // geralmente o session será null ou o user estará com email_confirmed_at null.
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1b] px-4 py-12 relative overflow-hidden selection:bg-primary/20">
        {/* Glows de fundo */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ffff]/5 blur-[120px] rounded-full -z-10" />

        <div className="w-full max-w-lg space-y-10 p-12 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-500 text-center">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-[2rem] bg-premium-gradient flex items-center justify-center shadow-2xl shadow-primary/30 mb-8 animate-bounce">
              <Zap className="h-12 w-12 text-white fill-current" />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white mb-4">Verifique seu E-mail</h2>
            <p className="text-slate-400 font-medium text-lg">
              Enviamos um link de ativação para <br />
              <span className="text-white font-black">{formData.email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-sm leading-relaxed text-slate-500 text-left">
              <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-2">Próximos passos:</p>
              <ul className="space-y-2 font-medium">
                <li className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                   Acesse sua caixa de entrada.
                </li>
                <li className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                   Clique no botão "Confirmar meu Acesso".
                </li>
                <li className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                   Você será redirecionado para o painel.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <Link 
               href="/login"
               className="w-full flex h-14 items-center justify-center rounded-2xl bg-white text-[#0a0e1b] font-black text-sm shadow-xl hover:bg-slate-100 transition-all active:scale-[0.98]"
             >
               Ir para o Login
             </Link>
             <button 
               onClick={() => setIsSuccess(false)}
               className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
             >
               Tentar outro e-mail
             </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1b] px-4 py-12 relative overflow-hidden selection:bg-primary/20">
      {/* Glows de fundo para registrar */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00ffff]/5 blur-[150px] rounded-full -z-10" />

      <div className="w-full max-w-lg space-y-8 p-10 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl animate-in fade-in duration-700">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-premium-gradient mb-6 shadow-xl shadow-primary/20">
            <Zap className="h-9 w-9 text-white fill-current" />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2">Começar no LF7 Flow</h2>
          <p className="text-slate-400 font-medium">Escale sua operação com IA em minutos.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
              <input
                required
                className="mt-2 w-full h-14 rounded-2xl border border-white/5 bg-white/5 px-6 text-white font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/20 transition-all"
                placeholder="Seu Nome"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome da Empresa</label>
              <input
                required
                className="mt-2 w-full h-14 rounded-2xl border border-white/5 bg-white/5 px-6 text-white font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/20 transition-all"
                placeholder="Ex: Marketing Digital LTDA"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <input
                type="email"
                required
                className="mt-2 w-full h-14 rounded-2xl border border-white/5 bg-white/5 px-6 text-white font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/20 transition-all"
                placeholder="nome@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sua Senha</label>
              <input
                type="password"
                required
                className="mt-2 w-full h-14 rounded-2xl border border-white/5 bg-white/5 px-6 text-white font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/20 transition-all"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
               <p className="text-sm text-red-400 font-bold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-premium-gradient text-white font-black text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                Criar Minha Conta <ArrowRight className="h-6 w-6" />
              </>
            )}
          </button>

          <p className="text-center text-sm font-bold text-slate-500">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-white hover:text-primary transition-colors">
              Fazer Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
