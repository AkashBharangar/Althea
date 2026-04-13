/**
 * Althea API client — `fetch`-based POST to `/api/analyze`.
 * No extra dependency; works with Vite dev proxy and `VITE_API_URL` in production.
 */

/**
 * @typedef {object} AnalyzeResponse
 * @property {{ sentence: string, score: number, index: number }[]} timeline
 * @property {string[]} triggers
 * @property {string[]} reflections
 * @property {string} summary
 */

const ANALYZE_PATH = "/api/analyze";

function getBaseUrl() {
  return import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
}

function analyzeUrl() {
  const base = getBaseUrl();
  return base ? `${base}${ANALYZE_PATH}` : ANALYZE_PATH;
}

/** Structured error from the API or network layer. */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {{ status?: number, body?: unknown }} [meta]
   */
  constructor(message, meta = {}) {
    super(message);
    this.name = "ApiError";
    this.status = meta.status;
    this.body = meta.body;
  }
}

/**
 * POST JSON and parse JSON response.
 * @template T
 * @param {string} url
 * @param {unknown} body
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<T>}
 */
export async function postJson(url, body, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: options.signal,
    });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new ApiError("Request was cancelled.", { status: 0 });
    }
    throw new ApiError(
      "We could not reach the server. Please check your connection and try again when you are ready.",
      { status: 0 }
    );
  }

  const raw = await res.text();
  let data = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      throw new ApiError(
        res.ok
          ? "The server sent an unexpected response."
          : "Something interrupted the response. Please try again in a moment.",
        { status: res.status, body: raw }
      );
    }
  }

  if (!res.ok) {
    const msg =
      (typeof data.error === "string" && data.error) ||
      res.statusText ||
      "Request failed";
    throw new ApiError(msg, { status: res.status, body: data });
  }

  return /** @type {T} */ (data);
}

/**
 * Analyze journal text — POST `{ text }` to `/api/analyze`.
 *
 * @param {string} text
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<AnalyzeResponse>}
 */
export async function analyzeJournalText(text, options = {}) {
  return postJson(analyzeUrl(), { text }, options);
}

/**
 * Same as `analyzeJournalText`, but wires loading + error callbacks (e.g. React setters).
 * Returns `{ ok, data?, error? }` so callers can branch without try/catch.
 *
 * @param {string} text
 * @param {{
 *   setLoading?: (loading: boolean) => void,
 *   setError?: (message: string | null) => void,
 *   onSuccess?: (data: AnalyzeResponse) => void,
 *   signal?: AbortSignal,
 * }} [handlers]
 */
export async function analyzeJournalTextManaged(text, handlers = {}) {
  const { setLoading, setError, onSuccess, signal } = handlers;

  setLoading?.(true);
  setError?.(null);

  try {
    const data = await analyzeJournalText(text, { signal });
    onSuccess?.(data);
    return { ok: /** @type {const} */ (true), data };
  } catch (e) {
    const message =
      e instanceof ApiError
        ? e.message
        : e instanceof Error
          ? e.message
          : "Something interrupted the response. Please try again in a moment.";
    setError?.(message);
    return { ok: /** @type {const} */ (false), error: message };
  } finally {
    setLoading?.(false);
  }
}

export { ANALYZE_PATH, analyzeUrl };
