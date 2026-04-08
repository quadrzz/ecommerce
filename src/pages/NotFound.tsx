import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="pt-28 pb-20 flex items-center justify-center min-h-screen">
    <div className="text-center max-w-md px-4">
      <h1 className="text-6xl md:text-8xl font-display tracking-widest mb-4">404</h1>
      <p className="text-xl text-muted-foreground font-body mb-2">Página não encontrada</p>
      <p className="text-sm text-muted-foreground font-body mb-8">
        O conteúdo que você procura não existe ou foi movido.
      </p>
      <Link
        to="/"
        className="inline-block text-sm font-display tracking-widest border-b border-foreground pb-1 hover:text-muted-foreground transition-colors"
      >
        VOLTAR AO INÍCIO
      </Link>
    </div>
  </main>
);

export default NotFound;
