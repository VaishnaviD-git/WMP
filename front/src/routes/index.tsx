import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import recyclingHologram from "@/assets/recycling-hologram.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <h1 className="sr-only">Smart Recycling Holographic Dashboard</h1>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end pb-10">
        <img
          src={recyclingHologram}
          alt="Hands typing on a laptop with a futuristic holographic recycling and sustainability dashboard"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/login"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl border border-emerald-300/40 bg-emerald-400/20 px-6 py-3 font-semibold text-emerald-200 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400/30"
          >
            Register
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
