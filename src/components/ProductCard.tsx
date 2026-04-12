import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { Flame, Star } from "lucide-react";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const hasPromo = product.isPromo && product.promoDiscount;
  const promoPrice = hasPromo ? product.price * (1 - product.promoDiscount! / 100) : null;
  const isLowStock = product.stockCount && product.stockCount <= 5;

  return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
  >
    <Link to={`/produto/${product.id}`} className="group block">
      <div className="aspect-[3/4] bg-secondary overflow-hidden metal-border relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:saturate-[1.1] group-hover:contrast-[1.1]"
          loading="lazy"
        />
        {(hasPromo || isLowStock) && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasPromo && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 tracking-wider">
                -{product.promoDiscount}% OFF
              </span>
            )}
            {isLowStock && (
              <span className="bg-orange-500 text-black text-[10px] font-bold px-2 py-1 tracking-wider flex items-center gap-1">
                <Flame size={10} />
                ÚLTIMAS UNIDADES
              </span>
            )}
          </div>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          <Star size={10} className="text-orange-500 fill-orange-500" />
          <span className="text-[10px] font-display text-foreground">4.8</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-end justify-center">
          <span className="text-xs font-display tracking-widest border border-foreground/50 bg-background/50 backdrop-blur-sm px-4 py-2 metal-border font-bold">VER DETALHES</span>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground font-body">{product.category}</p>
        <h3 className="text-sm font-display tracking-wider">{product.name}</h3>
        <p className="text-xs text-orange-400/80 font-body italic line-clamp-1">
          Para quem não aceita o comum
        </p>
        <div className="flex items-center gap-2">
          {hasPromo ? (
            <>
              <p className="text-sm text-muted-foreground font-body tabular-nums line-through">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-sm text-red-600 font-body tabular-nums font-bold">
                R$ {promoPrice!.toFixed(2).replace(".", ",")}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground font-body tabular-nums">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </p>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
  );
};

export default ProductCard;
