import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Eye,
  RefreshCcw,
  User,
  Mail,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  payment_method: string;
  payment_id: string | null;
  created_at: string;
};

export const OrdersTab = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown) as Order[];

    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order["status"] }) => {
      const { error } = await supabase
        .from("orders" as any)
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Status atualizado!");
    },
  });

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "paid": return <CheckCircle2 size={14} className="text-green-500" />;
      case "pending": return <Clock size={14} className="text-yellow-500" />;
      case "failed": return <AlertCircle size={14} className="text-red-500" />;
      case "cancelled": return <XCircle size={14} className="text-muted-foreground" />;
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "paid": return "Pago";
      case "pending": return "Pendente";
      case "failed": return "Falhou";
      case "cancelled": return "Cancelado";
    }
  };

  if (isLoading) return <p className="text-muted-foreground p-8">Carregando pedidos...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-widest">Pedidos</h2>
          <p className="text-muted-foreground font-body text-sm">Acompanhe as vendas e status de entrega.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCcw size={14} className="mr-2" /> ATUALIZAR
        </Button>
      </div>

      {!orders?.length ? (
        <div className="text-center py-20 bg-secondary/30 mt-6 border border-border border-dashed">
          <p className="text-muted-foreground font-body">Nenhum pedido encontrado ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-secondary border border-border p-5 hover:border-foreground/20 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-display tracking-widest text-muted-foreground">#{order.id.slice(0, 8)}</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-background border border-border rounded-full">
                      {getStatusIcon(order.status)}
                      <span className="text-[10px] font-display uppercase tracking-tighter">{getStatusText(order.status)}</span>
                    </div>
                  </div>
                  <h3 className="font-display tracking-widest uppercase">{order.customer_name}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1"><Mail size={12} /> {order.customer_email}</span>
                    <span className="flex items-center gap-1"><Phone size={12} /> {order.customer_phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-display">TOTAL</p>
                    <p className="text-xl font-display">R$ {order.total_amount.toFixed(2).replace(".", ",")}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      className="bg-background border border-border text-[10px] font-display uppercase tracking-widest p-2 focus:outline-none focus:border-foreground/40"
                      value={order.status}
                      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as Order["status"] })}
                    >
                      <option value="pending">Pendente</option>
                      <option value="paid">Pago</option>
                      <option value="failed">Falha</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
