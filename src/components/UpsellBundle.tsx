import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Percent } from "lucide-react";

interface UpsellBundleProps {
  productName: string;
  productPrice: number;
  onClose: () => void;
  onAddToCart: () => void;
}

const UpsellBundle = ({ productName, productPrice, onClose, onAddToCart }: UpsellBundleProps) => {
  const discount = 15;
  const bundlePrice = (productPrice * 2) * (1 - discount / 100);
  const savings = (productPrice * 2) - bundlePrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary border border-border p-6 metal-border relative"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-foreground/10 flex items-center justify-center shrink-0">
          <Percent size={24} className="text-accent" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-display tracking-wider uppercase mb-1">
            Leve 2 pelo preço de 1,7
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            Adicione mais 1 "{productName}" e ganhe <span className="text-red-600 font-bold">{discount}% OFF</span> no segundo
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-xs text-muted-foreground line-through">
              R$ {(productPrice * 2).toFixed(2).replace(".", ",")}
            </div>
            <div className="text-lg font-bold text-foreground">
              R$ {bundlePrice.toFixed(2).replace(".", ",")}
            </div>
            <div className="text-[10px] text-green-600 bg-green-600/10 px-2 py-1">
              ECONOMIA DE R$ {savings.toFixed(2).replace(".", ",")}
            </div>
          </div>

          <Button
            variant="metal"
            size="sm"
            onClick={onAddToCart}
            className="w-full"
          >
            ADICIONAR 2 UNIDADES
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UpsellBundle;