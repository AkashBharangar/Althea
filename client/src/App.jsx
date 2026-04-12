import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { JournalPanel } from "./components/JournalPanel.jsx";
import { ResultsView } from "./components/ResultsView.jsx";
import { analyzeEntries } from "./lib/api.js";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze(entries) {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeEntries(entries);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <Header />
      <main className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Hero />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 grid gap-8 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <JournalPanel
              onAnalyze={handleAnalyze}
              loading={loading}
              error={error}
            />
          </div>
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {result ? (
                <ResultsView key="results" data={result} />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl border border-lavender-200/80 bg-white/40 p-8 shadow-soft backdrop-blur-md"
                >
                  <p className="font-display text-lg text-lavender-800">
                    Your patterns will appear here
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-mist">
                    Add one or more journal snippets on the left, then run an
                    analysis. Althea describes word-level trends only — calm
                    reflections, not judgments or guidance.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
