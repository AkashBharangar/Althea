const base =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

/**
 * @param {{ id?: string, text: string, createdAt?: string }[]} entries
 */
export async function analyzeEntries(entries) {
  const url = base ? `${base}/api/analyze` : "/api/analyze";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}
