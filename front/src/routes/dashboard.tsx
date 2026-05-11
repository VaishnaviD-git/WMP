import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import BackButton from "@/components/BackButton";
import { predict, type ApiEnvelope } from "@/lib/api";

type Decision = "WAIT" | "MONITOR" | "DISPOSE" | null;

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [decision, setDecision] = useState<Decision>(null);
  const [waste, setWaste] = useState("");
  const [delay, setDelay] = useState("");
  const [density, setDensity] = useState("");
  const [area, setArea] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [disposalRecommendation, setDisposalRecommendation] = useState("");

  async function runPrediction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const parsedLat = Number(lat);
    const parsedLon = Number(lon);
    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLon)) {
      setLoading(false);
      setMessage("Latitude and longitude must be valid numeric coordinates.");
      return;
    }

    const response = await predict({
      waste: waste.trim(),
      delay: delay.trim(),
      density: density.trim(),
      area: area.trim(),
      lat: parsedLat,
      lon: parsedLon,
    });

    if (!response.ok || !response.data) {
      setLoading(false);
      setDecision(null);
      setDisposalRecommendation("");
      setMessage(response.message);
      return;
    }

    const parsedDecision = extractDecision(response.data);
    const recommendation = extractRecommendation(response.data);
    setDecision(parsedDecision);
    setDisposalRecommendation(recommendation);
    setMessage(response.message);
    setLoading(false);
  }

  const decisionConfig = {
    WAIT: {
      color: "cyan",
      icon: <CheckCircle2 className="h-10 w-10" />,
      title: "Monitoring Stable",
      description:
        "Waste accumulation currently remains within safe thresholds.",
    },

    MONITOR: {
      color: "amber",
      icon: <AlertTriangle className="h-10 w-10" />,
      title: "Monitoring Required",
      description:
        "Collection delay patterns indicate potential risk escalation.",
    },

    DISPOSE: {
      color: "red",
      icon: <Trash2 className="h-10 w-10" />,
      title: "Immediate Disposal Required",
      description:
        "AI engine recommends nearest disposal coordination immediately.",
    },
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8">
      <BackButton />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="flex items-center gap-3 text-5xl font-bold text-white">
            <BarChart3 className="h-12 w-12 text-cyan-300" />
            AI Waste Analytics
          </h1>

          <p className="mt-3 text-cyan-100/70">
            Smart decision intelligence powered by predictive waste analysis
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[420px,1fr]">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="rounded-3xl border border-cyan-400/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
          >
            <h2 className="mb-6 text-2xl font-semibold text-white">
              Predictive Input System
            </h2>

            <form className="space-y-5" onSubmit={runPrediction}>
              <DashboardInput
                label="Waste Level"
                placeholder="High"
                value={waste}
                onChange={setWaste}
              />

              <DashboardInput
                label="Collection Delay"
                placeholder="2 Days"
                value={delay}
                onChange={setDelay}
              />

              <DashboardInput
                label="Population Density"
                placeholder="High Density"
                value={density}
                onChange={setDensity}
              />

              <DashboardInput
                label="Area Classification"
                placeholder="Residential"
                value={area}
                onChange={setArea}
              />

              <DashboardInput
                label="Latitude"
                placeholder="12.971598"
                value={lat}
                onChange={setLat}
              />

              <DashboardInput
                label="Longitude"
                placeholder="77.594566"
                value={lon}
                onChange={setLon}
              />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-4 text-lg font-bold text-slate-900 shadow-lg"
              >
                {loading ? "Analyzing..." : "Run AI Analysis"}
              </motion.button>

              {message && (
                <p className="text-sm text-cyan-100/80">{message}</p>
              )}
            </form>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="grid gap-5 md:grid-cols-3"
            >
              <StatCard
                title="Active Zones"
                value="128"
                glow="cyan"
              />

              <StatCard
                title="High Risk Areas"
                value="34"
                glow="red"
              />

              <StatCard
                title="Optimized Routes"
                value="89%"
                glow="emerald"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-cyan-400/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
            >
              <h2 className="mb-6 text-3xl font-bold text-white">
                AI Decision Engine
              </h2>

              {!decision ? (
                <div className="flex h-[320px] items-center justify-center rounded-3xl border border-dashed border-cyan-400/30">
                  <p className="text-cyan-100/60">{loading ? "AI computation in progress..." : "Awaiting predictive analysis..."}</p>
                </div>
              ) : (
                <motion.div
                  key={decision}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`rounded-3xl border p-8 ${
                    decision === "WAIT"
                      ? "border-cyan-400/30 bg-cyan-400/10"
                      : decision === "MONITOR"
                      ? "border-amber-400/30 bg-amber-400/10"
                      : "border-red-400/30 bg-red-400/10"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`rounded-full p-6 ${
                        decision === "WAIT"
                          ? "bg-cyan-400/20 text-cyan-300"
                          : decision === "MONITOR"
                          ? "bg-amber-400/20 text-amber-300"
                          : "bg-red-400/20 text-red-300"
                      }`}
                    >
                      {decisionConfig[decision].icon}
                    </div>

                    <h3 className="mt-6 text-4xl font-bold text-white">
                      {decision}
                    </h3>

                    <p className="mt-3 text-xl text-white">
                      {decisionConfig[decision].title}
                    </p>

                    <p className="mt-4 max-w-xl text-cyan-100/70">
                      {decisionConfig[decision].description}
                    </p>

                    {disposalRecommendation && (
                      <p className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                        Disposal Recommendation: {disposalRecommendation}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
    </main>
  );
}

function DashboardInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-cyan-100">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-4 text-white outline-none transition focus:ring-2 focus:ring-cyan-400/40"
      />
    </div>
  );
}

function extractDecision(data: ApiEnvelope): Decision {
  const candidates = [data.decision, data.action, data.status, data.result];
  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      const normalized = candidate.trim().toUpperCase();
      if (normalized === "WAIT" || normalized === "MONITOR" || normalized === "DISPOSE") {
        return normalized;
      }
    }
  }
  return null;
}

function extractRecommendation(data: ApiEnvelope): string {
  const candidates = [
    data.recommendation,
    data.disposal_recommendation,
    data.nearest_center,
    data.center,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }
  return "";
}

function StatCard({
  title,
  value,
  glow,
}: {
  title: string;
  value: string;
  glow: string;
}) {
  return (
    <div
      className={`rounded-3xl border bg-white/10 p-6 shadow-2xl backdrop-blur-xl ${
        glow === "cyan"
          ? "border-cyan-400/20"
          : glow === "red"
          ? "border-red-400/20"
          : "border-emerald-400/20"
      }`}
    >
      <p className="text-sm text-cyan-100/70">
        {title}
      </p>

      <h3 className="mt-3 text-4xl font-bold text-white">
        {value}
      </h3>
    </div>
  );
}