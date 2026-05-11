import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LogIn, Leaf } from "lucide-react";
import { useState, type FormEvent } from "react";
import BackButton from "@/components/BackButton";
import { login } from "@/lib/api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    const response = await login({
      username: username.trim(),
      password,
    });

    if (response.ok) {
      setMessage(response.message);
      setIsError(false);
      setLoading(false);
      navigate({ to: "/dashboard" });
      return;
    }

    setMessage(response.message);
    setIsError(true);
    setLoading(false);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl border border-cyan-400/30 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-cyan-400/20 p-4">
              <Leaf className="h-10 w-10 text-cyan-300" />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Smart Waste Portal
            </h1>

            <p className="mt-2 text-sm text-cyan-100/80">
              AI-powered intelligent waste management access system
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm text-cyan-100">
                Username
              </label>

              <input
                type="text"
                required
                placeholder="Enter username"
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
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-cyan-400/20 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-75"
            >
              <LogIn className="h-5 w-5" />

              {loading ? "Authenticating..." : "Access Dashboard"}
            </motion.button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                isError ? "text-red-300" : "text-emerald-300"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-6 text-center text-sm text-cyan-100/70">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Register
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
    </main>
  );
}