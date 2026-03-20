import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();

  const handleFinish = () => {
    let msg = `Olá! Gostaria de finalizar o seguinte pedido:\n\n`;
    items.forEach((item, index) => {
      msg += `${index + 1}. *${item.name}* (${item.quantity}x)\n`;
      msg += `   - Tamanho: ${item.size}\n`;
      msg += `   - Material: ${item.material}\n`;
      msg += `   - Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}\n\n`;
    });
    msg += `*TOTAL DA COMPRA: R$ ${cartTotal.toFixed(2).replace(".", ",")}*`;

    window.open(`https://wa.me/5581991169932?text=${encodeURIComponent(msg)}`, "_blank");
    clearCart();
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
        <h1 className="text-3xl md:text-5xl mb-8">RESUMO DO PEDIDO</h1>
        
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
            Ao clicar em Continuar, você será redirecionado para o nosso WhatsApp para combinarmos o envio e pagamento.
          </p>
          <Button variant="metal" size="xl" className="w-full" onClick={handleFinish}>
            CONTINUAR PARA WHATSAPP
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
