import Link from "next/link"
import { ArrowRight, Bot, Zap, Shield, BarChart3, CheckCircle2, MessageSquare, Users, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-login-gradient font-sans selection:bg-primary/20 relative overflow-hidden text-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[15%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] animate-pulse delay-700" />
        <div className="absolute -bottom-[15%] left-[10%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50 sticky top-0 bg-black/10 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-premium-gradient flex items-center justify-center shadow-premium transition-transform group-hover:scale-110">
            <Zap className="h-6 w-6 text-white fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter">LF7 AI <span className="text-secondary italic">Flow</span></span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-4">Login</Link>
          <Link 
            href="/login" 
            className="rounded-full bg-premium-gradient px-8 py-3 text-sm font-bold text-white shadow-premium hover:opacity-90 transition-all flex items-center gap-2"
          >
            Começar Agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center pt-24 pb-32 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-secondary text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          Aumente suas vendas com Inteligência Artificial
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 max-w-5xl leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Transforme conversas em <br/>
          <span className="text-gradient">Lucro Real</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 font-medium">
          O LF7 AI Flow é o CRM inteligente que qualifica, engaja e fecha vendas 
          automaticamente para você. Pare de perder leads e comece a escalar hoje.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          <Link 
            href="/login" 
            className="h-16 px-12 rounded-2xl bg-premium-gradient text-white text-xl font-bold shadow-premium hover:opacity-90 transition-all hover:-translate-y-1 flex items-center gap-3 active:scale-95"
          >
            Testar Gratuitamente <ArrowRight className="h-6 w-6" />
          </Link>
          <p className="text-slate-500 text-sm font-medium">Sem cartão de crédito necessário</p>
        </div>

        {/* Real Dashboard Mockup */}
        <div className="relative w-full max-w-6xl mx-auto mt-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-primary/20 group animate-in zoom-in duration-1000">
          <img 
            src="/images/dashboard-real.png" 
            alt="Dashboard LF7 AI Flow" 
            className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--login-bg))] via-transparent to-transparent opacity-60" />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-20 border-y border-white/5 bg-black/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-widest mb-10">Integrado com a sua stack favorita</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-3xl font-black">OpenAI</div>
             <div className="text-3xl font-black">Supabase</div>
             <div className="text-3xl font-black">WhatsApp</div>
             <div className="text-3xl font-black">n8n</div>
             <div className="text-2xl font-black italic underline decoration-primary">ASAAS</div>
          </div>
        </div>
      </section>

      {/* Benefits Content */}
      <section className="py-32 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Por que escolher o LF7 AI Flow?</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">Criamos a tecnologia para que você foque no que realmente importa: fechar negócios.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-10 rounded-[2.5rem] glass-card hover:border-primary/50 transition-all group shadow-xl">
              <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-all shadow-lg shadow-secondary/10">
                <Bot className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">IA Generativa Ativa</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Nossa IA não apenas responde, ela entende o contexto e conduz o lead pelo funil até o fechamento.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-secondary" /> Qualificação Automática</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-secondary" /> Agendamento de Reuniões</li>
              </ul>
            </div>

            <div className="p-10 rounded-[2.5rem] glass-card hover:border-primary/50 transition-all group shadow-xl border-primary/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded bg-premium-gradient uppercase">Mais Popular</span>
               </div>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">CRM Kanban Visual</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Visualize todo o seu fluxo de vendas em tempo real. Saiba exatamente onde cada centavo está no funil.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-primary" /> Drag & Drop Intuitivo</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-primary" /> Histórico de Conversas</li>
              </ul>
            </div>

            <div className="p-10 rounded-[2.5rem] glass-card hover:border-primary/50 transition-all group shadow-xl">
              <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-8 group-hover:bg-green-500 group-hover:text-white transition-all shadow-lg shadow-green-500/10">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Segurança & Escala</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Arquitetura robusta construída sobre Supabase. Seus dados estão protegidos com o mais alto nível de criptografia.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-green-500" /> RLS Avançado</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-green-500" /> Backup Automático</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Benchmarks */}
      <section className="py-24 relative z-10 px-6 overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Resultados que falam por si</h2>
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <p className="text-5xl font-black text-gradient">+85%</p>
                     <p className="text-slate-400 font-bold uppercase text-xs tracking-wider">Aumento em Conversão</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-5xl font-black text-gradient">24/7</p>
                     <p className="text-slate-400 font-bold uppercase text-xs tracking-wider">Atendimento Ativo</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-5xl font-black text-gradient">0 min</p>
                     <p className="text-slate-400 font-bold uppercase text-xs tracking-wider">Tempo de Espera</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-5xl font-black text-gradient">+10k</p>
                     <p className="text-slate-400 font-bold uppercase text-xs tracking-wider">Leads Processados</p>
                  </div>
               </div>
            </div>
            <div className="flex-1 flex justify-center">
               <div className="p-1 rounded-[3rem] bg-premium-gradient shadow-premium relative">
                  <div className="bg-[hsl(var(--login-bg))] p-10 rounded-[2.9rem] space-y-6">
                     <MessageSquare className="h-10 w-10 text-primary" />
                     <p className="text-xl font-medium leading-relaxed italic">
                        "O LF7 AI Flow mudou completamente o jogo da nossa agência. Dobramos o faturamento sem contratar novos vendedores!"
                     </p>
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-slate-800 border" />
                        <div>
                           <p className="font-bold">Luiz Santana</p>
                           <p className="text-slate-500 text-sm">CEO, LF7 Soluções</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative z-10 px-6">
         <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-premium-gradient shadow-premium text-center space-y-10 relative overflow-hidden">
            {/* Background elements for CTA */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white z-10 relative">Pronto para escalar seu faturamento?</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium z-10 relative">Dê o próximo passo na evolução do seu CRM com Inteligência Artificial Generativa.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 z-10 relative">
               <Link 
                  href="/login" 
                  className="h-16 px-12 rounded-2xl bg-white text-primary text-xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3"
               >
                  Começar Trial Grátis <ArrowRight className="h-6 w-6" />
               </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center relative z-10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-black tracking-tighter">LF7 AI <span className="text-secondary">Flow</span></span>
           </div>
           <div className="flex gap-8 text-sm font-medium text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">Termos</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-white transition-colors">Suporte</Link>
           </div>
           <div className="text-sm text-slate-500 font-medium">
             &copy; 2026 LF7 AI Flow. Todos os direitos reservados.
           </div>
        </div>
      </footer>
    </main>
  );
}
