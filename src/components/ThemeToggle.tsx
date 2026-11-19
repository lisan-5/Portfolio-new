import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/** Night survey ↔ survey paper. Stays in sync when the field console switches themes. */
export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") document.documentElement.classList.add("light");
    const sync = () => setLight(document.documentElement.classList.contains("light"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="group fixed bottom-4 right-4 z-50 grid h-[50px] w-10 place-items-center border border-input bg-background/90 text-muted-foreground backdrop-blur-md transition-colors hover:border-cyber hover:text-cyber sm:bottom-6 sm:right-6"
      aria-label={light ? "Switch to the night survey" : "Switch to survey paper"}
      title={light ? "Night survey" : "Survey paper"}
    >
      {light ? <Moon className="h-4 w-4 transition-transform group-hover:-rotate-12" /> : <Sun className="h-4 w-4 transition-transform group-hover:rotate-45" />}
    </button>
  );
}
