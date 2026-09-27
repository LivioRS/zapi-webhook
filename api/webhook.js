import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;

    if (!data?.message) {
      return res.status(400).json({ error: 'Invalid payload: missing data.message' });
    }

    const message = data.message;
    const codigo = message.conversation?.trim() || message.extendedTextMessage?.text?.trim();
    const phone = message.key?.remoteJid?.replace('@s.whatsapp.net', '');

    if (!codigo || !phone) {
      return res.status(400).json({ error: 'Missing codigo or phone' });
    }

    // Consultar produto no Supabase
    const { data: produto, error: supabaseError } = await supabase
      .rpc('consultar_produto', { p_codigo: codigo });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return res.status(500).json({ error: 'Database error' });
    }

    // Montar resposta
    const texto = produto?.nome
      ? `${produto.nome}\nCusto: R$ ${Number(produto.custo || 0).toFixed(2).replace('.', ',')}\nQtd em estoque: ${produto.qtd_estoque}`
      : `Código não encontrado: ${codigo}`;

    // Enviar via ZAPI
    const zapiUrl = `${process.env.ZAPI_INSTANCE_URL}/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

    const zapiResponse = await fetch(zapiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message: texto })
    });

    if (!zapiResponse.ok) {
      const errorText = await zapiResponse.text();
      console.error('ZAPI error:', errorText);
      return res.status(500).json({ error: 'Failed to send via ZAPI' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}