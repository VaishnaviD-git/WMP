import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    navigate({ to: "/" });
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      type="button"
      onClick={goBack}
      className="fixed left-4 top-4 z-20 inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-black/30 px-4 py-2 text-sm font-semibold text-cyan-200 shadow-lg shadow-cyan-900/30 backdrop-blur-md transition hover:border-cyan-300/60 hover:bg-cyan-400/10"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </motion.button>
  );
}
