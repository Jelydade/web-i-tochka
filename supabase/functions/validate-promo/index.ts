import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { code } = await request.json();
    const normalizedCode = String(code || '').trim().toUpperCase();

    if (!/^[A-Z0-9]{5}$/.test(normalizedCode)) {
      return Response.json({ valid: false, message: 'Введите код из 5 латинских букв и цифр.' }, { status: 400, headers: corsHeaders });
    }

    const client = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
    const { data, error } = await client.rpc('validate_promo_code', { input_code: normalizedCode }).single();

    if (error) throw error;

    return Response.json({
      valid: data.valid,
      code: data.code,
      discountPercent: data.discount_percent,
      expiresAt: data.expires_at,
      message: data.message,
    }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ valid: false, message: 'Не удалось проверить промокод.' }, { status: 500, headers: corsHeaders });
  }
});
