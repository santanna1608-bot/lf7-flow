"use client"

import { useState, useEffect } from "react"
import { Database } from "@/types/database"
import { X, User, Phone, Mail, Calendar, MessageSquare, Tag } from "lucide-react"

type Lead = Database['public']['Tables']['leads']['Row']

interface LeadModalProps {
  lead: Lead | null
  onClose: () => void
  onUpdate?: (leadId: string, updates: Partial<Lead>) => Promise<boolean>
}

export function LeadModal({ lead, onClose, onUpdate }: LeadModalProps) {
  const [name, setName] = useState(lead?.name || "")
  const [phone, setPhone] = useState(lead?.phone || "")
  const [aiEnabled, setAiEnabled] = useState(lead?.ai_enabled ?? true)
  const [notes, setNotes] = useState(lead?.notes || "")
  const [loading, setLoading] = useState(false)

  // Update local state when lead changes
  useEffect(() => {
    if (lead) {
      setName(lead.name)
      setPhone(lead.phone || "")
      setAiEnabled(lead.ai_enabled ?? true)
      setNotes(lead.notes || "")
    }
  }, [lead])

  if (!lead) return null

  const handleSave = async () => {
    if (!onUpdate || loading) return
    setLoading(true)
    const success = await onUpdate(lead.id, {
      name: name.trim(),
      phone: phone.trim() || null,
      ai_enabled: aiEnabled,
      notes: notes.trim() || null
    })
    if (success) onClose()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl uppercase">
              {name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{name || "Sem Nome"}</h3>
              <p className="text-sm text-muted-foreground">ID: {lead.id.slice(0, 8)}</p>
            </div>
          </div>
          <button 
            type="button"
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
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Nome:</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-muted/30 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">WhatsApp / Telefone:</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-muted/30 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-muted-foreground">Status Atual:</span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-bold text-primary">
                    {lead.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Automação de IA
              </h4>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monitoramento IA:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={aiEnabled}
                      onChange={(e) => setAiEnabled(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Última Interação:</span>
                  <span>{lead.last_message_at ? new Date(lead.last_message_at).toLocaleTimeString() : 'Nenhuma'}</span>
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
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="flex gap-2 pt-4">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
