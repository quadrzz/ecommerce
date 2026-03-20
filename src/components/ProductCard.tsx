import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => (
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
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-end justify-center">
          <span className="text-xs font-display tracking-widest border border-foreground/50 bg-background/50 backdrop-blur-sm px-4 py-2 metal-border font-bold">VER DETALHES</span>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground font-body">{product.category}</p>
        <h3 className="text-sm font-display tracking-wider">{product.name}</h3>
        <p className="text-sm text-muted-foreground font-body tabular-nums">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </Link>
  </motion.div>
);

export default ProductCard;
