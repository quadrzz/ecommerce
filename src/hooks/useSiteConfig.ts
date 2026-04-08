import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteConfig {
  id: number;
  logo_url: string | null;
  hero_image_url: string | null;
  hero_title: string;
  hero_subtitle: string;
  updated_at: string;
}

export const useSiteConfig = () => {
  return useQuery({
    queryKey: ["siteConfig"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_config" as any)
        .select("*")
        .eq("id", 1)
        .single();

      if (error && error.code !== "PGRST116") { // Ignore zero rows error
        throw error;
      }
      return data as unknown as SiteConfig | null;
    },
  });
};

export const useUpdateSiteConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<SiteConfig>) => {
      const { data, error } = await supabase
        .from("site_config" as any)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", 1)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteConfig"] });
    },
  });
};

export const uploadSiteAsset = async (file: File, folder: string): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}-${Date.now()}.${fileExt}`;

  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.id === 'site-assets');
    
    if (!bucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket('site-assets', {
        public: true,
        fileSizeLimit: 5242880,
      });
      if (bucketError && bucketError.message !== 'Bucket already exists') {
        console.error("Bucket creation error:", bucketError);
        throw new Error("Não foi criar o bucket de armazenamento");
      }
    }

    const { error } = await supabase.storage
      .from("site-assets")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from("site-assets")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err: any) {
    console.error("Upload error:", err);
    throw new Error(err.message || "Erro ao enviar imagem");
  }
};
