"use client"

import { useState } from "react"
import { 
  Key, 
  ExternalLink, 
  Copy, 
  Check, 
  Webhook, 
  ShieldCheck,
  Zap
} from "lucide-react"

export default function SettingsPage() {
  const [copied, setCopied] = useState<string | null>(null)
  
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const apiKey = "sk_lf7_live_9a2b3c4d5e6f7g8h9i0j"
  const webhookUrl = "https://api.lf7flow.com/v1/webhooks/n8n/4f2a1b9c"

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações de Integração</h2>
          <p className="text-muted-foreground">Conecte seus Agentes de IA via n8n ou Evolution API.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Webhook className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Webhook URL</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Use esta URL no seu nó HTTP Request do n8n para enviar eventos de mensagens para o CRM.
            </p>
            <div className="relative flex items-center">
              <input
                readOnly
                value={webhookUrl}
                className="w-full rounded-md border bg-muted/50 px-4 py-2.5 text-sm font-mono focus:outline-none"
              />
              <button 
                onClick={() => handleCopy(webhookUrl, 'webhook')}
                className="absolute right-2 p-1.5 hover:bg-muted rounded-md transition-colors"
                title="Copiar para área de transferência"
              >
                {copied === 'webhook' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-primary">
              <ExternalLink className="h-3 w-3" />
              <a href="#" className="hover:underline">Ver documentação do n8n</a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">API Key Interna</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Chave de autenticação para as requisições da sua IA. Mantenha em segredo.
            </p>
            <div className="relative flex items-center">
              <input
                readOnly
                type="password"
                value={apiKey}
                className="w-full rounded-md border bg-muted/50 px-4 py-2.5 text-sm font-mono focus:outline-none"
              />
              <button 
                onClick={() => handleCopy(apiKey, 'key')}
                className="absolute right-2 p-1.5 hover:bg-muted rounded-md transition-colors"
              >
                {copied === 'key' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="mt-6">
              <button className="text-xs font-semibold text-destructive hover:underline">
                Rotacionar chave de API
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-primary/5 p-8 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold">Resumo da Integração</h4>
            <p className="text-sm text-muted-foreground max-w-2xl">
              1. No n8n, crie um fluxo que receba mensagens da Evolution API.<br/>
              2. Adicione um nó HTTP Request apontando para o seu Webhook URL.<br/>
              3. Inclua o Header `Authorization: Bearer [SUA_API_KEY]`.<br/>
              4. Seus leads e conversas aparecerão instantaneamente no Live Chat e Kanban.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
