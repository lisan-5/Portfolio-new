import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const projects = [
  {
    id: "01",
    image: "/projects/art-auction.webp",
    title: "ART AUCTION",
    subtitle: "Premium Art Auction | Marketplace | Artist Platform",
    challenge:
      "Giving artists and collectors one trusted place to buy, sell, and auction premium paintings, drawings, and crafts online.",
    solution:
      "Built an art auction marketplace where artists sign up to sell their work and collectors browse and bid across painting, drawing, and craft categories, backed by editorial art blogs.",
    outcome:
      "Creates a warm, gallery-style commerce experience that turns art discovery into sales, artist sign-ups, and an engaged creative community.",
    details:
      "Features a premium arts storefront with artist and artwork search, painting/drawing/craft categories, sell-now onboarding, an art blog, newsletter capture, and full contact details for a Addis Ababa-based art business (info@haddisart.com, +251947839898).",
    href: "https://haddisart.com/",
    stack: ["ART AUCTION", "MARKETPLACE", "E-COMMERCE", "UX"],
    metric: "Marketplace",
  },
  {
    id: "02",
    image: "/projects/nexus.webp",
    title: "NEXUS",
    subtitle:
      "Real-time Data Infrastructure | Event Pipelines | Reliable Delivery",
    challenge:
      "Giving engineering teams one reliable layer to capture, transform, route, and deliver event data across a growing stack.",
    solution:
      "Built a polished real-time data infrastructure platform that presents event capture, transformation, routing, and delivery as a clear operational workflow.",
    outcome:
      "Creates a focused product experience for teams building dependable event pipelines across their services and destinations.",
    details:
      "A Next.js and TypeScript platform interface for real-time event-data infrastructure, designed around data movement, transformations, routing controls, and reliable delivery workflows.",
    href: "https://nexussx.netlify.app/",
    stack: ["NEXT.JS", "TYPESCRIPT", "EVENT DATA", "INFRASTRUCTURE"],
    metric: "Real-time data",
  },
  {
    id: "03",
    image: "/projects/zsignal.webp",
    title: "ZSIGNAL",
    subtitle: "Independent News Platform | Live Briefings | Editorial UX",
    challenge:
      "Creating a premium news experience that feels trustworthy, focused, and fast in an era of noisy feeds.",
    solution:
      "Built a responsive editorial platform with live-style ticker, category navigation, featured investigations, and newsletter capture.",
    outcome:
      "Delivers a polished global-news homepage with opinion, data spotlight, and daily briefing flows ready for API-backed headlines.",
    details:
      "Includes breaking-news ticker, section filters, featured story layouts, perspective cards, data modules, newsletter CTA, and GNews API integration guidance.",
    href: "https://zsignal.netlify.app/",
    stack: ["REACT", "TYPESCRIPT", "NEWS UX", "API"],
    metric: "Live edition",
  },
  {
    id: "04",
    image: "/projects/sonique.webp",
    title: "SONIQUE",
    subtitle: "Mood-to-Music Generator | Playlist UX | Creative Search",
    challenge:
      "Turning vague moods, memories, scenes, and aesthetics into music discovery that feels immediate and expressive.",
    solution:
      "Built an interactive mood prompt experience with example vibes, famous-song seeds, poster browsing, and curated atmospheric track outputs.",
    outcome:
      "Creates a playful playlist discovery flow where users describe a feeling and receive original-feeling music recommendations.",
    details:
      "Supports mood prompts, example chips, famous vibe seeds, cover interactions, curated fictional tracks, and a polished music-first landing experience.",
    href: "https://soniquemusic.netlify.app/",
    stack: ["REACT", "NETLIFY", "MUSIC UX", "PROMPTS"],
    metric: "Mood music",
  },
  {
    id: "05",
    title: "SNOWLINK",
    subtitle: "AI Agent | Snowflake Sync | LLM Schema Extraction",
    challenge:
      "Eliminating manual documentation drift between Snowflake metadata and Jira/Confluence.",
    solution:
      "Built a Python-based AI agent that synchronizes Jira and Confluence with Snowflake metadata.",
    outcome:
      "Eliminated manual documentation workflows by extracting schemas, generating dbt models, and producing ER diagrams with production-grade reliability.",
    details:
      "Includes incremental updates, error handling, schema extraction, dbt model generation, and automated ER diagram production for documentation-heavy data teams.",
    href: "https://github.com/lisan-5/Snowlink",
    stack: ["PYTHON", "LLM", "SNOWFLAKE", "DBT", "JIRA"],
    metric: "AI docs sync",
  },
  {
    id: "06",
    image: "/projects/shemach-shop.webp",
    title: "SHEMACH SHOP",
    subtitle: "E-commerce | Next.js | Checkout UX",
    challenge:
      "Building a scalable commerce storefront with product discovery, cart flows, and secure checkout foundations.",
    solution:
      "Developed a Next.js commerce system focused on performance, reusable UI, typed data, and a clean shopping journey.",
    outcome:
      "Created a production-ready store experience optimized for speed, scalability, and real-world usability.",
    details:
      "Features storefront architecture, product browsing, cart state, reusable components, responsive layout, and checkout-oriented user flows.",
    href: "https://shemachshop.vercel.app/",
    stack: ["NEXT.JS", "TYPESCRIPT", "COMMERCE", "UX"],
    metric: "Storefront",
  },
  {
    id: "07",
    image: "/projects/applymate.webp",
    title: "APPLYMATE",
    subtitle: "AI Scholarship Workspace | Dashboards | Application Insights",
    challenge:
      "Helping students manage scholarship deadlines, application progress, and scattered requirements in one workspace.",
    solution:
      "Built a full-stack AI-powered workspace with structured dashboards and AI-assisted scholarship parsing.",
    outcome:
      "Improved application clarity, reduced missed deadlines, and generated useful insights for scholarship planning.",
    details:
      "Organizes applications, deadlines, status, requirements, and AI-generated insights into one focused workflow for students applying to multiple programs.",
    href: "https://applymate-new.vercel.app/",
    stack: ["REACT", "TYPESCRIPT", "AI", "DASHBOARDS"],
    metric: "AI workspace",
  },
  {
    id: "08",
    image: "/projects/spotter-atlas.webp",
    title: "SPOTTER ATLAS",
    subtitle: "AI Logistics & Real-time Routing",
    challenge:
      "Planning freight routes while meeting 11h/14h/30m Hours of Service constraints across live trip workflows.",
    solution:
      "Developed synchronized backend modules for maps, logs, trip state, itinerary generation, and compliance tracking.",
    outcome:
      "Reduced route planning time by ~50% and manual dispatch workload by ~60% while improving operational safety.",
    details:
      "Supports live route visualization, HOS-compliant scheduling, itinerary generation, compliance snapshots, and operational planning workflows.",
    href: "https://eld-trip-planner-drab.vercel.app/",
    stack: ["REACT", "LARAVEL", "ROUTING", "MAPS"],
    metric: "60% less work",
  },
  {
    id: "09",
    image: "/projects/lingo-abyssinia.webp",
    title: "LINGO ABYSSINIA",
    subtitle: "Language Learning | Gamified Lessons | Mobile-first UX",
    challenge:
      "Making Amharic, Afan Oromoo, and Tigrinya learning accessible through short daily sessions.",
    solution:
      "Developed modular lessons with XP tracking, progress analytics, and a gamified learning flow.",
    outcome:
      "Created a lightweight mobile-first platform designed for scalable lesson expansion and daily 5-minute learning.",
    details:
      "Built around short lessons, XP progression, structured content delivery, and a mobile-first interface for consistent language practice.",
    href: "https://lingoeth.netlify.app/",
    stack: ["REACT", "TYPESCRIPT", "UX", "ANALYTICS"],
    metric: "3 languages",
  },
  {
    id: "10",
    image: "/projects/learnablee.webp",
    title: "LEARNABLEE",
    subtitle: "Learning Platform | Auth Flow | Student Workspace",
    challenge:
      "Making course access and learning workflows feel simple from the first login.",
    solution:
      "Built a clean learning-platform entry experience with authentication-first navigation and modern product UX.",
    outcome:
      "Provides a focused foundation for learners to access content, manage sessions, and move quickly into study workflows.",
    details:
      "Covers login-first routing, responsive interface patterns, account entry points, and a scalable product surface for education features.",
    href: "https://learnablee.vercel.app/login",
    stack: ["REACT", "VERCEL", "AUTH", "EDTECH"],
    metric: "Learning UX",
  },
  {
    id: "11",
    image: "/projects/yedera-mart.webp",
    title: "YEDERA MART",
    subtitle: "Local Business Website | Ethiopian Market | Location UX",
    challenge:
      "Helping customers discover authentic Ethiopian groceries, coffee, cultural goods, hours, and location details quickly.",
    solution:
      "Built a warm storefront website with product sections, gallery storytelling, coffee ceremony highlights, and visit-focused CTAs.",
    outcome:
      "Gives the store a polished online presence that turns product discovery into calls, directions, and in-person visits.",
    details:
      "Includes product category cards, store gallery, hours, location details, phone CTA, Yelp link, and mobile-friendly navigation.",
    href: "https://yedera.netlify.app/",
    stack: ["REACT", "NETLIFY", "LOCAL SEO", "UX"],
    metric: "Store site",
  },
  {
    id: "12",
    image: "/projects/story-ai.webp",
    title: "STORY AI",
    subtitle: "Travel Media | AI Albums | Hospitality Workflows",
    challenge:
      "Turning raw guest photos and videos into structured, branded, shareable travel narratives.",
    solution:
      "Designed an AI-powered content pipeline for media ingestion, tagging, auto-chapter generation, and story assembly.",
    outcome:
      "Enabled hospitality-focused workflows that transform scattered media into cohesive guest memory outputs.",
    details:
      "Combines media ingestion, AI tagging, chapter generation, branded album output, and shareable story experiences for hospitality teams.",
    href: "https://story-ai-new.vercel.app/",
    stack: ["AI", "MEDIA", "PIPELINES", "STORYTELLING"],
    metric: "AI albums",
  },
  {
    id: "13",
    image: "/projects/teninete.webp",
    title: "TENINETE",
    subtitle: "Healthcare Platform | React | Laravel | High Availability",
    challenge:
      "Scaling a national healthcare platform for thousands of daily users and high-traffic production workflows.",
    solution:
      "Developed core features, optimized frontend-backend integration, and helped re-architect database and CI/CD workflows.",
    outcome:
      "Reduced data access latency by ~50% and supported 99.9% uptime across production systems.",
    details:
      "Production healthcare platform work focused on React/Laravel delivery, database performance, CI/CD maintainability, and reliable high-traffic user flows.",
    href: "https://teninete.et/",
    stack: ["REACT", "LARAVEL", "CI/CD", "DATABASES"],
    metric: "99.9% uptime",
  },
];

const INITIAL_PROJECT_COUNT = 6;

type Project = (typeof projects)[number];

const overlayStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
};

const overlayItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" as const } },
};

function ProjectCard({ project, revealMarker = false }: { project: Project; revealMarker?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const image = "image" in project ? (project as { image: string }).image : undefined;

  return (
    <motion.a
      id={revealMarker ? "project-more-start" : undefined}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/50 transition-colors duration-300 hover:z-10 hover:border-cyber/60"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      style={{ boxShadow: hovered ? "0 28px 80px rgba(120,200,220,0.16)" : "0 0 0 rgba(0,0,0,0)" }}
    >
      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 z-40 h-px bg-cyber"
        initial={{ width: "0%" }}
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.35, ease: "easeOut" as const }}
      />

      {/* Ambient glow that blooms on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px z-0 rounded-2xl"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "radial-gradient(120% 80% at 50% 0%, rgba(120,200,220,0.16), transparent 70%)",
        }}
      />

      {/* Full-card image backdrop — stays visible (faded) behind the hover detail */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {image ? (
          <motion.img
            src={image}
            alt=""
            aria-hidden
            loading="lazy"
            className="h-full w-full object-cover object-top"
            initial={false}
            animate={{ opacity: hovered ? 0.22 : 0, scale: hovered ? 1.06 : 1.01 }}
            transition={{ duration: 0.55, ease: "easeOut" as const }}
          />
        ) : (
          <motion.div
            aria-hidden
            className="h-full w-full bg-[radial-gradient(140%_100%_at_20%_0%,rgba(120,200,220,0.20),transparent_65%)]"
            initial={false}
            animate={{ opacity: hovered ? 0.5 : 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>

      {/* Preview thumbnail (resting state) */}
      <div className="relative z-10 aspect-[16/10] w-full overflow-hidden border-b border-border bg-gradient-to-br from-cyber/10 via-background to-background">
        {image ? (
          <motion.img
            src={image}
            alt={`${project.title} landing page`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top"
            initial={false}
            animate={{ opacity: hovered ? 0 : 0.92, scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <motion.div
              className="font-mono-tech text-2xl font-bold tracking-tight text-cyber/70"
              animate={{ y: hovered ? -4 : 0 }}
              transition={{ duration: 0.35 }}
            >
              {project.id}
            </motion.div>
            <span className="font-mono-tech text-[9px] tracking-[0.28em] text-muted-foreground">
              SOURCE ONLY
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/15 to-transparent" />
      </div>

      {/* Hover detail overlay — translucent so the image reads through */}
      <motion.div
        initial={false}
        variants={overlayStagger}
        animate={hovered ? "visible" : "hidden"}
        className={`absolute inset-0 z-30 flex flex-col overflow-y-auto bg-card/88 p-6 transition-opacity duration-300 ${hovered ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <motion.div variants={overlayItem} className="flex items-start justify-between gap-3">
          <div>
            <span className="font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">{project.id}</span>
            <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">{project.title}</h3>
          </div>
          <span className="font-mono-tech text-sm font-bold text-cyber">{project.metric}</span>
        </motion.div>

        <motion.p variants={overlayItem} className="mt-2 font-mono-tech text-[10px] leading-relaxed tracking-wider text-cyber/70">
          {project.subtitle}
        </motion.p>

        <div className="mt-4 space-y-3">
          {([
            ["CHALLENGE", project.challenge, "text-slate-mid"],
            ["SOLUTION", project.solution, "text-slate-mid"],
            ["OUTCOME", project.outcome, "text-foreground"],
            ["DETAIL", project.details, "text-slate-mid"],
          ] as const).map(([label, body, tone]) => (
            <motion.div key={label} variants={overlayItem}>
              <span className="font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">{label}</span>
              <p className={`mt-1 text-[13px] leading-relaxed ${tone}`}>{body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={overlayItem} className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded border border-border/50 bg-background/60 px-2 py-1 font-mono-tech text-[10px] tracking-wider text-cyber">
              {tech}
            </span>
          ))}
        </motion.div>

        <motion.div variants={overlayItem} className="group/cta relative mt-5 inline-flex self-start overflow-hidden rounded-xl border border-cyan-700/70 bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 px-4 py-2.5 font-mono-tech text-[10px] font-black tracking-[0.16em] text-white shadow-[0_12px_32px_rgba(14,116,144,0.18)] dark:border-cyan-100/45 dark:from-cyan-200 dark:via-cyan-100 dark:to-sky-200 dark:text-slate-950">
          <span className="pointer-events-none absolute inset-x-2 top-0 h-px bg-white/55 dark:bg-white/80" />
          <span className="relative z-10 flex items-center gap-2">
            <span className="transition-transform duration-300 group-hover/cta:translate-x-1">{"→"}</span>
            OPEN PROJECT
          </span>
        </motion.div>
      </motion.div>

      {/* Resting content */}
      <motion.div
        className="relative z-10 flex flex-1 flex-col p-6"
        initial={false}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <span className="font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">{project.id}</span>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground">{project.title}</h3>
          </div>
          <div className="font-mono-tech text-base font-bold text-cyber">{project.metric}</div>
        </div>

        <p className="mb-3 font-mono-tech text-[11px] leading-relaxed tracking-wider text-cyber/70">{project.subtitle}</p>

        <p className="text-sm leading-relaxed text-slate-mid">{project.outcome}</p>

        <div className="mt-auto flex items-center gap-2 pt-4 font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">
          HOVER FOR DETAIL
          <motion.span
            aria-hidden
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" as const }}
            className="text-cyber"
          >
            {"→"}
          </motion.span>
        </div>
      </motion.div>
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


