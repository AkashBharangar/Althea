import { useCallback, useState } from "react";
import { motion } from "framer-motion";

function newEntry() {
  return {
    id: crypto.randomUUID?.() || `id-${Date.now()}-${Math.random()}`,
    text: "",
    createdAt: "",
  };
}

export function JournalPanel({ onAnalyze, loading, error }) {
  const [entries, setEntries] = useState([newEntry()]);

  const update = useCallback((id, patch) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  }, []);

  const addRow = () => setEntries((prev) => [...prev, newEntry()]);

  const removeRow = (id) => {
    setEntries((prev) => (prev.length <= 1 ? prev : prev.filter((e) => e.id !== id)));
  };

  function submit() {
    const payload = entries
      .map((e) => ({
        id: e.id,
        text: e.text.trim(),
        createdAt: e.createdAt?.trim() || undefined,
      }))
      .filter((e) => e.text.length > 0);
    onAnalyze(payload);
  }

  return (
    <motion.div
      layout
      className="rounded-3xl border border-lavender-200/80 bg-white/50 p-6 shadow-card backdrop-blur-md"
    >
      <h2 className="font-display text-xl font-medium text-ink">
        Your entries
      </h2>
      <p className="mt-1 text-sm text-mist">
        Separate moments help show change over time. Dates are optional labels
        for charts.
      </p>

      <div className="mt-6 space-y-4">
        {entries.map((e, i) => (
          <div
            key={e.id}
            className="rounded-2xl border border-lavender-100 bg-lavender-50/50 p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-xs font-medium text-lavender-700">
                Entry {i + 1}
              </label>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(e.id)}
                  className="text-xs text-mist underline-offset-2 hover:text-lavender-700 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <textarea
              value={e.text}
              onChange={(ev) => update(e.id, { text: ev.target.value })}
              rows={5}
              placeholder="Write or paste what you noticed today…"
              className="w-full resize-y rounded-xl border border-lavender-200 bg-white/80 px-3 py-2 text-sm text-ink placeholder:text-lavender-400 focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/50"
            />
            <input
              type="date"
              value={e.createdAt}
              onChange={(ev) => update(e.id, { createdAt: ev.target.value })}
              className="mt-2 w-full rounded-xl border border-lavender-200 bg-white/80 px-3 py-2 text-sm text-ink focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-300/50 sm:w-auto"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 w-full rounded-xl border border-dashed border-lavender-300 py-2 text-sm font-medium text-lavender-700 transition hover:bg-lavender-100/60"
      >
        + Add another entry
      </button>

      {error && (
        <p
          className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className="mt-4 w-full rounded-2xl bg-lavender-600 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-lavender-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Reading patterns…" : "Analyze patterns"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-mist">
        Not stored on our servers in this MVP — your browser sends text only
        for this request. Host the API you trust.
      </p>
    </motion.div>
  );
}
