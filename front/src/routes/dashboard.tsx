import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, Clock3, MapPin } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { DecisionTriad } from "@/components/eco-tech/DecisionTriad";
import { GlassPanel } from "@/components/eco-tech/GlassPanel";
import { HolographicStamp } from "@/components/eco-tech/HolographicStamp";
import {
  ecoGhostButton,
  ecoInputClass,
  ecoLabelClass,
  ecoPrimaryButton,
  neonDivider,
} from "@/components/eco-tech/ecoTheme";
import { apiUrl, postForm } from "@/lib/api";

type Decision = "WAIT" | "MONITOR" | "DISPOSE" | null;
type Recommendation = { en: string; kn: string };
type LanguageMode = "en" | "kn" | "both";
type MunicipalRequestSummary = {
  id: number;
  decision: string;
  waste: number;
  delay: number;
  density: number;
  area: number;
  lat: number;
  lon: number;
  bin_lat: number | null;
  bin_lon: number | null;
  status: string;
  priority: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const Route = createFileRoute("/dashboard")({
  component: DashboardTemplate,
});

function DashboardTemplate() {
  const [waste, setWaste] = useState("1");
  const [delay, setDelay] = useState("0");
  const [density, setDensity] = useState("2");
  const [area, setArea] = useState("0");
  const [lat, setLat] = useState("12.9716");
  const [lon, setLon] = useState("77.5946");

  const [decision, setDecision] = useState<Decision>(null);
  const [binLat, setBinLat] = useState<number | null>(null);
  const [binLon, setBinLon] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [municipalRequestId, setMunicipalRequestId] = useState<number | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showMunicipalQueue, setShowMunicipalQueue] = useState(false);
  const [languageMode, setLanguageMode] = useState<LanguageMode>("both");
  const [municipalRequests, setMunicipalRequests] = useState<MunicipalRequestSummary[]>([]);
  const [municipalLoading, setMunicipalLoading] = useState(false);
  const [municipalError, setMunicipalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set("waste", waste);
    formData.set("delay", delay);
    formData.set("density", density);
    formData.set("area", area);
    formData.set("lat", lat);
    formData.set("lon", lon);

    try {
      const data = await postForm("/api/predict", formData);
      const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
      const d = typeof obj?.decision === "string" ? obj.decision : null;
      const blRaw = obj?.bin_lat;
      const brRaw = obj?.bin_lon;
      const recRaw = obj?.recommendations;
      const municipalRaw = obj?.municipal_request_id;
      const bl = typeof blRaw === "number" ? blRaw : blRaw !== null ? Number(blRaw) : null;
      const br = typeof brRaw === "number" ? brRaw : brRaw !== null ? Number(brRaw) : null;
      const municipalId =
        typeof municipalRaw === "number"
          ? municipalRaw
          : municipalRaw !== null && municipalRaw !== undefined
            ? Number(municipalRaw)
            : null;
      const recs = Array.isArray(recRaw)
        ? recRaw.filter(
            (entry): entry is Recommendation =>
              typeof entry === "object" &&
              entry !== null &&
              typeof (entry as { en?: unknown }).en === "string" &&
              typeof (entry as { kn?: unknown }).kn === "string",
          )
        : [];

      setDecision(d === "WAIT" || d === "MONITOR" || d === "DISPOSE" ? d : null);
      setBinLat(bl !== null && Number.isFinite(bl) ? bl : null);
      setBinLon(br !== null && Number.isFinite(br) ? br : null);
      setRecommendations(recs);
      setMunicipalRequestId(
        municipalId !== null && Number.isFinite(municipalId) ? Math.trunc(municipalId) : null,
      );
      setLanguageMode("both");
      setShowRecommendations(recs.length > 0);

      if (!d) {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setDecision(null);
      setBinLat(null);
      setBinLon(null);
      setRecommendations([]);
      setMunicipalRequestId(null);
      setShowRecommendations(false);
      setError(err instanceof Error ? err.message : "Prediction failed.");
    } finally {
      setLoading(false);
    }
  }

  async function openMunicipalQueue() {
    setShowMunicipalQueue(true);
    setMunicipalLoading(true);
    setMunicipalError(null);

    try {
      const response = await fetch(apiUrl("/api/municipal/requests"), {
        headers: { Accept: "application/json" },
      });
      const data = (await response.json()) as unknown;
      if (!response.ok) {
        throw new Error("Failed to load municipal queue.");
      }
      if (!Array.isArray(data)) {
        throw new Error("Unexpected response for municipal queue.");
      }
      const parsed = data.filter(
        (row): row is MunicipalRequestSummary =>
          typeof row === "object" &&
          row !== null &&
          typeof (row as { id?: unknown }).id === "number" &&
          typeof (row as { status?: unknown }).status === "string" &&
          typeof (row as { created_at?: unknown }).created_at === "string" &&
          typeof (row as { updated_at?: unknown }).updated_at === "string",
      );
      setMunicipalRequests(parsed);
    } catch (err) {
      setMunicipalRequests([]);
      setMunicipalError(err instanceof Error ? err.message : "Unable to load municipal queue.");
    } finally {
      setMunicipalLoading(false);
    }
  }

  const badgeClass =
    decision === "DISPOSE"
      ? "border border-rose-400/45 bg-gradient-to-r from-rose-500/35 to-orange-500/25 text-rose-50 shadow-[0_0_28px_rgba(251,113,133,0.35)]"
      : decision === "MONITOR"
        ? "border border-amber-400/45 bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-amber-50 shadow-[0_0_28px_rgba(251,191,36,0.3)]"
        : decision === "WAIT"
          ? "border border-cyan-400/45 bg-gradient-to-r from-cyan-500/30 to-sky-500/25 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.35)]"
          : "";

  const mapEmbedSrc =
    decision === "DISPOSE" && binLat !== null && binLon !== null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${binLon - 0.03}%2C${binLat - 0.03}%2C${binLon + 0.03}%2C${binLat + 0.03}&layer=mapnik&marker=${binLat}%2C${binLon}`
      : null;

  return (
    <main className="relative mx-auto min-h-[calc(100vh-64px)] w-full max-w-6xl px-4 py-10 md:px-6">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl"
        animate={{ opacity: [0.35, 0.75, 0.4] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="mb-6 flex flex-wrap justify-end gap-3">
        <Link to="/register" className={`${ecoGhostButton} text-xs`}>
          Register node
        </Link>
        <Link to="/login" className={`${ecoPrimaryButton} text-xs`}>
          Sign out
        </Link>
      </div>

      <GlassPanel glow="cyan" className="relative overflow-hidden p-6 md:p-8">
        <HolographicStamp size="md" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            
            <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              <BarChart3 className="h-7 w-7 text-cyan-300" aria-hidden />
              Environmental intelligence
            </h1>
          
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
            className="hidden h-16 w-16 shrink-0 rounded-full border border-cyan-400/35 bg-cyan-500/10 shadow-[0_0_32px_rgba(34,211,238,0.35)] md:flex md:items-center md:justify-center"
          >
            <span className="h-8 w-8 rounded-full border border-emerald-400/40" />
          </motion.div>
        </div>

        <div className={`my-8 ${neonDivider}`} />

        <div className="mt-2 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <motion.form
            layout
            className="space-y-4 rounded-2xl border border-cyan-500/20 bg-slate-950/45 p-5 shadow-inner shadow-cyan-500/10 backdrop-blur-xl"
            onSubmit={onSubmit}
          >
            <FieldLabel label="Waste level">
              <select
                value={waste}
                onChange={(event) => setWaste(event.target.value)}
                className={ecoInputClass}
                required
              >
                <option value="0">Low</option>
                <option value="1">Medium</option>
                <option value="2">High</option>
              </select>
            </FieldLabel>

            <FieldLabel label="Delay (days)">
              <input
                type="number"
                min={0}
                value={delay}
                onChange={(event) => setDelay(event.target.value)}
                className={ecoInputClass}
                required
              />
            </FieldLabel>

            <FieldLabel label="Population density">
              <select
                value={density}
                onChange={(event) => setDensity(event.target.value)}
                className={ecoInputClass}
                required
              >
                <option value="0">Low</option>
                <option value="1">Medium</option>
                <option value="2">High</option>
              </select>
            </FieldLabel>

            <FieldLabel label="Area type">
              <select
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className={ecoInputClass}
                required
              >
                <option value="0">Residential</option>
                <option value="1">Commercial</option>
              </select>
            </FieldLabel>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldLabel label="Latitude">
                <input
                  type="text"
                  inputMode="decimal"
                  value={lat}
                  onChange={(event) => setLat(event.target.value)}
                  className={ecoInputClass}
                  required
                />
              </FieldLabel>
              <FieldLabel label="Longitude">
                <input
                  type="text"
                  inputMode="decimal"
                  value={lon}
                  onChange={(event) => setLon(event.target.value)}
                  className={ecoInputClass}
                  required
                />
              </FieldLabel>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`${ecoPrimaryButton} mt-2 w-full`}
            >
              {loading ? "Running lattice inference…" : "Run analysis"}
            </motion.button>
          </motion.form>

          <aside className="flex flex-col gap-4 rounded-2xl border border-emerald-500/20 bg-slate-950/50 p-5 shadow-[inset_0_0_40px_rgba(52,211,153,0.06)] backdrop-blur-xl">
            <DecisionTriad decision={decision} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-200/75">
              Apriori routing output
            </p>

            {error ? (
              <p className="mt-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            {!decision && !error ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Submit the form to get a WAIT / MONITOR / DISPOSE decision.
              </p>
            ) : null}

            {decision ? (
              <>
                <div
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-bold ${badgeClass}`}
                >
                  {decision}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {decision === "DISPOSE" && "Nearest disposal point is shown on the map below."}
                  {decision === "MONITOR" &&
                    "Schedule monitoring before scheduling collection operations."}
                  {decision === "WAIT" && "No immediate action required under current rules."}
                </p>
              </>
            ) : null}

            {decision === "DISPOSE" && binLat !== null && binLon !== null && mapEmbedSrc ? (
              <div className="mt-4 rounded-2xl border border-cyan-500/25 bg-slate-950/55 p-3 shadow-[0_0_36px_-10px_rgba(34,211,238,0.35)] backdrop-blur-md">
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <MapPin className="h-4 w-4 text-cyan-300" aria-hidden />
                  Nearest disposal lattice
                </p>
                <div className="mt-3 overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/80">
                  <iframe
                    title="Nearest disposal location"
                    className="h-[280px] w-full grayscale-[0.2]"
                    src={mapEmbedSrc}
                  />
                </div>
              </div>
            ) : null}

            {decision === "DISPOSE" && (binLat === null || binLon === null) && !loading ? (
              <p className="mt-3 text-sm text-destructive">
                No disposal locations available in the dataset.
              </p>
            ) : null}

            {municipalRequestId !== null ? (
              <p className="mt-3 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.2)]">
                Disposal request persisted — municipal queue #{municipalRequestId}
              </p>
            ) : null}

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => void openMunicipalQueue()}
              className={`${ecoGhostButton} mt-1 w-full justify-center`}
            >
              Municipal queue &amp; dwell telemetry
            </motion.button>

            {recommendations.length > 0 ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowRecommendations(true)}
                className={`${ecoPrimaryButton} mt-2 w-full`}
              >
                Best-practice intelligence
              </motion.button>
            ) : null}
          </aside>
        </div>
      </GlassPanel>

      {showRecommendations ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl rounded-2xl border border-cyan-500/25 bg-slate-950/85 p-6 shadow-[0_0_60px_-12px_rgba(34,211,238,0.45)] backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300/85">
                  Guidance lattice
                </p>
                <h2 className="mt-2 text-lg font-semibold text-white">Recommended best practices</h2>
                <p className="text-sm text-muted-foreground">
                  English and Kannada guidance fused to your inference output.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRecommendations(false)}
                className={`${ecoGhostButton} shrink-0`}
              >
                Close
              </button>
            </div>

            <div className={`my-6 ${neonDivider}`} />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLanguageMode("en")}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  languageMode === "en"
                    ? "border-cyan-400/55 bg-cyan-500/25 text-white shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                    : "border-cyan-500/20 text-muted-foreground hover:border-cyan-400/45 hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguageMode("kn")}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  languageMode === "kn"
                    ? "border-cyan-400/55 bg-cyan-500/25 text-white shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                    : "border-cyan-500/20 text-muted-foreground hover:border-cyan-400/45 hover:text-white"
                }`}
              >
                Kannada
              </button>
              <button
                type="button"
                onClick={() => setLanguageMode("both")}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  languageMode === "both"
                    ? "border-emerald-400/55 bg-emerald-500/25 text-white shadow-[0_0_24px_rgba(52,211,153,0.35)]"
                    : "border-emerald-500/20 text-muted-foreground hover:border-emerald-400/45 hover:text-white"
                }`}
              >
                Both
              </button>
            </div>

            <ul className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
              {recommendations.map((tip, index) => (
                <li
                  key={`${tip.en}-${index}`}
                  className="rounded-xl border border-cyan-500/15 bg-slate-950/50 p-3 backdrop-blur-md"
                >
                  {languageMode === "en" || languageMode === "both" ? (
                    <p className="text-sm font-medium text-foreground">{tip.en}</p>
                  ) : null}
                  {languageMode === "kn" || languageMode === "both" ? (
                    <p
                      className={`text-sm text-muted-foreground ${
                        languageMode === "both" ? "mt-1" : ""
                      }`}
                    >
                      {tip.kn}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}

      {showMunicipalQueue ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl rounded-2xl border border-emerald-500/25 bg-slate-950/90 p-6 shadow-[0_0_60px_-12px_rgba(52,211,153,0.4)] backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-300/85">
                  Municipal mesh
                </p>
                <h2 className="mt-2 text-lg font-semibold text-white">Queue visibility</h2>
                <p className="text-sm text-muted-foreground">
                  Trace generated tasks and dwell hotspots across the fleet graph.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMunicipalQueue(false)}
                className={`${ecoGhostButton} shrink-0`}
              >
                Close
              </button>
            </div>

            {municipalError ? (
              <p className="mt-4 rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {municipalError}
              </p>
            ) : null}

            <div className="mt-4 max-h-[65vh] space-y-3 overflow-y-auto pr-1">
              {municipalLoading ? (
                <p className="rounded-xl border border-cyan-500/20 bg-slate-950/55 px-3 py-4 text-sm text-muted-foreground backdrop-blur-md">
                  Hydrating municipal queue…
                </p>
              ) : municipalRequests.length === 0 ? (
                <p className="rounded-xl border border-cyan-500/20 bg-slate-950/55 px-3 py-4 text-sm text-muted-foreground backdrop-blur-md">
                  No municipal tasks have been created yet.
                </p>
              ) : (
                municipalRequests.map((request) => {
                  const isDelayed =
                    request.status !== "COMPLETED" &&
                    request.status !== "SKIPPED" &&
                    request.delay >= 2;

                  return (
                    <article
                      key={request.id}
                      className="rounded-xl border border-cyan-500/15 bg-slate-950/45 p-4 shadow-[inset_0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Request #{request.id}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Created {formatDateTime(request.created_at)} • Last updated{" "}
                            {formatDateTime(request.updated_at)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge>{request.status}</Badge>
                          <Badge tone={request.priority === "HIGH" ? "danger" : "neutral"}>
                            {request.priority} priority
                          </Badge>
                          <Badge tone={isDelayed ? "warning" : "success"}>
                            {isDelayed ? "Delay hotspot" : "Moving normally"}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                        <div className="rounded-xl border border-cyan-500/15 bg-slate-950/55 p-3">
                          <p className="font-medium text-white">Operational inputs</p>
                          <p className="mt-2">
                            Decision: {request.decision} • Waste: {wasteLabel(request.waste)} •
                            Density: {densityLabel(request.density)}
                          </p>
                          <p className="mt-1">
                            Area: {areaLabel(request.area)} • Reported delay: {request.delay} day
                            {request.delay === 1 ? "" : "s"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-emerald-500/15 bg-slate-950/55 p-3">
                          <p className="font-medium text-white">Location trace</p>
                          <p className="mt-2">User point: {request.lat}, {request.lon}</p>
                          <p className="mt-1">
                            Assigned bin:{" "}
                            {request.bin_lat !== null && request.bin_lon !== null
                              ? `${request.bin_lat}, ${request.bin_lon}`
                              : "Not assigned"}
                          </p>
                        </div>
                      </div>

                      {request.notes ? (
                        <p className="mt-3 rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                          Municipal note: {request.notes}
                        </p>
                      ) : null}

                      {isDelayed ? (
                        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-amber-200">
                          <Clock3 className="h-4 w-4" />
                          This request is still open after a reported delay of {request.delay} days.
                        </p>
                      ) : null}
                    </article>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </main>
  );
}

function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={`${ecoLabelClass} normal-case tracking-normal text-xs text-cyan-100/90`}>
        {label}
      </span>
      {children}
    </label>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "border border-rose-400/45 bg-rose-500/15 text-rose-50"
      : tone === "warning"
        ? "border border-amber-400/45 bg-amber-500/15 text-amber-50"
        : tone === "success"
          ? "border border-emerald-400/45 bg-emerald-500/15 text-emerald-50"
          : "border border-cyan-500/25 bg-slate-950/55 text-cyan-50";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${toneClass}`}>
      {children}
    </span>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function wasteLabel(value: number) {
  return value === 2 ? "High" : value === 1 ? "Medium" : "Low";
}

function densityLabel(value: number) {
  return value === 2 ? "High" : value === 1 ? "Medium" : "Low";
}

function areaLabel(value: number) {
  return value === 1 ? "Commercial" : "Residential";
}
