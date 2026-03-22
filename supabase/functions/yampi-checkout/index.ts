import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items } = await req.json();

    const YAMPI_TOKEN = Deno.env.get("YAMPI_API_TOKEN");
    const STORE_ALIAS = Deno.env.get("YAMPI_STORE_ALIAS");

    if (!YAMPI_TOKEN || !STORE_ALIAS) {
      throw new Error("Yampi credentials not configured");
    }

    // Build cart items for Yampi payment link
    const yampiItems = items.map((item: any) => ({
      sku_id: item.yampiSkuId,
      quantity: item.quantity,
    })).filter((i: any) => i.sku_id);

    if (yampiItems.length === 0) {
      throw new Error("Nenhum produto possui SKU Yampi configurado. Configure os SKU IDs no painel de administração.");
    }

    // Create payment link via Yampi API
    const response = await fetch(
      `https://api.dooki.com.br/v2/${STORE_ALIAS}/payments/links`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Token": YAMPI_TOKEN,
        },
        body: JSON.stringify({
          items: yampiItems,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Yampi API error:", JSON.stringify(data));
      throw new Error(data.message || "Erro ao criar link de pagamento na Yampi");
    }

    const checkoutUrl = data?.data?.url || data?.url;

    if (!checkoutUrl) {
      // Fallback: redirect to store checkout directly
      const skuParams = yampiItems.map((i: any) => `skus[]=${i.sku_id}&quantities[]=${i.quantity}`).join("&");
      const fallbackUrl = `https://${STORE_ALIAS}.yampi.com.br/checkout/cart?${skuParams}`;
      
      return new Response(
        JSON.stringify({ checkout_url: fallbackUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ checkout_url: checkoutUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
