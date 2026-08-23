import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarButton: HapticTab, tabBarStyle: { paddingTop: 8, paddingBottom: bottomPadding, height: 56 + bottomPadding, backgroundColor: colors.background, borderTopColor: colors.border, borderTopWidth: 0.5 } }}><Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} /> }} /><Tabs.Screen name="devices" options={{ title: "Devices", tabBarIcon: ({ color }) => <IconSymbol size={24} name="shield.fill" color={color} /> }} /><Tabs.Screen name="cameras" options={{ title: "Cameras", tabBarIcon: ({ color }) => <IconSymbol size={24} name="video.fill" color={color} /> }} /><Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape.fill" color={color} /> }} /></Tabs>;
}
