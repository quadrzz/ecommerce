import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

interface CrossSellProps {
  onAddItem: (productId: string, name: string, price: number, image: string) => void;
}

const CrossSell = ({ onAddItem }: CrossSellProps) => {
  const { items } = useCart();
  
  const cartCategories = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product?.category;
  }).filter(Boolean);

  const crossSellProducts = products
    .filter(p => !cartCategories.includes(p.category))
    .slice(0, 3);

  if (crossSellProducts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-6 pt-6 border-t border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-display tracking-widest uppercase">
          Complementos sugeridos
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {crossSellProducts.map((product) => (
          <div key={product.id} className="group">
            <Link to={`/produto/${product.id}`} className="block">
              <div className="aspect-square bg-secondary metal-border overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-[10px] font-display truncate">{product.name}</p>
              <p className="text-[10px] text-muted-foreground">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddItem(product.id, product.name, product.price, product.image);
              }}
              className="mt-1 w-full text-[10px] bg-secondary border border-border py-1 flex items-center justify-center gap-1 hover:bg-foreground hover:text-background transition-colors"
            >
              <Plus size={10} /> ADICIONAR
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CrossSell;