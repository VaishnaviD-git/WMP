import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, UserPlus } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import BackButton from "@/components/BackButton";
import { register } from "@/lib/api";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    function consumeCoordinates() {
      const raw = localStorage.getItem("swm:selectedCoords");
      if (!raw) {
        return;
      }

      try {
        const parsed = JSON.parse(raw) as {
          lat?: number;
          lon?: number;
        };
        if (typeof parsed.lat === "number" && typeof parsed.lon === "number") {
          setLatitude(parsed.lat);
          setLongitude(parsed.lon);
        }
      } catch {
        // Ignore malformed local storage content.
      }
    }

    function onStorage(event: StorageEvent) {
      if (event.key === "swm:selectedCoords") {
        consumeCoordinates();
      }
    }

    consumeCoordinates();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", consumeCoordinates);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", consumeCoordinates);
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (latitude === null || longitude === null) {
      setMessage("Please select your location from the smart map before registration.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setIsError(false);

    const response = await register({
      username: username.trim(),
      password,
      latitude,
      longitude,
    });

    if (response.ok) {
      setMessage(response.message);
      setIsError(false);
      navigate({ to: "/login" });
      setLoading(false);
      return;
    }

    setMessage(response.message);
    setIsError(true);
    setLoading(false);
  }

  function openMap() {
    window.open("/map?select=1", "_blank", "width=1000,height=700");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="rounded-3xl border border-cyan-400/30 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/20">
              <UserPlus className="h-10 w-10 text-cyan-300" />
            </div>

            <h1 className="text-4xl font-bold text-white">
              Smart City Registration
            </h1>

            <p className="mt-3 text-sm text-cyan-100/80">
              Join the intelligent AI-powered waste management ecosystem
            </p>
          </div>

          <form
            className="grid gap-5 md:grid-cols-2"
            onSubmit={onSubmit}
          >
            <div>
              <label className="mb-2 block text-sm text-cyan-100">
                Username
              </label>

              <input
                type="text"
                required
                placeholder="Choose username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-cyan-400/20 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-cyan-100">
                Password
              </label>

              <input
                type="password"
                required
                placeholder="Choose password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-cyan-400/20 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            <div className="md:col-span-2 rounded-2xl border border-cyan-400/20 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Geo Location Mapping
                  </h2>

                  <p className="mt-1 text-sm text-cyan-100/70">
                    Attach your location for optimized waste coordination
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={openMap}
                  className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-900"
                >
                  <MapPin className="h-5 w-5" />
                  Open Map
                </motion.button>
              </div>

              <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                {latitude !== null && longitude !== null ? (
                  <p className="text-sm text-emerald-300">
                    Coordinates selected: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-sm text-cyan-100/70">No coordinates selected yet.</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-4 font-bold text-slate-900 shadow-lg transition disabled:cursor-not-allowed disabled:opacity-75"
              >
                {loading
                  ? "Creating Smart Account..."
                  : "Register Account"}
              </motion.button>
            </div>
          </form>

          {message && (
            <p
              className={`mt-5 text-center text-sm ${
                isError ? "text-red-300" : "text-emerald-300"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-6 text-center text-sm text-cyan-100/70">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Access Portal
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
    </main>
  );
}