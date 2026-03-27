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
  RefreshCw,
  Bot,
  Save,
  Wand2,
  AlertTriangle,
  X
} from "lucide-react"

export default function SettingsPage() {
  const supabase = createClientComponentClient()
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [rotating, setRotating] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [aiPersonality, setAiPersonality] = useState("")
  const [savingPersonality, setSavingPersonality] = useState(false)
  const [showRotateModal, setShowRotateModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
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
        .select('api_key_internal, ai_personality')
        .eq('id', profile.company_id)
        .single()

      if (company) {
        setApiKey(company.api_key_internal || "Nenhuma chave gerada")
        setAiPersonality(company.ai_personality || "")
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
    setRotating(true)
    setMessage(null)

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
      setMessage({ type: 'success', text: "Chave de API rotacionada com sucesso!" })
      setShowRotateModal(false)
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: "Erro ao rotacionar chave." })
    } finally {
      setRotating(false)
    }
  }

  const handleSavePersonality = async () => {
    setSavingPersonality(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile?.company_id) return

      const { error } = await supabase
        .from('companies')
        .update({ ai_personality: aiPersonality })
        .eq('id', profile.company_id)

      if (error) throw error
      setMessage({ type: 'success', text: "Personalidade da IA salva com sucesso!" })
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: "Erro ao salvar personalidade." })
    } finally {
      setSavingPersonality(false)
    }
  }

  return (
    <div className="flex-1 space-y-10 p-8 pt-6 max-w-[1400px] mx-auto pb-20 relative">
      {/* Banner de Mensagem */}
      {message && (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 ${
          message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5" />
            <p className="font-bold text-sm">{message.text}</p>
            <button onClick={() => setMessage(null)} className="ml-2 hover:bg-white/20 rounded-lg p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Rotação */}
      {showRotateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Rotacionar Chave?</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Esta ação invalidará sua chave atual. Todas as integrações no n8n ou Evolution API **deixarão de funcionar** até que você atualize para a nova chave.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowRotateModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl border border-slate-100 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleRotateKey}
                  disabled={rotating}
                  className="flex-1 bg-rose-500 text-white px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {rotating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="flex flex-col space-y-2 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Configurações de Integração</h2>
        <p className="text-slate-500 font-medium">Conecte seus Funcionários IA via n8n ou Evolution API com facilidade.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          {/* Card de Webhook URL */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-premium-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Webhook className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-black text-xl text-slate-900 tracking-tight">Webhook URL</h3>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                Use esta URL no seu nó HTTP Request do n8n para enviar eventos de mensagens.
              </p>
              <div className="relative flex items-center group/input">
                <input
                  readOnly
                  value={loading ? "Carregando..." : webhookUrl}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-xs font-mono text-slate-600 focus:outline-none focus:border-primary/30 transition-all shadow-inner"
                />
                <button 
                  onClick={() => handleCopy(webhookUrl, 'webhook')}
                  disabled={loading}
                  className="absolute right-3 p-2 hover:bg-white/5 rounded-xl transition-all disabled:opacity-50 text-slate-400"
                >
                  {copied === 'webhook' ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card de API Key Interna */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-premium-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-black text-xl text-slate-900 tracking-tight">API Key Interna</h3>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                Chave mestre para as requisições da sua IA.
              </p>
              <div className="relative flex items-center group/input">
                <input
                  readOnly
                  type="password"
                  value={loading ? "••••••••" : apiKey}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-xs font-mono text-slate-600 focus:outline-none focus:border-primary/30 transition-all shadow-inner"
                />
                <button 
                  onClick={() => handleCopy(apiKey, 'key')}
                  disabled={loading}
                  className="absolute right-3 p-2 hover:bg-white/5 rounded-xl transition-all disabled:opacity-50 text-slate-400"
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
                  onClick={() => setShowRotateModal(true)}
                  disabled={loading || rotating}
                  className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 flex items-center gap-2.5"
                >
                  {rotating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Rotacionar chave
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Personalidade da IA (Fica ao lado em desktops) */}
        <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl relative overflow-hidden group h-full">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-premium-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-8 lg:p-10 flex flex-col h-full">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-slate-900 tracking-tight">Personalidade</h3>
                  <p className="text-sm text-slate-500 font-medium leading-tight">Como o Funcionário IA deve agir.</p>
                </div>
              </div>
              <button
                onClick={handleSavePersonality}
                disabled={savingPersonality}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {savingPersonality ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Save className="h-4 w-4" /> Salvar</>
                )}
              </button>
            </div>

            <div className="relative group/textarea flex-1 min-h-[350px]">
              <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-black text-primary/40 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-lg backdrop-blur-sm pointer-events-none z-10">
                <Wand2 className="h-3 w-3" /> Modo Ativo
              </div>
              <textarea
                value={aiPersonality}
                onChange={(e) => setAiPersonality(e.target.value)}
                placeholder="Defina as instruções para a sua IA..."
                className="w-full h-full rounded-[1.5rem] border border-slate-100 bg-slate-50 px-8 py-10 text-sm text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner leading-relaxed resize-none font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-primary/10 bg-primary/5 p-10 relative overflow-hidden group">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -z-10 group-hover:w-64 group-hover:h-64 transition-all duration-700" />
        <div className="flex items-start gap-6">
          <div className="p-4 bg-primary/10 rounded-[1.5rem] shadow-xl shadow-primary/10">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Fluxo de Implementação Recomendado</h4>
            <div className="grid gap-3">
              {[
                "1. No n8n, crie um workflow que capture mensagens da sua Evolution API.",
                "2. Adicione um nó HTTP Request apontando para o seu 'Webhook URL' acima.",
                "3. No cabeçalho (Header), inclua 'Authorization: Bearer [SUA_API_KEY]'.",
                "4. Seus leads e conversas serão sincronizados em tempo real no Dashboard."
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
