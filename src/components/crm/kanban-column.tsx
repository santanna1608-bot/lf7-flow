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

  // Cores dinâmicas para o header baseado no título da coluna (Versão Dark)
  const getStageStyle = (title: string) => {
    switch (title.toLowerCase()) {
      case 'novo lead': return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
      case 'qualificado': return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' }
      case 'agendado': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
      case 'fechado': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
      default: return { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10' }
    }
  }

  const style = getStageStyle(title)

  return (
    <div className="flex w-80 shrink-0 flex-col gap-6 px-1 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between group/header">
        <div className="flex items-center gap-3">
          <div className={cn("h-8 px-4 rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.15em] border backdrop-blur-md shadow-lg shadow-black/20", style.bg, style.color, style.border)}>
             {title}
          </div>
          <span className="flex h-6 w-9 items-center justify-center rounded-full bg-white/5 text-[10px] font-black text-slate-500 border border-white/5 shadow-inner">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
          <button 
            onClick={() => onAddLead?.(id)}
            className="rounded-xl p-2 hover:bg-white/5 text-slate-500 hover:text-white transition-all"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button className="rounded-xl p-2 hover:bg-white/5 text-slate-500 transition-all">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-5 rounded-[2rem] bg-white/5 p-4 transition-all min-h-[550px] border border-white/5 shadow-2xl relative overflow-hidden group/column",
          isOver && "bg-white/[0.08] ring-1 ring-primary/30 border-primary/40 scale-[1.01] shadow-primary/10 z-20"
        )}
      >
        {/* Glow de fundo da coluna */}
        <div className={cn(
          "absolute -top-12 -right-12 w-24 h-24 blur-[40px] rounded-full -z-10 opacity-20 transition-opacity duration-500",
          style.bg.replace('bg-', 'bg-').split('/')[0]
        )} />

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
            "flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all",
            isOver ? "border-primary/40 bg-primary/5" : "border-white/5 bg-transparent"
          )}>
            <LayoutPanelTop className="h-12 w-12 text-slate-700 mb-4 opacity-50" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] leading-relaxed">
               Nenhum lead <br /> nesta etapa
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
