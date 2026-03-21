import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const apiKey = authHeader.split(' ')[1]
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Valida a API Key usando a função RPC (bypassa RLS com SECURITY DEFINER)
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_company_by_api_key', { p_api_key: apiKey })

    if (rpcError || !rpcData || !Array.isArray(rpcData) || rpcData.length === 0) {
      console.error('RPC Error:', rpcError, 'Data:', rpcData)
      return NextResponse.json({ error: 'API Key inválida' }, { status: 401 })
    }

    const companyId = rpcData[0].company_id

    // Normalização de Payloads (Aceita formato plano ou estruturado)
    let leadData = body.lead || (body.phone ? { name: body.name, phone: body.phone } : null)
    let messageData = body.message || (body.content ? { content: body.content, role: body.role } : null)

    if (!leadData) {
      return NextResponse.json({ error: 'Dados do lead são obrigatórios (phone e name)' }, { status: 400 })
    }

    // 1. Criar ou atualizar o lead
    // Tenta encontrar por telefone se fornecido, senão por nome
    const { data: existingLead, error: leadSearchError } = await supabase
      .from('leads')
      .select('id')
      .eq('company_id', companyId)
      .eq('phone', leadData.phone)
      .maybeSingle()

    let leadId: string

    if (existingLead) {
      leadId = existingLead.id
      // Atualiza o lead se necessário (opcional)
      await supabase
        .from('leads')
        .update({ 
          name: leadData.name || 'Sem nome',
          last_message_at: new Date().toISOString()
        })
        .eq('id', leadId)
    } else {
      const { data: newLead, error: createLeadError } = await supabase
        .from('leads')
        .insert({
          company_id: companyId,
          name: leadData.name || 'Sem nome',
          phone: leadData.phone,
          status: 'novo',
          last_message_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (createLeadError) throw createLeadError
      leadId = newLead.id
    }

    // 2. Inserir a mensagem (se houver)
    if (messageData && messageData.content) {
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          company_id: companyId,
          lead_id: leadId,
          content: messageData.content,
          role: messageData.role || 'assistant'
        })

      if (msgError) throw msgError
    }

    return NextResponse.json({ success: true, leadId })

  } catch (error: any) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
