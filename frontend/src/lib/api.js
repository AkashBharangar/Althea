const base =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

/**
 * @param {string} text Full journal text (can combine multiple blocks).
 */
export async function analyzeJournalText(text) {
  const url = base ? `${base}/api/analyze` : "/api/analyze";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}
