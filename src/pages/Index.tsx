import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import RealProjectsSection from "@/components/RealProjectsSection";
import { products, categories } from "@/data/products";
import heroImage from "@/assets/hero-main.jpg";
import beforeAfterImage from "@/assets/before-after.jpg";
import { Printer, Shield, Paintbrush, Package, MessageCircle } from "lucide-react";

const benefits = [
  { icon: Printer, title: "IMPRESSÃO HD", desc: "Resolução máxima para detalhes que impressionam." },
  { icon: Shield, title: "MATERIAL PREMIUM", desc: "Alumínio e MDF de alta densidade. Durabilidade real." },
  { icon: Paintbrush, title: "PERSONALIZAÇÃO", desc: "Seu quadro, sua identidade. 100% exclusivo." },
  { icon: Package, title: "EMBALAGEM SEGURA", desc: "Proteção total do nosso ateliê até sua parede." },
  { icon: MessageCircle, title: "ATENDIMENTO DIRETO", desc: "Fale direto com quem produz. Sem intermediários." },
];

const testimonials = [
  { name: "Lucas M.", text: "A qualidade do alumínio é absurda. Parece peça de galeria.", rating: 5 },
  { name: "Camila R.", text: "Personalizei com uma foto do meu carro. Ficou impecável.", rating: 5 },
  { name: "Pedro S.", text: "Entrega rápida e embalagem perfeita. Já é meu terceiro quadro.", rating: 5 },
];

const Index = () => {
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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[0.95]">
              NÃO DECORE SUA PAREDE. DECLARE QUEM VOCÊ É.
            </h1>
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
      <section className="py-20 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl mb-12">DESTAQUES</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/colecao">
              <Button variant="outline" size="lg">VER TODA A COLEÇÃO</Button>
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
                <p className="text-sm font-body text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <p className="text-xs font-display tracking-wider">{t.name}</p>
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
