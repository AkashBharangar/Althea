import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeJournalTextManaged } from "../lib/api.js";
import {
  softEase,
  duration,
  staggerContainer,
  fadeUpTight,
  viewSoft,
} from "../lib/motion.js";
import { EmotionTimeline } from "./EmotionTimeline.jsx";
import {
  InputBox,
  ReflectionCard,
  TriggerTags,
  Loader,
} from "./ui/index.js";

const disclaimer =
  "Observational language patterns only — not medical or mental health advice, diagnosis, or treatment.";

const resultsStagger = staggerContainer(0.13, 0.08);

/**
 * Dashboard: journal input → API → timeline, reflections, triggers.
 */
export function Dashboard() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError(
        "When it feels right, offer a few lines — even a short passage is enough."
      );
      return;
    }

    setResult(null);
    await analyzeJournalTextManaged(trimmed, {
      setLoading,
      setError,
      onSuccess: setResult,
    });
  }, [text]);

  const timelinePoints =
    result?.timeline?.map((t) => ({
      index: t.index,
      score: t.score,
      sentence: t.sentence,
    })) ?? [];

  const sectionCard =
    "rounded-[1.75rem] border border-lavender-200/55 bg-white/60 p-8 shadow-premium ring-1 ring-white/70 backdrop-blur-md sm:p-10";

  return (
    <div className="mx-auto max-w-3xl space-y-14 pb-24 lg:max-w-4xl">
      <motion.header
        className="space-y-3 text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewSoft}
        transition={{ duration: duration.relaxed, ease: softEase }}
      >
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-capsule text-lavender-600/90">
          Your studio
        </p>
        <h1 className="font-display text-[1.65rem] font-normal leading-snug tracking-tight text-ink sm:text-3xl">
          The shape of what you said
        </h1>
        <p className="mx-auto max-w-md text-sm font-light leading-relaxed text-mist sm:max-w-lg sm:text-[0.9375rem]">
          Tone, sentence by sentence — held up for noticing, not for scoring
          you. Take what resonates; leave the rest.
        </p>
      </motion.header>

      <motion.section
        layout
        className={sectionCard}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewSoft}
        transition={{ duration: duration.relaxed, delay: 0.06, ease: softEase }}
      >
        <InputBox
          id="dashboard-journal"
          label="Compose"
          hint="This moment stays between you and this page — unless your host keeps server logs."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          disabled={loading}
        />

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loader-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: duration.presence, ease: softEase }}
              className="mt-6 overflow-hidden rounded-2xl border border-lavender-100/90 bg-lavender-50/50 shadow-soft ring-1 ring-white/60"
            >
              <Loader />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              key={error}
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: duration.soft, ease: softEase }}
              className="mt-4 rounded-2xl border border-blush/35 bg-blush-muted/80 px-5 py-3.5 text-sm font-light leading-relaxed text-plum-800"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-9 flex flex-wrap items-center gap-5">
          <motion.button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="rounded-full bg-plum px-9 py-3.5 font-sans text-[0.8125rem] font-semibold tracking-wide text-white shadow-premium ring-1 ring-plum-600/15 transition-colors hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Reading with care…" : "Receive a reading"}
          </motion.button>
          <AnimatePresence>
            {result && (
              <motion.button
                key="clear"
                type="button"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.soft, ease: softEase }}
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="font-sans text-sm font-medium text-mist underline-offset-[5px] decoration-lavender-300/80 hover:text-plum-600 hover:decoration-plum-400"
              >
                Start fresh
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: duration.presence, ease: softEase }}
          >
            <motion.div
              variants={resultsStagger}
              initial="hidden"
              animate="show"
              className="space-y-10"
            >
            <motion.p
              variants={fadeUpTight}
              className="rounded-2xl border border-dusty/35 bg-dusty-muted/45 px-6 py-4 text-center text-[0.8125rem] font-light leading-relaxed text-mist shadow-soft ring-1 ring-white/50"
            >
              {disclaimer}
            </motion.p>

            <motion.section variants={fadeUpTight} className={sectionCard}>
              <h2 className="font-display text-[1.25rem] font-normal tracking-tight text-ink sm:text-xl">
                Cadence across sentences
              </h2>
              <p className="mt-3 max-w-prose text-sm font-light leading-relaxed text-mist">
                Each point is one sentence. The line follows a small sentiment
                lexicon — a contour to observe, not a verdict on who you are.
              </p>
              <div className="mt-9 w-full">
                <EmotionTimeline data={timelinePoints} height={288} />
              </div>
            </motion.section>

            <motion.section variants={fadeUpTight} className="space-y-5">
              <div className="px-1">
                <h2 className="font-display text-[1.25rem] font-normal tracking-tight text-ink sm:text-xl">
                  Readings
                </h2>
                <p className="mt-2 max-w-prose text-sm font-light leading-relaxed text-mist">
                  Framed as observations in language — not guidance for what to
                  do or feel next.
                </p>
              </div>
              <ul className="space-y-4">
                {(result.reflections || []).map((r, i) => (
                  <li key={`${i}-${r.slice(0, 24)}`}>
                    <ReflectionCard animated index={i}>
                      {r}
                    </ReflectionCard>
                  </li>
                ))}
              </ul>
            </motion.section>

            <motion.section variants={fadeUpTight} className={sectionCard}>
              <h2 className="font-display text-[1.25rem] font-normal tracking-tight text-ink sm:text-xl">
                Words beside heavier lines
              </h2>
              <p className="mt-3 max-w-prose text-sm font-light leading-relaxed text-mist">
                Nouns that appeared alongside sentences the lexicon read as
                net-negative — offered as texture, not as truth about your life.
              </p>
              <div className="mt-7">
                <TriggerTags tags={result.triggers || []} />
              </div>
            </motion.section>

            {result.summary && (
              <motion.section
                variants={fadeUpTight}
                className={`${sectionCard} border-sage/25 bg-sage-muted/35`}
              >
                <h2 className="font-display text-[1.25rem] font-normal tracking-tight text-ink sm:text-xl">
                  In one breath
                </h2>
                <p className="mt-4 max-w-prose text-sm font-light leading-[1.65] text-ink/88">
                  {result.summary}
                </p>
              </motion.section>
            )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewSoft}
          transition={{ duration: duration.relaxed, ease: softEase }}
          className="rounded-2xl border border-lavender-100/90 bg-white/40 px-9 py-11 text-center text-sm font-light leading-relaxed text-mist shadow-soft ring-1 ring-white/60 backdrop-blur-sm"
        >
          Your cadence, readings, and word-tags will gather here — quietly, like
          notes in a margin, not like a dashboard shouting for attention.
        </motion.p>
      )}
    </div>
  );
}
