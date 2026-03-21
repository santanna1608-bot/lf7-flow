import Link from "next/link"
import { ArrowRight, Bot, Zap, Shield, BarChart3, CheckCircle2, MessageSquare, Plus, Star, ArrowUpRight } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-login-gradient font-sans selection:bg-primary/20 relative overflow-hidden text-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[140px] animate-pulse" />
        <div className="absolute top-[20%] -right-[15%] w-[45%] h-[45%] rounded-full bg-secondary/10 blur-[140px] animate-pulse delay-700" />
        <div className="absolute -bottom-[15%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[140px] animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50 sticky top-0 bg-black/5 blur-xl border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-premium-gradient flex items-center justify-center shadow-premium transition-transform group-hover:scale-110">
            <Zap className="h-6 w-6 text-white fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">LF7 AI <span className="text-secondary">Flow</span></span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Funcionalidades</Link>
          <Link href="#testimonials" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Sucesso</Link>
          <Link 
            href="/login" 
            className="rounded-full bg-premium-gradient px-8 py-3 text-sm font-black text-white shadow-premium hover:opacity-90 transition-all flex items-center gap-2 group"
          >
            Acessar Painel <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center pt-24 pb-40 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-secondary text-xs font-black uppercase tracking-widest mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 backdrop-blur-lg">
          <div className="flex -space-x-2 mr-2">
             <div className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-800" />
             <div className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-700" />
             <div className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-600" />
          </div>
          +2.450 empresas escalando agora
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 max-w-6xl leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Domine seu mercado com <br/>
          <span className="text-gradient py-2">Inteligência Absoluta</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-14 max-w-4xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 font-semibold italic">
          O LF7 AI Flow não é apenas um CRM. É o motor de vendas autônomo <br className="hidden md:block" /> 
          que qualifica e fecha leads enquanto você dorme.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-8 mb-24 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          <Link 
            href="/login" 
            className="h-20 px-16 rounded-[2rem] bg-premium-gradient text-white text-2xl font-black shadow-premium hover:opacity-90 transition-all hover:-translate-y-2 flex items-center gap-4 active:scale-95 group"
          >
            Começar Agora <ArrowUpRight className="h-7 w-7 group-hover:rotate-45 transition-transform" />
          </Link>
          <div className="text-left">
             <div className="flex gap-1 text-amber-400 mb-1">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
             </div>
             <p className="text-slate-500 text-sm font-bold">4.9/5 estrelas no TrustPilot</p>
          </div>
        </div>

        {/* Improved Dashboard Mockup with Higher Numbers */}
        <div className="relative w-full max-w-7xl mx-auto rounded-[3rem] p-1.5 bg-gradient-to-br from-white/20 via-transparent to-white/5 shadow-2xl shadow-primary/30 animate-in zoom-in duration-1000 group">
          <div className="rounded-[2.9rem] overflow-hidden border border-white/5 bg-slate-900/50 backdrop-blur-sm">
             <img 
               src="/images/dashboard-success.png" 
               alt="Dashboard Success Metrics" 
               className="w-full object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
             />
          </div>
          {/* Glowing accents around image */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 blur-[60px] rounded-full" />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-24 border-y border-white/5 bg-black/30 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-12 opacity-80">Tecnologia Certificada nas Melhores Infraestruturas</p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-28 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-3xl font-black tracking-tighter">OpenAI</div>
             <div className="text-3xl font-black tracking-tighter">Azure Cloud</div>
             <div className="text-3xl font-black tracking-tighter">Supabase</div>
             <div className="text-3xl font-black tracking-tighter italic">Stripe</div>
             <div className="text-3xl font-black tracking-tighter uppercase decoration-secondary underline underline-offset-8">ASAAS</div>
          </div>
        </div>
      </section>

      {/* Success Metrics / Niche Social Proof */}
      <section id="testimonials" className="py-40 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">Poder de Escala em <span className="text-secondary">Qualquer Área</span></h2>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto font-semibold">Adaptamos o fluxo de IA para as maiores dores do seu nicho de mercado.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Depoimento 1: Clínica Odontológica */}
            <div className="p-12 rounded-[3.5rem] glass-card hover:bg-white/10 transition-all group shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full" />
               <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-10 shadow-lg shadow-blue-500/5 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Star className="h-8 w-8 fill-current" />
               </div>
               <p className="text-xl font-bold italic leading-relaxed text-slate-200 mb-10">
                  "O agendamento automático via IA reduziu nossas faltas em 40%. A recepção agora foca só em atender bem os pacientes presentes."
               </p>
               <div className="flex items-center gap-5 mt-auto">
                  <div className="h-14 w-14 rounded-full bg-slate-800 border-2 border-blue-500/30 flex items-center justify-center font-black text-blue-400">AA</div>
                  <div>
                     <p className="font-black text-lg">Dra. Ana Andrade</p>
                     <p className="text-blue-400 text-xs font-black uppercase tracking-widest">Odontologia Especializada</p>
                  </div>
               </div>
            </div>

            {/* Depoimento 2: Imobiliária */}
            <div className="p-12 rounded-[3.5rem] glass-card hover:bg-white/10 transition-all group shadow-2xl border-primary/20 relative overflow-hidden transform md:-translate-y-8">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[40px] rounded-full" />
               <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-10 shadow-lg shadow-primary/5 group-hover:bg-primary group-hover:text-white transition-all">
                  <TrendingUp className="h-8 w-8" />
               </div>
               <p className="text-xl font-bold italic leading-relaxed text-slate-200 mb-10">
                  "Triar leads de portais era um gargalo. A IA do LF7 agora qualifica quem tem crédito real e já entrega pronto para o corretor."
               </p>
               <div className="flex items-center gap-5 mt-auto">
                  <div className="h-14 w-14 rounded-full bg-slate-800 border-2 border-primary/30 flex items-center justify-center font-black text-primary">MC</div>
                  <div>
                     <p className="font-black text-lg">Marcos Castro</p>
                     <p className="text-primary text-xs font-black uppercase tracking-widest">Diretor Comercial - ImobHub</p>
                  </div>
               </div>
            </div>

            {/* Depoimento 3: Advocacia */}
            <div className="p-12 rounded-[3.5rem] glass-card hover:bg-white/10 transition-all group shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full" />
               <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-10 shadow-lg shadow-amber-500/5 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <Shield className="h-8 w-8" />
               </div>
               <p className="text-xl font-bold italic leading-relaxed text-slate-200 mb-10">
                  "Atendemos 24/7 sem aumentar a equipe. A IA faz a primeira triagem jurídica e nosso tempo de resposta caiu para segundos."
               </p>
               <div className="flex items-center gap-5 mt-auto">
                  <div className="h-14 w-14 rounded-full bg-slate-800 border-2 border-amber-500/30 flex items-center justify-center font-black text-amber-400">RL</div>
                  <div>
                     <p className="font-black text-lg">Dr. Ricardo Lemos</p>
                     <p className="text-amber-400 text-xs font-black uppercase tracking-widest">Lemos & Associados</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section id="features" className="py-40 bg-black/20 relative z-10 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24">
            <div className="flex-1 space-y-12">
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">O Futuro das Vendas é <span className="text-gradient underline">Autônomo</span></h2>
               <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                     <div className="h-12 w-12 rounded-xl bg-premium-gradient flex shrink-0 items-center justify-center shadow-lg shadow-primary/20">
                        <Bot className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black mb-2">IA com Memória Infinita</h4>
                        <p className="text-slate-400 font-semibold leading-relaxed">Nossa IA lembra de conversas passadas e adapta o tom para cada estágio do cliente.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                     <div className="h-12 w-12 rounded-xl bg-premium-gradient flex shrink-0 items-center justify-center shadow-lg shadow-primary/20">
                        <BarChart3 className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black mb-2">Analytics Preditivo</h4>
                        <p className="text-slate-400 font-semibold leading-relaxed">Não veja apenas o passado. Nossa IA prevê qual lead tem mais chance de fechar hoje.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex-1 relative">
               <div className="p-12 rounded-[4rem] bg-[hsl(var(--sidebar-bg))] border border-white/10 shadow-premium relative z-10">
                  <div className="space-y-6">
                     <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-2">
                           <div className="h-3 w-3 rounded-full bg-red-500" />
                           <div className="h-3 w-3 rounded-full bg-amber-500" />
                           <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">System Node v4.2</span>
                     </div>
                     <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-premium-gradient" />
                     </div>
                     <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase">
                        <span>Lead Scoring</span>
                        <span className="text-primary">+92% High Intent</span>
                     </div>
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5 animate-pulse">
                        <p className="text-xs text-slate-400 font-mono italic">"IA qualificada como Alta Intenção de Compra iniciada..."</p>
                     </div>
                  </div>
               </div>
               {/* Background glows */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] -z-10" />
            </div>
         </div>
      </section>

      {/* Final CTA (Exclusiva) */}
      <section className="py-40 relative z-10 px-6">
         <div className="max-w-6xl mx-auto p-16 md:p-24 rounded-[4.5rem] bg-premium-gradient shadow-premium text-center space-y-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white z-10 relative leading-[0.9]">Seu concorrente já está <span className="opacity-60 italic">testando a IA</span></h2>
            <p className="text-2xl text-white/80 max-w-3xl mx-auto font-bold z-10 relative">Chegou a hora de parar de queimar leads e começar a escalar seu lucro líquido.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 z-10 relative pt-6">
               <Link 
                  href="/login" 
                  className="h-20 px-16 rounded-[2rem] bg-white text-primary text-2xl font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-4 group"
               >
                  Começar Agora <ArrowRight className="h-7 w-7 text-primary group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
            <p className="text-white/40 text-sm font-black uppercase tracking-widest z-10 relative">Oferta por tempo limitado: Instalação gratuita em Março</p>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center relative z-10 bg-black/60 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col items-center gap-12">
           <div className="flex flex-col items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-premium-gradient flex items-center justify-center shadow-premium">
                <Zap className="h-10 w-10 text-white fill-current" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase italic">LF7 AI <span className="text-secondary">Flow</span></span>
           </div>
           
           <div className="flex flex-wrap justify-center gap-12 text-sm font-black uppercase tracking-widest text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">Produtos</Link>
              <Link href="#" className="hover:text-white transition-colors">Segurança</Link>
              <Link href="#" className="hover:text-white transition-colors">Integrações</Link>
              <Link href="#" className="hover:text-white transition-colors">Carreiras</Link>
           </div>
           
           <div className="pt-12 border-t border-white/5 w-full flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                &copy; 2026 LF7 AI Flow Systems. Crafted with Intelligence.
              </div>
              <div className="flex gap-6">
                 {/* Social placeholders */}
                 <div className="h-10 w-10 rounded-full bg-white/5 border border-white/5" />
                 <div className="h-10 w-10 rounded-full bg-white/5 border border-white/5" />
                 <div className="h-10 w-10 rounded-full bg-white/5 border border-white/5" />
              </div>
           </div>
        </div>
      </footer>
    </main>
  );
}
