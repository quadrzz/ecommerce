import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products as staticProducts, categories } from "@/data/products";
import { useProducts, type DbProduct } from "@/hooks/useProducts";
import { motion } from "framer-motion";

// Merge static + DB products into a unified format
function mergeProducts(dbProducts: DbProduct[] | undefined) {
  const fromDb = (dbProducts || []).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    categorySlug: p.category_slug,
    price: p.price,
    image: p.image_url || "",
    description: p.description || "",
    sizes: p.sizes,
    materials: p.materials,
  }));
  return [...staticProducts, ...fromDb];
}

const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get("cat") || "todos";
  const { data: dbProducts } = useProducts();

  const allProducts = mergeProducts(dbProducts);

  const filtered = activeCat === "todos"
    ? allProducts
    : allProducts.filter((p) => p.categorySlug === activeCat);

  return (
    <main className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl mb-8">COLEÇÃO</h1>
        
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
