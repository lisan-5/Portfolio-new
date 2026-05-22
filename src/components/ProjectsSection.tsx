import { useState } from "react";
import { motion } from "framer-motion";

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
    solution: "Built a Python-based AI agent that synchronizes Jira and Confluence with Snowflake metadata.",
    outcome: "Eliminated manual documentation workflows by extracting schemas, generating dbt models, and producing ER diagrams with production-grade reliability.",
    details: "Includes incremental updates, error handling, schema extraction, dbt model generation, and automated ER diagram production for documentation-heavy data teams.",
    href: "https://github.com/lisan-5/Snowlink",
    stack: ["PYTHON", "LLM", "SNOWFLAKE", "DBT", "JIRA"],
    metric: "AI docs sync",
  },
  {
    id: "02",
    title: "APPLYMATE",
    subtitle: "AI Scholarship Workspace | Dashboards | Application Insights",
    challenge: "Helping students manage scholarship deadlines, application progress, and scattered requirements in one workspace.",
    solution: "Built a full-stack AI-powered workspace with structured dashboards and AI-assisted scholarship parsing.",
    outcome: "Improved application clarity, reduced missed deadlines, and generated useful insights for scholarship planning.",
    details: "Organizes applications, deadlines, status, requirements, and AI-generated insights into one focused workflow for students applying to multiple programs.",
    href: "https://applymate-new.vercel.app/",
    stack: ["REACT", "TYPESCRIPT", "AI", "DASHBOARDS"],
    metric: "AI workspace",
  },
  {
    id: "03",
    title: "SPOTTER ATLAS",
    subtitle: "AI Logistics & Real-time Routing",
    challenge: "Planning freight routes while meeting 11h/14h/30m Hours of Service constraints across live trip workflows.",
    solution: "Developed synchronized backend modules for maps, logs, trip state, itinerary generation, and compliance tracking.",
    outcome: "Reduced route planning time by ~50% and manual dispatch workload by ~60% while improving operational safety.",
    details: "Supports live route visualization, HOS-compliant scheduling, itinerary generation, compliance snapshots, and operational planning workflows.",
    href: "https://eld-trip-planner-drab.vercel.app/",
    stack: ["REACT", "LARAVEL", "ROUTING", "MAPS"],
    metric: "60% less work",
  },
  {
    id: "04",
    title: "LINGO ABYSSINIA",
    subtitle: "Language Learning | Gamified Lessons | Mobile-first UX",
    challenge: "Making Amharic, Afan Oromoo, and Tigrinya learning accessible through short daily sessions.",
    solution: "Developed modular lessons with XP tracking, progress analytics, and a gamified learning flow.",
    outcome: "Created a lightweight mobile-first platform designed for scalable lesson expansion and daily 5-minute learning.",
    details: "Built around short lessons, XP progression, structured content delivery, and a mobile-first interface for consistent language practice.",
    href: "https://lingoeth.netlify.app/",
    stack: ["REACT", "TYPESCRIPT", "UX", "ANALYTICS"],
    metric: "3 languages",
  },
  {
    id: "05",
    title: "STORY AI",
    subtitle: "Travel Media | AI Albums | Hospitality Workflows",
    challenge: "Turning raw guest photos and videos into structured, branded, shareable travel narratives.",
    solution: "Designed an AI-powered content pipeline for media ingestion, tagging, auto-chapter generation, and story assembly.",
    outcome: "Enabled hospitality-focused workflows that transform scattered media into cohesive guest memory outputs.",
    details: "Combines media ingestion, AI tagging, chapter generation, branded album output, and shareable story experiences for hospitality teams.",
    href: "https://story-ai-new.vercel.app/",
    stack: ["AI", "MEDIA", "PIPELINES", "STORYTELLING"],
    metric: "AI albums",
  },
  {
    id: "06",
    title: "TENINETE",
    subtitle: "Healthcare Platform | React | Laravel | High Availability",
    challenge: "Scaling a national healthcare platform for thousands of daily users and high-traffic production workflows.",
    solution: "Developed core features, optimized frontend-backend integration, and helped re-architect database and CI/CD workflows.",
    outcome: "Reduced data access latency by ~50% and supported 99.9% uptime across production systems.",
    details: "Production healthcare platform work focused on React/Laravel delivery, database performance, CI/CD maintainability, and reliable high-traffic user flows.",
    href: "https://haddisart.com/",
    stack: ["REACT", "LARAVEL", "CI/CD", "DATABASES"],
    metric: "99.9% uptime",
  },
];

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      className="group relative block overflow-hidden border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:z-10 hover:border-cyber/60 hover:bg-card/75 hover:shadow-[0_24px_70px_rgba(120,200,220,0.10)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.025 }}
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

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }}
          transition={{ duration: 0.28, ease: "easeOut" as const }}
          className="overflow-hidden"
        >
          <div className="mt-4 border-t border-border pt-4">
            <div className="font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">MORE DETAIL</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-mid">{project.details}</p>
            <div className="font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">ARCHITECTURE</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="border border-border/50 bg-background/50 px-2 py-1 font-mono-tech text-[10px] tracking-wider text-cyber">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4 inline-flex border border-cyber/50 px-3 py-2 font-mono-tech text-[10px] tracking-[0.16em] text-cyber transition-colors group-hover:bg-cyber group-hover:text-background">
              OPEN PROJECT ↗
            </div>
          </div>
        </motion.div>
      </div>
    </motion.a>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="mb-2 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // SELECTED IMPACT
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-12 text-3xl font-bold tracking-tight text-foreground">
          LOGS<span className="text-cyber">.</span>
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
