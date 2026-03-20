import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface MobileConversionBarProps {
  onAddCart?: () => void;
  onBuy?: () => void;
}

const MobileConversionBar = ({ onAddCart, onBuy }: MobileConversionBarProps) => (
  <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3">
    <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-none border-foreground/20" onClick={onAddCart}>
      <ShoppingBag size={20} />
    </Button>
    <Button variant="metal" size="lg" className="flex-1 h-12" onClick={onBuy}>
      COMPRAR AGORA
    </Button>
  </div>
);

export default MobileConversionBar;
