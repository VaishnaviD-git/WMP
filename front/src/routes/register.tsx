import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Satellite, UserPlus } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { GlassPanel } from "@/components/eco-tech/GlassPanel";
import { HolographicStamp } from "@/components/eco-tech/HolographicStamp";
import {
  ecoGhostButton,
  ecoInputClass,
  ecoLabelClass,
  ecoLinkClass,
  ecoPrimaryButton,
  neonDivider,
} from "@/components/eco-tech/ecoTheme";
import { postForm } from "@/lib/api";

export const Route = createFileRoute("/register")({
  component: RegisterTemplate,
});

function RegisterTemplate() {
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [coordsHint, setCoordsHint] = useState("Awaiting geo-lock from map uplink.");
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { lat?: unknown; lon?: unknown };
      if (typeof data.lat === "number" && typeof data.lon === "number") {
        const la = data.lat.toFixed(6);
        const lo = data.lon.toFixed(6);
        setLat(la);
        setLon(lo);
        setCoordsHint(`Locked · ${la}, ${lo}`);
        setFeedback({ kind: "ok", text: "Coordinates synchronized." });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function openMap() {
    window.open("/map", "Map", "width=950,height=650,resizable=yes");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const form = event.currentTarget;
    const username = String(new FormData(form).get("username") || "").trim();
    const password = String(new FormData(form).get("password") || "");

    if (!username || !password) {
      setFeedback({ kind: "err", text: "Username and password are required." });
      return;
    }
    if (!lat || !lon) {
      setFeedback({ kind: "err", text: "Acquire coordinates from the holographic map interface." });
      return;
    }

    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);
    formData.set("latitude", lat);
    formData.set("longitude", lon);

    setLoading(true);
    try {
      await postForm("/api/register", formData);
      setFeedback({ kind: "ok", text: "Node provisioned. You may authenticate." });
      form.reset();
      setLat("");
      setLon("");
      setCoordsHint("Awaiting geo-lock from map uplink.");
    } catch (err) {
      setFeedback({
        kind: "err",
        text: err instanceof Error ? err.message : "Registration failed.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl items-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <GlassPanel className="relative overflow-hidden p-8 md:p-10">
          <HolographicStamp size="sm" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-300/85">
                Citizen provisioning
              </p>
              <h1 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                <UserPlus className="h-7 w-7 text-emerald-300" aria-hidden />
                Register uplink
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Attach your geo-coordinates so Nexus can orchestrate pickups against live municipal meshes.
              </p>
            </div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-cyan-400/35 bg-cyan-500/10 p-3 shadow-[0_0_28px_rgba(34,211,238,0.25)]"
            >
              <Satellite className="h-8 w-8 text-cyan-200" aria-hidden />
            </motion.div>
          </div>

          <div className={`my-8 ${neonDivider}`} />

          <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 }}
              className="md:col-span-1"
            >
              <label className={ecoLabelClass} htmlFor="username">
                Operator ID
              </label>
              <input
                id="username"
                name="username"
                className={ecoInputClass}
                placeholder="citizen.handle"
                type="text"
                required
                autoComplete="username"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1"
            >
              <label className={ecoLabelClass} htmlFor="password">
                Access key
              </label>
              <input
                id="password"
                name="password"
                className={ecoInputClass}
                placeholder="••••••••"
                type="password"
                required
                autoComplete="new-password"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="rounded-2xl border border-cyan-500/25 bg-slate-950/55 p-5 shadow-inner shadow-cyan-500/10 backdrop-blur-xl md:col-span-2"
            >
              <p className={ecoLabelClass}>Geo intelligence lock</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <motion.button
                  type="button"
                  onClick={openMap}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${ecoPrimaryButton} gap-2`}
                >
                  <MapPin className="h-4 w-4" aria-hidden />
                  Open holographic map
                </motion.button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{coordsHint}</p>
            </motion.div>

            <div className="md:col-span-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className={`${ecoPrimaryButton} w-full`}
              >
                {loading ? "Provisioning…" : "Commit registration"}
              </motion.button>
            </div>
          </form>

          {feedback ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
                feedback.kind === "err"
                  ? "border-rose-500/35 bg-rose-500/10 text-rose-100"
                  : "border-emerald-500/35 bg-emerald-500/10 text-emerald-100"
              }`}
              role="status"
            >
              {feedback.text}
            </motion.p>
          ) : null}

          <div className={`mt-8 ${neonDivider}`} />

          <p className="mt-5 text-sm text-muted-foreground">
            Already cleared?{" "}
            <Link to="/login" className={ecoLinkClass}>
              Sign in
            </Link>
          </p>
          <Link
            to="/"
            className={`${ecoGhostButton} mt-3 inline-flex w-full justify-center border-transparent bg-transparent`}
          >
            Back to Nexus overview
          </Link>
        </GlassPanel>
      </motion.div>
    </main>
  );
}
