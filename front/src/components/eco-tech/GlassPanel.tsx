import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { glassPanel } from "./ecoTheme";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  glow?: "cyan" | "emerald" | "none";
};

export function GlassPanel({ className, glow = "cyan", children, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        glassPanel,
        glow === "cyan" && "shadow-[0_0_52px_-14px_rgba(34,211,238,0.45)]",
        glow === "emerald" && "border-emerald-400/25 shadow-[0_0_52px_-14px_rgba(52,211,153,0.4)]",
        glow === "none" && "shadow-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
