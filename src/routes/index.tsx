import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../components/Sidebar";
import { SystemStatus } from "../components/SystemStatus";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { SkillsSection } from "../components/SkillsSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ExperienceSection } from "../components/ExperienceSection";
import { EducationSection } from "../components/EducationSection";
import { ContactSection } from "../components/ContactSection";
import { FooterSection } from "../components/FooterSection";
import { TerminalConsole } from "../components/TerminalConsole";
import { MobileNav } from "../components/MobileNav";
import { OceanBackground } from "../components/OceanBackground";
import { ThemeToggle } from "../components/ThemeToggle";
import { ScrollProgress } from "../components/ScrollProgress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lisanegebriel Abay — AI-Driven Full-Stack Engineer" },
      { name: "description", content: "Engineering scalable intelligence. AI-Driven Full-Stack Engineer specializing in LLM orchestration & high-performance web architectures." },
      { property: "og:title", content: "Lisanegebriel Abay — Engineering the Intelligence Layer" },
      { property: "og:description", content: "AI-Driven Full-Stack Engineer specializing in LLM orchestration & scalable architectures." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background">
      <OceanBackground />
      <ScrollProgress />
      <Sidebar />
      <SystemStatus />
      <MobileNav />
      <ThemeToggle />

      <main className="relative z-10 transition-[margin] duration-300">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
        <FooterSection />
      </main>

      <TerminalConsole />
    </div>
  );
}
