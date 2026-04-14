import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed left-0 top-0 z-[100] h-[2px] origin-left bg-cyber"
      style={{ scaleX: scrollYProgress, width: "100%" }}
    />
  );
}
