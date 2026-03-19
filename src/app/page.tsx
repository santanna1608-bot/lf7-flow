import Link from "next/link"
import { ArrowRight, Bot, Zap, Shield, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary/20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse delay-700" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <Zap className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tight">LF7 AI Flow</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/login" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Features</Link>
          <Link href="/login" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Preços</Link>
          <Link href="/login" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Documentação</Link>
          <Link 
            href="/login" 
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            Entrar no App <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Nova Era do CRM com IA Generativa
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Gerencie seus leads com <span className="text-primary italic">Inteligência Real</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
          O LF7 AI Flow automatiza suas conversas, qualifica leads em tempo real e 
          oferece insights poderosos para escalar o seu negócio de forma inteligente.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          <Link 
            href="/dashboard" 
            className="h-14 px-10 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-1 flex items-center gap-3 active:scale-95"
          >
            Começar Grátis <ArrowRight className="h-5 w-5" />
          </Link>
          <button className="h-14 px-10 rounded-full border bg-background/50 backdrop-blur-sm text-lg font-medium hover:bg-muted/50 transition-all active:scale-95">
            Ver Demonstração
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left animate-in fade-in slide-in-from-bottom-20 duration-1000">
          <div className="p-8 rounded-3xl bg-card border hover:border-primary/30 transition-all group backdrop-blur-sm bg-card/50">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Automação com IA</h3>
            <p className="text-muted-foreground leading-relaxed">
              Respostas contextuais que entendem a intenção do usuário e fecham negócios sozinhos.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border hover:border-primary/30 transition-all group backdrop-blur-sm bg-card/50">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">CRM Preditivo</h3>
            <p className="text-muted-foreground leading-relaxed">
              Visualize seu funil com probabilidade de conversão e scoring automatizado por IA.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border hover:border-primary/30 transition-all group backdrop-blur-sm bg-card/50">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 group-hover:bg-green-500 group-hover:text-white transition-all">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacidade & Escala</h3>
            <p className="text-muted-foreground leading-relaxed">
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
