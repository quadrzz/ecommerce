import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => (
  <main className="pt-28 pb-20">
    <div className="max-w-3xl mx-auto px-4 md:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl md:text-5xl">SOBRE A QUADRZZ</h1>

        <div className="mt-12 space-y-8 font-body text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground font-display tracking-tight normal-case" style={{ textTransform: "none" }}>
            A QUADRZZ nasceu de uma convicção: sua parede não é espaço para o genérico.
          </p>
          <p>
            Somos uma marca brasileira especializada em quadros decorativos premium, produzidos em placa de alumínio e MDF de alta densidade. Cada peça é impressa em HD com tecnologia de última geração, garantindo cores vivas, detalhes nítidos e durabilidade excepcional.
          </p>
          <p>
            Nosso posicionamento é claro: não vendemos decoração. Vendemos identidade. Cada quadro QUADRZZ é uma declaração de quem você é — seu estilo, suas referências, sua presença.
          </p>
          <p>
            Trabalhamos com produção sob demanda, o que significa que seu quadro é produzido exclusivamente para você. Sem estoque parado, sem peças genéricas. Do ateliê direto para sua parede, com embalagem reforçada e atendimento direto via WhatsApp.
          </p>
          <p>
            Para os apaixonados por carros, cultura urbana, frases de impacto ou estética minimalista — QUADRZZ é a marca que entende o que você quer dizer sem precisar falar.
          </p>
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <h2 className="text-xl md:text-2xl mb-6">NOSSOS VALORES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "QUALIDADE", desc: "Materiais premium, impressão HD, acabamento impecável." },
              { title: "IDENTIDADE", desc: "Cada peça reflete quem você é. Nada genérico." },
              { title: "PRESENÇA", desc: "Um quadro QUADRZZ transforma qualquer ambiente." },
            ].map((v) => (
              <div key={v.title} className="space-y-2">
                <h3 className="text-xs tracking-widest">{v.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/colecao">
            <Button variant="metal" size="xl">EXPLORAR COLEÇÃO</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </main>
);

export default About;
