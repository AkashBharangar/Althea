import { runNlpPipeline } from "./analysis/nlpPipelineService.js";

/**
 * @param {string} text
 * @returns {{
 *   timeline: { sentence: string, score: number, index: number }[],
 *   triggers: string[],
 *   triggerRanks: { word: string, count: number }[],
 *   reflections: string[],
 *   summary: string,
 * }}
 */
export function analyzeText(text) {
  return runNlpPipeline(text);
}
