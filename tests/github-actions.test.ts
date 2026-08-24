import { describe, expect, it } from "vitest";
import { normalizeBuildState, pollingDelayMs, summarizeBuildProgress } from "../lib/github-actions";

describe("GitHub build status polling", () => {
  it("normalizes workflow states for the dashboard", () => {
    expect(normalizeBuildState("queued", null)).toBe("queued");
    expect(normalizeBuildState("in_progress", null)).toBe("in_progress");
    expect(normalizeBuildState("completed", "success")).toBe("success");
    expect(normalizeBuildState("completed", "failure")).toBe("failure");
    expect(normalizeBuildState("completed", "cancelled")).toBe("cancelled");
    expect(normalizeBuildState("completed", "neutral")).toBe("unknown");
  });

  it("calculates progress from completed and active workflow steps", () => {
    const progress = summarizeBuildProgress("in_progress", [{ steps: [{ name: "Validate", status: "completed" }, { name: "Build debug APK", status: "in_progress" }, { name: "Upload APK", status: "queued" }] }]);
    expect(progress).toEqual({ progressPct: 33, completedSteps: 1, totalSteps: 3, currentStep: "Build debug APK" });
    expect(summarizeBuildProgress("success", [{ steps: [{ status: "completed" }] }]).progressPct).toBe(100);
    expect(summarizeBuildProgress("queued", []).progressPct).toBe(0);
  });

  it("polls active builds faster and caps retry backoff", () => {
    expect(pollingDelayMs(0, "in_progress")).toBe(15_000);
    expect(pollingDelayMs(1, "unknown")).toBe(5_000);
    expect(pollingDelayMs(20, "unknown")).toBe(30_000);
  });
});
