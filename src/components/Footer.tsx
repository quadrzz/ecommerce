import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-secondary border-t border-border">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-xl mb-4">QUADRZZ</h3>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Transformamos identidade em arte de parede. Quadros em alumínio premium e MDF de alta densidade.
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-widest mb-4">NAVEGAÇÃO</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors">Início</Link>
            <Link to="/colecao" className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors">Coleção</Link>
            <Link to="/personalizar" className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors">Personalizar</Link>
            <Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors">Sobre</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-widest mb-4">CATEGORIAS</h4>
          <div className="flex flex-col gap-2">
            <Link to="/colecao?cat=carros" className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors">Carros</Link>
            <Link to="/colecao?cat=frases" className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors">Frases</Link>
            <Link to="/colecao?cat=minimalistas" className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors">Minimalistas</Link>
            <Link to="/colecao?cat=lifestyle" className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors">Lifestyle</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-widest mb-4">CONTATO</h4>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Fale conosco pelo WhatsApp para encomendas especiais e dúvidas.
          </p>
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-foreground font-display tracking-wider hover:opacity-80 transition-opacity"
          >
            WHATSAPP →
          </a>
        </div>
      </div>
      <div className="border-t border-border mt-12 pt-8 text-center">
        <p className="text-xs text-muted-foreground font-body">
          © 2025 QUADRZZ. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
