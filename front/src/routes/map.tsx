import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LocateFixed, MapPin } from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";
import BackButton from "@/components/BackButton";

export const Route = createFileRoute("/map")({
  component: RouteComponent,
});

function RouteComponent() {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [message, setMessage] = useState("Ready to detect location or manually place a smart marker.");
  const canUseCoords = lat !== null && lon !== null;

  const markerStyle = useMemo(() => {
    if (!canUseCoords) {
      return { left: "50%", top: "50%", opacity: 0 };
    }

    const normalizedX = Math.min(90, Math.max(10, ((lon as number) + 180) / 360 * 100));
    const normalizedY = Math.min(90, Math.max(10, (90 - (lat as number)) / 180 * 100));
    return {
      left: `${normalizedX}%`,
      top: `${normalizedY}%`,
      opacity: 1,
    };
  }, [canUseCoords, lat, lon]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported in this browser.");
      return;
    }

    setMessage("Acquiring geospatial coordinates...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        setMessage("Live coordinates captured successfully.");
      },
      (error) => {
        setMessage(`Unable to read location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  function onMapClick(event: MouseEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    const mappedLon = x * 360 - 180;
    const mappedLat = 90 - y * 180;
    setLat(Number(mappedLat.toFixed(6)));
    setLon(Number(mappedLon.toFixed(6)));
    setMessage("Manual marker placement completed.");
  }

  function useCoordinates() {
    if (!canUseCoords) {
      setMessage("Select coordinates before confirming.");
      return;
    }

    localStorage.setItem(
      "swm:selectedCoords",
      JSON.stringify({
        lat,
        lon,
        ts: Date.now(),
      }),
    );
    setMessage("Coordinates synced. You can return to registration.");
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8">
      <BackButton />
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white">Smart City Geolocation Interface</h1>
          <p className="mt-2 text-cyan-100/70">
            Capture precise coordinates for AI-assisted waste management.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-cyan-400/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={useCurrentLocation}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-900"
            >
              <LocateFixed className="h-5 w-5" />
              Detect Current Location
            </button>
            <button
              type="button"
              onClick={useCoordinates}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 font-semibold text-slate-900"
            >
              <MapPin className="h-5 w-5" />
              Use These Coordinates
            </button>
          </div>

          <div
            onClick={onMapClick}
            className="relative h-[440px] w-full cursor-crosshair overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-[#042338]/70 via-[#0a1b2b]/70 to-[#032022]/70"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.15),transparent_65%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.12)_1px,transparent_1px)] bg-[size:44px_44px]" />
            <motion.div
              animate={markerStyle}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/20 p-3"
            >
              <MapPin className="h-6 w-6 text-cyan-300" />
            </motion.div>
          </div>

          <div className="mt-4 rounded-xl border border-cyan-400/20 bg-black/20 p-4 text-sm">
            <p className="text-cyan-100/80">{message}</p>
            <p className="mt-2 text-emerald-300">
              Latitude: {lat !== null ? lat.toFixed(6) : "--"} | Longitude: {lon !== null ? lon.toFixed(6) : "--"}
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
