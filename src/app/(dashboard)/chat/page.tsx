"use client"

import { useState } from "react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWindow } from "@/components/chat/chat-window"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"

type Lead = Database['public']['Tables']['leads']['Row']

export default function ChatPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  return (
    <div className="flex h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)] overflow-hidden rounded-xl border bg-card shadow-lg relative">
      <div className={cn(
        "w-full md:w-80 border-r",
        selectedLead ? "hidden md:block" : "block"
      )}>
        <ChatSidebar 
          onSelectLead={setSelectedLead} 
          selectedLeadId={selectedLead?.id} 
        />
      </div>
      <div className={cn(
        "flex-1 overflow-hidden h-full",
        !selectedLead ? "hidden md:flex" : "flex"
      )}>
        <ChatWindow 
          lead={selectedLead} 
          onBack={() => setSelectedLead(null)}
        />
      </div>
    </div>
  )
}
