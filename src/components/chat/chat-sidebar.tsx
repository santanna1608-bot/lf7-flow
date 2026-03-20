"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Search, User } from "lucide-react"

type Lead = Database['public']['Tables']['leads']['Row']

interface ChatSidebarProps {
  onSelectLead: (lead: Lead) => void
  selectedLeadId?: string
}

export function ChatSidebar({ onSelectLead, selectedLeadId }: ChatSidebarProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true

    const fetchLeads = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || !mounted) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('user_id', session.user.id)
          .single()

        if (!profile?.company_id || !mounted) {
          setLeads([])
          return
        }

        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('company_id', profile.company_id)
          .order('last_message_at', { ascending: false })
        
        if (data && mounted) setLeads(data)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchLeads()

    const channel = supabase
      .channel('leads-chat-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchLeads()
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) || 
    lead.phone?.includes(search)
  )

  return (
    <div className="flex h-full w-80 flex-col border-r bg-card">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Conversas</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar lead..."
            className="w-full rounded-md border bg-muted px-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredLeads.map((lead) => (
          <button
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className={cn(
              "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent",
              selectedLeadId === lead.id && "bg-accent"
            )}
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="truncate font-medium">{lead.name}</p>
                <span className="text-[10px] text-muted-foreground">
                  {lead.last_message_at ? new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">{lead.phone || 'Sem telefone'}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
