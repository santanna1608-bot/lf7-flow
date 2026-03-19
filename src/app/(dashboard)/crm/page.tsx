"use client"

import { KanbanBoard } from "@/components/crm/kanban-board"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CRMPage() {
  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CRM Kanban</h2>
          <p className="text-muted-foreground">
            Gerencie o progresso dos seus leads e acompanhe as automações de IA.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Adicionaremos o componente de Button real depois */}
          <button className="bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md font-medium text-sm flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Novo Funil
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  )
}
