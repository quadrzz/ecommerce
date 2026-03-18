import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { motion } from "framer-motion";

const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get("cat") || "todos";

  const filtered = activeCat === "todos"
    ? products
    : products.filter((p) => p.categorySlug === activeCat);

  return (
    <main className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl mb-8">COLEÇÃO</h1>
        
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setSearchParams({})}
            className={`text-xs font-display tracking-widest px-4 py-2 border transition-colors ${
              activeCat === "todos" ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
            }`}
          >
            TODOS
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSearchParams({ cat: cat.slug })}
              className={`text-xs font-display tracking-widest px-4 py-2 border transition-colors ${
                activeCat === cat.slug ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          key={activeCat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground font-body mt-20">Nenhum produto encontrado nesta categoria.</p>
        )}
      </div>
    </main>
  );
};

export default Collection;
