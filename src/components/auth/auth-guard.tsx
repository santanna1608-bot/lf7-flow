"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, usePathname } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setLoading(false)
        return
      }

      // 2. Fetch user profile to get company_id and role
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, role')
        .eq('user_id', session.user.id)
        .single()

      if (!profile) {
        setLoading(false)
        return
      }

      // Bypass check for Super Admins on admin routes
      if (profile.role === 'admin' && pathname.startsWith('/admin')) {
        setLoading(false)
        return
      }

      // 3. Fetch company status
      if (profile.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('account_status')
          .eq('id', profile.company_id)
          .single()

        if (company?.account_status === 'bloqueado') {
          router.push('/bloqueado')
          return
        }
      }

      setLoading(false)
    }

    checkAccess()
  }, [pathname, router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse">
            Verificando Acesso...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
