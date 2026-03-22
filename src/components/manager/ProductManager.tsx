import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, uploadProductImage, type DbProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Image, X } from "lucide-react";
import { toast } from "sonner";

const defaultSizes = ["30x40cm", "40x60cm", "60x90cm", "80x120cm"];
const defaultMaterials = ["Alumínio Premium", "MDF Alta Densidade"];
const categoryOptions = [
  { name: "Carros", slug: "carros" },
  { name: "Frases", slug: "frases" },
  { name: "Personalizados", slug: "personalizados" },
  { name: "Minimalistas", slug: "minimalistas" },
  { name: "Lifestyle", slug: "lifestyle" },
];

const emptyForm = {
  name: "",
  category: "Carros",
  category_slug: "carros",
  price: 0,
  description: "",
  sizes: defaultSizes,
  materials: defaultMaterials,
  image_url: "",
  is_active: true,
  yampi_sku_id: "",
};

export const ProductManager = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm((f) => ({ ...f, image_url: url }));
      toast.success("Imagem enviada!");
    } catch {
      toast.error("Erro ao enviar imagem.");
    }
    setUploading(false);
  };

  const handleCategoryChange = (slug: string) => {
    const cat = categoryOptions.find((c) => c.slug === slug);
    if (cat) setForm((f) => ({ ...f, category: cat.name, category_slug: cat.slug }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error("Nome e preço são obrigatórios.");
      return;
    }
    try {
      if (editingId) {
        await updateProduct.mutateAsync({ id: editingId, ...form });
        toast.success("Produto atualizado!");
      } else {
        await createProduct.mutateAsync(form);
        toast.success("Produto criado!");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch {
      toast.error("Erro ao salvar produto.");
    }
  };

  const handleEdit = (p: DbProduct) => {
    setForm({
      name: p.name,
      category: p.category,
      category_slug: p.category_slug,
      price: p.price,
      description: p.description || "",
      sizes: p.sizes,
      materials: p.materials,
      image_url: p.image_url || "",
      is_active: p.is_active ?? true,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produto excluído.");
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  const handleSizeToggle = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  };

  const handleMaterialToggle = (mat: string) => {
    setForm((f) => ({
      ...f,
      materials: f.materials.includes(mat)
        ? f.materials.filter((m) => m !== mat)
        : [...f.materials, mat],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display">Produtos</h2>
          <p className="text-muted-foreground font-body text-sm">Gerencie seu catálogo, estoque e descrições.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          <Plus size={14} className="mr-2" /> NOVO PRODUTO
        </Button>
      </div>

      {showForm && (
        <div className="bg-secondary border border-border p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display tracking-widest">
              {editingId ? "EDITAR PRODUTO" : "NOVO PRODUTO"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
              <X size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>

          {/* Form Content */}
          <div className="grid gap-6">
            <div>
              <label className="text-xs font-display tracking-widest mb-2 block">IMAGEM</label>
              {form.image_url ? (
                <div className="relative w-40 aspect-[3/4] bg-muted metal-border overflow-hidden">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => setForm((f) => ({ ...f, image_url: "" }))} className="absolute top-1 right-1 bg-background/80 p-1"><X size={12} /></button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-40 aspect-[3/4] border border-dashed border-border hover:border-foreground/30 cursor-pointer transition-colors bg-muted">
                  <div className="text-center">
                    <Image size={20} strokeWidth={1} className="mx-auto text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground font-body">{uploading ? "Enviando..." : "Upload"}</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-display tracking-widest mb-2 block">NOME</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-background border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-foreground/40 transition-colors"
                  placeholder="Nome do produto"
                />
              </div>
              <div>
                <label className="text-xs font-display tracking-widest mb-2 block">PREÇO (R$)</label>
                <input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-background border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-foreground/40 transition-colors tabular-nums"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-display tracking-widest mb-2 block">CATEGORIA</label>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => handleCategoryChange(c.slug)}
                    className={`text-xs font-body px-3 py-2 border transition-colors ${form.category_slug === c.slug ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"}`}
                  >
                    {c.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-display tracking-widest mb-2 block">DESCRIÇÃO</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full h-24 bg-background border border-border text-foreground font-body text-sm p-3 resize-none focus:outline-none focus:border-foreground/40 transition-colors placeholder:text-muted-foreground"
                placeholder="Descrição curta e impactante..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-display tracking-widest mb-2 block">TAMANHOS</label>
                <div className="flex flex-wrap gap-2">
                  {defaultSizes.map((s) => (
                    <button key={s} onClick={() => handleSizeToggle(s)} className={`text-xs font-body px-3 py-2 border transition-colors ${form.sizes.includes(s) ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-display tracking-widest mb-2 block">MATERIAIS</label>
                <div className="flex flex-wrap gap-2">
                  {defaultMaterials.map((m) => (
                    <button key={m} onClick={() => handleMaterialToggle(m)} className={`text-xs font-body px-3 py-2 border transition-colors ${form.materials.includes(m) ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"}`}>{m}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-display tracking-widest">ATIVO</label>
              <button
                onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                className={`w-10 h-6 rounded-full transition-colors relative ${form.is_active ? "bg-foreground" : "bg-border"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-transform ${form.is_active ? "left-5" : "left-1"}`} />
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="metal" size="lg" onClick={handleSave} disabled={createProduct.isPending || updateProduct.isPending}>
                {editingId ? "SALVAR ALTERAÇÕES" : "CRIAR PRODUTO"}
              </Button>
              <Button variant="outline" size="lg" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
                CANCELAR
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      {productsLoading ? (
        <p className="text-muted-foreground font-body">Carregando produtos...</p>
      ) : !products?.length ? (
        <div className="text-center py-20 bg-secondary/30 mt-6 border border-border border-dashed">
          <p className="text-muted-foreground font-body mb-4">Nenhum produto cadastrado.</p>
          <Button variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}>
            <Plus size={14} className="mr-2"/> ADICIONAR PRIMEIRO PRODUTO
          </Button>
        </div>
      ) : (
        <div className="space-y-3 mt-6">
          {products.map((p) => (
            <div key={p.id} className={`flex items-center gap-4 bg-secondary border border-border p-4 transition-opacity ${!p.is_active ? "opacity-50" : ""}`}>
              <div className="w-16 h-20 bg-muted metal-border overflow-hidden flex-shrink-0">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={16} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display tracking-wider truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground font-body">
                  {p.category} · R$ {p.price.toFixed(2).replace(".", ",")}
                  {!p.is_active && " · INATIVO"}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => handleEdit(p)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
