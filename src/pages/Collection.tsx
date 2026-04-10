import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products as staticProducts, categories } from "@/data/products";
import { useProducts, type DbProduct } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const allProducts = mergeProducts(dbProducts);

  let filtered = activeCat === "todos"
    ? allProducts
    : allProducts.filter((p) => p.categorySlug === activeCat);

  if (searchQuery.trim()) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortBy === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <main className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl mb-8">COLEÇÃO</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSearchParams({})}
              className={`text-xs font-display tracking-widest px-4 py-2 border transition-colors flex-shrink-0 ${
                activeCat === "todos" ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
              }`}
            >
              TODOS
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSearchParams({ cat: cat.slug })}
                className={`text-xs font-display tracking-widest px-4 py-2 border transition-colors flex-shrink-0 ${
                  activeCat === cat.slug ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar quadros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-border focus-visible:ring-foreground/20 w-full md:w-[250px] font-body text-sm h-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] bg-secondary border-border font-body text-sm h-10">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Relevância</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="name-asc">Ordem Alfabética</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
