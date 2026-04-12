import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const chartColors = {
  line: "#7f6ab8",
  bar: "#9585c9",
  grid: "#e2ddf2",
};

export function ResultsView({ data }) {
  const { analysis, reflections, disclaimer } = data;
  const wordData = (analysis.recurringWords || []).map((w) => ({
    name: w.word,
    count: w.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-lavender-200/80 bg-lavender-100/40 p-5 shadow-soft backdrop-blur-md">
        <p className="text-sm leading-relaxed text-lavender-900">{disclaimer}</p>
      </div>

      <section className="rounded-3xl border border-lavender-200/80 bg-white/50 p-6 shadow-card backdrop-blur-md">
        <h3 className="font-display text-lg font-medium text-ink">
          Gentle reflections
        </h3>
        <ul className="mt-4 space-y-3">
          {reflections.map((r, i) => (
            <li
              key={i}
              className="rounded-2xl border border-lavender-100 bg-white/70 px-4 py-3 text-sm leading-relaxed text-ink"
            >
              {r}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Language tone by entry">
          <p className="mb-3 text-xs text-mist">
            Comparative score from the{" "}
            <span className="text-lavender-700">sentiment</span> lexicon —
            higher is more positive-leaning word choice in that snippet.
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysis.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#9d92b3" }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11, fill: "#9d92b3" }} width={36} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2ddf2",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="comparative"
                  stroke={chartColors.line}
                  strokeWidth={2}
                  dot={{ r: 3, fill: chartColors.line }}
                  name="Tone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Words that repeat">
          <p className="mb-3 text-xs text-mist">
            Frequent tokens (stopwords removed) — curiosity, not a to-do list.
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wordData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9d92b3" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={72}
                  tick={{ fontSize: 11, fill: "#6c579f" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2ddf2",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill={chartColors.bar} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <section className="rounded-3xl border border-lavender-200/80 bg-white/40 p-6 shadow-soft backdrop-blur-md">
        <h3 className="font-display text-lg font-medium text-ink">
          At a glance
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Stat
            label="Entries"
            value={String(analysis.entryCount)}
          />
          <Stat
            label="Avg. comparative tone"
            value={String(analysis.aggregates.avgComparative)}
          />
          <Stat
            label="Positive-tinted word hits"
            value={String(analysis.aggregates.positiveWordHits)}
          />
          <Stat
            label="Negative-tinted word hits"
            value={String(analysis.aggregates.negativeWordHits)}
          />
        </dl>
      </section>
    </motion.div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-lavender-200/80 bg-white/50 p-5 shadow-soft backdrop-blur-md">
      <h3 className="font-display text-base font-medium text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-lavender-100 bg-lavender-50/60 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-mist">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl text-lavender-800">{value}</dd>
    </div>
  );
}
