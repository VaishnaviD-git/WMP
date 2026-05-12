import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Fingerprint, LogIn, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { GlassPanel } from "@/components/eco-tech/GlassPanel";
import { HolographicStamp } from "@/components/eco-tech/HolographicStamp";
import { ecoInputClass, ecoLabelClass, ecoLinkClass, ecoPrimaryButton, neonDivider } from "@/components/eco-tech/ecoTheme";
import { postForm } from "@/lib/api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setMessage(null);
    setLoading(true);
    try {
      await postForm("/api/login", formData);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-lg items-center px-4 py-16">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"
        animate={{ opacity: [0.35, 0.8, 0.4], scale: [0.95, 1.05, 0.98] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full"
      >
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <HolographicStamp size="sm" />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
            animate={{ opacity: [0.3, 0.85, 0.35] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-cyan-300/80">
                Secure uplink
              </p>
              <h1 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                <Fingerprint className="h-7 w-7 text-cyan-300" aria-hidden />
                Authenticate
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Municipal AI gateway · encrypted environmental intelligence channel.
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 8, -6, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="hidden rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-3 shadow-[0_0_24px_rgba(52,211,153,0.25)] sm:block"
            >
              <ShieldCheck className="h-8 w-8 text-emerald-300" aria-hidden />
            </motion.div>
          </div>

          <div className={`my-8 ${neonDivider}`} />

          <form className="space-y-5" onSubmit={onSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08, duration: 0.45 }}
            >
              <label className={ecoLabelClass} htmlFor="username">
                Operator ID
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="citizen.handle"
                className={ecoInputClass}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14, duration: 0.45 }}
            >
              <label className={ecoLabelClass} htmlFor="password">
                Access key
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={ecoInputClass}
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`${ecoPrimaryButton} mt-2 w-full`}
            >
              <LogIn className="h-4 w-4" aria-hidden />
              {loading ? "Negotiating keys…" : "Establish session"}
            </motion.button>
          </form>

          {message ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100"
              role="alert"
            >
              {message}
            </motion.p>
          ) : null}

          <div className={`mt-8 ${neonDivider}`} />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No uplink yet?{" "}
            <Link to="/register" className={ecoLinkClass}>
              Register citizen node
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            <Link to="/" className={ecoLinkClass}>
              Return to overview
            </Link>
          </p>
        </GlassPanel>
      </motion.div>
    </main>
  );
}
