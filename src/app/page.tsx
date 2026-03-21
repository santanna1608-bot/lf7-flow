import Link from "next/link"
import { ArrowRight, Bot, Zap, Shield, BarChart3, CheckCircle2, MessageSquare, Phone } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col font-sans selection:bg-primary/20 relative">
      {/* 1. Cabeçalho (Header) - Fixo */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0e1b]/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-premium-gradient flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">LF7 AI <span className="text-[#00ffff]">Flow</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2 rounded-full border border-[#8a2be2] text-[#8a2be2] text-sm font-bold hover:bg-[#8a2be2]/10 transition-all"
            >
              Login
            </Link>
            <Link 
              href="https://wa.me/5521981062423" 
              target="_blank"
              className="px-6 py-2 rounded-full bg-premium-gradient text-white text-sm font-black shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
            >
              Falar com Especialista <Phone className="h-4 w-4 fill-current" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Seção Hero (Topo - Fundo Escuro) */}
      <section className="bg-login-gradient pt-40 pb-32 px-6 relative overflow-hidden flex flex-col items-center text-center border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tighter text-white mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Escale sua Prospecção no <br className="hidden md:block" />
            WhatsApp com o <span className="text-gradient">LF7 AI Flow</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-14 max-w-4xl font-semibold animate-in fade-in slide-in-from-bottom-12 duration-1000">
            A automação com IA que você controla para gerenciar leads <br className="hidden md:block" />
            e fechar mais vendas de forma profissional e escalável.
          </p>

          <Link 
            href="/login" 
            className="h-16 px-12 rounded-2xl bg-premium-gradient text-white text-xl font-black shadow-2xl hover:scale-105 transition-all mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000"
          >
            Ver Demonstração
          </Link>

          {/* Floating Kanban Visual */}
          <div className="relative w-full max-w-6xl mx-auto group animate-in zoom-in duration-1000">
            <div className="absolute inset-0 bg-[#8a2be2]/20 blur-[100px] rounded-full -z-10 animate-pulse" />
            <img 
              src="/images/kanban-floating.png" 
              alt="Representação do Painel CRM Kanban" 
              className="w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* 3. Seção de Funcionalidades (Features - Fundo Claro) */}
      <section className="bg-[#f9fafc] py-32 px-6 relative z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#0a0e1b] mb-6">Controle e Eficiência para sua Prospecção</h2>
            <div className="h-1.5 w-24 bg-premium-gradient mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-10 rounded-3xl bg-white border border-[#0a0e1b]/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-[#8a2be2]/10 flex items-center justify-center text-[#8a2be2] mb-8 group-hover:bg-premium-gradient group-hover:text-white transition-all shadow-md">
                <Bot className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-[#0a0e1b] mb-4">Agentes de IA Inteligentes</h3>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Controle total sobre seus agentes. Pause, ative ou ajuste a personalidade da IA conforme a necessidade da sua operação.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-white border border-[#0a0e1b]/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-[#00ffff]/10 flex items-center justify-center text-[#00ffff] mb-8 group-hover:bg-premium-gradient group-hover:text-white transition-all shadow-md">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-[#0a0e1b] mb-4">CRM Kanban Integrado</h3>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Visualize seu funil de vendas com clareza. Mova leads entre etapas de prospecção, qualificação e fechamento.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-white border border-[#0a0e1b]/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:bg-premium-gradient group-hover:text-white transition-all shadow-md">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-[#0a0e1b] mb-4">Live Chat & Handoff</h3>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Intervenha nas conversas da IA sempre que necessário. Transição suave entre automação e atendimento humano.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-white border border-[#0a0e1b]/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-[#8a2be2]/10 flex items-center justify-center text-[#8a2be2] mb-8 group-hover:bg-premium-gradient group-hover:text-white transition-all shadow-md">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-[#0a0e1b] mb-4">Dashboard Performance</h3>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Métricas reais em tempo real. Saiba a taxa de conversão da sua IA e a velocidade de resposta do seu time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Seção de Testemunhos (Fundo Claro) */}
      <section className="bg-white py-32 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0a0e1b] mb-6">Casos de Sucesso</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-semibold">Empresas que escalaram sua operação com profissionalismo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-10 rounded-3xl bg-[#f9fafc] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-1 text-amber-400 mb-6">
                 {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-slate-600 font-semibold italic mb-8 leading-relaxed">
                "O LF7 AI Flow transformou nossa triagem inicial. Agora só focamos em fechar leads que já chegam pré-qualificados pela IA."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200" />
                <div>
                   <p className="font-black text-[#0a0e1b]">Dra. Ana Andrade</p>
                   <p className="text-xs font-black text-[#8a2be2] uppercase tracking-widest">Odontologia Especializada</p>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-[#f9fafc] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-1 text-amber-400 mb-6">
                 {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-slate-600 font-semibold italic mb-8 leading-relaxed">
                "A visualização no Kanban mudou o jogo para nossa imobiliária. Nenhum lead fica sem resposta mais, a escala é real."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200" />
                <div>
                   <p className="font-black text-[#0a0e1b]">Marcos Castro</p>
                   <p className="text-xs font-black text-[#8a2be2] uppercase tracking-widest">Diretor Comercial</p>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-[#f9fafc] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-1 text-amber-400 mb-6">
                 {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-slate-600 font-semibold italic mb-8 leading-relaxed">
                "Atendimento 24/7 sem aumentar equipe. A IA faz a primeira triagem e meu time jurídico recebe tudo organizado."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200" />
                <div>
                   <p className="font-black text-[#0a0e1b]">Dr. Ricardo Lemos</p>
                   <p className="text-xs font-black text-[#8a2be2] uppercase tracking-widest">Lemos & Associados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Rodapé (Footer - Fundo Escuro) */}
      <footer className="bg-[#0a0e1b] py-20 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-premium-gradient flex items-center justify-center shadow-2xl">
              <Zap className="h-10 w-10 text-white fill-current" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase italic">LF7 AI <span className="text-[#00ffff]">Flow</span></span>
          </div>
          
          <div className="flex gap-12 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-white transition-colors">Política de Privacidade</Link>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Desenvolvido por <span className="text-white">Luiz Fernando</span></p>
            <p className="text-xs font-black text-slate-600 uppercase tracking-widest">&copy; 2026 LF7 AI Flow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="none"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
