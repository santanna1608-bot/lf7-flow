"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { X, Building2, Trash2, ShieldCheck, ShieldAlert, CreditCard, Save, Loader2, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface ManageCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  company: any | null
}

export function ManageCompanyModal({ isOpen, onClose, onSuccess, company }: ManageCompanyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    account_status: "ativo",
    asaas_customer_id: "",
    negotiated_value: 0,
    subscription_start_date: "",
    plan_type: "FREE"
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        account_status: company.account_status || "ativo",
        asaas_customer_id: company.asaas_customer_id || "",
        negotiated_value: company.negotiated_value || 0,
        subscription_start_date: company.subscription_start_date 
          ? new Date(company.subscription_start_date).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
        plan_type: company.plan_type || "FREE"
      })
    }
  }, [company])

  if (!isOpen || !company) return null

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('companies')
      .update({
        name: formData.name,
        account_status: formData.account_status,
        asaas_customer_id: formData.asaas_customer_id,
        negotiated_value: Number(formData.negotiated_value),
        subscription_start_date: formData.subscription_start_date,
        plan_type: formData.plan_type
      })
      .eq('id', company.id)

    if (!error) {
      onSuccess()
      onClose()
    } else {
      console.error("Erro ao atualizar empresa:", error)
      alert("Erro ao atualizar dados.")
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm(`TEM CERTEZA? Isso excluirá permanentEMENTE a empresa "${company.name}" e todos os dados vinculados a ela.`)) {
      return
    }

    setDeleting(true)
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', company.id)

    if (!error) {
      onSuccess()
      onClose()
    } else {
      console.error("Erro ao excluir empresa:", error)
      alert("Erro ao excluir. Verifique se existem registros vinculados.")
    }
    setDeleting(false)
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/10">
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
              formData.account_status === 'bloqueado' ? "bg-red-50 text-red-500" : "bg-primary/10 text-primary"
            )}>
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Gerenciar Unidade</h3>
              <p className="text-xs text-slate-400 font-mono">ID: {company.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Fantasia</label>
              <input
                type="text"
                className="w-full px-5 h-12 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-slate-900 font-bold shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor do Contrato (MRR)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  className="w-full pl-10 pr-4 h-12 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-black shadow-sm"
                  value={formData.negotiated_value}
                  onChange={(e) => setFormData({...formData, negotiated_value: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asaas ID</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="cus_..."
                  className="w-full pl-10 pr-4 h-12 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-mono text-sm shadow-sm"
                  value={formData.asaas_customer_id}
                  onChange={(e) => setFormData({...formData, asaas_customer_id: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data de Início do Contrato</label>
              <input
                type="date"
                className="w-full px-5 h-12 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 font-bold shadow-sm"
                value={formData.subscription_start_date}
                onChange={(e) => setFormData({...formData, subscription_start_date: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nível do Plano</label>
             <div className="grid grid-cols-2 gap-4">
                {['FREE', 'PREMIUM'].map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setFormData({...formData, plan_type: plan})}
                    className={cn(
                      "h-12 rounded-xl border-2 flex items-center justify-center gap-2 font-black text-[10px] transition-all",
                      formData.plan_type === plan 
                        ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5" 
                        : "border-slate-50 bg-slate-50/50 text-slate-400"
                    )}
                  >
                    {plan}
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status de Acesso</label>
             <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, account_status: 'ativo'})}
                  className={cn(
                    "h-14 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs transition-all",
                    formData.account_status === 'ativo' 
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100" 
                      : "border-slate-50 bg-slate-50/50 text-slate-400"
                  )}
                >
                  <ShieldCheck className="h-4 w-4" /> ATIVO
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, account_status: 'bloqueado'})}
                  className={cn(
                    "h-14 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs transition-all",
                    formData.account_status === 'bloqueado' 
                      ? "border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-100 translate-y-[-2px]" 
                      : "border-slate-50 bg-slate-50/50 text-slate-400"
                  )}
                >
                  <ShieldAlert className="h-4 w-4" /> BLOQUEADO
                </button>
             </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={loading || deleting}
              className="w-full md:flex-1 h-14 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/20 hover:bg-opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Salvar Alterações</>}
            </button>
            <button
              type="button"
              disabled={loading || deleting}
              onClick={handleDelete}
              className="w-full md:w-auto h-14 px-6 rounded-2xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100"
            >
              {deleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
