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

  if (loading) return <div className="p-10 animate-pulse text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Sincronizando dados vitais...</div>

  return (
    <div className="max-w-[1200px] mx-auto p-4 lg:p-10 space-y-12 pb-24 relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[150px] rounded-full -z-10" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h1 className="text-4xl font-black tracking-tighter text-white">Configurações de Perfil</h1>
          <p className="text-slate-400 mt-2 font-medium">Gerencie sua identidade digital e preferências de segurança.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Lado Esquerdo: Perfil Rápido (Dark Style) */}
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 blur-[40px] rounded-full -z-10" />
            
            <div className="relative group/avatar mb-8">
              <div className="h-40 w-40 rounded-[3rem] bg-white/5 border-4 border-white/5 shadow-2xl overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover/avatar:scale-105 group-hover/avatar:rotate-2">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-20 w-20 text-slate-700" />
                )}
              </div>
              <label className="absolute bottom-1 right-1 h-12 w-12 bg-premium-gradient text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all border border-white/10">
                <Camera className="h-5 w-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            
            <h3 className="text-2xl font-black text-white tracking-tight">{profile.fullName || "Usuário"}</h3>
            <p className="text-[11px] font-black text-primary/60 mt-1 uppercase tracking-[0.2em]">{profile.email}</p>
            
            <div className="w-full h-px bg-white/5 my-8" />
            
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Status da Conta</span>
                <span className="inline-flex items-center px-4 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Ativo</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Membro desde</span>
                <span className="text-white font-black tracking-tighter">Março 2024</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-primary/20 blur-[30px] rounded-full" />
            <div className="flex items-center gap-4 mb-5 text-primary">
              <ShieldCheck className="h-8 w-8" />
              <h4 className="font-black text-lg tracking-tight">Privacidade Total</h4>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
              Seus dados são protegidos com tecnologia de ponta para garantir a segurança absoluta das suas operações.
            </p>
          </div>
        </div>

        {/* Lado Direito: Formulários (Glassmorphism) */}
        <div className="lg:col-span-2 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Informações Básicas */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Configurações de Identidade</h3>
            </div>
            
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    value={profile.fullName}
                    onChange={e => setProfile({...profile, fullName: e.target.value})}
                    className="w-full h-14 px-6 rounded-2xl border border-white/5 bg-black/20 focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-white font-medium placeholder:text-slate-700 shadow-inner"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                  <input 
                    value={profile.phone}
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    className="w-full h-14 px-6 rounded-2xl border border-white/5 bg-black/20 focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-white font-medium placeholder:text-slate-700 shadow-inner"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within/input:text-primary transition-colors" />
                    <input 
                      type="email"
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full h-14 pl-14 pr-6 rounded-2xl border border-white/5 bg-black/20 focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-white font-medium placeholder:text-slate-700 shadow-inner"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <p className="text-[9px] text-primary/40 mt-2 ml-1 font-bold uppercase tracking-widest italic">
                    * A mudança de e-mail requer confirmação por link de segurança.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-10 h-14 bg-premium-gradient text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-primary/20"
                >
                  {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : success ? (
                    <><CheckCircle2 className="h-5 w-5" /> Dados Atualizados!</>
                  ) : (
                    "Salvar Dados"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Troca de Senha (Dark Style) */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-rose-500/10 rounded-2xl">
                <Lock className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Segurança de Acesso</h3>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nova Senha</label>
                  <div className="relative group/input">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password.newPassword}
                      onChange={e => setPassword({...password, newPassword: e.target.value})}
                      className="w-full h-14 px-6 pr-14 rounded-2xl border border-white/5 bg-black/20 focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/30 transition-all text-white font-medium placeholder:text-slate-700 shadow-inner"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password.confirmPassword}
                    onChange={e => setPassword({...password, confirmPassword: e.target.value})}
                    className="w-full h-14 px-6 rounded-2xl border border-white/5 bg-black/20 focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/30 transition-all text-white font-medium placeholder:text-slate-700 shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  disabled={changingPassword}
                  className="px-10 h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 transition-all border border-white/10 shadow-xl"
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
