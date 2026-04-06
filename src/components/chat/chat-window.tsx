"use client"

import { useState, useRef, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useMessages } from "@/hooks/use-messages"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Search, Send, User, ChevronLeft, MoreVertical, Phone, Video, Paperclip, Smile, Zap, X } from "lucide-react"
import { LeadModal } from "@/components/crm/lead-modal"

type Lead = Database['public']['Tables']['leads']['Row']

interface ChatWindowProps {
  lead: Lead | null
  onBack?: () => void
}

const isImageUrl = (url: string) => {
  if (!url) return false;
  return (
    /\.(jpe?g|png|gif|webp|avif|bmp)/i.test(url) ||
    /drive\.usercontent\.google\.com|googleusercontent\.com|supabase\.co.*\/storage\/v1\/object/i.test(url) ||
    (url.includes('drive.google.com') && (url.includes('download') || url.includes('export=view')))
  );
};

const getDirectImageUrl = (url: string | null) => {
  if (!url) return "";
  
  // Se for Google Drive (vários formatos)
  if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
    const match = url.match(/(?:id=|\/d\/|file\/d\/)([\w-]{25,})/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  
  return url;
};

export function ChatWindow({ lead, onBack }: ChatWindowProps) {
  const { messages, loading } = useMessages(lead?.id || null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Resetar modal ao trocar de lead
  useEffect(() => {
    setIsLeadModalOpen(false)
    setIsSearchOpen(false)
  }, [lead?.id])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if ((!newMessage.trim() && !selectedFile) || !lead || sending) return

    setSending(true)
    try {
      let fileUrl = null

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${lead.company_id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('messages_attachments')
          .upload(filePath, selectedFile)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('messages_attachments')
            .getPublicUrl(filePath)
          fileUrl = publicUrl
        }
      }

      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          role: 'assistant',
          bot_message: 'false',
          lead_id: lead.id,
          company_id: lead.company_id,
          phone: lead.phone || null,
          file_url: fileUrl
        })

      if (msgError) throw msgError

      await supabase
        .from('leads')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', lead.id)

      setNewMessage("")
      setSelectedFile(null)
      setIsEmojiPickerOpen(false)
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err)
    } finally {
      setSending(false)
    }
  }

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setIsEmojiPickerOpen(false)
  }

  const popularEmojis = ["😀", "😂", "🥰", "😍", "🤫", "🤑", "🙌", "👍", "🔥", "✨", "🚀", "💎"]

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
      {/* Header do Chat (WhatsApp Style) */}
      <div className="h-[64px] flex items-center justify-between px-4 bg-[#f0f2f5] shrink-0 border-b border-slate-200 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="md:hidden p-1.5 text-slate-500 hover:bg-slate-200 rounded-full transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <div className="h-10 w-10 rounded-full bg-slate-300 flex items-center justify-center relative overflow-hidden border border-slate-200 shadow-sm">
             <span className="text-lg font-black text-white">{lead.name.charAt(0)}</span>
             <User className="h-7 w-7 text-slate-900 absolute opacity-10" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-[15px] font-bold text-slate-900 leading-tight truncate">{lead.name}</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 truncate">Visto por último hoje às {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(
              "p-2 hover:bg-slate-200 rounded-full transition-all",
              isSearchOpen && "text-primary bg-primary/10"
            )}
          >
            <Search className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setIsLeadModalOpen(true)}
            className="p-2 hover:bg-slate-200 rounded-full transition-all"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* WhatsApp Message Search Bar */}
      {isSearchOpen && (
        <div className="bg-[#f0f2f5] px-4 py-2 border-b border-slate-200 animate-in slide-in-from-top duration-200 z-20">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar mensagens..."
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-white border-none text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 p-1 hover:bg-slate-100 rounded-full"
              >
                <X className="h-3 w-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:px-12 md:py-6 space-y-2 z-10 custom-scrollbar"
      >
        {messages.length === 0 && !loading && (
            <div className="flex justify-center my-8 scale-in-center">
                <span className="bg-[#fff9c2] border border-[#e5e0b0] px-4 py-1.5 rounded-lg text-[11px] text-slate-600 shadow-sm uppercase font-bold tracking-wider">Criptografia de ponta a ponta</span>
            </div>
        )}
        
        {messages.filter(msg => 
          !searchTerm || msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((msg, idx) => {
          const isFirstInGroup = idx === 0 || messages[idx-1].role !== msg.role;
          return (
            <div
              key={msg.id}
              className={cn(
                "flex w-full animate-in fade-in slide-in-from-bottom-1 duration-300 mb-1",
                msg.role === 'user' ? "justify-start" : "justify-end",
                isFirstInGroup ? "mt-4" : "mt-1.5"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] md:max-w-[65%] px-3 py-1.5 shadow-sm relative text-[14.2px] leading-snug tracking-normal group/msg",
                  msg.role === 'user' 
                    ? "bg-white text-slate-900 rounded-lg rounded-tl-none ml-2" 
                    : "bg-[#d9fdd3] text-[#111b21] rounded-lg rounded-tr-none mr-2 shadow-[#00000014]"
                )}
              >
                {/* Tail for WhatsApp bubbles */}
                {isFirstInGroup && (
                  <div className={cn(
                    "absolute top-0 w-3 h-3",
                    msg.role === 'user' 
                      ? "-left-1.5 border-t-[10px] border-t-white border-l-[10px] border-l-transparent" 
                      : "-right-1.5 border-t-[10px] border-t-[#d9fdd3] border-r-[10px] border-r-transparent"
                  )} />
                )}

                <div className="pr-12 md:pr-14">
                  {msg.file_url && (
                    <div className="mb-2 overflow-hidden rounded-lg border border-black/5 bg-black/5 shadow-inner">
                      {isImageUrl(msg.file_url) ? (
                        <div className="relative group/img">
                          <img 
                            src={getDirectImageUrl(msg.file_url)} 
                            alt="Anexo" 
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            className="max-h-[300px] w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => window.open(getDirectImageUrl(msg.file_url!), '_blank')}
                          />
                        </div>
                      ) : (
                        <div className="p-2 flex items-center gap-2 group/file">
                          <Paperclip className="h-4 w-4 text-slate-500" />
                          <a 
                            href={msg.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-primary hover:underline truncate max-w-[150px]"
                          >
                            Ver anexo
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  {msg.content && (
                    <div className="space-y-3">
                      {/* Texto da mensagem (mostra sempre o conteúdo bruto) */}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      
                      {/* Renderiza a imagem ABAIXO do texto caso seja detectada uma imagem no conteúdo */}
                      {isImageUrl(msg.content) && (
                        <div className="overflow-hidden rounded-lg border border-black/5 shadow-sm bg-slate-50 relative group/img">
                           <img 
                             src={getDirectImageUrl(msg.content)} 
                             alt="Conteúdo" 
                             referrerPolicy="no-referrer"
                             crossOrigin="anonymous"
                             className="max-h-[400px] w-full object-cover cursor-pointer hover:scale-[1.01] transition-transform duration-500"
                             onClick={() => window.open(getDirectImageUrl(msg.content), '_blank')}
                             onError={(e) => {
                               // Fallback simples se a imagem falhar: oculta a tag quebrada
                               (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                             }}
                           />
                           <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors pointer-events-none" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={cn(
                  "absolute bottom-0 right-1.5 flex items-center gap-1 opacity-60",
                  "text-[10px] text-slate-500 font-medium"
                )}>
                  {new Date(msg.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {['assistant', 'attendant'].includes(msg.role || '') && (
                    <div className="text-[#53bdeb] flex items-center">
                      <svg viewBox="0 0 16 15" width="16" height="15"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879l-2.976-2.09a.307.307 0 0 0-.413.056l-.427.5a.306.306 0 0 0 .048.42l3.756 2.64a.341.341 0 0 0 .461-.044L15.083 3.82a.374.374 0 0 0-.073-.504zm-3.514.391l-.478-.372a.365.365 0 0 0-.51.063l-2.001 2.506a.342.342 0 0 0 .061.472l.441.344a.366.366 0 0 0 .51-.063l2.05-2.568a.375.375 0 0 0-.073-.482zM4.156 10.45l-2.454-1.724a.306.306 0 0 0-.413.056l-.427.5a.306.306 0 0 0 .048.42l3.756 2.64a.341.341 0 0 0 .461-.044L5.672 11.5l-.65-.508l-1.127 1.41z"></path></svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Área de Input (WhatsApp Style) */}
      <div className="bg-[#f0f2f5] py-3 px-4 flex flex-col gap-2 z-20 border-t border-slate-200 relative">
        {/* Preview de Arquivo */}
        {selectedFile && (
          <div className="absolute bottom-full left-0 right-0 p-3 bg-white border-t flex items-center justify-between animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Paperclip className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Seletor de Emoji Customizado */}
        {isEmojiPickerOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 grid grid-cols-6 gap-2 z-50 animate-in zoom-in-95 duration-200 origin-bottom-left">
            {popularEmojis.map(emoji => (
              <button 
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="h-10 w-10 flex items-center justify-center text-xl hover:bg-slate-50 rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-500">
             <button 
               type="button"
               onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
               className={cn(
                 "p-2 hover:bg-slate-200 rounded-full transition-all",
                 isEmojiPickerOpen && "text-primary bg-primary/10"
               )}
             >
               <Smile className="h-6 w-6" />
             </button>
             <button 
               type="button"
               onClick={() => fileInputRef.current?.click()}
               className={cn(
                 "p-2 hover:bg-slate-200 rounded-full transition-all",
                 selectedFile && "text-primary bg-primary/10"
               )}
             >
               <Paperclip className="h-6 w-6" />
             </button>
             <input 
               type="file" 
               className="hidden" 
               ref={fileInputRef}
               onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
             />
          </div>
          
          <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-3">
            <input
              type="text"
              placeholder="Digite uma mensagem..."
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

      {isLeadModalOpen && lead && (
        <LeadModal
          lead={lead}
          onClose={() => setIsLeadModalOpen(false)}
          onUpdate={async (id, updates) => {
            const { error } = await supabase
              .from('leads')
              .update(updates)
              .eq('id', id)
              .eq('company_id', lead.company_id)
            return !error
          }}
        />
      )}
    </div>
  )
}
