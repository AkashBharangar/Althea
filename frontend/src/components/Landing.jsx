import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
};

/**
 * Full-viewport landing — calm, premium, observational framing.
 * @param {{ onReflect?: () => void }} props
 */
export function Landing({ onReflect }) {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-20"
      aria-label="Welcome"
    >
      {/* Soft layered gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blush-muted/40 via-lavender-50 to-sage-muted/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(200,182,226,0.45),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_30%,rgba(175,198,233,0.35),transparent_50%),radial-gradient(ellipse_60%_45%_at_0%_80%,rgba(243,198,211,0.28),transparent_45%)]"
        aria-hidden
      />

      {/* Floating orbs */}
      <motion.div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-lavender/25 blur-3xl"
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease }}
      />
      <motion.div
        className="pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-dusty/30 blur-3xl"
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.15, ease }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-blush/20 blur-2xl"
        aria-hidden
        animate={{ y: [0, -12, 0], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <motion.p
          variants={item}
          className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-mist"
        >
          Althea
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-6 font-display text-[2.35rem] font-normal leading-[1.12] tracking-tight text-ink sm:text-5xl sm:leading-[1.1] md:text-[3.25rem]"
        >
          A gentle reflection of your thoughts
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-mist sm:text-lg"
        >
          A quiet space to notice patterns in your words — observational,
          non-judgmental, and never a substitute for human care or professional
          support.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-col items-center gap-5">
          <motion.button
            type="button"
            onClick={onReflect}
            className="group relative rounded-full bg-plum px-10 py-4 font-sans text-sm font-semibold tracking-wide text-white shadow-card transition-colors hover:bg-plum-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lavender-50"
            whileHover={{ scale: 1.03, boxShadow: "0 12px 40px -12px rgba(75, 63, 92, 0.35)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <span className="relative z-10">Reflect on your words</span>
            <span
              className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
            />
          </motion.button>

          <p className="max-w-sm font-sans text-xs font-normal leading-relaxed text-mist/90">
            Local language tools only — no advice, no diagnosis, just language
            mirrored back softly.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <motion.div
            className="h-px w-16 bg-gradient-to-r from-transparent via-lavender-400/60 to-transparent"
            animate={{ scaleX: [0.85, 1, 0.85], opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
