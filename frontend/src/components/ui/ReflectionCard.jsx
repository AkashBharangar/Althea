import { motion } from "framer-motion";
import { softEase, duration } from "../../lib/motion.js";

const cardMotion = {
  hidden: { opacity: 0, y: 14 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.07 * i,
      duration: duration.soft,
      ease: softEase,
    },
  }),
};

/**
 * Soft card for observational reflection copy — not a call to action.
 * @param {{
 *   children: import('react').ReactNode,
 *   className?: string,
 *   animated?: boolean,
 *   index?: number,
 * }} props
 */
export function ReflectionCard({
  children,
  className = "",
  animated = false,
  index = 0,
}) {
  const base =
    "rounded-2xl border border-lavender-100/80 bg-white/75 px-6 py-[1.125rem] shadow-soft ring-1 ring-white/70 backdrop-blur-sm";

  if (animated) {
    return (
      <motion.article
        custom={index}
        variants={cardMotion}
        initial="hidden"
        animate="show"
        className={`${base} ${className}`}
      >
        <div className="text-sm font-light leading-[1.65] text-ink/92">
          {children}
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      className={`${base} ${className}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: duration.soft, ease: softEase }}
    >
      <div className="text-sm font-light leading-[1.65] text-ink/92">{children}</div>
    </motion.article>
  );
}
