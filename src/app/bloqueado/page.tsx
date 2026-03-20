"use client"

import { ShieldAlert, MessageCircle, ExternalLink, LogOut } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function BlockedPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-200/50 border border-red-50 overflow-hidden">
          {/* Top Warning Bar */}
          <div className="h-2 bg-red-500 w-full" />
          
          <div className="p-10 text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <ShieldAlert className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Acesso Temporariamente Suspenso
              </h1>
              <p className="text-slate-500 leading-relaxed">
                Identificamos uma pendência financeira referente à sua mensalidade do 
                <span className="font-bold text-primary"> LF7 AI Flow</span>. 
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-600 text-left space-y-3">
              <p>Para regularizar seu acesso e reativar seus agentes de IA, por favor:</p>
              <ul className="list-disc list-inside space-y-1 font-medium">
                <li>Realize o pagamento pendente</li>
                <li>Entre em contato com nosso suporte</li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <a 
                href="https://wa.me/5500000000000" // Placeholder para WhatsApp
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="h-6 w-6" /> Falar com o Suporte
              </a>
              
              <button 
                className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-50 transition-all text-sm"
              >
                <ExternalLink className="h-4 w-4" /> 2ª Via do Boleto / Pix
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <LogOut className="h-3 w-3" /> Sair da conta
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-xs font-medium">
          &copy; 2024 LF7 AI Flow. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
