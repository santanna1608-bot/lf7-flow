"use client"

import { useState } from "react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWindow } from "@/components/chat/chat-window"
import { Database } from "@/types/database"

type Lead = Database['public']['Tables']['leads']['Row']

export default function ChatPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-xl border bg-card shadow-lg">
      <ChatSidebar 
        onSelectLead={setSelectedLead} 
        selectedLeadId={selectedLead?.id} 
      />
      <div className="flex-1 overflow-hidden">
        <ChatWindow lead={selectedLead} />
      </div>
    </div>
  )
}
