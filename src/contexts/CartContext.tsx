import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  material: string;
  frame?: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderValue?: number;
  active?: boolean;
}

interface CartContextData {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  coupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discount: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

const FALLBACK_COUPONS: Coupon[] = [
  { code: "QUADRZZ10", discountPercent: 10, minOrderValue: 200 },
  { code: "PRIMEIRACOMPRA", discountPercent: 15, minOrderValue: 150 },
  { code: "FRETEGRATIS", discountPercent: 100, minOrderValue: 499 },
];

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("@quadrzz:cart");
    return saved ? JSON.parse(saved) : [];
  });

  const { data: dbCoupons } = useQuery({
    queryKey: ["active-coupons"],
    queryFn: async () => {
      const { data } = await (supabase
        .from("marketing_coupons" as any)
        .select("*")
        .eq("active", true) as any);
      return data as Coupon[] || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const validCoupons = dbCoupons && dbCoupons.length > 0 ? dbCoupons : FALLBACK_COUPONS;

  useEffect(() => {
    localStorage.setItem("@quadrzz:cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    const id = `${newItem.productId}-${newItem.size}-${newItem.material}`;
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prev, { ...newItem, id }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const normalizedCode = code.toUpperCase().trim();
    const validCoupon = validCoupons.find(c => c.code === normalizedCode);

    if (!validCoupon) {
      return { success: false, message: "Cupom inválido ou expirado." };
    }

    if (validCoupon.minOrderValue && cartTotal < validCoupon.minOrderValue) {
      return { 
        success: false, 
        message: `Cupom válido para pedidos acima de R$ ${validCoupon.minOrderValue},00` 
      };
    }

    setCoupon(validCoupon);
    return { success: true, message: `Cupom ${validCoupon.code} aplicado! ${validCoupon.discountPercent}% OFF` };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const discount = coupon ? cartTotal * (coupon.discountPercent / 100) : 0;
  const finalTotal = cartTotal - discount;

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        cartTotal, 
        itemCount, 
        isCartOpen, 
        setIsCartOpen,
        coupon,
        applyCoupon,
        removeCoupon,
        discount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
