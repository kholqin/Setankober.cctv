import { useMemo } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { ScreenContainer } from "@/components/screen-container";
import { useCctv } from "@/lib/cctv-context";
import { useColors } from "@/hooks/use-colors";
import { AlertBanner } from "@/components/ui/alert-banner";

export default function CameraViewerScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cameras, storageError, clearStorageError } = useCctv();
  const camera = cameras.find((item) => item.id === id);
  const source = camera?.url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const player = useVideoPlayer(source, (instance) => { instance.loop = true; });
  const status = player.status;
  const error = status === "error";
  const isDemoSource = useMemo(() => !camera, [camera]);
  if (!camera) return <ScreenContainer className="px-5 pt-4"><Text className="text-2xl font-bold text-foreground">Kamera tidak ditemukan</Text><Text className="mt-2 text-sm text-muted">Kembali ke tab Kamera dan pilih aset yang tersimpan.</Text><Pressable onPress={() => router.back()} style={[styles.button, { backgroundColor: colors.primary }]}><Text style={styles.buttonText}>Kembali</Text></Pressable></ScreenContainer>;
  return <ScreenContainer className="px-5 pt-4">{storageError && <AlertBanner title="DATA LOKAL BERMASALAH" message={storageError} tone="warning" colors={colors} onDismiss={clearStorageError} />}{error && <AlertBanner title="STREAM GAGAL DIMUAT" message="Pemutar tidak dapat membuka sumber stream. Periksa URL privat, koneksi jaringan, dan dukungan RTSP perangkat." tone="error" colors={colors} />}<View className="flex-row items-center justify-between"><View><Text className="text-3xl font-bold text-foreground">{camera.name}</Text><Text className="mt-1 text-xs text-muted">{camera.url}</Text></View><View style={[styles.liveDot, { backgroundColor: status === "readyToPlay" ? colors.success : colors.warning }]} /></View><View style={[styles.viewer, { borderColor: colors.border, backgroundColor: "#000" }]}><VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture contentFit="contain" /></View><View style={[styles.banner, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text className="text-sm font-semibold text-foreground">{isDemoSource ? "Mode demo" : "Stream aset berizin"}</Text><Text className="mt-1 text-xs leading-5 text-muted">Status: {error ? "gagal memuat" : status}. Jika RTSP tidak didukung oleh perangkat, gunakan pemutar RTSP eksternal tepercaya pada jaringan Anda.</Text></View><View className="mt-4 flex-row gap-3"><Pressable onPress={() => player.play()} style={[styles.button, { backgroundColor: colors.primary }]}><Text style={styles.buttonText}>Putar</Text></Pressable><Pressable onPress={() => player.pause()} style={[styles.outline, { borderColor: colors.border }]}><Text style={{ color: colors.foreground, fontWeight: "800" }}>Berhenti</Text></Pressable><Pressable onPress={() => Alert.alert("Koneksi", `Status player: ${status}`)} style={[styles.outline, { borderColor: colors.border }]}><Text style={{ color: colors.foreground, fontWeight: "800" }}>Status</Text></Pressable></View></ScreenContainer>;
}
const styles = StyleSheet.create({ viewer: { marginTop: 20, height: 230, borderWidth: 1, borderRadius: 20, overflow: "hidden" }, video: { width: "100%", height: "100%" }, liveDot: { width: 12, height: 12, borderRadius: 6 }, banner: { marginTop: 14, borderWidth: 1, borderRadius: 16, padding: 14 }, button: { minHeight: 44, flex: 1, borderRadius: 13, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 }, buttonText: { color: "#06120F", fontWeight: "800" }, outline: { minHeight: 44, flex: 1, borderWidth: 1, borderRadius: 13, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 } });
