import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Decision = "WAIT" | "MONITOR" | "DISPOSE" | null;

const STEPS: { key: Exclude<Decision, null>; label: string; sub: string }[] = [
  { key: "WAIT", label: "Wait", sub: "Hold pattern" },
  { key: "MONITOR", label: "Monitor", sub: "Observe load" },
  { key: "DISPOSE", label: "Dispose", sub: "Route trucks" },
];

export function DecisionTriad({ decision }: { decision: Decision }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-slate-950/50 p-4 shadow-[inset_0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(34,211,238,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(52,211,153,0.25), transparent 50%)",
        }}
        animate={{ opacity: [0.25, 0.45, 0.28] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="relative text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-200/75">
        Decision engine
      </p>
      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {STEPS.map((step, index) => {
          const active = decision === step.key;
          return (
            <motion.div
              key={step.key}
              initial={false}
              animate={{
                scale: active ? 1.03 : 0.98,
                opacity: decision === null ? 0.55 : active ? 1 : 0.35,
              }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className={cn(
                "relative rounded-xl border px-2 py-3 text-center",
                active
                  ? "border-cyan-400/55 bg-gradient-to-b from-cyan-500/25 to-emerald-500/15 shadow-[0_0_32px_-6px_rgba(34,211,238,0.55)]"
                  : "border-cyan-500/15 bg-slate-950/40",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="decision-glow"
                  className="absolute inset-0 rounded-xl bg-gradient-to-t from-cyan-400/10 to-transparent"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              ) : null}
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-100/90">
                {step.label}
              </p>
              <p className="relative mt-1 text-[11px] text-muted-foreground">{step.sub}</p>
              <span className="relative mt-2 inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
              {index < STEPS.length - 1 ? (
                <span className="pointer-events-none absolute -right-1 top-1/2 hidden h-px w-2 -translate-y-1/2 bg-gradient-to-r from-cyan-400/40 to-transparent sm:block" />
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
