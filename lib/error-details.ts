const SECRET_KEY = /(token|password|passwd|secret|api[-_]?key|authorization|cookie|credential|keystore|private[-_]?key)/i;
const PRIVATE_URL = /(?:rtsp|rtsps|https?|ftp):\/\/[^\s)]+/gi;
const LONG_SECRET = /\b[A-Za-z0-9+/=_-]{32,}\b/g;

export function sanitizeTechnicalText(input: string): string {
  return input
    .replace(PRIVATE_URL, "[URL disamarkan]")
    .replace(/([\w.-]*(?:token|password|passwd|secret|api[-_]?key|authorization|cookie|credential|keystore|private[-_]?key)[\w.-]*)\s*[:=]\s*[^\s,;]+/gi, "$1=[REDACTED]")
    .replace(LONG_SECRET, (value) => (SECRET_KEY.test(value) ? "[REDACTED]" : value))
    .replace(/\b(?:[0-9a-f]{64}|[A-Za-z0-9+/]{44})\b/gi, "[REDACTED]")
    .slice(0, 2400);
}

export function buildTechnicalDetails(input: {
  source: string;
  title: string;
  message: string;
  status?: string;
  attempt?: number;
}): string {
  const lines = [
    "Setankober.cctv technical error",
    `source=${input.source}`,
    `title=${input.title}`,
    `message=${input.message}`,
    input.status ? `status=${input.status}` : null,
    typeof input.attempt === "number" ? `attempt=${input.attempt}` : null,
    `capturedAt=${new Date().toISOString()}`,
  ].filter((line): line is string => Boolean(line));
  return sanitizeTechnicalText(lines.join("\n"));
}
