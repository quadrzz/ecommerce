import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef, useState } from "react";

export interface RealVideo {
  id: string;
  /** Instagram Reel or TikTok URL */
  url: string;
  /** Short label */
  title: string;
  /** "instagram" | "tiktok" */
  platform: "instagram" | "tiktok";
}

// ── Paste your real video URLs here ──────────────────────────
const realVideos: RealVideo[] = [
  // Example:
  // { id: "1", url: "https://www.instagram.com/reel/ABC123/", title: "PORSCHE 911 EM ALUMÍNIO", platform: "instagram" },
  // { id: "2", url: "https://www.tiktok.com/@quadrzz/video/123456", title: "UNBOXING QUADRO MDF", platform: "tiktok" },
];

function getEmbedUrl(video: RealVideo): string {
  if (video.platform === "instagram") {
    // Extract reel code from URL
    const match = video.url.match(/\/reel\/([^/?]+)/);
    const code = match ? match[1] : "";
    return `https://www.instagram.com/reel/${code}/embed/`;
  }
  // TikTok
  const match = video.url.match(/\/video\/(\d+)/);
  const videoId = match ? match[1] : "";
  return `https://www.tiktok.com/embed/v2/${videoId}`;
}

const RealProjectsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(updateScrollState, 400);
  };

  if (realVideos.length === 0) {
    return (
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl mb-4">PROJETOS REAIS</h2>
          <p className="text-muted-foreground font-body mb-12 max-w-lg">
            Veja nossos quadros em ação. Vídeos reais dos projetos entregues.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 w-[260px] md:w-[300px] aspect-[9/16] bg-secondary metal-border flex flex-col items-center justify-center gap-3"
              >
                <Play size={28} strokeWidth={1} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-body">EM BREVE</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl md:text-4xl mb-4">PROJETOS REAIS</h2>
            <p className="text-muted-foreground font-body max-w-lg">
              Veja nossos quadros em ação. Vídeos reais dos projetos entregues.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 border border-border flex items-center justify-center text-foreground disabled:text-muted-foreground disabled:border-border/50 hover:border-foreground/40 transition-colors"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 border border-border flex items-center justify-center text-foreground disabled:text-muted-foreground disabled:border-border/50 hover:border-foreground/40 transition-colors"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {realVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 w-[260px] md:w-[300px] snap-start"
            >
              <div className="aspect-[9/16] bg-secondary metal-border overflow-hidden relative">
                <iframe
                  src={getEmbedUrl(video)}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                  title={video.title}
                />
              </div>
              <p className="mt-3 text-xs font-display tracking-wider">{video.title}</p>
              <p className="text-xs text-muted-foreground font-body mt-1 capitalize">{video.platform}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealProjectsSection;
