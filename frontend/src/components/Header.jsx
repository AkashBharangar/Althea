import { motion } from "framer-motion";
import { softEase, duration } from "../lib/motion.js";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.soft, ease: softEase }}
      className="border-b border-lavender-200/50 bg-white/40 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.soft, delay: 0.08, ease: softEase }}
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-lavender-200/70 bg-white/80 text-sm font-semibold tracking-tight text-plum-600 shadow-soft"
            aria-hidden
          >
            A
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg tracking-tight text-ink">
              Althea
            </span>
            <span className="hidden text-[0.65rem] font-medium uppercase tracking-capsule text-mist/90 sm:block">
              Language studio
            </span>
          </div>
        </motion.div>
        <motion.p
          className="hidden max-w-[14rem] text-right text-[0.7rem] font-medium leading-snug tracking-wide text-mist sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.soft, delay: 0.18, ease: softEase }}
        >
          Patterns held lightly — local tools, clear boundaries
        </motion.p>
      </div>
    </motion.header>
  );
}
