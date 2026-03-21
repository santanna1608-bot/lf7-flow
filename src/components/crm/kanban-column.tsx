"use client"

import { useDroppable } from "@dnd-kit/core"
import { KanbanCard } from "./kanban-card"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Plus, LayoutPanelTop } from "lucide-react"

type Lead = Database['public']['Tables']['leads']['Row']

interface KanbanColumnProps {
  id: string
  title: string
  leads: Lead[]
  onCardClick?: (lead: Lead) => void
  onCardUpdate?: (leadId: string, updates: Partial<Lead>) => void
  onAddLead?: (status: string) => void
}

export function KanbanColumn({ id, title, leads, onCardClick, onCardUpdate, onAddLead }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  // Cores dinâmicas para o header baseado no título da coluna
  const getStageStyle = (title: string) => {
    switch (title.toLowerCase()) {
      case 'novo lead': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
      case 'qualificado': return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' }
      case 'agendado': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
      case 'fechado': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
      default: return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' }
    }
  }

  const style = getStageStyle(title)

  return (
    <div className="flex w-80 shrink-0 flex-col gap-5 px-1 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between group/header">
        <div className="flex items-center gap-2.5">
          <div className={cn("h-7 px-2.5 rounded-lg flex items-center justify-center font-black text-[10px] uppercase tracking-[0.1em] border shadow-sm", style.bg, style.color, style.border)}>
             {title}
          </div>
          <span className="flex h-5 w-8 items-center justify-center rounded-full bg-slate-200/50 text-[10px] font-black text-slate-500 border border-slate-200/50">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
          <button 
            onClick={() => onAddLead?.(id)}
            className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-400 hover:text-primary transition-all"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-400 transition-all">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-4 rounded-2xl bg-slate-50/50 p-3 transition-all min-h-[500px] border border-transparent",
          isOver && "bg-white ring-2 ring-primary/10 border-primary/20 scale-[1.01] shadow-xl z-20"
        )}
      >
        {leads.map((lead) => (
          <KanbanCard 
            key={lead.id} 
            lead={lead} 
            onClick={onCardClick} 
            onUpdate={onCardUpdate}
          />
        ))}
        
        {leads.length === 0 && (
          <div className={cn(
            "flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-8 text-center transition-all",
            isOver ? "border-primary/40 bg-primary/5" : "bg-white/40"
          )}>
            <LayoutPanelTop className="h-10 w-10 text-slate-200 mb-3" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
               Nenhum lead <br /> nesta etapa
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
