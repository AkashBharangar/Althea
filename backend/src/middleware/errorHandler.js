export function notFoundHandler(req, res, _next) {
  return res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, _req, res, _next) {
  const status = err?.statusCode || err?.status || 500;
  const message =
    typeof err?.message === "string" && err.message
      ? err.message
      : "Something went wrong on our side. You can try again in a moment.";

  if (status >= 400 && status < 500) {
    return res.status(status).json({ error: message });
  }

  console.error(err);
  return res.status(500).json({
    error: "Something went wrong on our side. You can try again in a moment.",
  });
}

