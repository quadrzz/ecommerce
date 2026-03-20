import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-4 md:p-6 bg-background/95 backdrop-blur-md">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-xl text-left flex items-center gap-2">
            <ShoppingBag size={20} />
            SEU CARRINHO
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-4 px-4 md:-mx-6 md:px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <ShoppingBag size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="font-body text-sm">Seu carrinho está vazio.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-24 w-16 bg-secondary metal-border shrink-0 overflow-hidden relative group">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 gap-1 justify-center">
                    <div className="flex justify-between items-start">
                      <h4 className="font-display text-sm leading-none">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground font-body">{item.size} • {item.material}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 border border-border metal-border px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="disabled:opacity-50">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-display w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-display tabular-nums">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="pt-6 border-t border-border mt-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="font-display tracking-widest text-sm">TOTAL</span>
              <span className="font-display text-xl">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <Link to="/checkout" className="block">
              <Button variant="metal" size="xl" className="w-full border-b border-border">
                FINALIZAR COMPRA
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
