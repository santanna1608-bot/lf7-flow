"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { User, Mail, Phone, Camera, Loader2, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatarUrl: ""
  })

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone, avatar_url')
          .eq('user_id', session.user.id)
          .single()

        setProfile({
          fullName: profileData?.full_name || "",
          email: session.user.email || "",
          phone: profileData?.phone || "",
          avatarUrl: profileData?.avatar_url || ""
        })
      }
      setLoading(false)
    }
    getProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Atualizar Perfil no Banco
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          phone: profile.phone,
          avatar_url: profile.avatarUrl
        })
        .eq('user_id', session.user.id)

      if (profileError) throw profileError

      // Atualizar Email se mudou
      if (profile.email !== session.user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: profile.email })
        if (emailError) throw emailError
        alert("Um e-mail de confirmação foi enviado para o novo endereço.")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const fileExt = file.name.split('.').pop()
      const filePath = `${session.user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setProfile(prev => ({ ...prev, avatarUrl: publicUrl }))
      
      // Salvar URL no perfil imediatamente
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', session.user.id)

    } catch (error: any) {
      alert("Erro no upload: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 animate-pulse">Carregando dados do perfil...</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Minha Conta</h1>
        <p className="text-muted-foreground mt-2">Gerencie suas informações pessoais e preferências.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Lado Esquerdo: Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="h-40 w-40 rounded-full bg-muted border-4 border-background shadow-xl overflow-hidden flex items-center justify-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-20 w-20 text-muted-foreground" />
              )}
            </div>
            <label className="absolute bottom-2 right-2 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-all active:scale-95">
              <Camera className="h-5 w-5" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg">{profile.fullName || "Usuário"}</h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="space-y-6 bg-card border rounded-3xl p-8 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" /> Nome Completo
              </label>
              <input 
                value={profile.fullName}
                onChange={e => setProfile({...profile, fullName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Ex: João Silva"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" /> E-mail Corporativo
              </label>
              <input 
                type="email"
                value={profile.email}
                onChange={e => setProfile({...profile, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="seu@email.com"
              />
              <p className="text-[10px] text-muted-foreground">Nota: A alteração de e-mail exigirá confirmação no novo endereço.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" /> Telefone / WhatsApp
              </label>
              <input 
                value={profile.phone}
                onChange={e => setProfile({...profile, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="(11) 99999-9999"
              />
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : success ? (
                <><CheckCircle2 className="h-5 w-5" /> Salvo com Sucesso!</>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
