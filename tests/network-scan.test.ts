import { describe, expect, it } from "vitest";
import { expandAuthorizedCidr } from "../lib/network-scan";

describe("authorized network scan scope", () => {
  it("expands a small private CIDR", () => {
    expect(expandAuthorizedCidr("192.168.1.0/30")).toEqual(["192.168.1.1", "192.168.1.2"]);
  });

  it("rejects public networks and oversized ranges", () => {
    expect(() => expandAuthorizedCidr("8.8.8.0/29")).toThrow();
    expect(() => expandAuthorizedCidr("10.0.0.0/16")).toThrow();
    expect(() => expandAuthorizedCidr("192.168.1.0/23")).toThrow();
  });
});
