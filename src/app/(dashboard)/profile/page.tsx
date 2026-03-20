"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  Lock, 
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react"

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

  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

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

      // Upsert do Perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          phone: profile.phone,
        })
        .eq('user_id', session.user.id)

      if (profileError) throw profileError

      // Atualizar Email se mudou
      if (profile.email !== session.user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: profile.email })
        if (emailError) throw emailError
        alert("Um e-mail de confirmação foi enviado para o novo endereço.")
      }

      // Notificar Sidebar
      window.dispatchEvent(new Event('profile-updated'))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.newPassword !== password.confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }
    if (password.newPassword.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: password.newPassword })
      if (error) throw error
      alert("Senha atualizada com sucesso!")
      setPassword({ newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      alert(error.message)
    } finally {
      setChangingPassword(false)
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
      const filePath = `${session.user.id}/avatar-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setProfile(prev => ({ ...prev, avatarUrl: publicUrl }))
      
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', session.user.id)

      window.dispatchEvent(new Event('profile-updated'))

    } catch (error: any) {
      alert("Erro no upload: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 animate-pulse text-center">Carregando dados do perfil...</div>

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-10 space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Minha Conta</h1>
          <p className="text-slate-500 mt-2">Gerencie suas informações pessoais, contatos e segurança.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Lado Esquerdo: Perfil Rápido */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="h-32 w-32 rounded-full bg-slate-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-slate-300" />
                )}
              </div>
              <label className="absolute bottom-1 right-1 h-9 w-9 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-all">
                <Camera className="h-4 w-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{profile.fullName || "Usuário"}</h3>
            <p className="text-sm text-slate-400 mt-1">{profile.email}</p>
            
            <div className="w-full h-px bg-slate-100 my-6" />
            
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">Ativo</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Membro desde</span>
                <span className="text-slate-900 font-medium">Março 2024</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <ShieldCheck className="h-6 w-6" />
              <h4 className="font-bold">Segurança da Conta</h4>
            </div>
            <p className="text-xs text-primary/60 leading-relaxed">
              Mantenha seus dados atualizados e sua senha segura para garantir a integridade do seu fluxo de IA.
            </p>
          </div>
        </div>

        {/* Lado Direito: Formulários */}
        <div className="lg:col-span-2 space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Informações Básicas
            </h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Nome Completo</label>
                  <input 
                    value={profile.fullName}
                    onChange={e => setProfile({...profile, fullName: e.target.value})}
                    className="w-full h-12 px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Telefone / WhatsApp</label>
                  <input 
                    value={profile.phone}
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    className="w-full h-12 px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">E-mail de Acesso</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input 
                      type="email"
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full h-12 pl-12 pr-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-300"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 ml-1 leading-tight">
                    * Ao alterar seu e-mail, você receberá um link de confirmação para validar a mudança.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-8 h-12 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : success ? (
                    <><CheckCircle2 className="h-5 w-5" /> Dados Atualizados!</>
                  ) : (
                    "Salvar Alterações"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Troca de Senha */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Alterar Senha
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Nova Senha</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password.newPassword}
                      onChange={e => setPassword({...password, newPassword: e.target.value})}
                      className="w-full h-12 px-5 pr-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-300"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Confirmar Senha</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password.confirmPassword}
                    onChange={e => setPassword({...password, confirmPassword: e.target.value})}
                    className="w-full h-12 px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={changingPassword}
                  className="px-8 h-12 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  {changingPassword ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Atualizar Senha"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
