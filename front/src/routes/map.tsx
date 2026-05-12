import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crosshair, MapPinned, Navigation } from "lucide-react";
import { useCallback, useState } from "react";

import { GlassPanel } from "@/components/eco-tech/GlassPanel";
import { HolographicStamp } from "@/components/eco-tech/HolographicStamp";
import { ecoGhostButton, ecoInputClass, ecoLabelClass, ecoPrimaryButton, neonDivider } from "@/components/eco-tech/ecoTheme";

export const Route = createFileRoute("/map")({
  component: MapTemplate,
});

function MapTemplate() {
  const [lat, setLat] = useState(12.9716);
  const [lon, setLon] = useState(77.5946);
  const [status, setStatus] = useState(
    "Adjust coordinates or capture GPS — confirm to beam location back to registration.",
  );

  const setMarkerFromNumbers = useCallback((nextLat: number, nextLon: number, message?: string) => {
    setLat(nextLat);
    setLon(nextLon);
    setStatus(
      message
        ? `${message} · ${nextLat.toFixed(6)}, ${nextLon.toFixed(6)}`
        : `Locked · ${nextLat.toFixed(6)}, ${nextLon.toFixed(6)}`,
    );
  }, []);

  function confirmLocation() {
    if (!window.opener) {
      setStatus("Open this surface from registration (holographic map) to complete the handshake.");
      return;
    }

    window.opener.postMessage(
      {
        lat,
        lon,
      },
      window.location.origin,
    );

    window.close();
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setStatus("Geolocation unavailable on this terminal.");
      return;
    }
    setStatus("Triangulating your position…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const glat = position.coords.latitude;
        const glon = position.coords.longitude;
        setMarkerFromNumbers(glat, glon, "GPS lock acquired.");
      },
      () => setStatus("GPS denied — tune latitude / longitude manually."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <main className="relative mx-auto min-h-[calc(100vh-64px)] w-full max-w-6xl px-4 py-10 md:px-6">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-10 top-24 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl"
        animate={{ opacity: [0.35, 0.75, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <GlassPanel className="relative overflow-hidden p-6 md:p-8">
        <HolographicStamp size="sm" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-cyan-300/85">
              Geo intelligence · surface 04
            </p>
            <h1 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight text-white md:text-2xl">
              <MapPinned className="h-6 w-6 text-cyan-300" aria-hidden />
              Coordinate acquisition
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Lock your position inside the municipal mesh. Confirm beams encrypted coordinates to the registration
              portal.
            </p>
          </div>
          <Link to="/register" className={`${ecoGhostButton} shrink-0`}>
            Back to register
          </Link>
        </div>

        <div className={`my-6 ${neonDivider}`} />

        <div className="flex flex-wrap gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={ecoGhostButton}
            onClick={useCurrentLocation}
          >
            <Navigation className="h-4 w-4 text-cyan-300" aria-hidden />
            Capture GPS lock
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={ecoGhostButton}
            onClick={() => setMarkerFromNumbers(12.9716, 77.5946, "Bengaluru lattice anchor.")}
          >
            <Crosshair className="h-4 w-4 text-emerald-300" aria-hidden />
            Bengaluru default
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={ecoPrimaryButton}
            onClick={confirmLocation}
          >
            Confirm &amp; transmit
          </motion.button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className={ecoLabelClass} htmlFor="lat">
              Latitude
            </label>
            <input
              id="lat"
              type="number"
              step="0.000001"
              value={lat}
              onChange={(event) => {
                const next = Number(event.target.value);
                setLat(Number.isFinite(next) ? next : lat);
              }}
              className={ecoInputClass}
            />
          </div>
          <div>
            <label className={ecoLabelClass} htmlFor="lon">
              Longitude
            </label>
            <input
              id="lon"
              type="number"
              step="0.000001"
              value={lon}
              onChange={(event) => {
                const next = Number(event.target.value);
                setLon(Number.isFinite(next) ? next : lon);
              }}
              className={ecoInputClass}
            />
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-cyan-500/25 bg-slate-950/60 shadow-[0_0_48px_-12px_rgba(34,211,238,0.35)]">
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-cyan-400/35 bg-slate-950/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-100 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <motion.span
                aria-hidden
                className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
                animate={{ scale: [1, 1.65, 1], opacity: [0.55, 0.15, 0.55] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.85)]" />
            </span>
            Live preview
          </div>
          <iframe
            title="Map preview"
            className="relative z-0 h-[420px] w-full grayscale-[0.15] contrast-[1.05] [clip-path:inset(0_round_1rem)]"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.04}%2C${lat - 0.04}%2C${lon + 0.04}%2C${lat + 0.04}&layer=mapnik&marker=${lat}%2C${lon}`}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_80px_rgba(34,211,238,0.12)]"
            animate={{ opacity: [0.35, 0.6, 0.4] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          />
        </div>

        <motion.p
          id="status"
          initial={false}
          animate={{ opacity: [0.85, 1, 0.9] }}
          transition={{ duration: 3.2, repeat: Infinity }}
          className="mt-4 rounded-xl border border-cyan-500/20 bg-slate-950/55 px-4 py-3 text-sm text-muted-foreground backdrop-blur-md"
        >
          {status}
        </motion.p>
      </GlassPanel>
    </main>
  );
}
