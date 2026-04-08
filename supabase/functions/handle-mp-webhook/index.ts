import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const body = await req.json();

    // Mercado Pago sends different data for payment and subscription webhooks
    // Payment: { action, data: { id: paymentId } } or { type: "payment", data: { id: paymentId } }
    let paymentId: string | null = null;

    if (body.action && body.data?.id) {
      // New format
      paymentId = body.data.id;
    } else if (body.type === "payment" && body.data?.id) {
      paymentId = body.data.id;
    } else if (body.data?.id) {
      paymentId = body.data.id;
    } else if (body.id) {
      // Direct payment_id
      paymentId = body.id;
    }

    if (!paymentId) {
      return new Response(JSON.stringify({ message: "No payment ID found" }), {
        headers: { "Content-Type": "application/json" },
        status: 200, // Return 200 to stop Mercado Pago from retrying
      });
    }

    // Fetch payment details from Mercado Pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch payment ${paymentId}: ${response.status}. Could be a test notification.`);
      return new Response(JSON.stringify({ success: true, message: "Test or unknown payment ignored" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const payment = await response.json();
    const orderReference = payment.external_reference as string | null;

    if (!orderReference) {
      return new Response(JSON.stringify({ error: "No order reference" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Map Mercado Pago status to our order status
    const statusMap: Record<string, string> = {
      approved: "paid",
      authorized: "paid",
      in_process: "pending",
      in_mediation: "pending",
      pending: "pending",
      rejected: "failed",
      cancelled: "cancelled",
      refunded: "cancelled",
      charged_back: "cancelled",
    };

    const mpStatus = payment.status?.toLowerCase() || "pending";
    const newStatus = statusMap[mpStatus] || "pending";

    // Update order in Supabase
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        payment_id: paymentId.toString(),
      })
      .eq("id", orderReference);

    if (error) {
      console.error("Error updating order:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log(`Order ${orderReference} updated: ${newStatus}`);

    return new Response(JSON.stringify({ success: true, orderId: orderReference, status: newStatus }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      headers: { "Content-Type": "application/json" },
      status: 200, // Return 200 to stop retries
    });
  }
});
