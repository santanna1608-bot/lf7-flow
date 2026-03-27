import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Não autorizado', 
        message: 'Header Authorization (Bearer TOKEN) ausente ou inválido.' 
      }, { status: 401 })
    }

    const apiKey = authHeader.replace('Bearer ', '').trim()
    
    if (!supabaseUrl || !supabaseAnonKey) {
       throw new Error('Configuração do banco de dados (Supabase) ausente no servidor.')
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Normalização de Payloads
    let leadData = body.lead || (body.phone ? { name: body.name, phone: body.phone, status: body.status } : null)
    let messageData = body.message || (body.content ? { content: body.content, role: body.role } : null)

    if (!leadData || !leadData.phone) {
      return NextResponse.json({ 
        error: 'Dados inválidos', 
        message: 'O campo "phone" é obrigatório.' 
      }, { status: 400 })
    }

    // Chama a função RPC unificada (Segura e ignora RLS no banco)
    const { data: result, error: rpcError } = await supabase.rpc('process_webhook_payload', {
      p_api_key: apiKey,
      p_lead_name: leadData.name || null,
      p_lead_phone: leadData.phone,
      p_lead_status: leadData.status || null,
      p_message_content: (messageData && messageData.content) 
        ? (Array.isArray(messageData.content) ? messageData.content[0] : String(messageData.content)) 
        : null,
      p_message_role: (messageData && messageData.role) ? messageData.role : 'user',
      p_external_id: body.external_id || (messageData && messageData.id) || null
    })

    if (rpcError) {
      console.error('RPC Error:', rpcError)
      return NextResponse.json({ 
        error: 'Erro no processamento', 
        details: rpcError.message 
      }, { status: 500 })
    }

    if (result && result.success === false) {
      return NextResponse.json({ 
        error: result.error || 'Falha na validação', 
        message: 'Verifique sua API Key.' 
      }, { status: 401 })
    }

    return NextResponse.json({ 
      success: true, 
      leadId: result.lead_id,
      message: 'Dados processados com sucesso via RPC' 
    })

  } catch (error: any) {
    console.error('Webhook Runtime Error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message 
    }, { status: 500 })
  }
}
