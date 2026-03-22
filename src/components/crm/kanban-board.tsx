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
import { LeadList } from "./lead-list"
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
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
        {/* Kanban Search Header - Light Style */}
        <div className="flex items-center justify-between gap-6 bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm mb-2 group transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -z-10" />
          
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 font-black group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar leads neste funil..."
              className="w-full pl-14 pr-6 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/10 border-transparent focus:border-primary/20 transition-all text-[14px] font-medium text-slate-900 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
               <button 
                 onClick={() => setViewMode("grid")}
                 className={cn(
                   "p-2.5 rounded-xl transition-all",
                   viewMode === "grid" ? "bg-premium-gradient shadow-lg shadow-primary/20 text-white" : "text-slate-400 hover:text-slate-900 hover:bg-white"
                 )}
               >
                 <LayoutGrid className="h-4 w-4" />
               </button>
               <button 
                 onClick={() => setViewMode("list")}
                 className={cn(
                   "p-2.5 rounded-xl transition-all",
                   viewMode === "list" ? "bg-premium-gradient shadow-lg shadow-primary/20 text-white" : "text-slate-400 hover:text-slate-900 hover:bg-white"
                 )}
               >
                 <List className="h-4 w-4" />
               </button>
            </div>
            
            <div className="h-10 w-[1px] bg-white/5" />

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] bg-white/5 px-5 py-3 rounded-2xl border border-white/5 shadow-sm flex items-center gap-2.5">
                <Filter className="h-3.5 w-3.5 text-primary" />
                {filteredLeads.length} <span className="text-slate-500">Leads</span>
              </span>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
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
        ) : (
          <div className="flex-1 overflow-auto pb-10">
            <LeadList 
              leads={filteredLeads} 
              onCardClick={setSelectedLead}
              onCardUpdate={updateLead}
            />
          </div>
        )}
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
