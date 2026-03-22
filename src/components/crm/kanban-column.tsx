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

  // Cores dinâmicas para o header baseado no título da coluna (Versão Light)
  const getStageStyle = (title: string) => {
    switch (title.toLowerCase()) {
      case 'novo lead': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' }
      case 'qualificado': return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' }
      case 'agendado': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' }
      case 'fechado': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }
      default: return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' }
    }
  }

  const style = getStageStyle(title)

  return (
    <div className="flex w-80 shrink-0 flex-col gap-6 px-1 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-3">
          <div className={cn("h-9 px-4 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] border shadow-sm transition-all hover:scale-105 active:scale-95", style.bg, style.color, style.border)}>
             {title}
          </div>
          <span className="flex h-7 w-10 items-center justify-center rounded-xl bg-white text-[11px] font-black text-slate-400 border border-slate-100 shadow-sm">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onAddLead?.(id)}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all shadow-sm"
            title="Adicionar Lead"
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
            <MoreHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-5 rounded-[2rem] bg-slate-100/70 p-4 transition-all min-h-[550px] border border-slate-200/50 shadow-sm relative overflow-hidden group/column",
          isOver && "bg-slate-200/80 ring-1 ring-primary/20 border-primary/30 scale-[1.01] shadow-lg z-20"
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
            "flex flex-1 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed p-8 text-center transition-all",
            isOver ? "border-primary/40 bg-primary/5" : "border-slate-100 bg-white/30"
          )}>
            <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
              <LayoutPanelTop className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] leading-relaxed">
               Etapa Limpa <br /> 
               <span className="text-[10px] opacity-60 font-medium">Aguardando leads</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
