import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <main className="pt-28 pb-20 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground font-body">Carregando...</p>
      </main>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/manager" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError("Email ou senha incorretos.");
    }
    setSubmitting(false);
  };

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
            />
          </div>
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">SENHA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-foreground/40 transition-colors"
              required
            />
          </div>
          {error && <p className="text-xs text-destructive font-body">{error}</p>}
          <Button variant="metal" size="lg" className="w-full" type="submit" disabled={submitting}>
            {submitting ? "ENTRANDO..." : "ENTRAR"}
          </Button>
        </form>
        {user && !isAdmin && (
          <p className="text-xs text-destructive font-body mt-4 text-center">
            Sua conta não possui permissão de administrador.
          </p>
        )}
      </div>
    </main>
  );
};

export default AdminLogin;
