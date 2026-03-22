import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const { items, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("yampi-checkout", {
        body: {
          items: items.map((item) => ({
            yampiSkuId: item.yampiSkuId,
            quantity: item.quantity,
          })),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.checkout_url) {
        toast.success("Redirecionando para o checkout...");
        window.location.href = data.checkout_url;
      } else {
        throw new Error("Não foi possível gerar o link de checkout.");
      }
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error(error.message || "Erro ao processar seu pedido.");
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

  const missingSkus = items.some((item) => !item.yampiSkuId);

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

          {missingSkus && (
            <p className="text-xs text-destructive font-body mt-4">
              ⚠ Alguns produtos não possuem SKU Yampi configurado. O checkout pode falhar.
            </p>
          )}

          <p className="text-xs text-muted-foreground font-body mt-8 mb-4">
            Ao clicar em Finalizar, você será redirecionado para o checkout seguro da Yampi com Mercado Pago.
          </p>
          <Button
            variant="metal"
            size="xl"
            className="w-full"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "PROCESSANDO..." : "FINALIZAR COMPRA"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
