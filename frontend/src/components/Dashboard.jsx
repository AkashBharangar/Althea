import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { analyzeJournalText } from "../lib/api.js";

const chartLine = "#4B3F5C";
const chartGrid = "#E8DCF4";
const chartDot = "#7A5AA8";

const disclaimer =
  "Observational language patterns only. Not medical or mental health advice, diagnosis, or treatment.";

const listItem = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Dashboard: journal input → API → timeline, reflections, triggers.
 * State and `analyzeJournalText` live here.
 */
export function Dashboard() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Write or paste something first — even a short passage is enough.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeJournalText(trimmed);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [text]);

  const chartData =
    result?.timeline?.map((t) => ({
      label: `${t.index + 1}`,
      score: t.score,
      sentence: t.sentence,
    })) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-12 pb-20 lg:max-w-4xl">
      <header className="space-y-2 text-center">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-lavender-600">
          Dashboard
        </p>
        <h1 className="font-display text-2xl font-normal text-ink sm:text-3xl">
          Your words, gently mirrored
        </h1>
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-mist">
          Paste journal or chat text. You will see how the tone moves line by
          line — no scoresheet, just a soft read of language.
        </p>
      </header>

      {/* Input */}
      <motion.section
        layout
        className="rounded-[1.75rem] border border-lavender-200/70 bg-white/55 p-8 shadow-soft backdrop-blur-md sm:p-10"
      >
        <label
          htmlFor="dashboard-journal"
          className="font-display text-lg text-ink"
        >
          What is on your mind?
        </label>
        <p className="mt-1 text-sm text-mist">
          Everything stays in this browser session unless your host logs it.
        </p>
        <textarea
          id="dashboard-journal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Begin anywhere. A few sentences are enough to see a shape…"
          disabled={loading}
          className="mt-6 w-full resize-y rounded-2xl border border-lavender-200/90 bg-white/80 px-5 py-4 font-sans text-[0.95rem] leading-relaxed text-ink placeholder:text-mist/60 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/40 disabled:opacity-60"
        />

        {error && (
          <p
            className="mt-4 rounded-2xl bg-blush-muted/80 px-4 py-3 text-sm text-plum-800"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <motion.button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="rounded-full bg-plum px-8 py-3.5 font-sans text-sm font-semibold text-white shadow-card transition-colors hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Listening to your words…" : "Reflect"}
          </motion.button>
          {result && (
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setError(null);
              }}
              className="font-sans text-sm text-mist underline-offset-4 hover:text-plum-600 hover:underline"
            >
              Clear results
            </button>
          )}
        </div>
      </motion.section>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <p className="rounded-2xl border border-dusty/40 bg-dusty-muted/50 px-5 py-4 text-center text-sm leading-relaxed text-mist">
              {disclaimer}
            </p>

            {/* 1. Emotion timeline */}
            <section className="rounded-[1.75rem] border border-lavender-200/60 bg-white/50 p-8 shadow-soft backdrop-blur-md sm:p-10">
              <h2 className="font-display text-xl font-normal text-ink">
                How the wording shifts
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist">
                Each point is one sentence. The line is a simple lexicon tally —
                a ripple, not a verdict.
              </p>
              <div className="mt-8 h-64 w-full sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 8"
                      stroke={chartGrid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#9d92b3", fontFamily: "Manrope" }}
                      axisLine={{ stroke: chartGrid }}
                      tickLine={false}
                      label={{
                        value: "Sentence",
                        position: "insideBottom",
                        offset: -4,
                        fill: "#9d92b3",
                        fontSize: 11,
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9d92b3", fontFamily: "Manrope" }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      cursor={{ stroke: chartGrid, strokeWidth: 1 }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid #E8DCF4",
                        boxShadow: "0 8px 32px -8px rgba(75, 63, 92, 0.12)",
                        fontSize: "12px",
                        fontFamily: "Manrope",
                        maxWidth: "280px",
                      }}
                      formatter={(value) => [`${value}`, "Tone"]}
                      labelFormatter={(_, payload) =>
                        (payload?.[0]?.payload?.sentence || "").slice(0, 140) +
                        (payload?.[0]?.payload?.sentence?.length > 140 ? "…" : "")
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={chartLine}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: chartDot, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: chartLine }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* 2. Reflection cards */}
            <section className="space-y-4">
              <h2 className="px-1 font-display text-xl font-normal text-ink">
                Reflections
              </h2>
              <p className="px-1 text-sm text-mist">
                Phrases below describe patterns in the text — not instructions.
              </p>
              <ul className="space-y-4">
                {(result.reflections || []).map((r, i) => (
                  <motion.li
                    key={`${i}-${r.slice(0, 24)}`}
                    custom={i}
                    variants={listItem}
                    initial="hidden"
                    animate="show"
                    className="rounded-[1.35rem] border border-lavender-100 bg-white/65 px-6 py-5 shadow-soft backdrop-blur-sm"
                  >
                    <p className="text-sm leading-relaxed text-ink">{r}</p>
                  </motion.li>
                ))}
              </ul>
            </section>

            {/* 3. Trigger tags */}
            <section className="rounded-[1.75rem] border border-blush/25 bg-blush-muted/25 p-8 shadow-soft backdrop-blur-md sm:p-10">
              <h2 className="font-display text-xl font-normal text-ink">
                Words near heavier lines
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                Nouns that showed up when sentences read as net-negative on this
                pass — curiosity, not a label.
              </p>
              {result.triggers && result.triggers.length > 0 ? (
                <ul className="mt-6 flex flex-wrap gap-3">
                  {result.triggers.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-lavender-200/80 bg-white/70 px-4 py-2 font-sans text-sm text-plum-700 shadow-sm"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-sm italic text-mist">
                  Nothing stood out as a repeating noun in those lines this time.
                </p>
              )}
            </section>

            {/* Summary from API — quiet closing note */}
            {result.summary && (
              <section className="rounded-[1.75rem] border border-sage/30 bg-sage-muted/40 p-8 shadow-soft backdrop-blur-md sm:p-10">
                <h2 className="font-display text-xl font-normal text-ink">
                  In brief
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink/90">
                  {result.summary}
                </p>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[1.75rem] border border-lavender-100/80 bg-white/30 px-8 py-10 text-center text-sm leading-relaxed text-mist backdrop-blur-sm"
        >
          When you reflect, a timeline and gentle notes will appear here — no
          dashboards that shout, only space to notice.
        </motion.p>
      )}
    </div>
  );
}
