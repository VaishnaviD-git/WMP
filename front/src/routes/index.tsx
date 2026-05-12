import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Hexagon, Radar, Sparkles } from "lucide-react";

import { HolographicHeroImage } from "@/components/eco-tech/HolographicHeroImage";
import { HolographicStamp } from "@/components/eco-tech/HolographicStamp";
import { GlassPanel } from "@/components/eco-tech/GlassPanel";
import { ecoGhostButton, ecoLinkClass, ecoPrimaryButton } from "@/components/eco-tech/ecoTheme";

export const Route = createFileRoute("/")({
  component: Index,
});

const floatVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function Index() {
  return (
    <main className="relative mx-auto min-h-[calc(100vh-64px)] w-full max-w-7xl px-4 pb-24 pt-10 md:px-8">
      <HolographicStamp className="right-6 top-8" size="md" />
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div className="order-2 space-y-8 lg:order-1">
          <motion.div
            custom={0}
            variants={floatVariants}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/35 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-100/90 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-200" aria-hidden />
            Eco-tech routing mesh
          </motion.div>

          <motion.h1
            custom={1}
            variants={floatVariants}
            initial="hidden"
            animate="show"
            className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Orchestrate{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">
              intelligent waste
            </span>{" "}
            flows across your smart city.
          </motion.h1>

          <motion.p
            custom={2}
            variants={floatVariants}
            initial="hidden"
            animate="show"
            className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Nexus correlates density, dwell times, and routing signals through an Apriori inference shell —
            delivering cinematic situational awareness for cleaner urban corridors.
          </motion.p>

          <motion.div
            custom={3}
            variants={floatVariants}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-3"
          >
            <Link to="/login" className={ecoPrimaryButton}>
              Initialize session
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/dashboard" className={ecoGhostButton}>
              Open command deck
            </Link>
          </motion.div>

          <motion.div
            custom={4}
            variants={floatVariants}
            initial="hidden"
            animate="show"
            className="grid gap-3 sm:grid-cols-3"
          >
            {[
              { icon: Radar, t: "Predictive mesh", d: "WAIT · MONITOR · DISPOSE triage" },
              { icon: Hexagon, t: "Live telemetry", d: "Bins, trucks, and dwell fused" },
              { icon: Sparkles, t: "Eco holographics", d: "Ambient intelligence layers" },
            ].map((item, index) => (
              <GlassPanel
                key={item.t}
                glow="cyan"
                className="p-4 transition hover:border-cyan-400/45 hover:shadow-[0_0_36px_-8px_rgba(34,211,238,0.45)]"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <item.icon className="h-5 w-5 text-cyan-300" aria-hidden />
                  <p className="mt-3 text-sm font-semibold text-white">{item.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.d}</p>
                </motion.div>
              </GlassPanel>
            ))}
          </motion.div>

          <motion.p
            custom={5}
            variants={floatVariants}
            initial="hidden"
            animate="show"
            className="text-sm text-muted-foreground"
          >
            Need credentials?{" "}
            <Link to="/register" className={ecoLinkClass}>
              Provision citizen uplink
            </Link>
          </motion.p>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="relative w-full max-w-[440px]">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-10 top-10 h-24 w-24 rounded-full border border-cyan-400/25 bg-cyan-400/10 blur-xl"
              animate={{ opacity: [0.4, 0.85, 0.45], scale: [0.9, 1.08, 0.95] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-6 right-4 h-28 w-28 rounded-full border border-emerald-400/25 bg-emerald-400/10 blur-xl"
              animate={{ opacity: [0.35, 0.75, 0.4] }}
              transition={{ duration: 5.2, repeat: Infinity, delay: 0.6 }}
            />
            <HolographicHeroImage />
            <GlassPanel glow="emerald" className="mt-6 px-4 py-3 text-center text-xs text-muted-foreground">
              Live holographic recycling core · add `public/recycling-hero.png` (or webp/jpg) to use your reference image.
            </GlassPanel>
          </div>
        </div>
      </div>
    </main>
  );
}
