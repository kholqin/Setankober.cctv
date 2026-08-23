import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/lib/theme-provider";
import { CctvProvider } from "@/lib/cctv-context";

export default function RootLayout() {
  return <ThemeProvider><CctvProvider><StatusBar style="light" /><Stack screenOptions={{ headerShown: false }} /></CctvProvider></ThemeProvider>;
}
