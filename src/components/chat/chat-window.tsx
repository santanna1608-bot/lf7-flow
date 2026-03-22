"use client"

import { useState, useRef, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useMessages } from "@/hooks/use-messages"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Search, Send, User, ChevronLeft, MoreVertical, Phone, Video, Paperclip, Smile, Zap } from "lucide-react"

type Lead = Database['public']['Tables']['leads']['Row']

interface ChatWindowProps {
  lead: Lead | null
  onBack?: () => void
}

export function ChatWindow({ lead, onBack }: ChatWindowProps) {
  const { messages, loading } = useMessages(lead?.id || null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newMessage.trim() || !lead || sending) return

    setSending(true)
    try {
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          role: 'user',
          lead_id: lead.id,
          company_id: lead.company_id
        })

      if (msgError) throw msgError

      await supabase
        .from('leads')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', lead.id)

      setNewMessage("")
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err)
    } finally {
      setSending(false)
    }
  }

  if (!lead) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-12 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-md flex flex-col items-center animate-in fade-in zoom-in duration-700">
            <div className="h-28 w-28 rounded-[2.5rem] bg-premium-gradient flex items-center justify-center mb-10 shadow-2xl shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                <Zap className="h-14 w-14 text-white fill-current drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">LF7 AI <span className="text-primary">Flow Intelligence</span></h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-12">
                Central de Monitoramento em Tempo Real. Acompanhe a inteligência artificial agindo nos seus leads e intervenha para garantir a conversão perfeita.
            </p>
            <div className="h-[1px] w-48 bg-white/5 mb-12" />
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Conectado e Seguro
              </p>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-transparent relative overflow-hidden">
      {/* Glow de Fundo do Chat */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />

      {/* Header do Chat (Premium Dark) */}
      <div className="h-[76px] flex items-center justify-between px-6 bg-white/5 shrink-0 border-b border-white/5 z-10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="md:hidden p-2 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center relative overflow-hidden border border-white/5 shadow-inner group-hover/chat:scale-105 transition-transform">
             <span className="text-xl font-black text-primary opacity-80">{lead.name.charAt(0)}</span>
             <User className="h-8 w-8 text-white absolute opacity-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-black text-white leading-tight tracking-tight">{lead.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">IA Monitorando Fluxo</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
           <button className="p-2.5 hover:bg-white/5 hover:text-white rounded-xl transition-all"><Search className="h-5 w-5" /></button>
           <button className="p-2.5 hover:bg-white/5 hover:text-white rounded-xl transition-all"><MoreVertical className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Área de Mensagens (Dark Premium) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 z-10 custom-scrollbar"
      >
        {messages.length === 0 && !loading && (
            <div className="flex justify-center my-8 scale-in-center">
                <span className="bg-white/5 border border-white/5 px-4 py-2 rounded-2xl text-[10px] text-slate-500 backdrop-blur-xl uppercase font-black tracking-[0.2em] shadow-2xl">Início da conversa</span>
            </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === 'assistant' ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] md:max-w-[70%] px-5 py-4 shadow-2xl relative text-[14px] leading-relaxed tracking-tight group/msg",
                msg.role === 'assistant' 
                  ? "bg-white/5 text-white border border-white/5 rounded-[2rem] rounded-tl-none backdrop-blur-xl" 
                  : "bg-premium-gradient text-white rounded-[2rem] rounded-tr-none shadow-primary/20"
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <div className={cn(
                "flex items-center gap-2 mt-3 justify-end",
                "text-[9px] font-black uppercase tracking-tighter opacity-40 group-hover/msg:opacity-80 transition-opacity"
              )}>
                {new Date(msg.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.role === 'user' && (
                  <svg viewBox="0 0 16 15" width="14" height="13" className="text-white ml-0.5"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879l-2.976-2.09a.307.307 0 0 0-.413.056l-.427.5a.306.306 0 0 0 .048.42l3.756 2.64a.341.341 0 0 0 .461-.044L15.083 3.82a.374.374 0 0 0-.073-.504zm-3.514.391l-.478-.372a.365.365 0 0 0-.51.063l-2.001 2.506a.342.342 0 0 0 .061.472l.441.344a.366.366 0 0 0 .51-.063l2.05-2.568a.375.375 0 0 0-.073-.482zM4.156 10.45l-2.454-1.724a.306.306 0 0 0-.413.056l-.427.5a.306.306 0 0 0 .048.42l3.756 2.64a.341.341 0 0 0 .461-.044L5.672 11.5l-.65-.508l-1.127 1.41z"></path></svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Área de Input (Dark Premium) */}
      <div className="bg-white/5 pt-4 pb-6 px-6 flex flex-col gap-4 z-10 backdrop-blur-2xl border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-500">
             <button className="p-2.5 hover:bg-white/5 hover:text-white rounded-xl transition-all"><Smile className="h-5.5 w-5.5" /></button>
             <button className="p-2.5 hover:bg-white/5 hover:text-white rounded-xl transition-all"><Paperclip className="h-5.5 w-5.5" /></button>
          </div>
          
          <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-4">
            <input
              type="text"
              placeholder="Envie sua mensagem por aqui..."
              className="flex-1 h-12 rounded-[1.25rem] bg-white/5 border border-white/10 px-6 py-3 text-sm font-medium focus:outline-none placeholder:text-slate-600 text-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <button 
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="h-12 w-12 flex items-center justify-center bg-premium-gradient text-white rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100"
            >
              <Send className="h-5 w-5 translate-x-0.5" />
            </button>
          </form>
        </div>

        <div className="text-center px-4">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <Zap className="h-3 w-3 text-primary animate-pulse" /> Intervenção Humana: A IA será pausada automaticamente ao você enviar uma mensagem.
            </p>
        </div>
      </div>
    </div>
  )
}
