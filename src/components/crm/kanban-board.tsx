"use client"

import { useState } from "react"
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent, 
  PointerSensor, 
  useSensor, 
  useSensors,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { LeadModal } from "./lead-modal"
import { useLeads } from "@/hooks/use-leads"
import { Database } from "@/types/database"

type Lead = Database['public']['Tables']['leads']['Row']

const DEFAULT_STAGES = ["Novo Lead", "Qualificado", "Agendado", "Fechado"]

export function KanbanBoard() {
  const { leads, updateLeadStatus } = useLeads()
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveLead(event.active.data.current as Lead)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const leadId = active.id as string
    const newStatus = over.id as string

    if (activeLead && activeLead.status !== newStatus) {
      await updateLeadStatus(leadId, newStatus)
    }
    
    setActiveLead(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-6 overflow-x-auto pb-8">
        {DEFAULT_STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            id={stage}
            title={stage}
            leads={leads.filter((lead) => lead.status === stage)}
            onCardClick={setSelectedLead}
          />
        ))}
      </div>

      <LeadModal 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)} 
      />

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeLead ? <KanbanCard lead={activeLead} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
