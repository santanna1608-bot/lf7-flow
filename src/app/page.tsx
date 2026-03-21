import Link from "next/link"
import { ArrowRight, Bot, Zap, Shield, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-login-gradient font-sans selection:bg-primary/20 relative overflow-hidden text-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-secondary/10 blur-[120px] animate-pulse delay-700" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-8 max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-premium-gradient flex items-center justify-center shadow-premium transition-transform group-hover:scale-110">
            <Zap className="h-6 w-6 text-white fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter">LF7 AI <span className="text-secondary italic">Flow</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link 
            href="/login" 
            className="rounded-full bg-premium-gradient px-8 py-3 text-sm font-bold text-white shadow-premium hover:opacity-90 transition-all flex items-center gap-2"
          >
            Entrar no App <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-secondary text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          A Revolução do CRM com IA Generativa
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 max-w-5xl leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Gerencie leads com <br/>
          <span className="text-gradient hover:brightness-110 transition-all">Inteligência Real</span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 font-medium">
          O LF7 AI Flow automatiza suas conversas, qualifica leads em tempo real e 
          oferece insights poderosos para escalar o seu negócio de forma inteligente.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          <Link 
            href="/login" 
            className="h-16 px-12 rounded-2xl bg-premium-gradient text-white text-xl font-bold shadow-premium hover:opacity-90 transition-all hover:-translate-y-1 flex items-center gap-3 active:scale-95"
          >
            Começar Agora <ArrowRight className="h-6 w-6" />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full text-left animate-in fade-in slide-in-from-bottom-20 duration-1000">
          <div className="p-10 rounded-[2.5rem] glass-card hover:border-primary/50 transition-all group">
            <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-all shadow-lg shadow-secondary/10">
              <Bot className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Automação com IA</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              Respostas contextuais que entendem a intenção do usuário e fecham negócios sozinhos.
            </p>
          </div>

          <div className="p-10 rounded-[2.5rem] glass-card hover:border-primary/50 transition-all group">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">CRM Preditivo</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              Visualize seu funil com probabilidade de conversão e scoring automatizado por IA.
            </p>
          </div>

          <div className="p-10 rounded-[2.5rem] glass-card hover:border-primary/50 transition-all group">
            <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-8 group-hover:bg-green-500 group-hover:text-white transition-all shadow-lg shadow-green-500/10">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Privacidade & Escala</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              Dados seguros com RLS e performance ultra-rápida construídos no topo do Supabase.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Decoration */}
      <footer className="py-12 border-t text-center text-sm text-muted-foreground opacity-60">
        &copy; 2026 LF7 AI Flow. Todos os direitos reservados.
      </footer>
    </main>
  );
}
