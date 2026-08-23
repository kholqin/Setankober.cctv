import { describe, expect, it } from "vitest";
import { isAuthorizedPrivateUrl } from "../lib/cctv-validation";

describe("isAuthorizedPrivateUrl", () => {
  it("accepts private RTSP and HTTPS hosts", () => {
    expect(isAuthorizedPrivateUrl("rtsp://192.168.1.20:554/stream")).toBe(true);
    expect(isAuthorizedPrivateUrl("https://10.0.0.12/camera")).toBe(true);
    expect(isAuthorizedPrivateUrl("http://172.16.0.4/status")).toBe(true);
  });

  it("rejects public hosts and unsupported schemes", () => {
    expect(isAuthorizedPrivateUrl("rtsp://8.8.8.8:554/stream")).toBe(false);
    expect(isAuthorizedPrivateUrl("ftp://192.168.1.20/file")).toBe(false);
    expect(isAuthorizedPrivateUrl("javascript:alert(1)")).toBe(false);
  });
});
