"use client"

import { useMessages } from "@/hooks/use-messages"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Bot, Send, User } from "lucide-react"
import { useRef, useEffect } from "react"

type Lead = Database['public']['Tables']['leads']['Row']

interface ChatWindowProps {
  lead: Lead | null
}

export function ChatWindow({ lead }: ChatWindowProps) {
  const { messages, loading } = useMessages(lead?.id || null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!lead) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-8 bg-muted/20">
        <Bot className="h-16 w-16 text-muted mb-4 opacity-20" />
        <h3 className="text-lg font-medium">Nenhuma conversa selecionada</h3>
        <p className="text-sm text-muted-foreground">Selecione um lead na lateral para monitorar a conversa da IA.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4 bg-card">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {lead.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold">{lead.name}</h3>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-muted-foreground">Monitorando IA</span>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/5 font-sans"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full items-start gap-3",
              msg.role === 'assistant' ? "justify-start" : "justify-end"
            )}
          >
            {msg.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mt-1 shrink-0">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                msg.role === 'assistant' 
                  ? "bg-card border text-card-foreground rounded-tl-none" 
                  : "bg-primary text-primary-foreground rounded-tr-none"
              )}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className={cn(
                "mt-1 text-[10px] opacity-70",
                msg.role === 'assistant' ? "text-muted-foreground" : "text-primary-foreground"
              )}>
                {new Date(msg.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-1 shrink-0">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="IA está ativa... Digite para intervir (opcional)"
              className="w-full rounded-full border bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              disabled
            />
          </div>
          <button className="h-9 w-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground opacity-50 cursor-not-allowed">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-center text-muted-foreground">
          Modo Monitoramento: A IA responde automaticamente com base nas configurações do n8n.
        </p>
      </div>
    </div>
  )
}
