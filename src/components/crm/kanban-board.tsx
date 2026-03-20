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
import { LeadCreateModal } from "./lead-create-modal"
import { useLeads } from "@/hooks/use-leads"
import { Database } from "@/types/database"

type Lead = Database['public']['Tables']['leads']['Row']

interface KanbanBoardProps {
  activeFunnel: Database['public']['Tables']['funnels']['Row']
}

export function KanbanBoard({ activeFunnel }: KanbanBoardProps) {
  const { leads, updateLead } = useLeads()
  const stages = (activeFunnel.stages as string[]) || ["Novo Lead", "Qualificado", "Agendado", "Fechado"]
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createLeadStatus, setCreateLeadStatus] = useState("")
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
      await updateLead(leadId, { status: newStatus })
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
          {stages.map((stage) => (
            <KanbanColumn
              key={stage}
              id={stage}
              title={stage}
              leads={filteredLeads.filter((lead) => lead.status === stage)}
              onCardClick={setSelectedLead}
              onCardUpdate={updateLead}
              onAddLead={(status) => {
                setCreateLeadStatus(status)
                setIsCreateModalOpen(true)
              }}
            />
          ))}
        </div>
      </div>

      <LeadModal 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)} 
        onUpdate={updateLead}
      />

      <LeadCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {}}
        initialStatus={createLeadStatus}
        companyId={activeFunnel.company_id}
        funnelId={activeFunnel.id}
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
