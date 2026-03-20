"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, Loader2, User, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-primary fill-current" />
            <h1 className="text-3xl font-bold tracking-tight">LF7 AI Flow</h1>
          </div>
          <p className="text-muted-foreground">Bem-vindo de volta! Entre na sua conta para gerenciar seu fluxo.</p>
        </div>

        <div className="bg-card p-8 rounded-2xl border shadow-xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                  placeholder="nome@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-2 rounded-lg border bg-background"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex h-11 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Entrar"}
            </button>

            <div className="flex flex-col gap-3 text-center text-sm">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Esqueceu a senha?
              </Link>
              <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">
                Ainda não tem conta? <span className="text-primary font-semibold">Cadastre sua Empresa</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
