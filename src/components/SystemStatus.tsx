import { useState, useEffect } from "react";

export function SystemStatus() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        timeZone: "Africa/Addis_Ababa", 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit", 
        hour12: false 
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed right-6 top-6 z-50 hidden items-center lg:flex">
      <span className="font-mono-tech text-[10px] tracking-wider text-muted-foreground">
        ADDIS ABABA // {time}
      </span>
    </div>
  );
}
