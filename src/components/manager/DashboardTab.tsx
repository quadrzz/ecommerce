import { BarChart, Map, Users } from "lucide-react";

export const DashboardTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display">Dashboard</h2>
      <p className="text-muted-foreground font-body">Bem-vindo ao painel de controle Quadrzz.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary p-6 metal-border flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={16} /> <span className="text-xs tracking-widest font-display">VISITAS HOJE</span>
          </div>
          <p className="text-3xl font-display">124</p>
        </div>
        <div className="bg-secondary p-6 metal-border flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Map size={16} /> <span className="text-xs tracking-widest font-display">PEDIDOS PENDENTES</span>
          </div>
          <p className="text-3xl font-display">5</p>
        </div>
        <div className="bg-secondary p-6 metal-border flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart size={16} /> <span className="text-xs tracking-widest font-display">CONVERSÃO MENSAL</span>
          </div>
          <p className="text-3xl font-display">4.2%</p>
        </div>
      </div>
    </div>
  );
};
