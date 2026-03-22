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

export const uploadSiteAsset = async (file: File, path: string): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${path}-${Math.random()}.${fileExt}`;
  
  // We use customer-uploads bucket for simplicity 
  // or maybe another bucket "assets" if created.
  // We'll reuse customer-uploads to keep storage simple.
  const { error } = await supabase.storage
    .from("customer-uploads")
    .upload(`assets/${fileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("customer-uploads")
    .getPublicUrl(`assets/${fileName}`);
    
  return data.publicUrl;
};
