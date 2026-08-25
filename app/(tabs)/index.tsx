
import { useEffect, useRef, useState } from "react";
import { Alert, ActivityIndicator, Animated, Easing, FlatList, Linking, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useCctv } from "@/lib/cctv-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { scanAuthorizedNetwork, type ScanResult } from "@/lib/network-scan";
import { fetchLatestBuildStatus, pollingDelayMs, type BuildStatus } from "@/lib/github-actions";
import { AlertBanner } from "@/components/ui/alert-banner";
import { buildTechnicalDetails } from "@/lib/error-details";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { cameras, audits, authorized, setAuthorized, addAudit, storageError, clearStorageError } = useCctv();
  const scope = "Jaringan privat perangkat ini";
  const posture = !authorized ? { label: "LOCKED", copy: "Aktifkan otorisasi sebelum audit atau menambah kamera.", color: colors.warning } : cameras.length === 0 ? { label: "READY / NO ASSETS", copy: "Workspace aman, tetapi belum ada kamera berizin yang terdaftar.", color: colors.primary } : { label: "MONITORED", copy: `${cameras.length} kamera terdaftar · ${audits.length} catatan audit lokal.`, color: colors.success };
  const [cidr, setCidr] = useState("192.168.1.0/29");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const scanRun = useRef(0);
  const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [buildAttempt, setBuildAttempt] = useState(0);
  const [buildRefreshKey, setBuildRefreshKey] = useState(0);
  const [jobDetailsVisible, setJobDetailsVisible] = useState(false);
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
      setScanState("scanning"); setScanError(null); setScanResults([]); setProgress({ completed: 0, total: 0 });
      const results = await scanAuthorizedNetwork(cidr, (completed, total) => { if (runId === scanRun.current) setProgress({ completed, total }); });
      if (runId === scanRun.current) { setScanResults(results.filter((item) => item.status === "online")); setScanState("done"); await addAudit(`Scan lokal ${cidr}`); }
    } catch (error) { const message = error instanceof Error ? error.message : "Masukkan CIDR privat yang valid."; setScanState("idle"); setScanError(message); Alert.alert("Scan tidak dapat dijalankan", message); }
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
        {storageError && <AlertBanner title="DATA LOKAL BERMASALAH" message={storageError} tone="warning" colors={colors} technicalDetails={buildTechnicalDetails({ source: "local-storage", title: "DATA LOKAL BERMASALAH", message: storageError })} onDismiss={clearStorageError} />}
        {buildError && <AlertBanner title="BUILD TIDAK DAPAT DIMUAT" message={`${buildError} Periksa koneksi internet lalu coba lagi.`} tone="error" colors={colors} technicalDetails={buildTechnicalDetails({ source: "github-actions", title: "BUILD TIDAK DAPAT DIMUAT", message: buildError, attempt: buildAttempt })} actionLabel="Coba lagi" onAction={refreshBuildStatus} />}
        {scanError && <AlertBanner title="SCAN GAGAL" message={scanError} tone="error" colors={colors} technicalDetails={buildTechnicalDetails({ source: "authorized-local-scan", title: "SCAN GAGAL", message: scanError })} onDismiss={() => setScanError(null)} />}

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

        <View style={[styles.buildCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View className="flex-row items-center justify-between"><View><Text style={[styles.eyebrow, { color: colors.primary }]}>BUILD MONITOR</Text><Text className="mt-1 text-base font-bold text-foreground">Android APK pipeline</Text></View><Text style={{ color: buildStatus ? buildStateColor(buildStatus.state, colors) : colors.muted, fontSize: 11, fontWeight: "800" }}>{buildStatus?.label ?? (buildError ? "ERROR" : "CHECKING")}</Text></View><View style={styles.buildActivity}><Animated.View style={[styles.signalPulse, { backgroundColor: colors.primary, opacity: pulseOpacity, transform: [{ scale: pulseScale }] }]} /><View style={[styles.signalTrack, { backgroundColor: colors.border }]}><Animated.View style={[styles.signalSweep, { backgroundColor: colors.primary, transform: [{ translateX: sweepX }] }]} /></View><Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700" }}>{buildIsActive ? "SYNCING BUILD TELEMETRY" : "BUILD TELEMETRY STABLE"}</Text></View><View style={styles.progressHeader}><Text style={[styles.progressLabel, { color: colors.muted }]}>WORKFLOW PROGRESS</Text><Text style={[styles.progressValue, { color: buildStatus ? buildStateColor(buildStatus.state, colors) : colors.primary }]}>{buildStatus?.progressPct ?? 0}%</Text></View><View style={[styles.progressTrack, { backgroundColor: colors.border }]}><View style={[styles.progressFill, { width: `${buildStatus?.progressPct ?? 0}%`, backgroundColor: buildStatus ? buildStateColor(buildStatus.state, colors) : colors.primary }]} /></View><Text style={{ color: colors.muted, marginTop: 6, fontSize: 11 }}>{buildStatus?.currentStep ? `Aktif: ${buildStatus.currentStep}` : `${buildStatus?.completedSteps ?? 0}/${buildStatus?.totalSteps ?? 0} langkah selesai`}</Text><Text style={{ color: colors.muted, marginTop: 8, fontSize: 12, lineHeight: 18 }}>{buildStatus ? `Run #${buildStatus.runNumber ?? "—"} · branch ${buildStatus.branch ?? "—"}${buildStatus.state === "in_progress" || buildStatus.state === "queued" ? " · polling otomatis 15 detik" : ""}` : buildError ? `${buildError} · retry ${buildAttempt}/3` : "Membaca status workflow GitHub Actions publik…"}</Text><View className="mt-3 flex-row gap-2"><Pressable onPress={refreshBuildStatus} style={({ pressed }) => [styles.refreshButton, { borderColor: colors.primary }, pressed && styles.pressed]}><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>{buildError ? "Retry status" : "Perbarui status"}</Text></Pressable><Pressable disabled={!buildStatus?.url} onPress={openBuildLog} style={({ pressed }) => [styles.refreshButton, { borderColor: colors.border, opacity: buildStatus?.url ? 1 : 0.45 }, pressed && styles.pressed]}><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 12 }}>Lihat log</Text></Pressable><Pressable disabled={!buildStatus?.jobs.length} onPress={() => setJobDetailsVisible(true)} style={({ pressed }) => [styles.refreshButton, { borderColor: colors.primary, opacity: buildStatus?.jobs.length ? 1 : 0.45 }, pressed && styles.pressed]}><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>Detail job</Text></Pressable></View></View>

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
      <Modal visible={jobDetailsVisible} transparent animationType="slide" onRequestClose={() => setJobDetailsVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.jobSheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderCopy}>
                <Text style={[styles.eyebrow, { color: colors.primary }]}>JOB TELEMETRY</Text>
                <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "900", marginTop: 5 }}>Detail workflow</Text>
                <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4 }}>Ringkasan langkah dari job publik. Secret dan isi credential tidak ditampilkan.</Text>
              </View>
              <Pressable onPress={() => setJobDetailsVisible(false)} style={({ pressed }) => [styles.closeButton, { borderColor: colors.border }, pressed && styles.pressed]}><Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>×</Text></Pressable>
            </View>
            <FlatList
              data={buildStatus?.jobs ?? []}
              keyExtractor={(job) => String(job.id)}
              contentContainerStyle={styles.jobList}
              ListEmptyComponent={<Text style={{ color: colors.muted, textAlign: "center", paddingVertical: 32 }}>Belum ada detail job yang tersedia.</Text>}
              renderItem={({ item: job }) => (
                <View style={[styles.jobCard, { borderColor: colors.border }]}>
                  <View style={styles.jobTitleRow}><Text style={{ flex: 1, color: colors.foreground, fontWeight: "800", fontSize: 14 }}>{job.name}</Text><Text style={{ color: buildStateColor(job.conclusion === "success" ? "success" : job.status === "in_progress" ? "in_progress" : job.conclusion === "failure" ? "failure" : "unknown", colors), fontSize: 10, fontWeight: "900" }}>{job.conclusion ?? job.status}</Text></View>
                  <View style={[styles.jobProgressTrack, { backgroundColor: colors.border }]}><View style={[styles.jobProgressFill, { width: `${job.progressPct}%`, backgroundColor: buildStateColor(job.conclusion === "success" ? "success" : job.status === "in_progress" ? "in_progress" : job.conclusion === "failure" ? "failure" : "unknown", colors) }]} /></View>
                  <Text style={{ color: colors.muted, fontSize: 11, marginTop: 6 }}>{job.completedSteps}/{job.totalSteps} langkah · {job.progressPct}%{job.currentStep ? ` · aktif: ${job.currentStep}` : ""}</Text>
                  <View style={styles.stepList}>{job.steps.map((step, index) => <View key={`${job.id}-${index}`} style={styles.stepRow}><Text style={{ color: step.status === "completed" ? colors.success : step.status === "in_progress" ? colors.warning : colors.muted, fontSize: 12, width: 18 }}>{step.status === "completed" ? "✓" : step.status === "in_progress" ? "›" : "·"}</Text><Text style={{ flex: 1, color: colors.foreground, fontSize: 12 }} numberOfLines={2}>{step.name}</Text><Text style={{ color: colors.muted, fontSize: 10 }}>{step.conclusion ?? step.status}</Text></View>)}</View>
                  {job.htmlUrl && <Pressable onPress={() => Linking.openURL(job.htmlUrl!)} style={({ pressed }) => [styles.jobLogButton, { borderColor: colors.border }, pressed && styles.pressed]}><Text style={{ color: colors.primary, fontSize: 11, fontWeight: "800" }}>Buka log lengkap GitHub</Text></Pressable>}
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
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

const styles = StyleSheet.create({ progressHeader: { marginTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, progressLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.1 }, progressValue: { fontSize: 16, fontWeight: "900" }, progressTrack: { marginTop: 8, height: 7, borderRadius: 4, overflow: "hidden" }, progressFill: { height: 7, borderRadius: 4, minWidth: 0 }, buildActivity: { marginTop: 14, flexDirection: "row", alignItems: "center", gap: 8, overflow: "hidden" }, signalPulse: { width: 8, height: 8, borderRadius: 4 }, signalTrack: { width: 118, height: 4, borderRadius: 2, overflow: "hidden" }, signalSweep: { width: 44, height: 4, borderRadius: 2 }, buildCard: { marginTop: 14, borderWidth: 1, borderRadius: 18, padding: 16 }, refreshButton: { flex: 1, marginTop: 12, minHeight: 38, borderWidth: 1, borderRadius: 11, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }, postureCard: { marginTop: 14, borderWidth: 1, borderRadius: 18, padding: 16 }, content: { paddingBottom: 32, width: "100%", maxWidth: 760, alignSelf: "center" }, scanCard: { marginTop: 16, borderWidth: 1, borderRadius: 20, padding: 16 }, cidrInput: { marginTop: 14, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 13 }, scanButton: { minHeight: 44, flex: 1, borderRadius: 13, alignItems: "center", justifyContent: "center" }, statusDot: { width: 12, height: 12, borderRadius: 6 }, hero: { marginTop: 22, borderWidth: 1, borderRadius: 24, padding: 20 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 }, metric: { flex: 1, marginTop: 14, borderWidth: 1, borderRadius: 18, padding: 14 }, metricIcon: { fontSize: 10, fontWeight: "800", letterSpacing: 1 }, primaryButton: { flex: 1, minHeight: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 }, primaryButtonText: { color: "#06120F", fontWeight: "800", fontSize: 13 }, secondaryButton: { flex: 1, minHeight: 48, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 }, secondaryButtonText: { fontWeight: "700", fontSize: 13 }, actionCard: { minHeight: 86, borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center" }, modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.78)" }, jobSheet: { maxHeight: "88%", minHeight: 280, borderTopWidth: 1, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 18 }, sheetHandle: { alignSelf: "center", width: 42, height: 4, borderRadius: 3, backgroundColor: "#5D7074", marginBottom: 14 }, sheetHeader: { flexDirection: "row", alignItems: "flex-start" }, sheetHeaderCopy: { flex: 1, paddingRight: 12 }, closeButton: { width: 36, height: 36, borderWidth: 1, borderRadius: 18, alignItems: "center", justifyContent: "center" }, jobList: { paddingTop: 16, paddingBottom: 8, gap: 12 }, jobCard: { borderWidth: 1, borderRadius: 16, padding: 13 }, jobTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 }, jobProgressTrack: { height: 5, borderRadius: 3, overflow: "hidden", marginTop: 12 }, jobProgressFill: { height: 5, borderRadius: 3 }, stepList: { marginTop: 10, gap: 7 }, stepRow: { flexDirection: "row", alignItems: "center", minHeight: 20, gap: 3 }, jobLogButton: { marginTop: 12, minHeight: 34, borderWidth: 1, borderRadius: 10, alignItems: "center", justifyContent: "center" }, smallButton: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 }, smallButtonText: { fontWeight: "800", fontSize: 11 }, pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] } });
