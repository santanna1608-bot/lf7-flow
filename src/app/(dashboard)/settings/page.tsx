"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  Key, 
  ExternalLink, 
  Copy, 
  Check, 
  Webhook, 
  ShieldCheck,
  Zap,
  Loader2,
  RefreshCw
} from "lucide-react"

export default function SettingsPage() {
  const supabase = createClientComponentClient()
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [rotating, setRotating] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  
  const fetchSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile || !profile.company_id) return

      const { data: company } = await supabase
        .from('companies')
        .select('api_key_internal')
        .eq('id', profile.company_id)
        .single()

      if (company) {
        setApiKey(company.api_key_internal || "Nenhuma chave gerada")
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        setWebhookUrl(`${origin}/api/webhooks/n8n`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleRotateKey = async () => {
    if (rotating || !confirm("Tem certeza que deseja rotacionar sua chave de API? Todas as integrações atuais deixarão de funcionar até serem atualizadas.")) return

    setRotating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile?.company_id) return

      const newKey = `sk_lf7_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      
      const { error } = await supabase
        .from('companies')
        .update({ api_key_internal: newKey })
        .eq('id', profile.company_id)

      if (error) throw error

      setApiKey(newKey)
      alert("Chave de API rotacionada com sucesso!")
    } catch (err) {
      console.error(err)
      alert("Erro ao rotacionar chave.")
    } finally {
      setRotating(false)
    }
  }

  return (
    <div className="flex-1 space-y-10 p-8 pt-6 max-w-[1400px] mx-auto pb-20 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="flex flex-col space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tighter">Configurações de Integração</h2>
        <p className="text-slate-400 font-medium">Conecte seus Agentes de IA via n8n ou Evolution API com facilidade.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-premium-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Webhook className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-black text-xl text-white tracking-tight">Webhook URL</h3>
            </div>
            <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">
              Use esta URL no seu nó HTTP Request do n8n para enviar eventos de mensagens para o CRM de forma instantânea.
            </p>
            <div className="relative flex items-center group/input">
              <input
                readOnly
                value={loading ? "Carregando..." : webhookUrl}
                className="w-full rounded-2xl border border-white/5 bg-black/20 px-6 py-4 text-xs font-mono text-white/80 focus:outline-none focus:border-primary/30 transition-all shadow-inner"
              />
              <button 
                onClick={() => handleCopy(webhookUrl, 'webhook')}
                disabled={loading}
                className="absolute right-3 p-2 hover:bg-white/5 rounded-xl transition-all disabled:opacity-50 text-slate-400 hover:text-white"
                title="Copiar para área de transferência"
              >
                {copied === 'webhook' ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" />
              <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/" target="_blank" rel="noopener noreferrer"> Ver documentação oficial n8n</a>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-premium-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-black text-xl text-white tracking-tight">API Key Interna</h3>
            </div>
            <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">
              Chave de autenticação mestre para as requisições da sua IA. Mantenha em segredo absoluto.
            </p>
            <div className="relative flex items-center group/input">
              <input
                readOnly
                type="password"
                value={loading ? "••••••••" : apiKey}
                className="w-full rounded-2xl border border-white/5 bg-black/20 px-6 py-4 text-xs font-mono text-white/80 focus:outline-none focus:border-primary/30 transition-all shadow-inner"
              />
              <button 
                onClick={() => handleCopy(apiKey, 'key')}
                disabled={loading}
                className="absolute right-3 p-2 hover:bg-white/5 rounded-xl transition-all disabled:opacity-50 text-slate-400 hover:text-white"
                title="Copiar API Key"
              >
                {copied === 'key' ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="mt-8">
              <button 
                onClick={handleRotateKey}
                disabled={loading || rotating}
                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 flex items-center gap-2.5 disabled:opacity-50 transition-colors"
              >
                {rotating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Rotacionar chave de segurança
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/10 bg-primary/5 p-10 border-primary/20 relative overflow-hidden group">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -z-10 group-hover:w-64 group-hover:h-64 transition-all duration-700" />
        <div className="flex items-start gap-6">
          <div className="p-4 bg-primary/10 rounded-[1.5rem] shadow-xl shadow-primary/10">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-black text-white tracking-tight">Fluxo de Implementação Recomendado</h4>
            <div className="grid gap-3">
              {[
                "1. No n8n, crie um workflow que capture mensagens da sua Evolution API.",
                "2. Adicione um nó HTTP Request apontando para o seu 'Webhook URL' acima.",
                "3. No cabeçalho (Header), inclua 'Authorization: Bearer [SUA_API_KEY]'.",
                "4. Seus leads e conversas serão sincronizados em tempo real no Dashboard."
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <p className="text-[13px] text-slate-400 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
