import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const navLinks = [
  { label: "INÍCIO", path: "/" },
  { label: "COLEÇÃO", path: "/colecao" },
  { label: "PERSONALIZAR", path: "/personalizar" },
  { label: "SOBRE", path: "/sobre" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const { data: config } = useSiteConfig();

  useEffect(() => {
    sessionStorage.setItem("@quadrzz:hasInteracted", "true");
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-secondary text-muted-foreground text-xs font-body tracking-widest text-center py-2 uppercase">
        Frete grátis para todo o Brasil • Produção sob demanda
      </div>
      
      <nav className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center h-16 relative">
          {/* Left nav - hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 absolute left-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-display tracking-widest transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Center logo */}
          <div className="flex justify-center">
            <Link to="/" className="text-2xl font-display tracking-widest leading-none z-50 inline-block">
              {config?.logo_url ? (
                <img src={config.logo_url} alt="Quadrzz" className="h-6 md:h-8 object-contain" />
              ) : (
                "QUADRZZ"
              )}
            </Link>
          </div>
          
          {/* Right - Cart */}
          <div className="absolute right-0 flex items-center gap-4">
            <CartDrawer>
              <button className="relative p-2 text-foreground hover:opacity-70 transition-opacity">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </CartDrawer>

            <button
              className="md:hidden p-2 -mr-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="flex flex-col px-4 py-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-display tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
