import React from "react";
import { motion } from "framer-motion";

export default function Spinner({ label = "Loading..." }) {
  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        className="w-11 h-11 border-[3px] border-accent/30 border-t-accent rounded-full"
        aria-hidden="true"
      />
      <p className="text-primary/50 dark:text-white/60 text-xs font-semibold uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}
