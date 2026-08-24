
import { useEffect, useRef, useState } from "react";
import { Alert, ActivityIndicator, Animated, Easing, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useCctv } from "@/lib/cctv-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { scanAuthorizedNetwork, type ScanResult } from "@/lib/network-scan";
import { fetchLatestBuildStatus, pollingDelayMs, type BuildStatus } from "@/lib/github-actions";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { cameras, audits, authorized, setAuthorized, addAudit } = useCctv();
  const scope = "Jaringan privat perangkat ini";
  const posture = !authorized ? { label: "LOCKED", copy: "Aktifkan otorisasi sebelum audit atau menambah kamera.", color: colors.warning } : cameras.length === 0 ? { label: "READY / NO ASSETS", copy: "Workspace aman, tetapi belum ada kamera berizin yang terdaftar.", color: colors.primary } : { label: "MONITORED", copy: `${cameras.length} kamera terdaftar · ${audits.length} catatan audit lokal.`, color: colors.success };
  const [cidr, setCidr] = useState("192.168.1.0/29");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const scanRun = useRef(0);
  const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [buildAttempt, setBuildAttempt] = useState(0);
  const [buildRefreshKey, setBuildRefreshKey] = useState(0);
  const buildPulse = useRef(new Animated.Value(0)).current;
  const buildIsActive = (!buildStatus && !buildError) || buildStatus?.state === "queued" || buildStatus?.state === "in_progress" || (!!buildError && buildAttempt < 3);

  useEffect(() => {
    if (!buildIsActive) { buildPulse.stopAnimation(); buildPulse.setValue(0); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(buildPulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(buildPulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [buildIsActive, buildPulse]);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    const load = async (attempt: number) => {
      setBuildAttempt(attempt);
      try {
        const next = await fetchLatestBuildStatus(controller.signal);
        if (stopped) return;
        setBuildStatus(next);
        setBuildError(null);
        if (next.state === "queued" || next.state === "in_progress") timer = setTimeout(() => load(0), pollingDelayMs(0, next.state));
      } catch (error) {
        if (stopped || controller.signal.aborted) return;
        setBuildError(error instanceof Error ? error.message : "Status build tidak dapat dibaca.");
        if (attempt < 3) timer = setTimeout(() => load(attempt + 1), pollingDelayMs(attempt + 1, "unknown"));
      }
    };
    load(0);
    return () => { stopped = true; controller.abort(); if (timer) clearTimeout(timer); };
  }, [buildRefreshKey]);

  const pulseScale = buildPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.45] });
  const pulseOpacity = buildPulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });
  const sweepX = buildPulse.interpolate({ inputRange: [0, 1], outputRange: [-80, 190] });

  const refreshBuildStatus = () => { setBuildStatus(null); setBuildError(null); setBuildRefreshKey((value) => value + 1); };
  const openBuildLog = async () => { if (buildStatus?.url) await Linking.openURL(buildStatus.url); };

  const runScan = async () => {
    if (!authorized) { Alert.alert("Scan dikunci", "Aktifkan otorisasi untuk jaringan privat Anda terlebih dahulu."); return; }
    scanRun.current += 1;
    const runId = scanRun.current;
    try {
      setScanState("scanning"); setScanResults([]); setProgress({ completed: 0, total: 0 });
      const results = await scanAuthorizedNetwork(cidr, (completed, total) => { if (runId === scanRun.current) setProgress({ completed, total }); });
      if (runId === scanRun.current) { setScanResults(results.filter((item) => item.status === "online")); setScanState("done"); await addAudit(`Scan lokal ${cidr}`); }
    } catch (error) { setScanState("idle"); Alert.alert("Scope tidak valid", error instanceof Error ? error.message : "Masukkan CIDR privat yang valid."); }
  };

  const cancelScan = () => { scanRun.current += 1; setScanState("idle"); setProgress({ completed: 0, total: 0 }); };

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

        <View style={[styles.postureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View className="flex-row items-center justify-between"><Text style={[styles.eyebrow, { color: posture.color }]}>SECURITY POSTURE</Text><Text style={{ color: posture.color, fontSize: 11, fontWeight: "800" }}>{posture.label}</Text></View><Text style={{ color: colors.muted, marginTop: 8, fontSize: 12, lineHeight: 18 }}>{posture.copy}</Text></View>

        <View style={[styles.buildCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View className="flex-row items-center justify-between"><View><Text style={[styles.eyebrow, { color: colors.primary }]}>BUILD MONITOR</Text><Text className="mt-1 text-base font-bold text-foreground">Android APK pipeline</Text></View><Text style={{ color: buildStatus ? buildStateColor(buildStatus.state, colors) : colors.muted, fontSize: 11, fontWeight: "800" }}>{buildStatus?.label ?? (buildError ? "ERROR" : "CHECKING")}</Text></View><View style={styles.buildActivity}><Animated.View style={[styles.signalPulse, { backgroundColor: colors.primary, opacity: pulseOpacity, transform: [{ scale: pulseScale }] }]} /><View style={[styles.signalTrack, { backgroundColor: colors.border }]}><Animated.View style={[styles.signalSweep, { backgroundColor: colors.primary, transform: [{ translateX: sweepX }] }]} /></View><Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700" }}>{buildIsActive ? "SYNCING BUILD TELEMETRY" : "BUILD TELEMETRY STABLE"}</Text></View><Text style={{ color: colors.muted, marginTop: 8, fontSize: 12, lineHeight: 18 }}>{buildStatus ? `Run #${buildStatus.runNumber ?? "—"} · branch ${buildStatus.branch ?? "—"}${buildStatus.state === "in_progress" || buildStatus.state === "queued" ? " · polling otomatis 15 detik" : ""}` : buildError ? `${buildError} · retry ${buildAttempt}/3` : "Membaca status workflow GitHub Actions publik…"}</Text><View className="mt-3 flex-row gap-2"><Pressable onPress={refreshBuildStatus} style={({ pressed }) => [styles.refreshButton, { borderColor: colors.primary }, pressed && styles.pressed]}><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>{buildError ? "Retry status" : "Perbarui status"}</Text></Pressable><Pressable disabled={!buildStatus?.url} onPress={openBuildLog} style={({ pressed }) => [styles.refreshButton, { borderColor: buildStatus?.url ? colors.border : colors.border, opacity: buildStatus?.url ? 1 : 0.45 }, pressed && styles.pressed]}><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 12 }}>Lihat log</Text></Pressable></View></View>

        <View style={[styles.scanCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View className="flex-row items-center justify-between"><View><Text style={[styles.eyebrow, { color: colors.primary }]}>LOCAL DISCOVERY</Text><Text className="mt-1 text-base font-bold text-foreground">Scan jaringan berizin</Text></View>{scanState === "scanning" ? <ActivityIndicator color={colors.primary} /> : <Text style={{ color: colors.muted, fontSize: 11 }}>{scanResults.length} online</Text>}</View>
          <TextInput value={cidr} onChangeText={setCidr} editable={scanState !== "scanning"} autoCapitalize="none" autoCorrect={false} placeholder="192.168.1.0/29" placeholderTextColor={colors.muted} style={[styles.cidrInput, { borderColor: colors.border, color: colors.foreground }]} />
          {scanState === "scanning" && <Text className="mt-2 text-xs text-muted">Memeriksa {progress.completed}/{progress.total} endpoint aman. Concurrency dibatasi 4 dan timeout 700 ms.</Text>}
          <View className="mt-3 flex-row gap-2"><Pressable onPress={scanState === "scanning" ? cancelScan : runScan} style={({ pressed }) => [styles.scanButton, { backgroundColor: scanState === "scanning" ? colors.warning : colors.primary }, pressed && styles.pressed]}><Text style={styles.primaryButtonText}>{scanState === "scanning" ? "Batalkan scan" : "Scan jaringan privat"}</Text></Pressable></View>
          {scanState === "done" && <><Text className="mt-2 text-xs text-muted">Selesai. Hanya host privat dan port HTTP terbatas yang diperiksa; tidak ada kredensial yang dicoba.</Text><View className="mt-2 gap-1">{scanResults.slice(0, 6).map((item) => <Text key={`${item.host}:${item.port}`} className="text-xs text-foreground">● {item.host}:{item.port} · {item.latencyMs ?? 0} ms</Text>)}</View></>}
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

function buildStateColor(state: BuildStatus["state"], colors: ReturnType<typeof useColors>) { return state === "success" ? colors.success : state === "failure" || state === "cancelled" ? colors.error : state === "queued" || state === "in_progress" ? colors.warning : colors.muted; }

function Metric({ label, value, icon, colors }: { label: string; value: string; icon: string; colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.metricIcon, { color: colors.primary }]}>{icon}</Text><Text className="mt-2 text-xl font-bold text-foreground">{value}</Text><Text className="mt-1 text-xs text-muted">{label}</Text></View>;
}

function ActionCard({ title, subtitle, button, onPress, colors }: { title: string; subtitle: string; button: string; onPress: () => void; colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View className="flex-1 pr-3"><Text className="text-base font-semibold text-foreground">{title}</Text><Text className="mt-1 text-xs leading-4 text-muted">{subtitle}</Text></View><Pressable onPress={onPress} style={({ pressed }) => [styles.smallButton, { borderColor: colors.primary }, pressed && styles.pressed]}><Text style={[styles.smallButtonText, { color: colors.primary }]}>{button}</Text></Pressable></View>;
}

const styles = StyleSheet.create({ buildActivity: { marginTop: 14, flexDirection: "row", alignItems: "center", gap: 8, overflow: "hidden" }, signalPulse: { width: 8, height: 8, borderRadius: 4 }, signalTrack: { width: 118, height: 4, borderRadius: 2, overflow: "hidden" }, signalSweep: { width: 44, height: 4, borderRadius: 2 }, buildCard: { marginTop: 14, borderWidth: 1, borderRadius: 18, padding: 16 }, refreshButton: { flex: 1, marginTop: 12, minHeight: 38, borderWidth: 1, borderRadius: 11, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }, postureCard: { marginTop: 14, borderWidth: 1, borderRadius: 18, padding: 16 }, content: { paddingBottom: 32, width: "100%", maxWidth: 760, alignSelf: "center" }, scanCard: { marginTop: 16, borderWidth: 1, borderRadius: 20, padding: 16 }, cidrInput: { marginTop: 14, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 13 }, scanButton: { minHeight: 44, flex: 1, borderRadius: 13, alignItems: "center", justifyContent: "center" }, statusDot: { width: 12, height: 12, borderRadius: 6 }, hero: { marginTop: 22, borderWidth: 1, borderRadius: 24, padding: 20 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 }, metric: { flex: 1, marginTop: 14, borderWidth: 1, borderRadius: 18, padding: 14 }, metricIcon: { fontSize: 10, fontWeight: "800", letterSpacing: 1 }, primaryButton: { flex: 1, minHeight: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 }, primaryButtonText: { color: "#06120F", fontWeight: "800", fontSize: 13 }, secondaryButton: { flex: 1, minHeight: 48, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 }, secondaryButtonText: { fontWeight: "700", fontSize: 13 }, actionCard: { minHeight: 86, borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center" }, smallButton: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 }, smallButtonText: { fontWeight: "800", fontSize: 11 }, pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] } });
