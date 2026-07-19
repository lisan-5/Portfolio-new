import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const projects = [
  {
    id: "01",
    title: "NEXUS",
    subtitle: "Real-time Data Infrastructure | Event Pipelines | Reliable Delivery",
    challenge: "Giving engineering teams one reliable layer to capture, transform, route, and deliver event data across a growing stack.",
    solution: "Built a polished real-time data infrastructure platform that presents event capture, transformation, routing, and delivery as a clear operational workflow.",
    outcome: "Creates a focused product experience for teams building dependable event pipelines across their services and destinations.",
    details: "A Next.js and TypeScript platform interface for real-time event-data infrastructure, designed around data movement, transformations, routing controls, and reliable delivery workflows.",
    href: "https://nexussx.netlify.app/",
    stack: ["NEXT.JS", "TYPESCRIPT", "EVENT DATA", "INFRASTRUCTURE"],
    metric: "Real-time data",
  },
  {
    id: "02",
    title: "ZSIGNAL",
    subtitle: "Independent News Platform | Live Briefings | Editorial UX",
    challenge: "Creating a premium news experience that feels trustworthy, focused, and fast in an era of noisy feeds.",
    solution: "Built a responsive editorial platform with live-style ticker, category navigation, featured investigations, and newsletter capture.",
    outcome: "Delivers a polished global-news homepage with opinion, data spotlight, and daily briefing flows ready for API-backed headlines.",
    details: "Includes breaking-news ticker, section filters, featured story layouts, perspective cards, data modules, newsletter CTA, and GNews API integration guidance.",
    href: "https://zsignal.netlify.app/",
    stack: ["REACT", "TYPESCRIPT", "NEWS UX", "API"],
    metric: "Live edition",
  },
  {
    id: "03",
    title: "SONIQUE",
    subtitle: "Mood-to-Music Generator | Playlist UX | Creative Search",
    challenge: "Turning vague moods, memories, scenes, and aesthetics into music discovery that feels immediate and expressive.",
    solution: "Built an interactive mood prompt experience with example vibes, famous-song seeds, poster browsing, and curated atmospheric track outputs.",
    outcome: "Creates a playful playlist discovery flow where users describe a feeling and receive original-feeling music recommendations.",
    details: "Supports mood prompts, example chips, famous vibe seeds, cover interactions, curated fictional tracks, and a polished music-first landing experience.",
    href: "https://soniquemusic.netlify.app/",
    stack: ["REACT", "NETLIFY", "MUSIC UX", "PROMPTS"],
    metric: "Mood music",
  },
  {
    id: "04",
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
    id: "05",
    title: "SHEMACH SHOP",
    subtitle: "E-commerce | Next.js | Checkout UX",
    challenge: "Building a scalable commerce storefront with product discovery, cart flows, and secure checkout foundations.",
    solution: "Developed a Next.js commerce system focused on performance, reusable UI, typed data, and a clean shopping journey.",
    outcome: "Created a production-ready store experience optimized for speed, scalability, and real-world usability.",
    details: "Features storefront architecture, product browsing, cart state, reusable components, responsive layout, and checkout-oriented user flows.",
    href: "https://shemachshop.vercel.app/",
    stack: ["NEXT.JS", "TYPESCRIPT", "COMMERCE", "UX"],
    metric: "Storefront",
  },
  {
    id: "06",
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
    id: "07",
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
    id: "08",
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
    id: "09",
    title: "LEARNABLEE",
    subtitle: "Learning Platform | Auth Flow | Student Workspace",
    challenge: "Making course access and learning workflows feel simple from the first login.",
    solution: "Built a clean learning-platform entry experience with authentication-first navigation and modern product UX.",
    outcome: "Provides a focused foundation for learners to access content, manage sessions, and move quickly into study workflows.",
    details: "Covers login-first routing, responsive interface patterns, account entry points, and a scalable product surface for education features.",
    href: "https://learnablee.vercel.app/login",
    stack: ["REACT", "VERCEL", "AUTH", "EDTECH"],
    metric: "Learning UX",
  },
  {
    id: "10",
    title: "YEDERA MART",
    subtitle: "Local Business Website | Ethiopian Market | Location UX",
    challenge: "Helping customers discover authentic Ethiopian groceries, coffee, cultural goods, hours, and location details quickly.",
    solution: "Built a warm storefront website with product sections, gallery storytelling, coffee ceremony highlights, and visit-focused CTAs.",
    outcome: "Gives the store a polished online presence that turns product discovery into calls, directions, and in-person visits.",
    details: "Includes product category cards, store gallery, hours, location details, phone CTA, Yelp link, and mobile-friendly navigation.",
    href: "https://yedera.netlify.app/",
    stack: ["REACT", "NETLIFY", "LOCAL SEO", "UX"],
    metric: "Store site",
  },
  {
    id: "11",
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
    id: "12",
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

const INITIAL_PROJECT_COUNT = 6;

function ProjectCard({ project, revealMarker = false }: { project: typeof projects[0]; revealMarker?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      id={revealMarker ? "project-more-start" : undefined}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
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
            <div className="group/cta relative mt-4 inline-flex overflow-hidden rounded-xl border border-cyan-700/70 bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 px-4 py-2.5 font-mono-tech text-[10px] font-black tracking-[0.16em] text-white shadow-[0_12px_32px_rgba(14,116,144,0.18)] transition-all duration-300 hover:border-cyan-500 hover:shadow-[0_16px_40px_rgba(14,116,144,0.24)] dark:border-cyan-100/45 dark:from-cyan-200 dark:via-cyan-100 dark:to-sky-200 dark:text-slate-950">
              <span className="pointer-events-none absolute inset-x-2 top-0 h-px bg-white/55 dark:bg-white/80" />
              <span className="relative z-10 flex items-center gap-2">
                <span className="transition-transform duration-300 group-hover/cta:translate-x-0.5">{"\u2192"}</span>
                OPEN PROJECT
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.a>
  );
}

export function ProjectsSection() {
  const [visibleProjectCount, setVisibleProjectCount] = useState(INITIAL_PROJECT_COUNT);
  const visibleProjects = projects.slice(0, visibleProjectCount);
  const hasMoreProjects = visibleProjectCount < projects.length;
  const hiddenProjectCount = Math.max(projects.length - visibleProjectCount, 0);

  const handleProjectToggle = () => {
    if (hasMoreProjects) {
      setVisibleProjectCount(projects.length);
      window.setTimeout(() => {
        document.getElementById("project-more-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }

    setVisibleProjectCount(INITIAL_PROJECT_COUNT);
  };

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
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} revealMarker={index === INITIAL_PROJECT_COUNT} />
          ))}
        </div>

        {projects.length > INITIAL_PROJECT_COUNT && (
          <motion.div variants={fadeUp} className="mt-10 flex justify-center">
            <motion.button
              type="button"
              onClick={handleProjectToggle}
              className="group relative w-full overflow-hidden rounded-xl border border-cyan-700/70 bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 px-6 py-4 font-mono-tech text-xs font-black tracking-[0.18em] text-white shadow-[0_14px_40px_rgba(14,116,144,0.22)] transition-all duration-300 hover:border-cyan-500 hover:shadow-[0_18px_48px_rgba(14,116,144,0.28)] focus:outline-none focus:ring-4 focus:ring-cyan-300/35 dark:border-cyan-100/45 dark:from-cyan-200 dark:via-cyan-100 dark:to-sky-200 dark:text-slate-950 dark:shadow-[0_14px_40px_rgba(125,211,252,0.14)] sm:w-auto sm:px-9"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white/55 dark:bg-white/80" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">{"\u2192"}</span>
                {hasMoreProjects ? "SHOW MORE" : "SHOW LESS"}
                {hasMoreProjects && <span className="rounded-full border border-current/30 px-2 py-0.5 text-[10px]">+{hiddenProjectCount}</span>}
              </span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}


