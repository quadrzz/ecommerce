import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tag, Percent, Mail, Plus, Trash2, Save, Zap } from "lucide-react";

interface Coupon {
  id?: string;
  code: string;
  discount_percent: number;
  min_order_value: number;
  active: boolean;
}

interface MarketingConfig {
  id?: string;
  popup_enabled: boolean;
  popup_discount: number;
  popup_code: string;
  popup_trigger_seconds: number;
  upsell_discount: number;
  countdown_hours: number;
}

export const MarketingSettings = () => {
  const queryClient = useQueryClient();

  const { data: coupons, isLoading: loadingCoupons } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("marketing_coupons" as any)
        .select("*")
        .order("created_at", { ascending: false }) as any);
      if (error) throw error;
      return data as Coupon[];
    }
  });

  const { data: marketingConfig } = useQuery({
    queryKey: ["marketing-config"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("marketing_config" as any)
        .select("*")
        .limit(1) as any);
      if (error) throw error;
      return data?.[0] as MarketingConfig || null;
    }
  });

  const [config, setConfig] = useState<MarketingConfig>({
    popup_enabled: true,
    popup_discount: 10,
    popup_code: "QUADRZZ10",
    popup_trigger_seconds: 15,
    upsell_discount: 15,
    countdown_hours: 2
  });

  const [newCoupon, setNewCoupon] = useState<Omit<Coupon, "id">>({
    code: "",
    discount_percent: 10,
    min_order_value: 100,
    active: true
  });

  const saveCouponMutation = useMutation({
    mutationFn: async (coupon: Coupon) => {
      if (coupon.id) {
        return supabase.from("marketing_coupons" as any).update(coupon).eq("id", coupon.id);
      } else {
        return supabase.from("marketing_coupons" as any).insert(coupon);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Cupom salvo!");
      setNewCoupon({ code: "", discount_percent: 10, min_order_value: 100, active: true });
    },
    onError: () => toast.error("Erro ao salvar cupom")
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id: string) => {
      return supabase.from("marketing_coupons" as any).delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Cupom excluído!");
    },
    onError: () => toast.error("Erro ao excluir cupom")
  });

  const saveConfigMutation = useMutation({
    mutationFn: async (cfg: MarketingConfig) => {
      if (marketingConfig?.id) {
        return supabase.from("marketing_config" as any).update(cfg).eq("id", marketingConfig.id);
      } else {
        return supabase.from("marketing_config" as any).insert(cfg);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-config"] });
      toast.success("Configurações salvas!");
    },
    onError: () => toast.error("Erro ao salvar configurações")
  });

  useEffect(() => {
    if (marketingConfig) setConfig(marketingConfig);
  }, [marketingConfig]);

  if (loadingCoupons) return <p className="text-muted-foreground font-body p-8">Carregando...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display uppercase tracking-widest">Marketing & Ofertas</h2>
        <p className="text-muted-foreground font-body text-sm">Gerencie promoções, cupons e configurações de conversão.</p>
      </div>

      {/* Popup de Email */}
      <div className="bg-secondary p-6 border border-border space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <Mail size={20} className="text-accent" />
          <h3 className="text-lg font-display">Popup de Captura de Email</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="popup_enabled"
              checked={config.popup_enabled}
              onChange={(e) => setConfig(c => ({ ...c, popup_enabled: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="popup_enabled" className="text-sm font-body">Ativar popup</label>
          </div>
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">DESCONTO (%)</label>
            <Input
              type="number"
              value={config.popup_discount}
              onChange={(e) => setConfig(c => ({ ...c, popup_discount: parseInt(e.target.value) }))}
              className="w-24"
            />
          </div>
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">CÓDIGO DO CUPOM</label>
            <Input
              value={config.popup_code}
              onChange={(e) => setConfig(c => ({ ...c, popup_code: e.target.value.toUpperCase() }))}
              className="w-40"
            />
          </div>
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">SEGUNDOS ATÉ APARECER</label>
            <Input
              type="number"
              value={config.popup_trigger_seconds}
              onChange={(e) => setConfig(c => ({ ...c, popup_trigger_seconds: parseInt(e.target.value) }))}
              className="w-24"
            />
          </div>
        </div>

        <Button variant="metal" size="sm" onClick={() => saveConfigMutation.mutate(config)}>
          <Save size={14} className="mr-2" /> SALVAR
        </Button>
      </div>

      {/* Upsell & Countdown */}
      <div className="bg-secondary p-6 border border-border space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <Zap size={20} className="text-accent" />
          <h3 className="text-lg font-display">Upsell & Urgência</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">DESCONTO UPSELL "LEVE 2" (%)</label>
            <Input
              type="number"
              value={config.upsell_discount}
              onChange={(e) => setConfig(c => ({ ...c, upsell_discount: parseInt(e.target.value) }))}
              className="w-24"
            />
          </div>
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">CONTADOR REGRESSIVO (HORAS)</label>
            <Input
              type="number"
              value={config.countdown_hours}
              onChange={(e) => setConfig(c => ({ ...c, countdown_hours: parseInt(e.target.value) }))}
              className="w-24"
            />
          </div>
        </div>

        <Button variant="metal" size="sm" onClick={() => saveConfigMutation.mutate(config)}>
          <Save size={14} className="mr-2" /> SALVAR
        </Button>
      </div>

      {/* Gerenciar Cupons */}
      <div className="bg-secondary p-6 border border-border space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <Tag size={20} className="text-accent" />
          <h3 className="text-lg font-display">Gerenciar Cupons</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">CÓDIGO</label>
            <Input
              value={newCoupon.code}
              onChange={(e) => setNewCoupon(c => ({ ...c, code: e.target.value.toUpperCase() }))}
              placeholder="EX: DESCONTO20"
            />
          </div>
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">% OFF</label>
            <Input
              type="number"
              value={newCoupon.discount_percent}
              onChange={(e) => setNewCoupon(c => ({ ...c, discount_percent: parseInt(e.target.value) }))}
              className="w-20"
            />
          </div>
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">MÍNIMO (R$)</label>
            <Input
              type="number"
              value={newCoupon.min_order_value}
              onChange={(e) => setNewCoupon(c => ({ ...c, min_order_value: parseInt(e.target.value) }))}
              className="w-24"
            />
          </div>
          <Button variant="metal" size="sm" onClick={() => saveCouponMutation.mutate(newCoupon)} disabled={!newCoupon.code}>
            <Plus size={14} className="mr-1" /> ADICIONAR
          </Button>
        </div>

        {/* Lista de Cupons */}
        <div className="mt-4 space-y-2">
          {coupons?.map((coupon) => (
            <div key={coupon.id} className="flex items-center justify-between p-3 bg-background border border-border">
              <div className="flex items-center gap-4">
                <span className="font-display text-sm">{coupon.code}</span>
                <span className="text-xs text-muted-foreground">{coupon.discount_percent}% OFF</span>
                <span className="text-xs text-muted-foreground">Mín: R$ {coupon.min_order_value}</span>
                <span className={`text-[10px] px-2 py-0.5 ${coupon.active ? 'bg-green-600/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                  {coupon.active ? "ATIVO" : "INATIVO"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => saveCouponMutation.mutate({ ...coupon, active: !coupon.active })}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {coupon.active ? "DESATIVAR" : "ATIVAR"}
                </button>
                {coupon.id && (
                  <button
                    onClick={() => deleteCouponMutation.mutate(coupon.id!)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {(!coupons || coupons.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum cupom cadastrado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingSettings;