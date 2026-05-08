export function parseTextFileBuffer(file) {
  if (!file) {
    const err = new Error('Missing form field "file".');
    err.statusCode = 400;
    throw err;
  }

  const raw = Buffer.isBuffer(file.buffer)
    ? file.buffer.toString("utf8")
    : String(file.buffer ?? "");
  const text = raw.trim();

  if (!text) {
    const err = new Error("Uploaded file is empty.");
    err.statusCode = 400;
    throw err;
  }

  return text;
}

