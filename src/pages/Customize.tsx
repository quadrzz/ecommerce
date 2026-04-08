import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const sizes = ["21x30cm (A4)"];
const materials = ["Alumínio Premium", "MDF Alta Densidade"];

const Customize = () => {
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    let imageUrl = "Nenhuma imagem enviada.";

    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from("customer-uploads")
          .upload(filePath, file);

        if (error) {
          console.error("Erro ao fazer upload:", error);
          alert(`Erro Supabase: ${error.message} \n\nDetalhes: ${JSON.stringify(error)}`);
        } else if (data) {
          const { data: publicUrlData } = supabase.storage
            .from("customer-uploads")
            .getPublicUrl(filePath);
          
          if (publicUrlData) {
              imageUrl = publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
      } finally {
        setIsUploading(false);
      }
    }

    const msg = `Olá! Quero personalizar um quadro.
Tamanho: ${sizes[selectedSize]}
Material: ${materials[selectedMaterial]}
Observações: ${notes || "Nenhuma"}
Imagem: ${imageUrl}`;
    
    window.location.href = `https://wa.me/5581991169932?text=${encodeURIComponent(msg)}`;

  };

  return (
    <main className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl md:text-5xl">PERSONALIZAR MEU QUADRO</h1>
          <p className="mt-4 text-muted-foreground font-body leading-relaxed max-w-lg">
            Envie sua referência. Nós transformamos em presença. Sua imagem em alumínio premium ou MDF de alta densidade.
          </p>

          <div className="mt-12 space-y-10">
            {/* Upload */}
            <div>
              <p className="text-xs font-display tracking-widest mb-3">SUA IMAGEM</p>
              <label className="flex flex-col items-center justify-center h-48 border border-dashed border-border hover:border-foreground/30 transition-colors cursor-pointer bg-secondary">
                <Upload size={24} strokeWidth={1} className="text-muted-foreground mb-3" />
                <span className="text-xs text-muted-foreground font-body">
                  {file ? file.name : "Clique para enviar sua imagem"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            {/* Size */}
            <div>
              <p className="text-xs font-display tracking-widest mb-3">TAMANHO</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(i)}
                    className={`text-xs font-body px-4 py-2.5 border transition-colors ${
                      selectedSize === i ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <p className="text-xs font-display tracking-widest mb-3">MATERIAL</p>
              <div className="flex flex-wrap gap-2">
                {materials.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(i)}
                    className={`text-xs font-body px-4 py-2.5 border transition-colors ${
                      selectedMaterial === i ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-xs font-display tracking-widest mb-3">OBSERVAÇÕES</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva como quer seu quadro..."
                className="w-full h-32 bg-secondary border border-border text-foreground font-body text-sm p-4 resize-none focus:outline-none focus:border-foreground/40 transition-colors placeholder:text-muted-foreground"
              />
            </div>

            {/* Submit */}
            <Button variant="metal" size="xl" onClick={handleSubmit} disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ENVIANDO IMAGEM...
                </>
              ) : (
                "SOLICITAR ORÇAMENTO"
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Customize;
