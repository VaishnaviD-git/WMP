import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 28, filter: "blur(14px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -24, filter: "blur(12px)" }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
