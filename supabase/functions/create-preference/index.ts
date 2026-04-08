const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      }
    });
  }

  try {
    const { items, orderId, customer } = await req.json();

    const origin = req.headers.get("origin") ?? "";

    // Fetch the webhook URL from Supabase config if available
    const webhookUrl = SUPABASE_URL
      ? `${SUPABASE_URL}/rest/v1/rpc/webhook_handler`
      : `${origin}/webhooks/mp`; // fallback - this needs to be the actual edge function URL

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map((item: any) => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
        })),
        currency_id: "BRL",
        external_reference: orderId,
        payer: {
          email: customer?.email,
          name: customer?.name,
        },
        back_urls: {
          success: `${origin}/order-success`,
          failure: `${origin}/checkout`,
          pending: `${origin}/checkout`,
        },
        auto_return: "approved",
        notification_url: `${SUPABASE_URL}/functions/v1/handle-mp-webhook`,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: response.status,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 400,
    });
  }
});
