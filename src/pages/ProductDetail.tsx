import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { products as staticProducts } from "@/data/products";
import { useProduct } from "@/hooks/useProducts";
import MobileConversionBar from "@/components/MobileConversionBar";
import { Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Try static first
  const staticProduct = staticProducts.find((p) => p.id === id);
  
  // Try DB (only if not static)
  const { data: dbProduct, isLoading } = useProduct(!staticProduct && id ? id : "");

  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(0);

  // Normalize product data
  const product = staticProduct
    ? staticProduct
    : dbProduct
    ? {
        id: dbProduct.id,
        name: dbProduct.name,
        category: dbProduct.category,
        categorySlug: dbProduct.category_slug,
        price: dbProduct.price,
        image: dbProduct.image_url || "",
        description: dbProduct.description || "",
        sizes: dbProduct.sizes,
        materials: dbProduct.materials,
        yampiSkuId: dbProduct.yampi_sku_id || undefined,
      }
    : null;

  if (isLoading && !staticProduct) {
    return (
      <main className="pt-28 pb-20 text-center">
        <p className="text-muted-foreground font-body">Carregando...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-28 pb-20 text-center">
        <p className="text-muted-foreground font-body">Produto não encontrado.</p>
        <Link to="/colecao" className="text-foreground font-display text-sm mt-4 inline-block">← VOLTAR À COLEÇÃO</Link>
      </main>
    );
  }

  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[selectedSize],
      material: product.materials[selectedMaterial],
      quantity: 1,
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[selectedSize],
      material: product.materials[selectedMaterial],
      quantity: 1,
    });
    navigate("/checkout");
  };

  return (
    <main className="pt-28 pb-24 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Link to="/colecao" className="text-xs text-muted-foreground font-display tracking-wider hover:text-foreground transition-colors">
          ← VOLTAR
        </Link>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-[3/4] bg-secondary overflow-hidden metal-border"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="text-xs text-muted-foreground font-body mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl">{product.name}</h1>
            <p className="mt-2 text-2xl font-display tabular-nums">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </p>
            <p className="mt-6 text-sm text-muted-foreground font-body leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="text-xs font-display tracking-widest mb-3">TAMANHO</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, i) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(i)}
                    className={`text-xs font-body px-4 py-2.5 border transition-colors ${
                      selectedSize === i ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-display tracking-widest mb-3">MATERIAL</p>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((mat, i) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(i)}
                    className={`text-xs font-body px-4 py-2.5 border transition-colors ${
                      selectedMaterial === i ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 hidden md:flex gap-4">
              <Button variant="outline" size="xl" onClick={handleAddToCart} className="flex-1">
                ADICIONAR AO CARRINHO
              </Button>
              <Button variant="metal" size="xl" onClick={handleBuyNow} className="flex-1">
                COMPRAR AGORA
              </Button>
            </div>

            <div className="mt-10 space-y-3">
              {[
                "Impressão HD em alta resolução",
                "Produção sob demanda — exclusivo para você",
                "Embalagem reforçada e segura",
                "Garantia de qualidade QUADRZZ",
              ].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <Check size={14} strokeWidth={1.5} className="text-accent" />
                  <span className="text-xs text-muted-foreground font-body">{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-border pt-6 space-y-4">
              <h3 className="text-xs tracking-widest">ESPECIFICAÇÕES</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-body">
                <div>
                  <p className="text-muted-foreground">Material</p>
                  <p className="text-foreground">{product.materials[selectedMaterial]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tamanho</p>
                  <p className="text-foreground">{product.sizes[selectedSize]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Impressão</p>
                  <p className="text-foreground">HD Premium</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Montagem</p>
                  <p className="text-foreground">Pronto para pendurar</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <MobileConversionBar onAddCart={handleAddToCart} onBuy={handleBuyNow} />
    </main>
  );
};

export default ProductDetail;
