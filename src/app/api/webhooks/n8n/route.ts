import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(req: Request) {
  let step = 'inicial'
  try {
    step = 'parse_body'
    const body = await req.json()
    
    step = 'parse_headers'
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Não autorizado', 
        message: 'Header Authorization (Bearer TOKEN) ausente ou inválido.' 
      }, { status: 401 })
    }

    const apiKey = authHeader.split(' ')[1]
    
    step = 'init_supabase'
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(`Credenciais do Supabase ausentes no Vercel (URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey})`)
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    step = 'call_rpc_auth'
    // Valida a API Key usando a função RPC
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_company_by_api_key', { p_api_key: apiKey })

    if (rpcError) {
      console.error('RPC Error:', rpcError)
      return NextResponse.json({ 
        error: 'Erro no banco de dados', 
        details: rpcError.message,
        step: 'rpc_call'
      }, { status: 401 })
    }

    if (!rpcData || !Array.isArray(rpcData) || rpcData.length === 0) {
      return NextResponse.json({ 
        error: 'API Key inválida', 
        message: 'A chave fornecida não foi encontrada no banco de dados.',
        step: 'auth_validation'
      }, { status: 401 })
    }

    const companyId = rpcData[0].company_id

    step = 'normaliza_payload'
    // Normalização de Payloads (Aceita formato plano ou estruturado)
    let leadData = body.lead || (body.phone ? { name: body.name, phone: body.phone } : null)
    let messageData = body.message || (body.content ? { content: body.content, role: body.role } : null)

    if (!leadData || !leadData.phone) {
      return NextResponse.json({ 
        error: 'Dados do lead são obrigatórios', 
        message: 'Envie ao menos o campo "phone" (diretamente ou dentro de um objeto "lead").',
        step: 'payload_validation'
      }, { status: 400 })
    }

    step = 'search_lead'
    // 1. Criar ou atualizar o lead
    const { data: existingLead, error: leadSearchError } = await supabase
      .from('leads')
      .select('id')
      .eq('company_id', companyId)
      .eq('phone', leadData.phone)
      .maybeSingle()

    if (leadSearchError) {
       throw new Error(`Erro ao buscar lead: ${leadSearchError.message}`)
    }

    let leadId: string

    if (existingLead) {
      step = 'update_lead'
      leadId = existingLead.id
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          name: leadData.name || 'Sem nome',
          last_message_at: new Date().toISOString()
        })
        .eq('id', leadId)
      
      if (updateError) throw new Error(`Erro ao atualizar lead: ${updateError.message}`)
    } else {
      step = 'create_lead'
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

      if (createLeadError) throw new Error(`Erro ao criar lead: ${createLeadError.message}`)
      if (!newLead) throw new Error('Falha ao obter ID do novo lead após inserção')
      leadId = newLead.id
    }

    // 2. Inserir a mensagem (se houver)
    if (messageData && messageData.content) {
      step = 'create_message'
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          company_id: companyId,
          lead_id: leadId,
          content: messageData.content,
          role: messageData.role || 'assistant'
        })

      if (msgError) throw new Error(`Erro ao criar mensagem: ${msgError.message}`)
    }

    return NextResponse.json({ 
      success: true, 
      leadId,
      message: 'Webhook processado com sucesso' 
    })

  } catch (error: any) {
    console.error(`Webhook Error at ${step}:`, error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message,
      step: step
    }, { status: 500 })
  }
}
