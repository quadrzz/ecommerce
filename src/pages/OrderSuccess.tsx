import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const OrderSuccess = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");

  useEffect(() => {
    // Clear cart on success
    if (status === "approved" || !status) {
      clearCart();
    }
  }, [clearCart, status]);

  return (
    <main className="pt-28 pb-20 min-h-screen text-center">
      <div className="max-w-md mx-auto px-4">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl md:text-5xl mb-4 font-display tracking-widest">OBRIGADO!</h1>
        <p className="text-lg text-muted-foreground font-body mb-8">
          Seu pedido foi recebido com sucesso e estamos processando o pagamento.
        </p>
        
        <div className="bg-secondary p-6 metal-border border border-border text-left mb-8">
          <h3 className="font-display tracking-widest mb-2 border-b border-border pb-2 text-sm">
            DETALHES DO PEDIDO
          </h3>
          <p className="text-sm font-body">Status: <span className="font-bold uppercase">{status || "Pendente"}</span></p>
          {paymentId && <p className="text-sm font-body">ID do Pagamento: {paymentId}</p>}
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button variant="metal" size="xl" className="w-full">
              VOLTAR À LOJA
            </Button>
          </Link>
          <Link to="/colecao" className="block text-sm font-display underline hover:no-underline">
            CONTINUAR COMPRANDO
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
