import { motion, useSpring } from "framer-motion";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

const SHARED_HERO_SRC = "/recycling-hero.png";

type HolographicStampProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function HolographicStamp({ className, size = "md" }: HolographicStampProps) {
  const sizeClass = size === "sm" ? "h-16 w-16" : size === "lg" ? "h-28 w-28" : "h-20 w-20";
  const rotateX = useSpring(0, { stiffness: 90, damping: 18, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 90, damping: 18, mass: 0.5 });
  const offsetX = useSpring(0, { stiffness: 80, damping: 20, mass: 0.6 });
  const offsetY = useSpring(0, { stiffness: 80, damping: 20, mass: 0.6 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = event.clientX / w - 0.5;
      const ny = event.clientY / h - 0.5;

      rotateY.set(nx * 16);
      rotateX.set(-ny * 14);
      offsetX.set(nx * 8);
      offsetY.set(ny * 8);
    };

    const onLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
      offsetX.set(0);
      offsetY.set(0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [offsetX, offsetY, rotateX, rotateY]);

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute right-5 top-5 z-0", sizeClass, className)}
      style={{ x: offsetX, y: offsetY, rotateX, rotateY, transformStyle: "preserve-3d" }}
      animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0], opacity: [0.2, 0.4, 0.22] }}
      transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl" />
        <div className="absolute inset-0 rounded-full border border-cyan-300/35 bg-slate-950/45 p-2 backdrop-blur-xl">
          <img
            src={SHARED_HERO_SRC}
            alt=""
            className="h-full w-full rounded-full object-cover opacity-90 saturate-125 [filter:drop-shadow(0_0_14px_rgba(34,211,238,0.45))]"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src = "/recycling-hero.svg";
            }}
          />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border border-emerald-300/30"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
