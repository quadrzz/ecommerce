import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      // 1. Criar o pedido no Supabase
      const { data: order, error: orderError } = await (supabase
        .from("orders" as any)
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          total_amount: cartTotal,
          status: "pending",
          payment_method: "mercadopago"
        })
        .select()
        .single() as any);


      if (orderError) throw orderError;

      // 2. Salvar os itens do pedido
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        image_url: item.image,
      }));

      const { error: itemsError } = await (supabase
        .from("order_items" as any)
        .insert(orderItems) as any);

      if (itemsError) throw itemsError;

      // 3. Chamar a Edge Function para criar a preferência no Mercado Pago
      const { data: pref, error: prefError } = await supabase.functions.invoke("create-preference", {
        body: {
          orderId: order.id,
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          customer: {
            email: formData.email,
            name: formData.name,
          }
        },
      });

      if (prefError) throw prefError;
      if (pref?.error) throw new Error(pref.error);

      if (pref?.init_point) {
        toast.success("Pedido criado! Redirecionando para o pagamento...");
        // Pequeno delay para o toast aparecer
        setTimeout(() => {
          window.location.href = pref.init_point;
        }, 1500);
      } else {
        throw new Error("Link de pagamento não gerado.");
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

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl mb-8 font-display tracking-widest">FINALIZAR PEDIDO</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Dados */}
          <div className="bg-secondary p-6 md:p-8 metal-border border border-border h-fit">
            <h2 className="text-xl font-display tracking-widest mb-6">SEUS DADOS</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-display text-xs tracking-widest">NOME COMPLETO</Label>
                <Input 
                  id="name" 
                  placeholder="Seu nome" 
                  className="bg-background"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-display text-xs tracking-widest">E-MAIL</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="bg-background"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-display text-xs tracking-widest">WHATSAPP / CELULAR</Label>
                <Input 
                  id="phone" 
                  placeholder="(00) 00000-0000" 
                  className="bg-background"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <p className="text-[10px] text-muted-foreground font-body mt-4">
                Ao clicar em PAGAR AGORA, você concorda com nossos termos e será redirecionado para o Mercado Pago com segurança.
              </p>

              <Button
                type="submit"
                variant="metal"
                size="xl"
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? "PROCESSANDO..." : "PAGAR AGORA"}
              </Button>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-secondary/50 p-6 md:p-8 metal-border border border-border h-fit">
            <h2 className="text-xl font-display tracking-widest mb-6 border-b border-border pb-4">RESUMO</h2>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border/50 pb-4 last:border-0">
                  <div className="h-20 w-14 bg-background metal-border shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-display tracking-widest leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-body mt-1 uppercase">
                        {item.size} • {item.material} • Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-display tabular-nums">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
              <p className="font-display tracking-widest text-xs">TOTAL A PAGAR</p>
              <p className="font-display text-2xl">R$ {cartTotal.toFixed(2).replace(".", ",")}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;

