import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import RealProjectsSection from "@/components/RealProjectsSection";
import { products, categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import heroImage from "@/assets/hero-main.jpg";
import beforeAfterImage from "@/assets/before-after.jpg";
import lucasAvatar from "@/assets/avatars/lucas.png";
import camilaAvatar from "@/assets/avatars/camila.png";
import pedroAvatar from "@/assets/avatars/pedro.png";
import { Printer, Shield, Paintbrush, Package, MessageCircle, BadgeCheck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const benefits = [
  { icon: Printer, title: "IMPRESSÃO HD", desc: "Resolução máxima para detalhes que impressionam." },
  { icon: Shield, title: "MATERIAL PREMIUM", desc: "Alumínio e MDF de alta densidade. Durabilidade real." },
  { icon: Paintbrush, title: "PERSONALIZAÇÃO", desc: "Seu quadro, sua identidade. 100% exclusivo." },
  { icon: Package, title: "EMBALAGEM SEGURA", desc: "Proteção total do nosso ateliê até sua parede." },
  { icon: MessageCircle, title: "ATENDIMENTO DIRETO", desc: "Fale direto com quem produz. Sem intermediários." },
];

const testimonials = [
  { name: "Lucas M.", text: "A qualidade do alumínio é absurda. Parece peça de galeria urbana.", rating: 5, avatar: lucasAvatar },
  { name: "Camila R.", text: "Personalizei com uma foto do meu carro. Ficou simplesmente impecável.", rating: 5, avatar: camilaAvatar },
  { name: "Pedro S.", text: "Entrega super rápida e embalagem perfeita. Já é meu terceiro quadro com eles.", rating: 5, avatar: pedroAvatar },
];

const Index = () => {
  const { data: dbProducts } = useProducts();
  
  const allProducts = useMemo(() => {
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
    return [...fromDb, ...products];
  }, [dbProducts]);

  const featured = allProducts.slice(0, 8);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-end">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Quadro QUADRZZ em ambiente moderno" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-20 md:pb-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.2 }}
            className="max-w-2xl"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl leading-[0.95] drop-shadow-2xl"
            >
              NÃO DECORE SUA PAREDE. DECLARE QUEM VOCÊ É.
            </motion.h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground font-body leading-relaxed max-w-lg">
              Quadros em Alumínio Premium e MDF de alta densidade. Identidade visual para quem não aceita o comum.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/colecao">
                <Button variant="metal" size="xl">VER COLEÇÃO</Button>
              </Link>
              <Link to="/personalizar">
                <Button variant="outline" size="xl">PERSONALIZAR MEU QUADRO</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl mb-12"
          >
            CATEGORIAS
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/colecao?cat=${cat.slug}`} className="group block">
                  <div className="aspect-[3/4] bg-secondary overflow-hidden metal-border relative">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-all duration-400 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <span className="absolute bottom-4 left-4 font-display text-sm tracking-wider text-foreground">{cat.name.toUpperCase()}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-2xl md:text-4xl">MAIS VENDIDOS</h2>
            <Link to="/colecao" className="hidden md:inline-flex text-xs font-display tracking-widest border-b border-foreground pb-1 hover:text-muted-foreground transition-colors uppercase">
              Ver toda a coleção
            </Link>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featured.map((p, i) => (
                <CarouselItem key={p.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ProductCard product={p} index={i} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 border-border/50 hover:bg-background" />
              <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 border-border/50 hover:bg-background" />
            </div>
          </Carousel>

          <div className="mt-12 text-center md:hidden">
            <Link to="/colecao">
              <Button variant="outline" size="lg" className="w-full">VER COLEÇÃO COMPLETA</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl mb-12">POR QUE QUADRZZ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="space-y-3"
              >
                <b.icon size={24} strokeWidth={1} className="text-accent" />
                <h3 className="text-xs tracking-widest">{b.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl mb-12">ANTES E DEPOIS</h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="overflow-hidden metal-border"
          >
            <img src={beforeAfterImage} alt="Antes e depois com quadros QUADRZZ" className="w-full object-cover" loading="lazy" />
          </motion.div>
          <p className="mt-6 text-muted-foreground font-body text-center max-w-md mx-auto">
            Um quadro QUADRZZ transforma qualquer ambiente. Presença que se sente.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl mb-12">O QUE DIZEM</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-secondary p-8 metal-border"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-foreground text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm font-body text-muted-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto border-t border-border/50 pt-4">
                  <div className="w-10 h-10 rounded-full border border-border overflow-hidden shrink-0">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover grayscale-[0.2]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-display tracking-wider text-foreground leading-none">{t.name}</p>
                      <BadgeCheck size={16} className="text-background fill-[#1DA1F2]" />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1.5 tracking-widest uppercase font-display">Comprador Verificado</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Projects */}
      <RealProjectsSection />

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl mb-6">SUA PAREDE MERECE PRESENÇA.</h2>
          <p className="text-muted-foreground font-body mb-10 max-w-md mx-auto">
            Escolha seu quadro ou crie o seu. Alumínio premium, impressão HD, entrega segura.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/colecao">
              <Button variant="metal" size="xl">VER COLEÇÃO</Button>
            </Link>
            <Link to="/personalizar">
              <Button variant="outline" size="xl">PERSONALIZAR</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
