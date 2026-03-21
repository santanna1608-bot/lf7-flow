import Link from "next/link"
import { ArrowLeft, Shield, Zap } from "lucide-react"

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">Termos de Uso</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Última atualização: 21 de Março de 2026</p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o sistema <strong>LF7 AI Flow</strong>, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, você não deve acessar ou utilizar o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">2. Descrição do Serviço</h2>
            <p>
              O LF7 AI Flow é uma plataforma SaaS de CRM e gerenciamento de agentes de Inteligência Artificial para WhatsApp. O serviço inclui, mas não se limita a: triagem de leads por IA, painel de monitoramento (Kanban), live chat e integrações de automação via n8n.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">3. Responsabilidade no Uso da IA</h2>
            <p>
              O usuário compreende que a IA é uma ferramenta de suporte e automação. A responsabilidade pelas mensagens enviadas e pelas interações geradas pela IA é integralmente do usuário contratante. Recomendamos o monitoramento regular das interações através do Live Chat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">4. Propriedade Intelectual</h2>
            <p>
              Todo o código-fonte, design, logotipos e funcionalidades do LF7 AI Flow são de propriedade exclusiva do desenvolvedor Luiz Fernando. É proibida a engenharia reversa, cópia ou redistribuição de qualquer parte do sistema sem autorização prévia por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">5. Pagamentos e Assinaturas</h2>
            <p>
              O acesso ao sistema é liberado mediante o pagamento da assinatura escolhida. O atraso no pagamento pode resultar na suspensão imediata do acesso ao painel e na desativação temporária dos agentes de IA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4">6. Modificações nos Termos</h2>
            <p>
              Reservamo-nos o direito de alterar estes termos a qualquer momento. Alterações significativas serão notificadas diretamente no painel do usuário. O uso contínuo do sistema após tais alterações constitui aceitação dos novos termos.
            </p>
          </section>
        </div>

        <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-white">Dúvidas Jurídicas?</p>
              <p className="text-sm text-slate-500 font-medium">Entre em contato com nosso suporte.</p>
            </div>
          </div>
          <Link 
            href="https://wa.me/5521981062423" 
            target="_blank"
            className="px-8 py-3 rounded-full bg-premium-gradient text-white font-black text-sm shadow-xl hover:scale-105 transition-all"
          >
            Falar com Especialista
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
