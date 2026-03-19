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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg space-y-8 p-8 rounded-3xl border bg-card/50 backdrop-blur-sm shadow-xl">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
            <Zap className="h-7 w-7 text-primary-foreground fill-current" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Começar com LF7 Flow</h2>
          <p className="mt-2 text-sm text-muted-foreground">Configure sua empresa e comece a escalar com IA em minutos.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <input
                required
                className="mt-1 w-full h-11 rounded-xl border bg-background px-4 py-2 text-sm"
                placeholder="Seu Nome"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nome da Empresa</label>
              <input
                required
                className="mt-1 w-full h-11 rounded-xl border bg-background px-4 py-2 text-sm"
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
                className="mt-1 w-full h-11 rounded-xl border bg-background px-4 py-2 text-sm"
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
                className="mt-1 w-full h-11 rounded-xl border bg-background px-4 py-2 text-sm"
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
            className="w-full flex h-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Criar Minha Conta"}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Entrar agora
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
