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
import { Search, Filter, LayoutGrid, List } from "lucide-react"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { LeadModal } from "./lead-modal"
import { LeadCreateModal } from "./lead-create-modal"
import { useLeads } from "@/hooks/use-leads"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"

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
      <div className="flex flex-col h-full gap-8">
        {/* Kanban Search Header - Premium Style */}
        <div className="flex items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-5 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] mb-2 group transition-all hover:bg-white/60">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 font-black group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar leads neste funil..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-white/80 focus:outline-none focus:ring-4 focus:ring-primary/10 border-transparent focus:border-primary/20 transition-all text-[15px] text-slate-900 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/50">
               <button className="p-2 rounded-lg bg-white shadow-sm text-primary"><LayoutGrid className="h-4 w-4" /></button>
               <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600"><List className="h-4 w-4" /></button>
            </div>
            
            <div className="h-10 w-[1px] bg-slate-200/60" />

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-primary/60" />
                {filteredLeads.length} <span className="text-slate-400">Leads</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 gap-8 overflow-x-auto pb-10 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
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
              scale: '1.05',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            },
          },
        }),
      }}>
        {activeLead ? <KanbanCard lead={activeLead} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
