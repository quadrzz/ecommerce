import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, ShoppingBag, Users, TrendingUp } from "lucide-react";

export const DashboardTab = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // 1. Total de pedidos
      const { count: totalOrders, error: err1 } = await supabase
        .from("orders" as any)
        .select("*", { count: "exact", head: true });
      
      // 2. Pedidos pendentes
      const { count: pendingOrders, error: err2 } = await supabase
        .from("orders" as any)
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // 3. Faturamento Total (Apenas pagos)
      const { data: revenueData, error: err3 } = await supabase
        .from("orders" as any)
        .select("total_amount")
        .eq("status", "paid");

      if (err1 || err2 || err3) throw (err1 || err2 || err3);

      const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

      return {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        totalRevenue: totalRevenue
      };
    },
  });

  if (isLoading) return <p className="text-muted-foreground p-8">Carregando estatísticas...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display uppercase tracking-widest">Dashboard</h2>
        <p className="text-muted-foreground font-body text-sm">Visão geral do desempenho da sua loja.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary p-6 metal-border flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingBag size={16} /> <span className="text-xs tracking-widest font-display">TOTAL DE PEDIDOS</span>
          </div>
          <p className="text-3xl font-display">{stats?.totalOrders}</p>
        </div>
        
        <div className="bg-secondary p-6 metal-border flex flex-col gap-2 border-l-4 border-l-yellow-500/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp size={16} /> <span className="text-xs tracking-widest font-display">PEDIDOS PENDENTES</span>
          </div>
          <p className="text-3xl font-display">{stats?.pendingOrders}</p>
        </div>

        <div className="bg-secondary p-6 metal-border flex flex-col gap-2 border-l-4 border-l-green-500/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart size={16} /> <span className="text-xs tracking-widest font-display">FATURAMENTO TOTAL</span>
          </div>
          <p className="text-3xl font-display">R$ {stats?.totalRevenue.toFixed(2).replace(".", ",")}</p>
        </div>
      </div>

      <div className="mt-12 p-8 border border-border bg-secondary/20 border-dashed text-center">
        <p className="text-sm text-muted-foreground font-body italic">
          "O sucesso é a soma de pequenos esforços repetidos dia após dia."
        </p>
      </div>
    </div>
  );
};
