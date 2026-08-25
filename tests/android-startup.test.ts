import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const gradle = readFileSync("android/app/build.gradle", "utf8");
const application = readFileSync(
  "android/app/src/main/java/com/app/setankobercctv/MainApplication.kt",
  "utf8",
);

describe("standalone Android startup configuration", () => {
  it("embeds the JavaScript bundle for the debug APK", () => {
    expect(gradle).toContain("debuggableVariants = []");
  });

  it("does not wait for a Metro development server", () => {
    expect(application).toContain("override fun getUseDeveloperSupport(): Boolean = false");
  });
});
