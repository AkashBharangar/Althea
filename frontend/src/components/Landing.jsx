import { motion } from "framer-motion";
import {
  softEase,
  duration,
  staggerContainer,
  fadeUp,
} from "../lib/motion.js";

const container = staggerContainer(0.11, 0.06);

/**
 * Full-viewport landing — calm, premium, observational framing.
 * @param {{ onReflect?: () => void }} props
 */
export function Landing({ onReflect }) {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24"
      aria-label="Welcome"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-lavender-50/80 to-sage-muted/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_110%_75%_at_50%_-15%,rgba(200,182,226,0.38),transparent_58%),radial-gradient(ellipse_65%_48%_at_100%_25%,rgba(175,198,233,0.28),transparent_52%),radial-gradient(ellipse_55%_42%_at_0%_85%,rgba(243,198,211,0.22),transparent_50%)]"
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-lavender/20 blur-3xl"
        aria-hidden
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.35, ease: softEase }}
      />
      <motion.div
        className="pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-dusty/25 blur-3xl"
        aria-hidden
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.35, delay: 0.12, ease: softEase }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-blush/15 blur-2xl"
        aria-hidden
        animate={{ y: [0, -10, 0], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <motion.p
          variants={fadeUp}
          className="font-sans text-[0.65rem] font-semibold uppercase tracking-capsule text-mist"
        >
          Language studio · Observational only
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-8 font-display text-[2.25rem] font-normal leading-[1.11] tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.08] md:text-[3.1rem]"
        >
          A gentle reflection of your thoughts
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-8 max-w-md font-sans text-[1.05rem] font-light leading-[1.65] text-mist sm:max-w-lg sm:text-lg"
        >
          For people who care about nuance — a composed read of cadence and
          word choice. Nothing here diagnoses, directs, or replaces the people
          who know you.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-12 flex flex-col items-center gap-6"
        >
          <motion.button
            type="button"
            onClick={onReflect}
            className="group relative rounded-full bg-plum px-11 py-4 font-sans text-[0.8125rem] font-semibold tracking-wide text-white shadow-premium ring-1 ring-plum-600/20 transition-colors hover:bg-plum-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 focus-visible:ring-offset-2 focus-visible:ring-offset-lavender-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
          >
            <span className="relative z-10">Enter your studio</span>
            <span
              className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/[0.08] to-white/0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              aria-hidden
            />
          </motion.button>

          <p className="max-w-xs font-sans text-xs font-normal leading-relaxed text-mist/85">
            Lexicon-based signals only — mirrored back with care, not authority.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: duration.soft, ease: softEase }}
        >
          <motion.div
            className="h-px w-20 bg-gradient-to-r from-transparent via-lavender-400/50 to-transparent"
            animate={{ scaleX: [0.9, 1, 0.9], opacity: [0.3, 0.65, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
