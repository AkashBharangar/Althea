import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-lavender-200/60 bg-white/30 backdrop-blur-lg"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-200/80 text-sm font-semibold text-lavender-800 shadow-sm"
            aria-hidden
          >
            A
          </span>
          <span className="font-display text-xl font-medium tracking-tight text-ink">
            Althea
          </span>
        </div>
        <p className="hidden text-xs text-mist sm:block">
          Observational patterns · Local NLP
        </p>
      </div>
    </motion.header>
  );
}
