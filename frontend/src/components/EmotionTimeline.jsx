import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { softEase, duration } from "../lib/motion.js";

/**
 * @typedef {{ index: number, score: number, sentence?: string }} EmotionPoint
 */

const tooltipStyle = {
  borderRadius: "16px",
  border: "1px solid rgba(232, 220, 244, 0.9)",
  background: "rgba(255, 255, 255, 0.94)",
  boxShadow: "0 12px 40px -12px rgba(75, 63, 92, 0.14)",
  fontSize: "12px",
  fontFamily: "Manrope, system-ui, sans-serif",
  padding: "10px 14px",
  maxWidth: "280px",
};

const axisTick = {
  fontSize: 11,
  fill: "#9d92b3",
  fontFamily: "Manrope, system-ui, sans-serif",
};

/**
 * Soft emotion line chart: monotone curve, lavender gradient stroke, light tooltip.
 * Expects `data` shaped as `[{ index, score }, ...]` (0-based `index` is shown as 1, 2, … on the axis).
 *
 * @param {{
 *   data: EmotionPoint[],
 *   className?: string,
 *   height?: number,
 * }} props
 */
export function EmotionTimeline({ data = [], className = "", height = 288 }) {
  const rawId = useId().replace(/:/g, "");
  const gradId = `lavender-line-${rawId}`;

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        at: d.index + 1,
        score: d.score,
        sentence: d.sentence,
      })),
    [data]
  );

  if (chartData.length === 0) {
    return (
      <motion.div
        className={`flex min-h-[200px] items-center justify-center rounded-2xl border border-lavender-100/80 bg-lavender-50/35 px-6 text-center text-sm font-light leading-relaxed text-mist ring-1 ring-white/50 ${className}`}
        style={{ height }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.soft, ease: softEase }}
      >
        The page is ready to listen — bring a few sentences when you wish.
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      style={{ height, minHeight: height }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.relaxed, ease: softEase }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 16, right: 12, left: 4, bottom: 8 }}
        >
          <defs>
            <linearGradient
              id={gradId}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor="#E8DCF4" stopOpacity={0.95} />
              <stop offset="45%" stopColor="#C8B6E2" stopOpacity={1} />
              <stop offset="100%" stopColor="#7A5AA8" stopOpacity={0.92} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="at"
            tick={axisTick}
            axisLine={{ stroke: "rgba(232, 220, 244, 0.55)", strokeWidth: 1 }}
            tickLine={false}
            padding={{ left: 4, right: 4 }}
            label={{
              value: "Sentence",
              position: "insideBottom",
              offset: -2,
              fill: "#b0a3c9",
              fontSize: 11,
              fontFamily: "Manrope, system-ui, sans-serif",
            }}
          />
          <YAxis
            tick={axisTick}
            axisLine={false}
            tickLine={false}
            width={36}
          />

          <Tooltip
            cursor={{
              stroke: "rgba(200, 182, 226, 0.45)",
              strokeWidth: 1,
            }}
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}`, "Tone"]}
            labelFormatter={(_, payload) => {
              const row = payload?.[0]?.payload;
              if (row?.sentence) {
                const s = row.sentence;
                return s.length > 120 ? `${s.slice(0, 120)}…` : s;
              }
              return `Sentence ${row?.at ?? ""}`;
            }}
          />

          <Line
            type="monotone"
            dataKey="score"
            stroke={`url(#${gradId})`}
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={{
              r: 4,
              fill: "#C8B6E2",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "#7A5AA8",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            isAnimationActive
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
