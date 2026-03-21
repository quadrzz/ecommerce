import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { initMercadoPago } from "@/integrations/payment/mercadopago";
import { useToast } from "@/components/ui/use-toast";

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Order in Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders" as any)
        .insert({
          total_amount: cartTotal,
          customer_email: "test@example.com", // In a real app, collect this from a form
          customer_name: "Cliente Teste",
          status: "pending",
        } as any)
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = items.map(item => ({
        order_id: (order as any).id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        image_url: item.image,
      }));

      const { error: itemsError } = await supabase
        .from("order_items" as any)
        .insert(orderItems as any);

      if (itemsError) throw itemsError;

      // 3. Initialize Mercado Pago and Redirect
      const mp = await initMercadoPago();
      
      const { data: pref, error: prefError } = await supabase.functions.invoke("create-preference", {
        body: { items, orderId: (order as any).id },
      });

      if (prefError) throw prefError;

      if (pref.init_point) {
        toast({
          title: "Pedido Criado!",
          description: "Redirecionando para o pagamento...",
        });
        window.location.href = pref.init_point;
      } else {
        throw new Error("Não foi possível gerar o link de pagamento.");
      }

    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast({
        title: "Erro no Checkout",
        description: error.message || "Ocorreu um erro ao processar seu pedido.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="pt-28 pb-20 text-center min-h-screen">
        <h1 className="text-3xl font-display tracking-widest mb-4">CHECKOUT</h1>
        <p className="text-muted-foreground font-body">Seu carrinho está vazio.</p>
        <Link to="/colecao" className="mt-8 inline-block text-sm font-display underline hover:no-underline">
          VOLTAR À COLEÇÃO
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl mb-8 font-display tracking-widest">RESUMO DO PEDIDO</h1>
        
        <div className="bg-secondary p-6 md:p-8 metal-border border border-border">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-border pb-6 last:border-0">
                <div className="h-24 w-16 bg-background metal-border shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display tracking-widest">{item.name}</h3>
                    <p className="text-xs text-muted-foreground font-body mt-1">
                      {item.size} • {item.material} • Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="font-display tabular-nums">
                    R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
            <p className="font-display tracking-widest">TOTAL A PAGAR</p>
            <p className="font-display text-2xl">R$ {cartTotal.toFixed(2).replace(".", ",")}</p>
          </div>

          <p className="text-xs text-muted-foreground font-body mt-8 mb-4">
            Ao clicar em Pagar Agora, você será redirecionado para o Mercado Pago para concluir sua compra de forma segura.
          </p>
          <Button 
            variant="metal" 
            size="xl" 
            className="w-full" 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "PROCESSANDO..." : "PAGAR AGORA"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Checkout;

