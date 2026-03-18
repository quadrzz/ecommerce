import { motion } from "framer-motion";

export interface RealProject {
  id: string;
  image: string;
  title: string;
  description: string;
}

// Placeholder list — replace images with real uploads
const realProjects: RealProject[] = [];

const RealProjectsSection = () => {
  if (realProjects.length === 0) {
    return (
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl mb-4">PROJETOS REAIS</h2>
          <p className="text-muted-foreground font-body mb-12 max-w-lg">
            Cada quadro é único. Veja o que já criamos para nossos clientes.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-square bg-secondary metal-border flex items-center justify-center"
              >
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
        <h2 className="text-2xl md:text-4xl mb-4">PROJETOS REAIS</h2>
        <p className="text-muted-foreground font-body mb-12 max-w-lg">
          Cada quadro é único. Veja o que já criamos para nossos clientes.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {realProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square bg-secondary metal-border overflow-hidden"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-400 group-hover:scale-105 group-hover:saturate-[1.1]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-xs font-display tracking-wider text-foreground">{project.title}</p>
                  {project.description && (
                    <p className="text-xs text-muted-foreground font-body mt-1">{project.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealProjectsSection;
