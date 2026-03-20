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
import { Search } from "lucide-react"
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
  const [searchTerm, setSearchTerm] = useState("")
  
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

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full gap-6">
        {/* Kanban Search Header */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 font-bold" />
            <input
              type="text"
              placeholder="Buscar lead pelo nome..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-slate-900 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              {filteredLeads.length} Leads
            </span>
          </div>
        </div>

        <div className="flex flex-1 gap-6 overflow-x-auto pb-8 min-h-0">
          {DEFAULT_STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              id={stage}
              title={stage}
              leads={filteredLeads.filter((lead) => lead.status === stage)}
              onCardClick={setSelectedLead}
            />
          ))}
        </div>
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
