/** Portfolio content, extracted from the original section components. */

export const projects = [
  {
    id: "00",
    image: "/projects/vigil.webp",
    title: "VIGIL",
    subtitle: "Real-time Observability | Logs · Metrics · Traces · Alerts",
    challenge:
      "On-call teams drown in dashboards and pages. The goal: a console calm enough to trust at 02:14, that wakes exactly one person and only when it matters.",
    solution:
      "Built a real-time observability platform: live fleet overview, a service dependency map with animated traffic, an alerting workflow with acknowledge / resolve, a virtualised log explorer and distributed trace waterfalls — behind a typed client interface so a real REST/WebSocket backend plugs in with one env var.",
    outcome:
      "A production-grade SSR app with a scroll-driven landing page that replays an overnight incident, a 3D canvas constellation of the services and kinetic variable-font type.",
    details:
      "React 19, TypeScript, TanStack Start / Router / Query, Tailwind CSS 4, Radix UI, Motion, Recharts, Zustand and Vitest; accessible, keyboard-first and deployed on Vercel.",
    href: "https://vigilog.vercel.app/",
    repo: "https://github.com/lisan-5/Vigil",
    stack: ["REACT 19", "TYPESCRIPT", "TANSTACK START", "OBSERVABILITY"],
    metric: "Real-time ops",
  },
  {
    id: "00b",
    image: "/projects/askbase.webp",
    title: "ASKBASE",
    subtitle: "AI Data Analyst | Plain English → SQL | Runs in Your Browser",
    challenge:
      "Small businesses sit on Stripe, Shopify and spreadsheet exports they can't query. Dashboards are rigid, analysts are expensive, and uploading customer data to an AI is a privacy risk.",
    solution:
      "Built an AI analyst that runs a real database (DuckDB compiled to WebAssembly) inside the browser tab. Claude Opus 5.5 turns a question into a validated query plan via structured outputs; the SQL is guarded as read-only, runs locally, and repairs itself once if DuckDB rejects it. Only the question and column names ever leave the machine.",
    outcome:
      "Every answer comes back as the right chart with the exact SQL, its assumptions and follow-up questions — checkable, editable and private. A built-in question engine keeps the live demo working without an API key.",
    details:
      "React 19, TypeScript, TanStack Start (SSR + server functions), DuckDB-WASM, Anthropic SDK with Zod structured outputs and prompt caching, Recharts, Motion and Vitest. The landing page runs a query choreography over 12,983 real rows and prints answers as receipts.",
    href: "https://github.com/lisan-5/Askbase",
    repo: "https://github.com/lisan-5/Askbase",
    stack: ["DUCKDB-WASM", "CLAUDE API", "TYPESCRIPT", "TEXT-TO-SQL"],
    metric: "AI data analyst",
  },
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

export const experiences = [
  {
    role: "Software Engineer",
    company: "Theseus Group",
    href: "https://adaptwith.us/",
    period: "01/2026 - Present",
    stack: ["LLMOps", "Docker", "APIs", "Automation"],
    highlights: [
      "Built scalable AI-powered backend systems and automation workflows supporting internal business operations and intelligent decision-making processes.",
      "Developed high-performance APIs and asynchronous backend services, improving processing efficiency and reducing workflow execution times by ~40%.",
      "Integrated LLM-powered automation pipelines and AI-assisted tooling, streamlining repetitive operational tasks and improving system scalability.",
      "Collaborated across engineering and strategy teams to deliver production-ready backend solutions focused on reliability, maintainability, and long-term scalability.",
    ],
  },
  {
    role: "AI & Full-Stack Engineer",
    company: "Spotter AI",
    href: "https://spotter.ai/",
    period: "08/2025 - 04/2026",
    stack: ["Laravel", "React", "REST APIs", "Routing"],
    highlights: [
      "Built Spotter Atlas, an AI-assisted freight routing platform with 100% HOS compliance across routing and scheduling workflows.",
      "Developed scalable RESTful APIs and synchronized backend systems across 4+ core operational modules in real time.",
      "Reduced route calculation and planning time by ~50% through intelligent routing logic and optimized backend workflows.",
      "Delivered live route visualization, itinerary generation, compliance snapshots, and PDF export functionality, reducing manual planning effort by ~60%.",
    ],
  },
  {
    role: "Full-stack Developer",
    company: "Haddis Art",
    href: "https://haddisart.com/",
    period: "07/2025 - 01/2026",
    stack: ["Laravel", "React", "REST APIs", "CI/CD"],
    highlights: [
      "Developed scalable web applications for Teninete, a national-level healthcare platform, using React and Laravel, supporting thousands of daily users.",
      "Re-architected database schemas and CI/CD deployment workflows, reducing data access latency by ~50% and improving long-term maintainability.",
      "Collaborated with cross-functional engineering and product teams to deliver high-traffic platform features with 99.9% uptime and strong system reliability.",
      "Optimized frontend/backend integration and rendering performance, significantly improving responsiveness and overall user experience across core workflows.",
    ],
  },
  {
    role: "Full-stack Developer",
    company: "Brana Software Solution",
    href: "https://et.linkedin.com/company/brana-tech",
    period: "06/2024 - 07/2025",
    stack: ["React", "JavaScript", "REST APIs", "Geospatial"],
    highlights: [
      "Contributed to production-ready geospatial software solutions supporting 1,000+ mapped entities and location-based workflows.",
      "Developed and maintained RESTful APIs and scalable database systems powering interactive mapping and visualization features.",
      "Improved data handling and backend query performance, helping optimize application responsiveness and usability.",
      "Collaborated with senior engineers on full-stack development tasks, deployment workflows, and production system improvements.",
    ],
  },
  {
    role: "Back End Developer",
    company: "Ambalay Maps",
    href: "https://www.ambalaymaps.com",
    period: "11/2022 - 12/2024",
    stack: ["REST APIs", "Geospatial", "Databases", "Routing"],
    highlights: [
      "Developed scalable backend services and RESTful APIs powering geocoding, routing, trip tracking, and location intelligence features.",
      "Designed and optimized database schemas and backend logic to efficiently process geospatial data and support high-performance API requests.",
      "Built secure, maintainable backend systems that enabled real-time location services, route optimization, and travel-time calculations.",
    ],
  },
];

export const stacks = [
  {
    label: "PROGRAMMING & BACKEND",
    items: ["Python", "JavaScript", "TypeScript", "Java", "C++", "PHP", "SQL", "Node.js", "Express.js", "FastAPI", "Laravel", "REST APIs", "System Design"],
  },
  {
    label: "AI / MACHINE LEARNING",
    items: ["Artificial Intelligence", "Machine Learning", "LLM Integration", "Prompt Engineering", "NLP Pipelines", "AI Automation", "NumPy", "Pandas", "Scikit-learn", "Model Evaluation"],
  },
  {
    label: "TOOLS & PLATFORMS",
    items: ["Docker", "Git", "GitHub", "Linux", "Bash", "Postman", "VS Code", "CI/CD", "PostgreSQL", "MySQL", "Firebase", "Jira", "Cloud Deployment"],
  },
  {
    label: "FOUNDATIONS",
    items: ["Data Structures", "Algorithms", "Graphs", "Dynamic Programming", "Recursion", "Operating Systems", "Databases", "Networking", "Competitive Programming"],
  },
];

export const certifications = [
  "Machine Learning Foundations — Udemy",
  "Oracle Cloud Infrastructure 2025 Generative AI Professional",
  "Future Talent Development Bootcamp 2025",
];

export const footerStats = [
  { label: "FOCUS", value: "Full-stack + AI" },
  { label: "LOCATED IN", value: "Addis Ababa" },
  { label: "CONTACT", value: "Open via email" },
  { label: "STATUS", value: "Available" },
];

export type Testimonial = {
  name: string;
  role: string;
  org: string;
  initials: string;
  tag: string;
  quote: string;
  link: { label: string; href: string; icon: "linkedin" | "mail" | "globe" };
};

export const testimonials: Testimonial[] = [
  {
    name: "Adis Ojeda",
    role: "Director of Engineering",
    org: "Theseus Group",
    initials: "AO",
    tag: "AI - CLOUD - MIT EECS",
    quote:
      "Lisanegebriel is the rare engineer who pairs real backend rigor with genuine AI intuition. Working alongside him at Theseus Group, I watched him take ambiguous LLM problems and ship production-grade systems that actually hold up. He turns research into reliable infrastructure - exactly the instinct modern AI teams are built on.",
    link: { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/adis-ojeda/", icon: "linkedin" },
  },
  {
    name: "Samuel Getachew",
    role: "Final Project Advisor - Dept. of Computer Science",
    org: "Addis Ababa University",
    initials: "SG",
    tag: "ACADEMIC ADVISOR",
    quote:
      "As his advisor on Lingo-Abyssinia, I saw Lisanegebriel move from requirement analysis to a working interactive language-learning system with discipline and independence. He consistently proposed practical solutions, communicated clearly with his team, and applied classroom knowledge to real software. Among the students I have supervised, he stood out for his curiosity and reliability.",
    link: { label: "Email the advisor", href: "mailto:samuel.getachew34@aau.edu.et", icon: "mail" },
  },
  {
    name: "Binyam Dele",
    role: "Founder",
    org: "Ambalay Maps",
    initials: "BD",
    tag: "GEOSPATIAL - AFRICA",
    quote:
      "Building map infrastructure for how Ethiopians actually move takes engineers who understand both the technology and the local context. Lisanegebriel is exactly that - sharp with modern web stacks, thoughtful about real users, and relentless about shipping. He understands that local problems need local engineering, and he builds accordingly.",
    link: { label: "Visit ambalaymaps.com", href: "https://www.ambalaymaps.com", icon: "globe" },
  },
];

export const coursework = ["Data Structures & Algorithms", "Advanced Python", "AI & Machine Learning", "Operating Systems", "Database Systems", "Networking", "Computer Organization"];
