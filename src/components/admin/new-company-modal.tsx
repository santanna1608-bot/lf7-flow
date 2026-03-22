"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { X, Building2, Plus, Loader2 } from "lucide-react"

interface NewCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function NewCompanyModal({ isOpen, onClose, onSuccess }: NewCompanyModalProps) {
  const [name, setName] = useState("")
  const [planType, setPlanType] = useState("free")
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    const { error } = await supabase
      .from('companies')
      .insert([
        { 
          name: name.trim(), 
          plan_type: planType.toUpperCase() 
        }
      ])

    if (!error) {
      setName("")
      setPlanType("free")
      onSuccess()
      onClose()
    } else {
      console.error("Erro ao criar empresa:", error)
      alert("Erro ao criar empresa. Tente novamente.")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Nova Empresa</h3>
              <p className="text-sm text-slate-400 font-medium">Cadastre uma nova instância.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Nome da Empresa
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Ex: Minha Empresa LTDA"
              className="w-full px-6 h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-slate-900 font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Tipo de Plano
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['FREE', 'PREMIUM'].map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setPlanType(plan.toLowerCase())}
                  className={`h-14 rounded-2xl border-2 font-black text-sm transition-all ${
                    planType === plan.toLowerCase()
                      ? plan === 'PREMIUM' ? "border-amber-400 bg-amber-50 text-amber-600 shadow-sm" : "border-primary bg-primary/5 text-primary"
                      : "border-slate-50 bg-slate-50/30 text-slate-400 hover:border-slate-100"
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Plus className="h-6 w-6" /> Cadastrar Empresa
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
