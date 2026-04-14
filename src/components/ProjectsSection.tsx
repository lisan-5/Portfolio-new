import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const projects = [
  {
    id: "01",
    title: "SNOWLINK",
    subtitle: "AI Agent | Snowflake Sync | LLM Schema Extraction",
    challenge: "Eliminating manual documentation drift between Snowflake metadata and Jira/Confluence.",
    solution: "Engineered a Python agent using LLMs to autonomously extract schemas and generate dbt models and ER diagrams.",
    outcome: "Automated documentation accuracy across enterprise environments, saving hundreds of engineering hours.",
    stack: ["PYTHON", "LLM", "SNOWFLAKE", "DBT", "JIRA"],
    metric: "100s hrs saved",
  },
  {
    id: "02",
    title: "SPOTTER ATLAS",
    subtitle: "AI Logistics & Real-time Routing",
    challenge: "Managing complex freight routing with strict 100% Hours of Service (HOS) compliance.",
    solution: "Developed a real-time routing platform integrating ML-assisted heuristics for dynamic optimization.",
    outcome: "Reduced manual planning time by ~60% and cut route calculation time by ~50%.",
    stack: ["NEXT.JS", "FASTAPI", "MONGODB", "ML"],
    metric: "60% faster",
  },
  {
    id: "03",
    title: "TENINETE",
    subtitle: "National Health Platform | High-Availability System",
    challenge: "Scaling a national medical records system for high-traffic environments.",
    solution: "Re-architected database schemas and CI/CD workflows using React and Laravel.",
    outcome: "Achieved a 50% reduction in data access latency and maintained 99.9% uptime.",
    stack: ["REACT", "LARAVEL", "POSTGRESQL", "DOCKER"],
    metric: "99.9% uptime",
  },
];

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-cyber/50 hover:shadow-[0_0_30px_rgba(120,200,220,0.05)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 h-px bg-cyber"
        initial={{ width: "0%" }}
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.3 }}
      />

      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <span className="font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">{project.id}</span>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground">{project.title}</h3>
          </div>
          <motion.div
            className="font-mono-tech text-lg font-bold text-cyber"
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {project.metric}
          </motion.div>
        </div>

        <p className="mb-4 font-mono-tech text-[11px] tracking-wider text-cyber/70">{project.subtitle}</p>

        <div className="space-y-3">
          <div>
            <span className="font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">CHALLENGE</span>
            <p className="mt-1 text-sm leading-relaxed text-slate-mid">{project.challenge}</p>
          </div>
          <div>
            <span className="font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">OUTCOME</span>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{project.outcome}</p>
          </div>
        </div>

        {/* Stack reveal on hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" as const }}
          className="overflow-hidden"
        >
          <div className="mt-4 border-t border-border pt-4">
            <div className="font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">ARCHITECTURE</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="border border-border/50 bg-background/50 px-2 py-1 font-mono-tech text-[10px] tracking-wider text-cyber">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-32 px-8 lg:px-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={fadeUp} className="mb-2 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // SELECTED IMPACT
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-12 text-3xl font-bold tracking-tight text-foreground">
          LOGS<span className="text-cyber">.</span>
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
