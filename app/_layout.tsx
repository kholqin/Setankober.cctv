import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ThemeProvider } from "@/lib/theme-provider";
import { CctvProvider } from "@/lib/cctv-context";

// Keep the native splash visible only until the first React tree is mounted.
// The fallback prevents a failed optional provider/storage operation from leaving the app on the logo forever.
void SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 220, fade: true });

export default function RootLayout() {
  useEffect(() => {
    const hide = () => {
      void SplashScreen.hideAsync().catch(() => undefined);
    };
    const readyTimer = setTimeout(hide, 180);
    const fallbackTimer = setTimeout(hide, 1800);
    return () => {
      clearTimeout(readyTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return <ThemeProvider><CctvProvider><StatusBar style="light" /><Stack screenOptions={{ headerShown: false }} /></CctvProvider></ThemeProvider>;
}
