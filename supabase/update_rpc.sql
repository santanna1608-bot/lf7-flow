-- SQL Script para atualizar a função RPC process_webhook_payload no Supabase
-- Execute este script no SQL Editor do seu dashboard Supabase.

CREATE OR REPLACE FUNCTION public.process_webhook_payload(
  p_api_key text,
  p_lead_name text,
  p_lead_phone text,
  p_lead_status text DEFAULT NULL,
  p_message_content text DEFAULT NULL,
  p_message_role text DEFAULT 'assistant'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id uuid;
  v_lead_id uuid;
  v_clean_phone text;
  v_final_status text;
BEGIN
  -- 1. Sanitização do Telefone
  -- Remove '@s.whatsapp.net' e mantém apenas números
  v_clean_phone := regexp_replace(replace(p_lead_phone, '@s.whatsapp.net', ''), '[^0-9]', '', 'g');

  -- 2. Validação da API Key e busca da Empresa
  SELECT id INTO v_company_id 
  FROM public.companies 
  WHERE api_key_internal = p_api_key;

  IF v_company_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'API Key inválida');
  END IF;

  -- 3. Definir o status final (Preserva o valor enviado ou usa padrão)
  v_final_status := COALESCE(p_lead_status, 'Novo Lead');

  -- 4. Busca ou Criação do Lead
  INSERT INTO public.leads (company_id, name, phone, status, last_message_at)
  VALUES (v_company_id, COALESCE(p_lead_name, 'Lead via Webhook'), v_clean_phone, v_final_status, now())
  ON CONFLICT (company_id, phone) 
  DO UPDATE SET 
    name = COALESCE(EXCLUDED.name, leads.name),
    status = EXCLUDED.status,
    last_message_at = now()
  RETURNING id INTO v_lead_id;

  -- 5. TRAVA DE CONCORRÊNCIA (Advisory Lock)
  -- Bloqueia qualquer outra inserção para este Lead durante esta transação
  -- Isso impede que duas requisições a 0.3s de distância entrem juntas
  PERFORM pg_advisory_xact_lock(hashtext(v_lead_id::text));

  -- 6. Registro da Mensagem com trava de duplicidade (30 segundos)
  IF p_message_content IS NOT NULL AND p_message_content <> '' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.messages 
      WHERE lead_id = v_lead_id 
      AND content = p_message_content 
      AND created_at > now() - interval '30 seconds'
    ) THEN
      INSERT INTO public.messages (lead_id, company_id, content, role)
      VALUES (v_lead_id, v_company_id, p_message_content, p_message_role);
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true, 
    'lead_id', v_lead_id,
    'clean_phone', v_clean_phone,
    'status_applied', v_final_status
  );
END;
$$;
