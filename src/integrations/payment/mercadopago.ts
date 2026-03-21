import { loadMercadoPago } from "@mercadopago/sdk-js";

let mercadopago: any = null;

export const initMercadoPago = async () => {
  if (mercadopago) return mercadopago;
  
  await loadMercadoPago();
  // Using a placeholder public key. User should update this in .env
  const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "TEST-e61e6490-67c8-4712-9b2f-3d603a1104e1";
  
  mercadopago = new (window as any).MercadoPago(publicKey, {
    locale: "pt-BR",
  });
  
  return mercadopago;
};

export const createPreference = async (items: any[], orderId: string) => {
  // This usually should be done in a backend (Edge Function) to keep the Access Token secret.
  // For simplicity in this demo, we'll outline the call, 
  // but I'll recommend using a Supabase Edge Function.
  
  console.log("Creating preference for order:", orderId);
  
  // Example of what would be sent to the MP API
  const preferenceData = {
    items: items.map(item => ({
      title: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      currency_id: "BRL",
    })),
    external_reference: orderId,
    back_urls: {
      success: `${window.location.origin}/order-success`,
      failure: `${window.location.origin}/checkout`,
      pending: `${window.location.origin}/checkout`,
    },
    auto_return: "approved",
  };

  // In a real app, you'd call a Supabase function here:
  // const { data, error } = await supabase.functions.invoke('create-preference', { body: preferenceData });
  
  return preferenceData;
};
