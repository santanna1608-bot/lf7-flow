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
      <div className="flex h-full flex-col items-center justify-center text-center p-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-md flex flex-col items-center animate-in fade-in zoom-in duration-700">
            <div className="h-28 w-28 rounded-[2.5rem] bg-premium-gradient flex items-center justify-center mb-10 shadow-2xl shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                <Zap className="h-14 w-14 text-white fill-current drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">LF7 AI <span className="text-primary">Flow Intelligence</span></h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-12">
                Central de Monitoramento em Tempo Real. Acompanhe a inteligência artificial agindo nos seus leads e intervenha para garantir a conversão perfeita.
            </p>
            <div className="h-[1px] w-48 bg-slate-100 mb-12" />
            <div className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Conectado e Seguro
              </p>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#efeae2] relative overflow-hidden">
      {/* Background Pattern (Subtle WhatsApp feel) */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
      {/* Header do Chat (Light Style) */}
      <div className="h-[76px] flex items-center justify-between px-6 bg-white shrink-0 border-b border-slate-100 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="md:hidden p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center relative overflow-hidden border border-slate-100 shadow-inner">
             <span className="text-xl font-black text-primary opacity-80">{lead.name.charAt(0)}</span>
             <User className="h-8 w-8 text-slate-900 absolute opacity-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-black text-slate-900 leading-tight tracking-tight">{lead.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IA Monitorando Fluxo</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
           <button className="p-2.5 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all"><Search className="h-5 w-5" /></button>
           <button className="p-2.5 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all"><MoreVertical className="h-5 w-5" /></button>
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
                "max-w-[85%] md:max-w-[70%] px-5 py-4 shadow-sm relative text-[14px] leading-relaxed tracking-tight group/msg",
                msg.role === 'assistant' 
                  ? "bg-white text-slate-900 border border-slate-100 rounded-[2rem] rounded-tl-none" 
                  : "bg-premium-gradient text-white rounded-[2rem] rounded-tr-none shadow-xl shadow-primary/10"
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

      {/* Área de Input (WhatsApp Style) */}
      <div className="bg-[#f0f2f5] py-3 px-4 flex flex-col gap-2 z-10 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-500">
             <button className="p-2 hover:bg-slate-200 rounded-full transition-all"><Smile className="h-6 w-6" /></button>
             <button className="p-2 hover:bg-slate-200 rounded-full transition-all"><Paperclip className="h-6 w-6" /></button>
          </div>
          
          <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-3">
            <input
              type="text"
              placeholder="Digite uma mensagem"
              className="flex-1 h-11 rounded-lg bg-white border-none px-4 text-[15px] focus:outline-none placeholder:text-slate-500 text-slate-900 transition-all shadow-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <button 
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="h-11 w-11 flex items-center justify-center bg-transparent text-slate-500 hover:text-slate-900 transition-all disabled:opacity-20"
            >
              <Send className="h-6 w-6" />
            </button>
          </form>
        </div>

        <div className="text-center md:block hidden">
            <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-2">
              <Zap className="h-3 w-3 text-primary" /> IA pausada automaticamente ao intervir no fluxo.
            </p>
        </div>
      </div>
    </div>
  )
}
