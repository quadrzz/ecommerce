import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import heroImage from "@/assets/hero-main.jpg";
import lucasAvatar from "@/assets/avatars/lucas.png";
import camilaAvatar from "@/assets/avatars/camila.png";
import pedroAvatar from "@/assets/avatars/pedro.png";
import producaoVideo from "@/components/manager/produção.mp4";
import mosaicoVideo from '../../supabase/images/compressed/naruto mosaico.mp4';
import Autoplay from "embla-carousel-autoplay";
import { Printer, Shield, Paintbrush, Package, MessageCircle, BadgeCheck, Truck, Gift, Zap } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious } from
"@/components/ui/carousel";

const benefits = [
{ icon: Printer, title: "IMPRESSÃO HD", desc: "Resolução máxima para detalhes que impressionam." },
{ icon: Shield, title: "MATERIAL PREMIUM", desc: "Alumínio e MDF de alta densidade. Durabilidade real." },
{ icon: Paintbrush, title: "PERSONALIZAÇÃO", desc: "Seu quadro, sua identidade. 100% exclusivo." },
{ icon: Package, title: "EMBALAGEM SEGURA", desc: "Proteção total do nosso ateliê até sua parede." },
{ icon: MessageCircle, title: "ATENDIMENTO DIRETO", desc: "Fale direto com quem produz. Sem intermediários." }];


const testimonials = [
{ name: "Lucas M.", text: "A qualidade do alumínio é absurda. Parece peça de galeria urbana.", rating: 5, avatar: lucasAvatar },
{ name: "Camila R.", text: "Personalizei com uma foto do meu carro. Ficou simplesmente impecável.", rating: 5, avatar: camilaAvatar },
{ name: "Pedro S.", text: "Entrega super rápida e embalagem perfeita. Já é meu terceiro quadro com eles.", rating: 5, avatar: pedroAvatar }];


const Index = () => {
  const { data: dbProducts } = useProducts();
  const { data: config } = useSiteConfig();
  const videoModules = import.meta.glob('../../supabase/images/**/*.{mp4,MP4}', { eager: true, query: '?url', import: 'default' });
  const videoList = Object.values(videoModules) as string[];

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
      materials: p.materials
    }));
    return [...fromDb, ...products];
  }, [dbProducts]);

  const featured = allProducts.slice(0, 8);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-end">
        <div className="absolute inset-0">
          <img src={config?.hero_image_url || heroImage} alt="Hero QUADRZZ" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-20 md:pb-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.2 }}
            className="max-w-2xl">
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl leading-[0.95] drop-shadow-2xl uppercase">
              
              Não decore sua parede. Declare quem você é.
            </motion.h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground font-body leading-relaxed max-w-lg">
              Quadros premium em alumínio e MDF. Personalização única, entrega para todo o Brasil.
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
            className="text-2xl md:text-4xl mb-12">
            
            CATEGORIAS
          </motion.h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-6 md:overflow-visible md:gap-6">
            {categories.map((cat, i) =>
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 w-[140px] md:w-auto">
              
                <Link to={`/colecao?cat=${cat.slug}`} className="group block">
                  <div className="aspect-[3/4] bg-secondary overflow-hidden metal-border relative">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-all duration-400 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <span className="absolute bottom-4 left-4 font-display text-xs md:text-sm tracking-wider text-foreground">{cat.name}</span>
                  </div>
                </Link>
              </motion.div>
            )}
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
              loop: true
            }}
            className="w-full">
            
            <CarouselContent className="-ml-2 md:-ml-4">
              {featured.map((p, i) =>
              <CarouselItem key={p.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ProductCard product={p} index={i} />
                </CarouselItem>
              )}
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

      {/* Real Photos/Videos Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl mb-4 text-center">
            RESULTADOS REAIS
          </motion.h2>
          <p className="text-muted-foreground font-body text-center max-w-md mx-auto mb-12">
            Veja como ficam os quadros na parede. Fotos e vídeos reais dos nossos clientes.
          </p>
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-500/20 blur-[100px] rounded-[100%] pointer-events-none -z-10" />
            <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]} className="w-full"><CarouselContent className="-ml-2 md:-ml-4">{videoList.map((vid, idx) => (<CarouselItem key={idx} className="pl-2 md:pl-4 basis-full md:basis-1/2"><div className="aspect-[3/4] bg-secondary overflow-hidden metal-border"><video src={vid} autoPlay muted loop playsInline className="w-full h-full object-cover" /></div></CarouselItem>))}</CarouselContent>
              <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 border-border/50 hover:bg-background hidden md:flex" />
              <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 border-border/50 hover:bg-background hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Bastidores */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl mb-12">
            BASTIDORES
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6">
              <h3 className="text-xl md:text-2xl font-display tracking-wider">
                DO PROJETO À SUA PAREDE
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                Cada quadro QUADRZZ nasce no nosso ateliê com material selecionado a rigor: alumínio de alta liga e MDF de alta densidade, cortados com precisão CNC.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                A impressão UV direta garante resolução extrema — detalhes que não desbotam, não descascam e não perdem a vivacidade com o tempo. O acabamento é lixado, revisado quadro a quadro e enviado em embalagem desenvolvida para chegar perfeito.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                Sem intermediários. Sem atalhos. Do ateliê direto para a sua parede.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden metal-border bg-secondary aspect-[9/16] md:aspect-[3/4] lg:aspect-[9/16] rounded">
              <video src={producaoVideo} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promo Cards */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl mb-12">OFERTAS ESPECIAIS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "FRETE GRÁTIS", desc: "A partir de R$149", icon: "🚚" },
              { title: "15% OFF", desc: "No primeiro pedido", icon: "🔥" },
              { title: "PERSONALIZAÇÃO", desc: "Grátis em qualquer quadro", icon: "✨" },
            ].map((promo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary p-8 metal-border text-center"
              >
                <div className="text-4xl mb-4">{promo.icon}</div>
                <h3 className="text-xl font-display tracking-wider mb-2">{promo.title}</h3>
                <p className="text-muted-foreground font-body">{promo.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl mb-12">O QUE DIZEM</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) =>
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-secondary p-8 metal-border">
              
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) =>
                <span key={j} className="text-foreground text-sm">★</span>
                )}
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
            )}
          </div>
        </div>
      </section>

      {/* FAQ / Quebra de Objeções */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl mb-12 text-center">
            AINDA COM DÚVIDAS?
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: "É fácil instalar?", a: "Sim! Seu quadro já vem pronto para pendurar. Acompanha kit de instalação e não precisa de buracos complexos." },
              { q: "A qualidade é boa?", a: "Impressão HD em placa de alumínio premium. Cores vibrantes que não desbotam, material resistente e acabamento de galeria." },
              { q: "E se eu não gostar?", a: "Oferecemos garantia de satisfação. Se não amar seu quadro, devolvemos o dinheiro em até 7 dias." },
              { q: "Como funciona a entrega?", a: "Enviamos para todo o Brasil com rastreamento. Embalagem reforçada para chegar perfeito na sua parede." },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary p-6 metal-border"
              >
                <h3 className="text-sm font-display tracking-wider mb-2 text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground font-body">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
    </main>);

};

export default Index;




