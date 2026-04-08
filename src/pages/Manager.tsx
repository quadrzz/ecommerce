import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  PanelLeftClose, 
  PanelRightClose, 
  Menu,
  KeyRound,
  ShoppingBag,
  X,
  Megaphone
} from "lucide-react";

import { DashboardTab } from "@/components/manager/DashboardTab";
import { ProductManager } from "@/components/manager/ProductManager";
import { OrdersTab } from "@/components/manager/OrdersTab";
import { SiteSettings } from "@/components/manager/SiteSettings";
import { MarketingSettings } from "@/components/manager/MarketingSettings";

import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Tab = "dashboard" | "orders" | "products" | "settings" | "marketing";


const Manager = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  if (loading) {
    return (
      <main className="pt-28 pb-20 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground font-body">Carregando...</p>
      </main>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (passwordForm.new.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setChangingPassword(true);
    
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: passwordForm.current,
    });
    
    if (signInErr) {
      toast.error("Senha atual incorreta.");
      setChangingPassword(false);
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: passwordForm.new });
    if (error) {
      toast.error("Erro ao trocar senha.");
    } else {
      toast.success("Senha alterada com sucesso!");
      setShowPasswordForm(false);
      setPasswordForm({ current: "", new: "", confirm: "" });
    }
    setChangingPassword(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case "orders": return <OrdersTab />;
      case "products": return <ProductManager />;
      case "marketing": return <MarketingSettings />;
      case "settings": return <SiteSettings />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row pt-16 md:pt-0">
      
      {/* Mobile Top Nav for Manager */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/95 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <h1 className="font-display tracking-widest text-lg">MANAGER</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <PanelRightClose size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-16 md:top-0 left-0 w-full md:w-64 h-[calc(100vh-4rem)] md:h-screen 
        bg-secondary/50 border-r border-border flex flex-col z-30 transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="font-display tracking-widest text-2xl">MANAGER</h1>
          <p className="text-xs text-muted-foreground font-body mt-1 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 px-4 py-6 md:py-0 space-y-2 overflow-y-auto">
          <button
            onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-display tracking-widest transition-colors
              ${activeTab === "dashboard" ? "bg-foreground text-background" : "hover:bg-accent/10"}`}
          >
            <LayoutDashboard size={16} /> DASHBOARD
          </button>
          <button
            onClick={() => { setActiveTab("orders"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-display tracking-widest transition-colors
              ${activeTab === "orders" ? "bg-foreground text-background" : "hover:bg-accent/10"}`}
          >
            <ShoppingBag size={16} /> PEDIDOS
          </button>


          <button
            onClick={() => { setActiveTab("products"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-display tracking-widest transition-colors
              ${activeTab === "products" ? "bg-foreground text-background" : "hover:bg-accent/10"}`}
          >
            <Package size={16} /> PRODUTOS
          </button>
          <button
            onClick={() => { setActiveTab("marketing"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-display tracking-widest transition-colors
              ${activeTab === "marketing" ? "bg-foreground text-background" : "hover:bg-accent/10"}`}
          >
            <Megaphone size={16} /> MARKETING
          </button>
          <button
            onClick={() => { setActiveTab("settings"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-display tracking-widest transition-colors
              ${activeTab === "settings" ? "bg-foreground text-background" : "hover:bg-accent/10"}`}
          >
            <Settings size={16} /> CONFIGURAÇÕES
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-border space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-muted-foreground hover:text-foreground" 
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            <KeyRound size={16} className="mr-2" /> SENHA
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-muted-foreground hover:text-foreground" 
            onClick={signOut}
          >
            <LogOut size={16} className="mr-2" /> SAIR
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8 md:pt-16 max-w-6xl mx-auto">
          {/* Password change form */}
          {showPasswordForm && (
            <div className="mb-12 bg-secondary border border-border p-6 md:p-8 space-y-4 metal-border">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-display tracking-widest">TROCAR SENHA</h2>
                <button onClick={() => { setShowPasswordForm(false); setPasswordForm({ current: "", new: "", confirm: "" }); }}>
                  <X size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-display tracking-widest mb-2 block">SENHA ATUAL</label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
                    className="w-full bg-background border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-display tracking-widest mb-2 block">NOVA SENHA</label>
                  <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, new: e.target.value }))}
                    className="w-full bg-background border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-display tracking-widest mb-2 block">CONFIRMAR</label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
                    className="w-full bg-background border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>
              </div>
              <Button variant="metal" size="lg" onClick={handleChangePassword} disabled={changingPassword}>
                {changingPassword ? "ALTERANDO..." : "ALTERAR SENHA"}
              </Button>
            </div>
          )}

          {renderTab()}
        </div>
      </main>

    </div>
  );
};

export default Manager;

