/**
 * Shared Framer Motion presets — slow, soft, no snappy motion.
 */

export const softEase = [0.22, 1, 0.36, 1];

export const duration = {
  /** Default fade / slide */
  soft: 0.58,
  /** Hero lines, larger blocks */
  relaxed: 0.72,
  /** Presence enter/exit */
  presence: 0.55,
};

/** Stagger parent: children fade up in sequence */
export function staggerContainer(stagger = 0.1, delayChildren = 0.07) {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Child: slight rise + fade */
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.relaxed, ease: softEase },
  },
};

/** Smaller travel for dense UI */
export const fadeUpTight = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.soft, ease: softEase },
  },
};

/** Scroll-reveal defaults */
export const viewSoft = {
  once: true,
  amount: 0.12,
  margin: "-32px 0px -24px 0px",
};
