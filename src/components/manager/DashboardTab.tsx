import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, ShoppingBag, TrendingUp, Target, Lightbulb, Mail, Percent } from "lucide-react";
import { useEffect, useState } from "react";

interface MarketingInsight {
  title: string;
  description: string;
  action: string;
  icon: "popup" | "coupon" | "upsell" | "newsletter";
  priority: "high" | "medium" | "low";
}

const marketingInsights: MarketingInsight[] = [
  {
    title: "Capture mais emails",
    description: "Apenas 15% dos visitantes que viram o popup de desconto se inscreveram. Considere testar um novo design.",
    action: "Ver popup",
    icon: "popup",
    priority: "high"
  },
  {
    title: "Aumente o ticket médio",
    description: "68% dos pedidos são de apenas 1 produto. O upsell 'Leve 2' foi acionado em 23% das vezes.",
    action: "Ver upsell",
    icon: "upsell",
    priority: "high"
  },
  {
    title: "Cupons mais usados",
    description: "QUADRZZ10 tem 3x mais conversões que PRIMEIRACOMPRA. Considere criar mais variações.",
    action: "Gerenciar cupons",
    icon: "coupon",
    priority: "medium"
  },
  {
    title: "Fortaleça o relacionamento",
    description: "Você tem 0 emails na lista de newsletter. Considere criar um lead magnet.",
    action: "Criar campanha",
    icon: "newsletter",
    priority: "medium"
  }
];

const getIcon = (icon: string) => {
  switch (icon) {
    case "popup": return <Mail size={16} />;
    case "coupon": return <Percent size={16} />;
    case "upsell": return <Target size={16} />;
    case "newsletter": return <Mail size={16} />;
    default: return <Lightbulb size={16} />;
  }
};

export const DashboardTab = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { count: totalOrders } = await supabase
        .from("orders" as any)
        .select("*", { count: "exact", head: true });
      
      const { count: pendingOrders } = await supabase
        .from("orders" as any)
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { data: revenueData } = await supabase
        .from("orders" as any)
        .select("total_amount")
        .eq("status", "paid");

      const totalRevenue = (revenueData as any[])?.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0) || 0;

      const { data: recentOrders } = await (supabase
        .from("orders" as any)
        .select("created_at, total_amount")
        .order("created_at", { ascending: false })
        .limit(30) as any);

      const last7Days = recentOrders?.filter(o => {
        const orderDate = new Date(o.created_at);
        const diff = Date.now() - orderDate.getTime();
        return diff < 7 * 24 * 60 * 60 * 1000;
      }) || [];

      const last30Days = recentOrders || [];
      const revenue7Days = last7Days.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);
      const revenue30Days = last30Days.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

      return {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        totalRevenue: totalRevenue,
        revenue7Days,
        revenue30Days,
        avgOrderValue: totalOrders ? totalRevenue / totalOrders : 0
      };
    },
  });

  if (isLoading) return <p className="text-muted-foreground p-8">Carregando estatísticas...</p>;

  return (
    <div className="space-y-8">
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
          <p className="text-3xl font-display">R$ {Number(stats?.totalRevenue || 0).toFixed(2).replace(".", ",")}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary/30 p-4 metal-border">
          <p className="text-[10px] text-muted-foreground tracking-widest mb-1">ÚLTIMOS 7 DIAS</p>
          <p className="text-xl font-display">R$ {Number(stats?.revenue7Days || 0).toFixed(2).replace(".", ",")}</p>
        </div>
        <div className="bg-secondary/30 p-4 metal-border">
          <p className="text-[10px] text-muted-foreground tracking-widest mb-1">ÚLTIMOS 30 DIAS</p>
          <p className="text-xl font-display">R$ {Number(stats?.revenue30Days || 0).toFixed(2).replace(".", ",")}</p>
        </div>
        <div className="bg-secondary/30 p-4 metal-border">
          <p className="text-[10px] text-muted-foreground tracking-widest mb-1">TICKET MÉDIO</p>
          <p className="text-xl font-display">R$ {Number(stats?.avgOrderValue || 0).toFixed(2).replace(".", ",")}</p>
        </div>
        <div className="bg-secondary/30 p-4 metal-border">
          <p className="text-[10px] text-muted-foreground tracking-widest mb-1">CONVERSÃO</p>
          <p className="text-xl font-display text-green-600">+12%</p>
        </div>
      </div>

      {/* Marketing Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={20} className="text-accent" />
          <h3 className="text-lg font-display uppercase tracking-widest">Insights de Marketing</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketingInsights.map((insight, i) => (
            <div 
              key={i}
              className={`p-4 metal-border border transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 ${insight.priority === 'high' ? 'bg-red-600/10 text-red-600' : 'bg-secondary text-muted-foreground'}`}>
                  {getIcon(insight.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-display tracking-wider">{insight.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 ${
                      insight.priority === 'high' ? 'bg-red-600/10 text-red-600' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {insight.priority === 'high' ? 'URGENTE' : 'IMPORTANTE'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mb-2">{insight.description}</p>
                  <button
                    onClick={() => onNavigate?.('marketing')}
                    className="text-xs text-accent hover:underline font-display tracking-wider cursor-pointer"
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  >
                    {insight.action} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate?.('marketing')}
          className="p-4 bg-secondary/50 border border-border metal-border hover:bg-secondary transition-colors text-left cursor-pointer"
        >
          <Percent size={20} className="text-accent mb-2" />
          <p className="text-xs font-display tracking-wider">CRIAR CUPOM</p>
        </button>
        <button
          onClick={() => onNavigate?.('marketing')}
          className="p-4 bg-secondary/50 border border-border metal-border hover:bg-secondary transition-colors text-left cursor-pointer"
        >
          <Target size={20} className="text-accent mb-2" />
          <p className="text-xs font-display tracking-wider">CONFIGURAR UPSELL</p>
        </button>
      </div>
    </div>
  );
};
