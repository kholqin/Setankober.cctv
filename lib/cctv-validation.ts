export function isAuthorizedPrivateUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!["rtsp:", "rtsps:", "http:", "https:"].includes(parsed.protocol)) return false;
    const host = parsed.hostname;
    return host === "localhost" || host === "127.0.0.1" || /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
  } catch {
    return false;
  }
}
