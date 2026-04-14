import { Linkedin, Send, Code2, Twitter, Trophy } from "lucide-react";

const railLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/lisanegebriel-abay", icon: Linkedin },
  { label: "Telegram", href: "https://t.me/ligator", icon: Send },
  { label: "LeetCode", href: "https://leetcode.com/u/lisanx/", icon: Code2 },
  { label: "X", href: "https://x.com/lisanabay", icon: Twitter },
  { label: "Achievements", href: "/#about", icon: Trophy },
] as const;

export function RightSocialRail() {
  return (
    <aside className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
      {railLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={link.label}
          title={link.label}
          className="inline-flex h-9 w-9 items-center justify-center border border-border bg-background/60 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-cyber hover:text-cyber"
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
    </aside>
  );
}
