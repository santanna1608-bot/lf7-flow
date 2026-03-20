"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database"

type Lead = Database['public']['Tables']['leads']['Row']

export function useLeads() {
  const supabase = createClientComponentClient()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = async (mounted = true) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || !mounted) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', session.user.id)
        .single()

      if (!profile || !('company_id' in profile) || !profile.company_id || !mounted) {
        setLeads([])
        return
      }

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false })

      if (!error && data && mounted) {
        setLeads(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (mounted) setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    fetchLeads(mounted)

    const channel = supabase
      .channel('leads-crm')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchLeads(mounted)
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const { error } = await (supabase.from('leads') as any)
      .update({ status: newStatus })
      .eq('id', leadId)

    if (error) {
      console.error("Erro ao atualizar status do lead:", error)
      return false
    }
    return true
  }

  return { leads, loading, updateLeadStatus }
}
