import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, X, Plus, Minus, Trash2, Tag, CheckCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CrossSell from "./CrossSell";

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen, coupon, applyCoupon, removeCoupon, discount, addToCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const result = applyCoupon(couponCode);
    setCouponMessage({
      type: result.success ? "success" : "error",
      text: result.message
    });
  };

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

              {!coupon && (
                <div className="bg-secondary p-4 metal-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={14} className="text-accent" />
                    <span className="text-xs font-display tracking-wider">CUPO DE DESCONTO</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite o código"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="text-xs h-9"
                    />
                    <Button variant="outline" size="sm" onClick={handleApplyCoupon} className="h-9">
                      OK
                    </Button>
                  </div>
                  {couponMessage && (
                    <p className={`text-[10px] mt-2 ${couponMessage.type === "success" ? "text-green-600" : "text-red-500"}`}>
                      {couponMessage.text}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["QUADRZZ10", "PRIMEIRACOMPRA"].map((code) => (
                      <button
                        key={code}
                        onClick={() => { setCouponCode(code); handleApplyCoupon(); }}
                        className="text-[10px] text-muted-foreground border border-border px-2 py-1 hover:border-foreground transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {coupon && (
                <div className="bg-green-600/10 border border-green-600/30 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      {coupon.code} - {coupon.discountPercent}% OFF
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-muted-foreground hover:text-foreground">
                    Remover
                  </button>
                </div>
              )}

              <CrossSell onAddItem={(productId, name, price, image) => {
                addToCart({
                  productId,
                  name,
                  price,
                  image,
                  size: "30x40cm",
                  material: "Alumínio Premium",
                  quantity: 1,
                });
              }} />
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="pt-6 border-t border-border mt-auto">
            {coupon && (
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-muted-foreground line-through">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
              </div>
            )}
            {coupon && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span className="text-xs">Desconto</span>
                <span className="text-xs">-R$ {discount.toFixed(2).replace(".", ",")}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <span className="font-display tracking-widest text-sm">TOTAL</span>
              <span className="font-display text-xl">R$ {(cartTotal - discount).toFixed(2).replace(".", ",")}</span>
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
