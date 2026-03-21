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
      <div className="flex h-full flex-col items-center justify-center text-center p-12 bg-[#f0f2f5] border-l border-[#e9edef]">
        <div className="max-w-md flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center mb-8 opacity-40">
                <Zap className="h-12 w-12 text-slate-400 fill-current" />
            </div>
            <h1 className="text-3xl font-light text-[#41525d] mb-4">LF7 AI <span className="font-bold">Flow Web</span></h1>
            <p className="text-[#667781] text-sm leading-relaxed mb-10">
                Monitore suas conversas em tempo real. Acompanhe o atendimento da sua IA e intervenha sempre que necessário para garantir o melhor fechamento.
            </p>
            <div className="h-[1px] w-full bg-[#d1d7db] mb-10" />
            <p className="text-[#8696a0] text-xs flex items-center gap-2">
                <Zap className="h-3 w-3 fill-current" /> Protegido com criptografia de ponta a ponta
            </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#efeae2] relative overflow-hidden">
      {/* WhatsApp Chat Pattern (Opcional - mas dá o toque final) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />

      {/* Header do Chat */}
      <div className="h-[60px] flex items-center justify-between px-4 bg-[#f0f2f5] shrink-0 border-b border-[#e9edef] z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="md:hidden p-1 text-[#54656f] hover:bg-black/5 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <div className="h-10 w-10 rounded-full bg-[#dfe5e7] flex items-center justify-center relative overflow-hidden border border-slate-200">
             {lead.name.charAt(0).toUpperCase()}
             <User className="h-8 w-8 text-[#919191] absolute opacity-20" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-[#111b21] leading-tight">{lead.name}</h3>
            <span className="text-[12px] text-[#667781]">Monitorando fluxo IA</span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-[#54656f]">
           <button className="p-2 hover:bg-black/5 rounded-full"><Search className="h-5 w-5" /></button>
           <button className="p-2 hover:bg-black/5 rounded-full"><MoreVertical className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 z-10 scrollbar-thin scrollbar-thumb-slate-300"
      >
        {messages.length === 0 && !loading && (
            <div className="flex justify-center my-4">
                <span className="bg-[#fff9c2] px-3 py-1.5 rounded-lg text-[11px] text-[#54656f] shadow-sm uppercase font-bold tracking-wider">Aguardando mensagens...</span>
            </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full mb-1",
              msg.role === 'assistant' ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] md:max-w-[70%] px-2.5 py-1.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative text-[14.2px] break-words",
                msg.role === 'assistant' 
                  ? "bg-white text-[#111b21] rounded-lg rounded-tl-none" 
                  : "bg-[#dcf8c6] text-[#111b21] rounded-lg rounded-tr-none"
              )}
            >
              <p className="whitespace-pre-wrap leading-normal pr-12">{msg.content}</p>
              <div className={cn(
                "absolute bottom-1 right-1.5 flex items-center gap-1",
                "text-[10px] text-[#667781]/70"
              )}>
                {new Date(msg.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.role === 'user' && (
                  <svg viewBox="0 0 16 15" width="16" height="15" className="text-[#53bdeb] ml-0.5"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879l-2.976-2.09a.307.307 0 0 0-.413.056l-.427.5a.306.306 0 0 0 .048.42l3.756 2.64a.341.341 0 0 0 .461-.044L15.083 3.82a.374.374 0 0 0-.073-.504zm-3.514.391l-.478-.372a.365.365 0 0 0-.51.063l-2.001 2.506a.342.342 0 0 0 .061.472l.441.344a.366.366 0 0 0 .51-.063l2.05-2.568a.375.375 0 0 0-.073-.482zM4.156 10.45l-2.454-1.724a.306.306 0 0 0-.413.056l-.427.5a.306.306 0 0 0 .048.42l3.756 2.64a.341.341 0 0 0 .461-.044L5.672 11.5l-.65-.508l-1.127 1.41z"></path></svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Área de Input Estilo WhatsApp */}
      <div className="bg-[#f0f2f5] min-h-[62px] py-1.5 px-4 flex items-center gap-3 z-10">
        <div className="flex items-center gap-2 text-[#54656f]">
           <button className="p-2 hover:bg-black/5 rounded-full"><Smile className="h-6 w-6" /></button>
           <button className="p-2 hover:bg-black/5 rounded-full"><Paperclip className="h-6 w-6" /></button>
        </div>
        
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-3">
          <input
            type="text"
            placeholder="Digite uma mensagem"
            className="flex-1 h-10 rounded-lg bg-white px-4 py-2 text-[15px] focus:outline-none placeholder:text-[#667781] text-[#3b4a54]"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 flex items-center justify-center text-[#54656f] hover:bg-black/5 rounded-full transition-all disabled:opacity-30"
          >
            <Send className="h-6 w-6" />
          </button>
        </form>
      </div>

      <div className="bg-[#f0f2f5] pb-2 text-center z-10">
          <p className="text-[10px] text-[#667781] px-4 font-medium uppercase tracking-wider">
            Intervenção Humana: A IA será pausada automaticamente se você enviar uma mensagem.
          </p>
      </div>
    </div>
  )
}
