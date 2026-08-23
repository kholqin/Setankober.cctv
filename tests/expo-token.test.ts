import { describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

describe("EXPO_TOKEN", () => {
  it.skipIf(!process.env.EXPO_TOKEN)("authenticates through the official EAS API client when configured", async () => {
    const token = process.env.EXPO_TOKEN;
    expect(token, "EXPO_TOKEN belum tersedia").toBeTruthy();
    const { stdout } = await execFileAsync("pnpm", ["dlx", "eas-cli@latest", "whoami"], {
      env: { ...process.env, EXPO_TOKEN: token, CI: "1" },
      timeout: 20_000,
    });
    expect(stdout).toContain("authenticated using EXPO_TOKEN");
  }, 30_000);
});
