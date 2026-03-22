import Link from "next/link"
import { ArrowLeft, Lock, Zap, EyeOff } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1b] text-slate-300 font-sans selection:bg-primary/20">
      {/* Header Simples */}
      <header className="border-b border-white/5 bg-[#0a0e1b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
            <span className="text-sm font-bold text-slate-500 group-hover:text-white transition-colors">Voltar para Início</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-premium-gradient flex items-center justify-center">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-sm font-black tracking-tighter text-white uppercase italic">LF7 AI FLOW</span>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <article className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">Política de Privacidade</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Última atualização: 21 de Março de 2026</p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-4">1. Coleta de Informações</h2>
            <p>
              Coletamos as informações necessárias para a operação dos seus Funcionários IA, incluindo logs de conversas, números de telefone dos leads e metadados de interação. Todos os dados são processados para fins exclusivos de triagem e qualificação comercial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">2. Segurança dos Dados</h2>
            <p>
              Utilizamos infraestrutura de ponta (Supabase e PostgreSQL) com criptografia em trânsito e em repouso. O acesso aos dados dos leads é restrito ao seu painel administrativo, protegido por autenticação segura via e-mail e senha.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">3. Integração com WhatsApp</h2>
            <p>
              O LF7 AI Flow utiliza APIs de integração para conectar seus Funcionários IA ao WhatsApp. Respeitamos as políticas de uso da plataforma e não realizamos práticas de spam. O usuário é responsável por garantir que a coleta de números de leads esteja em conformidade com as leis locais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">4. Compartilhamento de Dados</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos os dados coletados com terceiros. As informações só são compartilhadas com provedores de infraestrutura estritamente necessários para o funcionamento da plataforma (ex: OpenAI para processamento de IA) sob acordos de confidencialidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">5. Seus Direitos (LGPD)</h2>
            <p>
              Em conformidade com a LGPD, você tem o direito de solicitar a exportação ou exclusão definitiva dos seus dados e dos dados dos seus leads a qualquer momento. Para isso, basta entrar em contato através dos canais oficiais de suporte.
            </p>
          </section>
        </div>

        <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#00ffff]/10 flex items-center justify-center text-[#00ffff]">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-white">Privacidade em Primeiro Lugar</p>
              <p className="text-sm text-slate-500 font-medium">Seus dados são protegidos com tecnologia militar.</p>
            </div>
          </div>
          <Link 
            href="https://wa.me/5521981062423" 
            target="_blank"
            className="px-8 py-3 rounded-full bg-[#00ffff]/10 text-[#00ffff] font-black text-sm border border-[#00ffff]/20 hover:bg-[#00ffff]/20 transition-all"
          >
            Saber Mais
          </Link>
        </div>
      </article>

      {/* Footer Simples */}
      <footer className="border-t border-white/5 py-12 text-center">
        <p className="text-xs font-black text-slate-600 uppercase tracking-widest">&copy; 2026 LF7 AI Flow. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}
