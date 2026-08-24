import { describe, expect, it } from "vitest";
import { normalizeBuildState, pollingDelayMs } from "../lib/github-actions";

describe("GitHub build status polling", () => {
  it("normalizes workflow states for the dashboard", () => {
    expect(normalizeBuildState("queued", null)).toBe("queued");
    expect(normalizeBuildState("in_progress", null)).toBe("in_progress");
    expect(normalizeBuildState("completed", "success")).toBe("success");
    expect(normalizeBuildState("completed", "failure")).toBe("failure");
    expect(normalizeBuildState("completed", "cancelled")).toBe("cancelled");
    expect(normalizeBuildState("completed", "neutral")).toBe("unknown");
  });

  it("polls active builds faster and caps retry backoff", () => {
    expect(pollingDelayMs(0, "in_progress")).toBe(15_000);
    expect(pollingDelayMs(1, "unknown")).toBe(5_000);
    expect(pollingDelayMs(20, "unknown")).toBe(30_000);
  });
});
