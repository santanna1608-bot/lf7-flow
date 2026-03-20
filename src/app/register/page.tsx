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
      // O gatilho handle_new_user() no banco de dados agora cuida de tudo
      // se passarmos 'company_name' no metadata.
      // - [x] Configuração de Auth & RLS
      // - [x] Criar políticas de RLS para isolamento por `company_id`
      // - [x] Configurar trigger para criação automática de perfil no signup
      // - [x] Corrigir erro de RLS no cadastro atômico
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
            role: 'admin'
          }
        }
      })

      if (signUpError) throw signUpError

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070a] px-4 py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-lg z-10 bg-[#0a0c1a]/60 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
        <div className="text-center mb-8">
           <div className="flex flex-col items-center gap-0 mb-6">
            <span className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
              evolua
            </span>
            <span className="text-[10px] font-black tracking-[0.4em] text-secondary uppercase -mt-2">
              PROSPECT
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Criar sua Conta</h2>
          <p className="mt-2 text-sm text-white/50">Configure sua empresa e comece em minutos.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <input
                required
                className="mt-1 w-full h-12 rounded-xl bg-[#e0e7ff] text-[#05070a] font-bold px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-[#05070a]/40"
                placeholder="Seu Nome"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nome da Empresa</label>
              <input
                required
                className="mt-1 w-full h-12 rounded-xl bg-[#e0e7ff] text-[#05070a] font-bold px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-[#05070a]/40"
                placeholder="Minha Empresa SaaS"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">E-mail Corporativo</label>
              <input
                type="email"
                required
                className="mt-1 w-full h-12 rounded-xl bg-[#e0e7ff] text-[#05070a] font-bold px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-[#05070a]/40"
                placeholder="nome@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Senha</label>
              <input
                type="password"
                required
                className="mt-1 w-full h-12 rounded-xl bg-[#e0e7ff] text-[#05070a] font-bold px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-[#05070a]/40"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/5 p-3 rounded-lg text-center border border-destructive/20">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 flex items-center justify-center rounded-2xl bg-gradient-to-r from-secondary to-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Criar Minha Conta"}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </button>

          <p className="text-center text-sm font-medium text-white/40">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-bold text-secondary hover:underline underline-offset-4">
              Entrar agora
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
