import { createFileRoute } from "@tanstack/react-router";
import { AiAssistant } from "../components/AiAssistant";
import { TerminalConsole } from "../components/TerminalConsole";
import { ThemeToggle } from "../components/ThemeToggle";
import { Locator, Neatline, Readout, TopBar } from "../components/atlas/Collar";
import { Flyover } from "../components/atlas/Flyover";
import { Hero } from "../components/atlas/Hero";
import { Landmarks } from "../components/atlas/Landmarks";
import { Route as RouteSection } from "../components/atlas/Route";
import { Destination, FieldNotes, Legend, Reports } from "../components/atlas/Sections";
import { TopoField } from "../components/atlas/TopoField";

const TITLE = "Lisanegebriel Abay — CTO · Full-Stack & AI Engineer";
const DESCRIPTION =
  "CTO at Spirit Hero and Full-Stack & AI Engineer in Addis Ababa building scalable backend systems, LLM applications, intelligent automation and production-grade software.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://www.ligator.tech/" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background">
      <TopoField className="fixed inset-0 h-full w-full" />
      <Neatline />
      <TopBar />
      <Locator />
      <Readout />
      <ThemeToggle />

      <main className="relative z-10">
        <Hero />
        <Flyover />
        <Landmarks />
        <RouteSection />
        <Legend />
        <FieldNotes />
        <Reports />
        <Destination />
      </main>

      <TerminalConsole />
      <AiAssistant />
    </div>
  );
}
