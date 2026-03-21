"use client"

import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Calendar, Phone, User, MessageSquare, ExternalLink, MoreVertical } from "lucide-react"

type Lead = Database['public']['Tables']['leads']['Row']

interface LeadListProps {
  leads: Lead[]
  onCardClick?: (lead: Lead) => void
  onCardUpdate?: (leadId: string, updates: Partial<Lead>) => void
}

export function LeadList({ leads, onCardClick, onCardUpdate }: LeadListProps) {
  
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'novo lead': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'qualificado': return 'bg-purple-50 text-purple-600 border-purple-100'
      case 'agendado': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'fechado': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white/60 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100/50">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lead</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">WhatsApp</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Última Interação</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Automação</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr 
                key={lead.id} 
                onClick={() => onCardClick?.(lead)}
                className="group hover:bg-white/60 transition-all cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      {lead.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{lead.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">ID: {lead.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                    getStatusStyle(lead.status || "")
                  )}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-primary/40" />
                    {lead.phone || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-300" />
                    {lead.last_message_at ? new Date(lead.last_message_at).toLocaleDateString('pt-BR') : "--/--/--"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={lead.ai_enabled ?? true}
                        onChange={(e) => {
                          onCardUpdate?.(lead.id, { ai_enabled: e.target.checked })
                        }}
                      />
                      <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                    </label>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      lead.ai_enabled !== false ? "text-emerald-500" : "text-slate-400"
                    )}>
                      {lead.ai_enabled !== false ? "Ativa" : "Pausada"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                     <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                        <MessageSquare className="h-4 w-4" />
                     </button>
                     <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                        <ExternalLink className="h-4 w-4" />
                     </button>
                     <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-all">
                        <MoreVertical className="h-4 w-4" />
                     </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 && (
          <div className="p-12 text-center">
             <User className="mx-auto h-12 w-12 text-slate-200 mb-4" />
             <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Nenhum Lead Encontrado</h3>
             <p className="text-sm text-slate-400 mt-2">Tente ajustar sua busca ou adicione um novo lead.</p>
          </div>
        )}
      </div>
    </div>
  )
}
