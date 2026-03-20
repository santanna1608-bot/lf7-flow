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
    <div className="min-h-screen flex items-center justify-center bg-[#05070a] px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-12">
          <div className="inline-flex flex-col items-center gap-1">
            <span className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
              evolua
            </span>
            <span className="text-[12px] font-black tracking-[0.4em] text-secondary uppercase -mt-2">
              PROSPECT
            </span>
          </div>
        </div>

        <div className="bg-[#0a0c1a]/60 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Entrar</h2>
            <p className="text-sm text-white/50 mt-1">Insira suas credenciais</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[#e0e7ff] text-[#05070a] font-bold focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-[#05070a]/40"
                  placeholder="santanna1608@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full h-14 pl-12 pr-12 rounded-2xl bg-[#e0e7ff] text-[#05070a] font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-[#05070a]/40"
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#05070a]/30 hover:text-[#05070a]/60 transition-colors text-xs font-bold"
                >
                  {showPassword ? "esconder" : "mostrar"}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive font-medium bg-destructive/10 p-4 rounded-2xl text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 flex items-center justify-center rounded-2xl bg-gradient-to-r from-secondary to-primary text-white font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Entrar"}
            </button>

            <div className="flex flex-col gap-3 text-center text-sm font-medium">
              <Link href="#" className="text-white/40 hover:text-white transition-colors underline decoration-secondary/30 underline-offset-4">
                Esqueceu a senha? <span className="text-secondary">Clique aqui</span>
              </Link>
              <Link href="/register" className="text-white/40 hover:text-white transition-colors">
                Problemas no login? <span className="text-secondary underline decoration-secondary/30 underline-offset-4">Suporte</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
