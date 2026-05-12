import type { ReactNode } from "react";
import { Suspense, lazy } from "react";

import { EcoNav } from "./EcoNav";
import { PageTransition } from "./PageTransition";

const BackgroundScene = lazy(() => import("@/components/ui/three/BackgroundScene"));

export function EcoShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020617] text-foreground">
      <Suspense fallback={<div className="fixed inset-0 -z-10 bg-[#020617]" aria-hidden />}>
        <BackgroundScene />
      </Suspense>

      {/* Atmospheric overlays */}
      <div
        className="pointer-events-none fixed inset-0 -z-[5] bg-[radial-gradient(ellipse_at_20%_0%,rgba(34,211,238,0.18)_0%,transparent_45%),radial-gradient(ellipse_at_80%_100%,rgba(52,211,153,0.14)_0%,transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-[5] opacity-[0.06] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-[5] mix-blend-screen opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <EcoNav />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
