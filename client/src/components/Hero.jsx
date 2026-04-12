import { motion } from "framer-motion";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="text-center"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-lavender-600">
        Emotional pattern mirror
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        Soft light on your words
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-mist">
        Althea reads journal or chat text with gentle, local language tools.
        It surfaces recurring words and simple sentiment shapes — reflections
        only, never diagnosis, therapy, or advice.
      </p>
    </motion.section>
  );
}
