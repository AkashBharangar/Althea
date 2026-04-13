import { motion } from "framer-motion";
import { softEase, duration } from "../../lib/motion.js";

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

const tagItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.soft, ease: softEase },
  },
};

/**
 * Gentle pill tags for recurring words — no urgency, no “alerts”.
 * @param {{
 *   tags: string[],
 *   className?: string,
 *   emptyMessage?: string,
 * }} props
 */
export function TriggerTags({
  tags = [],
  className = "",
  emptyMessage = "No single word repeated enough to name — sometimes silence in the data is its own kind of clarity.",
}) {
  if (!tags.length) {
    return (
      <motion.p
        className={`text-sm font-light leading-relaxed text-mist ${className}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.soft, ease: softEase }}
      >
        {emptyMessage}
      </motion.p>
    );
  }

  return (
    <motion.ul
      className={`flex flex-wrap gap-3 ${className}`}
      aria-label="Words beside heavier sentences"
      variants={list}
      initial="hidden"
      animate="show"
    >
      {tags.map((tag) => (
        <motion.li key={tag} variants={tagItem}>
          <span className="inline-block rounded-full border border-lavender-200/70 bg-white/85 px-4 py-2 font-sans text-sm font-medium text-plum-700/95 shadow-soft ring-1 ring-white/60">
            {tag}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
