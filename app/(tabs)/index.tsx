
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useCctv } from "@/lib/cctv-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { cameras, audits, authorized, setAuthorized, addAudit } = useCctv();
  const scope = "Jaringan privat perangkat ini";

  const runAudit = async () => {
    await addAudit(scope);
    if (!authorized) {
      Alert.alert("Audit diblokir", "Aktifkan konfirmasi otorisasi terlebih dahulu. Aplikasi tidak memindai internet publik atau mencoba kredensial.");
      return;
    }
    Alert.alert("Audit siap", "Sesi audit tercatat. Tambahkan kamera milik Anda pada tab Kamera untuk menguji koneksi secara eksplisit.");
  };

  return (
    <ScreenContainer className="px-5 pt-4" containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-muted">SECURITY CONSOLE</Text>
            <Text className="mt-1 text-3xl font-bold text-foreground">Setankober.cctv</Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: authorized ? colors.success : colors.warning }]} />
        </View>

        <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>MODE DEFENSIF</Text>
          <Text className="mt-2 text-xl font-bold text-foreground">Pantau aset Anda, bukan milik orang lain.</Text>
          <Text className="mt-2 text-sm leading-5 text-muted">Audit terbatas untuk jaringan privat yang Anda miliki atau telah diberi izin. Tidak ada brute force, bypass, atau eksploitasi.</Text>
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-1 pr-3"><Text className="text-sm font-semibold text-foreground">Saya memiliki otorisasi</Text><Text className="mt-1 text-xs text-muted">Wajib sebelum audit atau menambah kamera.</Text></View>
            <Switch value={authorized} onValueChange={setAuthorized} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.foreground} />
          </View>
        </View>

        <View className="flex-row gap-3">
          <Metric label="Kamera" value={String(cameras.length)} icon="CAM" colors={colors} />
          <Metric label="Audit" value={String(audits.length)} icon="LOG" colors={colors} />
          <Metric label="Status" value={authorized ? "Siap" : "Kunci"} icon="SAFE" colors={colors} />
        </View>

        <View className="mt-2 flex-row gap-3">
          <Pressable style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]} onPress={runAudit}>
            <Text style={styles.primaryButtonText}>Mulai audit berizin</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.secondaryButton, { borderColor: colors.border }, pressed && styles.pressed]} onPress={() => router.push("/(tabs)/cameras" as any)}>
            <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>Tambah kamera</Text>
          </Pressable>
        </View>

        <Text className="mt-6 text-lg font-bold text-foreground">Quick actions</Text>
        <View className="mt-3 gap-3">
          <ActionCard title="Perangkat terdaftar" subtitle="Tinjau aset dan status konektivitas." button="Buka perangkat" onPress={() => router.push("/(tabs)/devices" as any)} colors={colors} />
          <ActionCard title="Audit log" subtitle="Riwayat pemeriksaan tersimpan lokal." button="Lihat log" onPress={() => router.push("/(tabs)/settings" as any)} colors={colors} />
        </View>

        <Text className="mt-6 text-xs leading-5 text-muted">Privasi: metadata kamera dan audit disimpan lokal di perangkat. URL harus mengarah ke host privat seperti 192.168.x.x, 10.x.x.x, 172.16–31.x.x, atau localhost.</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

function Metric({ label, value, icon, colors }: { label: string; value: string; icon: string; colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.metricIcon, { color: colors.primary }]}>{icon}</Text><Text className="mt-2 text-xl font-bold text-foreground">{value}</Text><Text className="mt-1 text-xs text-muted">{label}</Text></View>;
}

function ActionCard({ title, subtitle, button, onPress, colors }: { title: string; subtitle: string; button: string; onPress: () => void; colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View className="flex-1 pr-3"><Text className="text-base font-semibold text-foreground">{title}</Text><Text className="mt-1 text-xs leading-4 text-muted">{subtitle}</Text></View><Pressable onPress={onPress} style={({ pressed }) => [styles.smallButton, { borderColor: colors.primary }, pressed && styles.pressed]}><Text style={[styles.smallButtonText, { color: colors.primary }]}>{button}</Text></Pressable></View>;
}

const styles = StyleSheet.create({ content: { paddingBottom: 32 }, statusDot: { width: 12, height: 12, borderRadius: 6 }, hero: { marginTop: 22, borderWidth: 1, borderRadius: 24, padding: 20 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 }, metric: { flex: 1, marginTop: 14, borderWidth: 1, borderRadius: 18, padding: 14 }, metricIcon: { fontSize: 10, fontWeight: "800", letterSpacing: 1 }, primaryButton: { flex: 1, minHeight: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 }, primaryButtonText: { color: "#06120F", fontWeight: "800", fontSize: 13 }, secondaryButton: { flex: 1, minHeight: 48, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 }, secondaryButtonText: { fontWeight: "700", fontSize: 13 }, actionCard: { minHeight: 86, borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center" }, smallButton: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 }, smallButtonText: { fontWeight: "800", fontSize: 11 }, pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] } });
