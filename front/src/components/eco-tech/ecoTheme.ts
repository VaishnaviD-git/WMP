import { cn } from "@/lib/utils";

/** Shared glass / neon surface styles for the eco-tech shell */
export const glassPanel = cn(
  "rounded-2xl border border-cyan-400/25 bg-slate-950/40 shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)] backdrop-blur-xl",
);

export const glassPanelStrong = cn(
  "rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-slate-950/70 via-cyan-950/25 to-emerald-950/30 shadow-[0_0_48px_-8px_rgba(52,211,153,0.25)] backdrop-blur-2xl",
);

export const neonDivider = cn("h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent");

export const ecoInputClass = cn(
  "w-full rounded-xl border border-cyan-500/25 bg-slate-950/60 px-3 py-2.5 text-sm text-foreground shadow-inner shadow-cyan-500/5 outline-none transition",
  "placeholder:text-muted-foreground/70",
  "focus:border-cyan-400/55 focus:shadow-[0_0_24px_-4px_rgba(34,211,238,0.35)] focus:ring-2 focus:ring-cyan-400/30",
);

export const ecoLabelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80";

export const ecoPrimaryButton = cn(
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
  "bg-gradient-to-r from-cyan-400/90 to-emerald-400/85 text-slate-950 shadow-[0_0_32px_-6px_rgba(34,211,238,0.55)]",
  "transition hover:brightness-110 hover:shadow-[0_0_40px_-4px_rgba(52,211,153,0.45)] disabled:opacity-50",
);

export const ecoGhostButton = cn(
  "inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/35 bg-slate-950/40 px-4 py-2.5 text-sm font-medium text-cyan-100",
  "backdrop-blur-md transition hover:border-cyan-300/55 hover:bg-cyan-500/10",
);

export const ecoLinkClass = "font-medium text-cyan-300 underline-offset-4 transition hover:text-cyan-100 hover:underline";
