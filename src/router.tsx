import { createRouter, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <p className="map-label">signal lost</p>
        <h1 className="font-map mt-4 text-6xl leading-none text-foreground">
          The trail <em className="text-cyber">washed out.</em>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-slate-mid">
          Something broke on this stretch of the route. Try again, or head back to base camp.
        </p>
        {import.meta.env.DEV && error instanceof Error && error.message && (
          <pre className="mt-4 max-h-40 overflow-auto border border-destructive/40 p-3 text-left font-mono-tech text-xs text-destructive">
            {error.message}
          </pre>
        )}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-cyber px-6 py-3.5 font-mono-tech text-[11px] uppercase tracking-[0.18em] text-cyber-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-input px-6 py-3.5 font-mono-tech text-[11px] uppercase tracking-[0.18em] text-foreground hover:border-foreground"
          >
            Base camp
          </a>
        </div>
      </div>
    </div>
  );
}

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });

  return router;
};
