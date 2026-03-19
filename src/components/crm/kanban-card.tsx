"use client"

import { useDraggable } from "@dnd-kit/core"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Calendar, Phone, User } from "lucide-react"

type Lead = Database['public']['Tables']['leads']['Row']

interface KanbanCardProps {
  lead: Lead
  onClick?: (lead: Lead) => void
}

export function KanbanCard({ lead, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: lead
  })

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
        "group cursor-grab rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div className="flex -space-x-2">
          {/* Mock avatars for visual flair */}
          <div className="h-5 w-5 rounded-full border-2 border-background bg-blue-500" />
          <div className="h-5 w-5 rounded-full border-2 border-background bg-indigo-500" />
        </div>
      </div>
      
      <h4 className="font-semibold text-sm mb-1">{lead.name}</h4>
      
      <div className="space-y-1.5">
        {lead.phone && (
          <div className="flex items-center text-[10px] text-muted-foreground">
            <Phone className="mr-1 h-3 w-3" />
            {lead.phone}
          </div>
        )}
        <div className="flex items-center text-[10px] text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          {lead.last_message_at ? new Date(lead.last_message_at).toLocaleDateString() : 'Nenhuma interação'}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          IA Ativa
        </span>
        <div className="text-[10px] font-medium text-muted-foreground">
          {lead.status}
        </div>
      </div>
    </div>
  )
}
