"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const springProgress = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min(scrollTop / docHeight, 1);
        setProgress(percent);
        springProgress.set(percent);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [springProgress]);

  return (
    <div className="fixed top-14 left-0 right-0 z-40 h-[3px] bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-accent rounded-r-full"
        style={{ width: `${progress * 100}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      />
    </div>
  );
}
