import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import MobileConversionBar from "@/components/MobileConversionBar";
import { Check } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(0);

  if (!product) {
    return (
      <main className="pt-28 pb-20 text-center">
        <p className="text-muted-foreground font-body">Produto não encontrado.</p>
        <Link to="/colecao" className="text-foreground font-display text-sm mt-4 inline-block">← VOLTAR À COLEÇÃO</Link>
      </main>
    );
  }

  const handleBuy = () => {
    const msg = `Olá! Quero comprar o quadro "${product.name}" — ${product.sizes[selectedSize]}, ${product.materials[selectedMaterial]}. Valor: R$ ${product.price.toFixed(2).replace(".", ",")}`;
    window.open(`https://wa.me/5500000000000?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <main className="pt-28 pb-24 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Link to="/colecao" className="text-xs text-muted-foreground font-display tracking-wider hover:text-foreground transition-colors">
          ← VOLTAR
        </Link>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-[3/4] bg-secondary overflow-hidden metal-border"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          {/* Info */}
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

            {/* Sizes */}
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

            {/* Material */}
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

            {/* Buy */}
            <div className="mt-8 hidden md:block">
              <Button variant="metal" size="xl" onClick={handleBuy} className="w-full">
                COMPRAR AGORA
              </Button>
            </div>

            {/* Benefits */}
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

            {/* Specs */}
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

      <MobileConversionBar onBuy={handleBuy} />
    </main>
  );
};

export default ProductDetail;
