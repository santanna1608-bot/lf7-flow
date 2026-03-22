"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Search, User, MoreVertical, MessageSquarePlus, CircleDashed } from "lucide-react"

type Lead = Database['public']['Tables']['leads']['Row']

interface ChatSidebarProps {
  onSelectLead: (lead: Lead) => void
  selectedLeadId?: string
}

export function ChatSidebar({ onSelectLead, selectedLeadId }: ChatSidebarProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true

    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || !mounted) return

        // Buscar avatar do usuário logado
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id, avatar_url')
          .eq('user_id', session.user.id)
          .single()

        if (profile?.avatar_url) setUserAvatar(profile.avatar_url)

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

    fetchInitialData()

    const channel = supabase
      .channel('leads-chat-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchInitialData()
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

  return (    <div className="flex h-full w-full flex-col bg-transparent border-r border-white/5">
      {/* WhatsApp Header: Perfil do Usuário e Ações (Dark Style) */}
      <div className="h-[76px] bg-white/5 px-6 flex items-center justify-between shrink-0 border-b border-white/5 backdrop-blur-md">
        <div className="h-11 w-11 rounded-2xl bg-white/5 p-[2px] shadow-lg shadow-black/20">
           <div className="h-full w-full rounded-2xl bg-[#0a0e1b] flex items-center justify-center overflow-hidden border border-white/5">
             {userAvatar ? (
               <img src={userAvatar} alt="Meu Perfil" className="h-full w-full object-cover" />
             ) : (
               <div className="h-full w-full flex items-center justify-center text-slate-500">
                  <User className="h-6 w-6" />
               </div>
             )}
           </div>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
           <button className="p-2.5 hover:bg-white/5 hover:text-white rounded-xl transition-all">
              <CircleDashed className="h-5.5 w-5.5" />
           </button>
           <button className="p-2.5 hover:bg-white/5 hover:text-white rounded-xl transition-all">
              <MessageSquarePlus className="h-5.5 w-5.5" />
           </button>
           <button className="p-2.5 hover:bg-white/5 hover:text-white rounded-xl transition-all">
              <MoreVertical className="h-5.5 w-5.5" />
           </button>
        </div>
      </div>

      {/* Busca Estilo Dark Premium */}
      <div className="p-4 border-b border-white/5 shrink-0 bg-white/[0.02]">
        <div className="relative flex items-center group">
          <div className="absolute left-4 text-slate-500 group-focus-within:text-primary transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar conversa..."
            className="w-full rounded-2xl bg-white/5 pl-12 pr-6 py-3 text-sm font-medium focus:outline-none placeholder:text-slate-600 text-white border border-white/5 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Conversas (Dark) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading && leads.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Carregando conversas...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-10 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest italic">Nenhuma conversa encontrada.</div>
        ) : (
          filteredLeads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className={cn(
                "flex w-full items-center gap-4 px-6 py-4 text-left transition-all border-b border-white/5 relative overflow-hidden group/item",
                selectedLeadId === lead.id ? "bg-white/10" : "hover:bg-white/[0.03]"
              )}
            >
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden relative border border-white/5 shadow-inner transition-transform group-hover/item:scale-105">
                <span className="text-xl font-black text-slate-500 uppercase">{lead.name.charAt(0)}</span>
                <User className="h-10 w-10 text-white absolute opacity-5" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={cn(
                    "truncate font-black text-[16px] tracking-tight transition-colors",
                    selectedLeadId === lead.id ? "text-primary" : "text-white group-hover/item:text-primary"
                  )}>{lead.name}</p>
                  <span className={cn(
                    "text-[10px] whitespace-nowrap ml-2 font-black uppercase tracking-tighter opacity-60",
                    selectedLeadId === lead.id ? "text-primary" : "text-slate-500"
                  )}>
                    {lead.last_message_at ? new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="truncate text-[11px] font-bold text-slate-500 tracking-wide uppercase">
                    {lead.phone || 'Sem contato'}
                  </p>
                  {lead.ai_enabled !== false && (
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
