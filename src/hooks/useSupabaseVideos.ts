import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useSupabaseVideos() {
  return useQuery({
    queryKey: ["supabase-videos"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("images").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) {
        console.error("Error fetching videos from Supabase:", error);
        return [];
      }

      // Filter only video formats (mp4, webm, mov, ogg)
      const videoFiles = data.filter((file) => {
        const name = file.name.toLowerCase();
        return (
          name.endsWith(".mp4") ||
          name.endsWith(".webm") ||
          name.endsWith(".mov") ||
          name.endsWith(".ogg")
        );
      });

      // Map to public URLs
      const urls = videoFiles.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(file.name);
        return publicUrlData.publicUrl;
      });

      return urls;
    },
  });
}
