import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X, Mail, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface EmailCapturePopupProps {
  onClose: () => void;
  onSuccess: (email: string) => void | Promise<void>;
  popupCode?: string;
  popupDiscount?: number;
}

interface MarketingConfig {
  popup_enabled: boolean;
  popup_discount: number;
  popup_code: string;
  popup_trigger_seconds: number;
}

const EmailCapturePopup = ({ onClose, onSuccess, popupCode = "QUADRZZ10", popupDiscount = 10 }: EmailCapturePopupProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Save to Supabase
      await supabase.from("email_leads" as any).insert({
        email,
        coupon_used: popupCode,
        source: "popup"
      });
    } catch {
      // Still show success even if save fails
    }
    setTimeout(() => {
      setIsSuccess(true);
      onSuccess(email);
      setIsSubmitting(false);
    }, 800);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-secondary border border-border p-8 metal-border max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-display mb-2">{popupDiscount}% DE DESCONTO CONCEDIDO!</h3>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Use o código <span className="font-bold text-foreground">{popupCode}</span> no checkout. 
            O código foi enviado para seu email também!
          </p>
          <Button variant="metal" onClick={onClose} className="w-full">
            COMPRAR AGORA
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-secondary border border-border p-8 metal-border max-w-md w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-accent/20 flex items-center justify-center">
            <Gift size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-display uppercase tracking-wider">
              Ganhe {popupDiscount}% de desconto
            </h3>
            <p className="text-xs text-muted-foreground">Na sua primeira compra</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground font-body mb-6">
          Cadastre seu email e receba um código exclusivo de <span className="text-foreground font-bold">{popupDiscount}% OFF</span>. 
          Sem spam, só ofertas especiais!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-background"
              required
            />
          </div>
          <Button 
            type="submit" 
            variant="metal" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "ENVIANDO..." : "QUERO MEU DESCONTO"}
          </Button>
        </form>

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          Ao cadastrar, você aceita receber emails da QUADRZZ. 
          Você pode cancelar a qualquer momento.
        </p>
      </motion.div>
    </motion.div>
  );
};

export const useEmailPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const { data: config, isLoading } = useQuery({
    queryKey: ["marketing-config"],
    queryFn: async () => {
      const { data } = await (supabase
        .from("marketing_config" as any)
        .select("*")
        .limit(1) as any);
      return data?.[0] as MarketingConfig | null;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;

    if (!config || !config.popup_enabled) return;

    if (config.popup_enabled) {
      const wasDismissed = localStorage.getItem("@quadrzz:emailPopupDismissed");
      const hasSubscribed = localStorage.getItem("@quadrzz:subscribed");

      if (!wasDismissed && !hasSubscribed) {
        const timer = setTimeout(() => {
          setShowPopup(true);
          setHasShown(true);
        }, config.popup_trigger_seconds * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [config, isLoading]);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("@quadrzz:emailPopupDismissed", "true");
  };

  const handleSuccess = (email: string) => {
    localStorage.setItem("@quadrzz:subscribed", email);
    localStorage.setItem("@quadrzz:emailPopupDismissed", "true");
  };

  return {
    showPopup,
    handleClose,
    handleSuccess,
    popupCode: config?.popup_code || "QUADRZZ10",
    popupDiscount: config?.popup_discount ?? 10
  };
};

export default EmailCapturePopup;