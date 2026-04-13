import { motion } from "framer-motion";
import { softEase, duration } from "../../lib/motion.js";

/**
 * Soft, breathing dots — calm loading state.
 * @param {{
 *   label?: string,
 *   className?: string,
 * }} props
 */
export function Loader({
  label = "Staying with your words for a moment…",
  className = "",
}) {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center gap-5 py-7 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.soft, ease: softEase }}
    >
      <div className="flex items-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-gradient-to-br from-lavender-300 to-lavender-500"
            animate={{
              opacity: [0.3, 0.85, 0.3],
              scale: [0.9, 1.03, 0.9],
            }}
            transition={{
              duration: 1.85,
              repeat: Infinity,
              delay: i * 0.22,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {label && (
        <motion.p
          className="max-w-xs text-center text-sm font-light leading-relaxed text-mist"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: duration.soft, ease: softEase }}
        >
          {label}
        </motion.p>
      )}
    </motion.div>
  );
}
