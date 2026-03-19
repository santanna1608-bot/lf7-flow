"use client"

import { Database } from "@/types/database"
import { X, User, Phone, Mail, Calendar, MessageSquare, Tag } from "lucide-react"

type Lead = Database['public']['Tables']['leads']['Row']

interface LeadModalProps {
  lead: Lead | null
  onClose: () => void
}

export function LeadModal({ lead, onClose }: LeadModalProps) {
  if (!lead) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{lead.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {lead.id.slice(0, 8)}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <User className="h-4 w-4" /> Informações do Lead
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span className="font-medium">{lead.phone || "Não informado"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status Atual:</span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                    {lead.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Criado em:</span>
                  <span>{new Date(lead.created_at || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Automação de IA
              </h4>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Status da IA:</span>
                  <span className="text-green-500 font-bold">ATIVA</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Última Interação:</span>
                  <span>há 5 minutos</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Notas internas
            </h4>
            <textarea 
              className="w-full h-32 rounded-lg border bg-muted/50 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Adicione uma nota sobre este lead..."
            />
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Salvar Alterações
              </button>
              <button className="px-4 border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                Arquivar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
