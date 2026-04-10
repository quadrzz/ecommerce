import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    
    try {
      const { data, error: err } = await signIn(email, password);
      if (err) {
        setError(err.message === "Invalid login credentials" ? "Email ou senha incorretos." : err.message);
        setSubmitting(false);
      } else if (data?.user) {
        setTimeout(() => {
          setSubmitting(false);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login.");
      setSubmitting(false);
    }
  };

  if (user && isAdmin) {
    return <Navigate to="/manager" replace />;
  }

  if (user && !isAdmin) {
    return (
      <main className="pt-28 pb-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm px-4 text-center">
          <p className="text-destructive font-body">Sua conta não possui permissão de administrador.</p>
          <Button variant="outline" className="mt-4" onClick={() => signOut()}>
            Sair
          </Button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="pt-28 pb-20 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground font-body">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm px-4">
        <h1 className="text-2xl md:text-3xl mb-8 text-center">MANAGER</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-foreground/40 transition-colors"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">SENHA</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary border border-border text-foreground font-body text-sm p-3 pr-10 focus:outline-none focus:border-foreground/40 transition-colors"
                required
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-destructive font-body">{error}</p>}
          <Button variant="metal" size="lg" className="w-full" type="submit" disabled={submitting}>
            {submitting ? "ENTRANDO..." : "ENTRAR"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
