import { useState, useEffect } from "react";
import { useSiteConfig, useUpdateSiteConfig, uploadSiteAsset } from "@/hooks/useSiteConfig";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Image, X } from "lucide-react";

export const SiteSettings = () => {
  const { data: config, isLoading } = useSiteConfig();
  const updateConfig = useUpdateSiteConfig();

  const [form, setForm] = useState({
    logo_url: "",
    hero_image_url: "",
    hero_title: "",
    hero_subtitle: "",
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    if (config) {
      setForm({
        logo_url: config.logo_url || "",
        hero_image_url: config.hero_image_url || "",
        hero_title: config.hero_title || "",
        hero_subtitle: config.hero_subtitle || "",
      });
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync(form);
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'hero_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (field === 'logo_url') setUploadingLogo(true);
    if (field === 'hero_image_url') setUploadingHero(true);

    try {
      const url = await uploadSiteAsset(file, field === 'logo_url' ? 'logo' : 'hero');
      setForm((f) => ({ ...f, [field]: url }));
      toast.success("Imagem enviada!");
    } catch {
      toast.error("Erro ao enviar imagem.");
    }

    if (field === 'logo_url') setUploadingLogo(false);
    if (field === 'hero_image_url') setUploadingHero(false);
  };

  if (isLoading) return <p className="text-muted-foreground font-body">Carregando...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-display">Configurações do Site</h2>
      <p className="text-muted-foreground font-body text-sm">Altere textos, logo e banner principal da sua loja.</p>

      <div className="bg-secondary p-6 border border-border space-y-6">
        <div>
          <label className="text-xs font-display tracking-widest mb-2 block">LOGO DA LOJA</label>
          {form.logo_url ? (
            <div className="relative w-40 h-16 bg-background metal-border flex items-center justify-center">
              <img src={form.logo_url} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
              <button onClick={() => setForm(f => ({ ...f, logo_url: "" }))} className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1"><X size={12}/></button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-40 h-16 border border-dashed border-border hover:border-foreground/30 cursor-pointer bg-background">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Image size={16} /> <span className="text-xs font-body">{uploadingLogo ? "Enviando..." : "Upload Logo"}</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo_url')} disabled={uploadingLogo} />
            </label>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <label className="text-xs font-display tracking-widest mb-2 block">BANNER PRINCIPAL (HERO)</label>
          {form.hero_image_url ? (
            <div className="relative w-full aspect-video bg-muted metal-border overflow-hidden">
              <img src={form.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
              <button onClick={() => setForm(f => ({ ...f, hero_image_url: "" }))} className="absolute top-2 right-2 bg-background/80 p-2"><X size={16}/></button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-video border border-dashed border-border hover:border-foreground/30 cursor-pointer bg-muted transition-colors">
              <Image size={32} className="text-muted-foreground mb-2" />
              <span className="text-sm font-body text-muted-foreground">{uploadingHero ? "Enviando..." : "Upload Imagem Banner"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'hero_image_url')} disabled={uploadingHero} />
            </label>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">TÍTULO PRINCIPAL</label>
            <input
              value={form.hero_title}
              onChange={(e) => setForm(f => ({ ...f, hero_title: e.target.value }))}
              className="w-full bg-background border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-foreground/40"
              placeholder="Ex: NÃO DECORE SUA PAREDE."
            />
          </div>
          <div>
            <label className="text-xs font-display tracking-widest mb-2 block">SUBTÍTULO</label>
            <textarea
              value={form.hero_subtitle}
              onChange={(e) => setForm(f => ({ ...f, hero_subtitle: e.target.value }))}
              className="w-full h-20 bg-background border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-foreground/40 resize-none"
              placeholder="Ex: Quadros premium..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="metal" size="lg" onClick={handleSave} disabled={updateConfig.isPending}>
            SALVAR CONFIGURAÇÕES
          </Button>
        </div>
      </div>
    </div>
  );
};
