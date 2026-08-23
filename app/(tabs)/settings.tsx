import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useCctv } from "@/lib/cctv-context";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const colors = useColors();
  const { audits, setAuthorized } = useCctv();
  return <ScreenContainer className="px-5 pt-4"><ScrollView contentContainerStyle={{ paddingBottom: 32 }}><Text className="text-3xl font-bold text-foreground">Settings</Text><Text className="mt-2 text-sm leading-5 text-muted">Kontrol privasi, keselamatan, dan riwayat audit lokal.</Text><View className="mt-6 gap-3"><SettingCard title="Safety Center" description="Fitur dibatasi pada aset berizin. Tidak ada brute force, credential guessing, atau pemindaian internet publik." colors={colors} /><SettingCard title="Penyimpanan" description={`Riwayat audit tersimpan lokal. ${audits.length} catatan saat ini.`} colors={colors} /><SettingCard title="License" description="MIT License untuk kode aplikasi. Gunakan sesuai hukum dan kebijakan perangkat Anda." colors={colors} /></View><Pressable onPress={() => { setAuthorized(false); Alert.alert("Otorisasi dimatikan", "Audit dan penambahan kamera akan diblokir."); }} style={({ pressed }) => [styles.danger, { borderColor: colors.error }, pressed && { opacity: 0.72 }]}><Text style={{ color: colors.error, fontWeight: "800" }}>Matikan otorisasi</Text></Pressable><Text className="mt-6 text-xs leading-5 text-muted">Setankober.cctv 1.0.0 · Data kamera tidak disinkronkan ke cloud secara default.</Text></ScrollView></ScreenContainer>;
}
function SettingCard({ title, description, colors }: { title: string; description: string; colors: ReturnType<typeof useColors> }) { return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text className="text-base font-semibold text-foreground">{title}</Text><Text className="mt-2 text-xs leading-5 text-muted">{description}</Text></View>; }
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 18, padding: 16 }, danger: { marginTop: 20, minHeight: 46, borderWidth: 1, borderRadius: 14, alignItems: "center", justifyContent: "center" } });
