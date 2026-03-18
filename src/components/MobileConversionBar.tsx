import { Button } from "@/components/ui/button";

interface MobileConversionBarProps {
  onBuy?: () => void;
  buyLabel?: string;
}

const MobileConversionBar = ({ onBuy, buyLabel = "COMPRAR AGORA" }: MobileConversionBarProps) => (
  <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/80 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3">
    <a
      href="https://wa.me/5500000000000"
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 border border-foreground/20 flex items-center justify-center text-foreground"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    </a>
    <Button variant="metal" size="lg" className="flex-1" onClick={onBuy}>
      {buyLabel}
    </Button>
  </div>
);

export default MobileConversionBar;
