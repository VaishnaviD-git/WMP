import { motion, useMotionTemplate, useSpring } from "framer-motion";
import { useCallback, useMemo, useState, type MouseEvent } from "react";

import { cn } from "@/lib/utils";

/** Drop `recycling-hero.png` (or webp/jpg) into `public/` — falls back to bundled SVG. */
const IMAGE_CANDIDATES = [
  "/recycling-hero.png",
  "/recycling-hero.webp",
  "/recycling-hero.jpg",
  "/recycling-hero.svg",
];

function FallbackHolographicSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={cn("h-full w-full", className)}
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id="holo-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#34d399" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="holo-ring" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0" />
          <stop offset="40%" stopColor="#67e8f9" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="200" cy="200" r="168" fill="none" stroke="url(#holo-ring)" strokeWidth="3" opacity="0.55" />
      <circle cx="200" cy="200" r="148" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.35" />
      <g filter="url(#glow)">
        <path
          fill="url(#holo-cyan)"
          d="M200 88c-13 0-24 4-33 12l-38 31c-18 15-18 42 0 57l38 31c9 8 20 12 33 12h52v-36h-52c-4 0-8-1-11-4l-38-31c-4-3-4-9 0-12l38-31c3-3 7-4 11-4h52v-45h-52zm0 180c13 0 24-4 33-12l38-31c18-15 18-42 0-57l-38-31c-9-8-20-12-33-12h-52v36h52c4 0 8 1 11 4l38 31c4 3 4 9 0 12l-38 31c-3 3-7 4-11 4h-52v45h52z"
        />
      </g>
      <circle cx="200" cy="200" r="54" fill="none" stroke="#34d399" strokeWidth="2" opacity="0.45" />
      <path
        d="M200 128 L248 200 L200 272 L152 200 Z"
        fill="none"
        stroke="#a5f3fc"
        strokeWidth="1.2"
        opacity="0.5"
      />
    </svg>
  );
}

type HeroParticlesProps = { count?: number };

function HeroParticles({ count = 24 }: HeroParticlesProps) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: `${8 + (i * 3.7) % 84}%`,
        y: `${10 + (i * 5.1) % 80}%`,
        delay: (i % 7) * 0.12,
        duration: 3.2 + (i % 5) * 0.35,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]"
          style={{ left: d.x, top: d.y }}
          animate={{ opacity: [0.15, 1, 0.2], scale: [0.6, 1.2, 0.7], y: [0, -10, 4] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function HolographicHeroImage({ className }: { className?: string }) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  const rotateX = useSpring(0, { stiffness: 120, damping: 18, mass: 0.4 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 18, mass: 0.4 });

  const shine = useMotionTemplate`linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 48%, rgba(165,243,252,0.35) 52%, transparent 68%)`;

  const onMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(px * 22);
      rotateX.set(-py * 18);
    },
    [rotateX, rotateY],
  );

  const onLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const handleImgError = useCallback(() => {
    if (candidateIndex + 1 < IMAGE_CANDIDATES.length) {
      setCandidateIndex((i) => i + 1);
    } else {
      setUseFallback(true);
    }
  }, [candidateIndex]);

  const src = IMAGE_CANDIDATES[candidateIndex];

  return (
    <motion.div
      className={cn("relative mx-auto w-full max-w-lg perspective-[1200px]", className)}
      initial={{ opacity: 0, y: 40, scale: 0.94, filter: "blur(16px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        aria-hidden
        className="absolute -inset-10 rounded-[40%] bg-cyan-400/25 blur-3xl"
        animate={{ opacity: [0.35, 0.75, 0.4], scale: [0.95, 1.05, 0.98] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -inset-6 rounded-[45%] bg-emerald-400/15 blur-2xl"
        animate={{ opacity: [0.25, 0.55, 0.3] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div
        className="relative aspect-square w-full max-w-[min(100%,420px)] mx-auto"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <HeroParticles />

        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          {/* Neon rim */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/50 via-emerald-400/35 to-cyan-500/20 p-[2px] shadow-[0_0_60px_-10px_rgba(34,211,238,0.65)]">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950/80 backdrop-blur-xl">
              {/* Shimmer sweep */}
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
                style={{
                  backgroundImage: shine,
                  backgroundSize: "240% 240%",
                }}
                animate={{ backgroundPosition: ["200% 50%", "-200% 50%"] }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              />
              {/* Inner holographic ring */}
              <motion.div
                className="pointer-events-none absolute inset-6 rounded-full border border-cyan-400/30"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="pointer-events-none absolute inset-10 rounded-full border border-emerald-400/25"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative z-10 h-[72%] w-[72%]">
                {useFallback ? (
                  <FallbackHolographicSvg />
                ) : (
                  <img
                    src={src}
                    alt="Holographic recycling intelligence core"
                    className="h-full w-full object-contain drop-shadow-[0_0_28px_rgba(34,211,238,0.45)]"
                    loading="eager"
                    decoding="async"
                    onError={handleImgError}
                  />
                )}
              </div>

              {/* Edge light */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  boxShadow: "inset 0 0 40px rgba(34,211,238,0.25)",
                }}
                animate={{ opacity: [0.45, 0.85, 0.5] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Orbiting eco ring */}
        <motion.div
          className="pointer-events-none absolute inset-[-8%] rounded-full border border-dashed border-cyan-400/25"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
