"use client"

import { useDraggable } from "@dnd-kit/core"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Calendar, Phone, User, MessageSquare, ExternalLink, Zap } from "lucide-react"

type Lead = Database['public']['Tables']['leads']['Row']

interface KanbanCardProps {
  lead: Lead
  onClick?: (lead: Lead) => void
  onUpdate?: (leadId: string, updates: Partial<Lead>) => void
}

export function KanbanCard({ lead, onClick, onUpdate }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: lead
  })

  // Cores dinâmicas para o card baseado no status (opcional, mas adicionamos como borda lateral)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'novo lead': return 'bg-blue-500'
      case 'qualificado': return 'bg-purple-500'
      case 'agendado': return 'bg-amber-500'
      case 'fechado': return 'bg-emerald-500'
      default: return 'bg-slate-300'
    }
  }

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick?.(lead)}
      className={cn(
        "group cursor-grab rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden",
        !isDragging && "transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1",
        isDragging && "opacity-50 ring-2 ring-primary/20 scale-95 cursor-grabbing"
      )}
    >
      {/* Borda lateral de status */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", getStatusColor(lead.status || ""))} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-black text-[15px] text-slate-900 leading-tight group-hover:text-primary transition-colors">{lead.name}</h4>
            <div className="flex items-center text-[11px] font-bold text-slate-400 mt-0.5">
               <Calendar className="mr-1 h-3.5 w-3.5" />
               {lead.last_message_at ? new Date(lead.last_message_at).toLocaleDateString('pt-BR') : 'Sem interação'}
            </div>
          </div>
        </div>
        
        <div className="flex -space-x-1 items-center" onClick={(e) => e.stopPropagation()}>
           <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={lead.ai_enabled ?? true}
              onChange={(e) => {
                onUpdate?.(lead.id, { ai_enabled: e.target.checked })
              }}
            />
            <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
          </label>
        </div>
      </div>
      
      <div className="space-y-3 mb-5">
        {lead.phone && (
          <div className="flex items-center text-xs font-bold text-slate-500 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <Phone className="mr-2 h-3.5 w-3.5 text-primary/60" />
            {lead.phone}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5">
          {lead.ai_enabled !== false ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-slate-300"></span>
          )}
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.1em]",
            lead.ai_enabled !== false ? "text-emerald-600" : "text-slate-400"
          )}>
            {lead.ai_enabled !== false ? "IA Monitorando" : "IA Pausada"}
          </span>
        </div>

        <div className="flex items-center gap-2">
           <button 
             className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
             title="Abrir Chat"
           >
              <MessageSquare className="h-4 w-4" />
           </button>
           <button 
             className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
             title="Ver Detalhes"
           >
              <ExternalLink className="h-4 w-4" />
           </button>
        </div>
      </div>
    </div>
  )
}
