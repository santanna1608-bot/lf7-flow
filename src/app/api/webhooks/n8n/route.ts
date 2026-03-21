import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const apiKey = authHeader.split(' ')[1]
    const supabase = createRouteHandlerClient({ cookies })

    // Valida a API Key e busca a empresa vinculada
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('api_key_internal', apiKey)
      .single()

    if (companyError || !company) {
      return NextResponse.json({ error: 'API Key inválida' }, { status: 401 })
    }

    const { lead: leadData, message: messageData } = body

    if (!leadData || !messageData) {
      return NextResponse.json({ error: 'Dados incompletos (lead e message são obrigatórios)' }, { status: 400 })
    }

    // 1. Criar ou atualizar o lead
    // Tenta encontrar por telefone se fornecido, senão por nome
    const { data: existingLead, error: leadSearchError } = await supabase
      .from('leads')
      .select('id')
      .eq('company_id', company.id)
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
          company_id: company.id,
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

    // 2. Inserir a mensagem
    const { error: msgError } = await supabase
      .from('messages')
      .insert({
        company_id: company.id,
        lead_id: leadId,
        content: messageData.content,
        role: messageData.role || 'assistant'
      })

    if (msgError) throw msgError

    return NextResponse.json({ success: true, leadId })

  } catch (error: any) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
