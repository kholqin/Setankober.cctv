import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ThemeColorPalette } from "@/constants/theme";

type AlertTone = "error" | "warning" | "info" | "success";

type AlertBannerProps = {
  title: string;
  message: string;
  tone?: AlertTone;
  colors: ThemeColorPalette;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
};

export function AlertBanner({
  title,
  message,
  tone = "error",
  colors,
  actionLabel,
  onAction,
  onDismiss,
}: AlertBannerProps) {
  const toneColor = tone === "error" ? colors.error : tone === "warning" ? colors.warning : tone === "success" ? colors.success : colors.primary;
  return (
    <View style={[styles.container, { backgroundColor: `${toneColor}16`, borderColor: `${toneColor}70` }]} accessibilityRole="alert">
      <View style={[styles.indicator, { backgroundColor: toneColor }]} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: toneColor }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.foreground }]}>{message}</Text>
        {(actionLabel || onDismiss) && (
          <View style={styles.actions}>
            {actionLabel && onAction && (
              <Pressable onPress={onAction} style={({ pressed }) => [styles.action, { borderColor: toneColor }, pressed && styles.pressed]}>
                <Text style={[styles.actionText, { color: toneColor }]}>{actionLabel}</Text>
              </Pressable>
            )}
            {onDismiss && (
              <Pressable onPress={onDismiss} style={({ pressed }) => [styles.dismiss, pressed && styles.pressed]} accessibilityLabel="Tutup notifikasi">
                <Text style={[styles.dismissText, { color: colors.muted }]}>Tutup</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", borderWidth: 1, borderRadius: 16, padding: 12, gap: 10 },
  indicator: { width: 4, borderRadius: 4 },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 12, fontWeight: "900", letterSpacing: 0.7 },
  message: { fontSize: 12, lineHeight: 18 },
  actions: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6 },
  action: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7 },
  actionText: { fontSize: 11, fontWeight: "900" },
  dismiss: { paddingVertical: 7, paddingHorizontal: 4 },
  dismissText: { fontSize: 11, fontWeight: "700" },
  pressed: { opacity: 0.65 },
});
