export type ScanResult = { host: string; port: number; status: "online" | "offline" | "timeout"; latencyMs?: number };

const PRIVATE_IPV4 = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/;
const SAFE_PORTS = [80, 8080, 8000, 8899];
const MAX_HOSTS = 32;

function ipToNumber(ip: string) {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}
function numberToIp(value: number) {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

export function expandAuthorizedCidr(input: string) {
  const [ip, prefixText] = input.trim().split("/");
  const prefix = Number(prefixText);
  if (!PRIVATE_IPV4.test(ip) || !Number.isInteger(prefix) || prefix < 24 || prefix > 30) throw new Error("Gunakan CIDR privat /24 sampai /30, misalnya 192.168.1.0/29.");
  const base = ipToNumber(ip) & (0xffffffff << (32 - prefix));
  const size = 2 ** (32 - prefix);
  const usable = Array.from({ length: Math.max(0, size - 2) }, (_, index) => numberToIp(base + index + 1));
  if (usable.length > MAX_HOSTS) throw new Error("Rentang terlalu besar. Batasi maksimal 32 host per sesi.");
  return usable;
}

async function probe(host: string, port: number): Promise<ScanResult> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 700);
  try {
    await fetch(`http://${host}:${port}/`, { method: "HEAD", signal: controller.signal });
    return { host, port, status: "online", latencyMs: Date.now() - started };
  } catch (error) {
    const isTimeout = typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
    return { host, port, status: isTimeout ? "timeout" : "offline", latencyMs: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

export async function scanAuthorizedNetwork(cidr: string, onProgress?: (completed: number, total: number) => void) {
  const hosts = expandAuthorizedCidr(cidr);
  const jobs = hosts.flatMap((host) => SAFE_PORTS.map((port) => ({ host, port })));
  const results: ScanResult[] = [];
  let cursor = 0;
  const worker = async () => { while (cursor < jobs.length) { const job = jobs[cursor++]; const result = await probe(job.host, job.port); results.push(result); onProgress?.(results.length, jobs.length); } };
  await Promise.all(Array.from({ length: Math.min(4, jobs.length) }, worker));
  return results.sort((a, b) => a.host.localeCompare(b.host) || a.port - b.port);
}
