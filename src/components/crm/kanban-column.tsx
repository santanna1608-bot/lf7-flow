"use client"

import { useDroppable } from "@dnd-kit/core"
import { KanbanCard } from "./kanban-card"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Plus } from "lucide-react"

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

  return (
    <div className="flex w-80 shrink-0 flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onAddLead?.(id)}
            className="rounded-md p-1 hover:bg-muted text-muted-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1 hover:bg-muted text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-3 rounded-xl bg-muted/30 p-2 transition-colors min-h-[500px]",
          isOver && "bg-muted/50 ring-2 ring-primary/20"
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
          <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center p-4">
            <p className="text-xs text-muted-foreground">Nenhum lead nesta etapa</p>
          </div>
        )}
      </div>
    </div>
  )
}
