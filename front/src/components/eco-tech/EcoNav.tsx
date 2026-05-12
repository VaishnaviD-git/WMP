import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Cpu, LayoutDashboard, Leaf, LogIn, Map, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Overview", icon: Leaf },
  { to: "/login", label: "Access", icon: LogIn },
  { to: "/register", label: "Enlist", icon: UserPlus },
  { to: "/dashboard", label: "Command", icon: LayoutDashboard },
  { to: "/map", label: "Geo Intel", icon: Map },
] as const;

export function EcoNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-500/15 bg-slate-950/55 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/35 bg-cyan-500/10 shadow-[0_0_28px_rgba(34,211,238,0.35)]"
          >
            <Cpu className="h-5 w-5 text-cyan-200" aria-hidden />
            <span className="absolute inset-0 rounded-full border border-emerald-400/25 opacity-70" />
          </motion.div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
              Nexus · Eco OS
            </p>
            <p className="text-sm font-semibold tracking-tight text-white">Smart Waste Intelligence</p>
          </div>
        </Link>

        <nav
          className="flex flex-wrap items-center gap-1 rounded-full border border-cyan-500/20 bg-slate-950/50 p-1 shadow-inner shadow-cyan-500/10"
          aria-label="Primary"
        >
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to}>
                <span
                  className={cn(
                    "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "text-slate-950"
                      : "text-cyan-100/80 hover:text-white",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="eco-nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_24px_rgba(34,211,238,0.45)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 opacity-90" aria-hidden />
                    {label}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
