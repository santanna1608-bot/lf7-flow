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
    <div className="min-h-screen flex items-center justify-center bg-login-gradient px-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-premium-gradient flex items-center justify-center shadow-premium">
              <Zap className="h-7 w-7 text-white fill-current" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">LF7 AI <span className="text-secondary">Flow</span></h1>
          </div>
          <p className="text-slate-400 font-medium">Insira suas credenciais para acessar o painel</p>
        </div>

        <div className="glass-card p-8 rounded-[2rem] shadow-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">E-mail</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/20 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-white/10 bg-black/20 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center gap-3">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex h-14 items-center justify-center rounded-xl bg-premium-gradient text-white font-bold text-lg shadow-premium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Entrar no Sistema"}
            </button>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-sm">
                <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                  Esqueceu a senha?
                </Link>
                <Link href="/register" className="text-primary font-bold hover:underline">
                  Criar conta agora
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
