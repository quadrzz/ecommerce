import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Clock } from "lucide-react";

interface SocialProofProps {
  productId?: string;
}

export const SocialProof = ({ productId }: SocialProofProps) => {
  const [viewerCount, setViewerCount] = useState(0);
  const [lastPurchase, setLastPurchase] = useState<string | null>(null);

  useEffect(() => {
    const count = Math.floor(Math.random() * 8) + 3;
    setViewerCount(count);

    const names = ["Maria", "João", "Camila", "Pedro", "Lucas", "Ana", "Carlos", "Juliana"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    setLastPurchase(randomName);

    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 15000);

    return () => clearInterval(interval);
  }, [productId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-4 text-xs"
    >
      <div className="flex items-center gap-2 text-green-600 bg-green-600/10 px-3 py-1.5">
        <Eye size={12} />
        <span className="font-body">
          <span className="font-bold">{viewerCount}</span> pessoas vendo agora
        </span>
      </div>

      {lastPurchase && (
        <div className="flex items-center gap-2 text-muted-foreground bg-secondary px-3 py-1.5">
          <Clock size={12} />
          <span className="font-body">
            <span className="font-bold text-foreground">{lastPurchase}</span> comprou há poucos minutos
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default SocialProof;