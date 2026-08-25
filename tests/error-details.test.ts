import { describe, expect, it } from "vitest";
import { buildTechnicalDetails, sanitizeTechnicalText } from "../lib/error-details";

describe("safe technical error details", () => {
  it("redacts URLs and credential-shaped values", () => {
    const result = sanitizeTechnicalText("rtsp://user:password@192.168.1.20:554/live token=abc123");
    expect(result).not.toContain("rtsp://");
    expect(result).not.toContain("192.168.1.20");
    expect(result).not.toContain("password");
    expect(result).toContain("[URL disamarkan]");
    expect(result).toContain("[REDACTED]");
  });

  it("includes safe context while excluding sensitive URL content", () => {
    const result = buildTechnicalDetails({
      source: "camera-viewer",
      title: "STREAM GAGAL DIMUAT",
      message: "Gagal membuka rtsp://admin:secret@10.0.0.8/stream",
      status: "error",
    });
    expect(result).toContain("source=camera-viewer");
    expect(result).toContain("status=error");
    expect(result).not.toContain("rtsp://");
    expect(result).not.toContain("10.0.0.8");
  });
});
