import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 600">
        {Array.from({ length: 14 }, (_, i) => (
          <ellipse
            key={i}
            cx={400}
            cy={300}
            rx={30 + i * 34}
            ry={20 + i * 24}
            fill="none"
            stroke={i % 5 === 0 ? "var(--contour-index)" : "var(--contour)"}
            strokeWidth={i % 5 === 0 ? 1.6 : 1}
            transform={`rotate(${i * 4} 400 300)`}
          />
        ))}
      </svg>
      <div className="relative max-w-lg text-center">
        <p className="map-label">error 404 · uncharted territory</p>
        <h1 className="font-map mt-4 text-7xl leading-none text-foreground sm:text-8xl">
          Off the <em className="text-cyber">map.</em>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-slate-mid">
          Nothing has been surveyed at this address. The way back to base camp is clearly marked.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-cyber px-6 py-3.5 font-mono-tech text-[11px] uppercase tracking-[0.18em] text-cyber-foreground"
        >
          ← Back to base camp
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lisanegebriel Abay — Full-Stack & AI Engineer" },
      { name: "description", content: "Full-Stack & AI Engineer building scalable backend systems, LLM applications and production-grade software." },
      { name: "author", content: "Lisanegebriel Abay" },
      { name: "theme-color", content: "#0a1311" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Lisanegebriel Abay" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@lisanabay" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      {/* Browser extensions commonly stamp attributes onto <body> before React
          hydrates (e.g. jf-observer-attached), which React reports as a
          hydration mismatch. This suppresses that noise for body's own
          attributes only — mismatches inside the app still warn. */}
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
