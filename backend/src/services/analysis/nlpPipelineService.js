import { buildReflections, buildSummary } from "../reflectionService.js";
import { buildAnalysisContext } from "./analysisContextService.js";
import { buildSentenceTimeline } from "./sentenceTimelineService.js";

/**
 * Main NLP orchestration pipeline.
 * Keeps computation flow explicit and easy to test in parts.
 */
export function runNlpPipeline(text) {
  const { timeline, negativeSentences } = buildSentenceTimeline(text);
  const ctx = buildAnalysisContext({ timeline, negativeSentences });

  return {
    timeline,
    triggers: ctx.triggers,
    triggerRanks: ctx.triggerRanks,
    reflections: buildReflections(ctx),
    summary: buildSummary(ctx),
  };
}

