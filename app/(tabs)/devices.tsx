import { FlatList, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useCctv } from "@/lib/cctv-context";
import { useColors } from "@/hooks/use-colors";

export default function DevicesScreen() {
  const colors = useColors();
  const { cameras, audits } = useCctv();
  return <ScreenContainer className="px-5 pt-4"><Text className="text-3xl font-bold text-foreground">Perangkat</Text><Text className="mt-2 text-sm leading-5 text-muted">Daftar aset kamera yang Anda tambahkan secara eksplisit. Hasil audit jaringan tidak mengakses atau menebak kredensial.</Text><View className="mt-5"><Text className="text-sm font-bold text-foreground">Kamera terdaftar</Text><FlatList data={cameras} keyExtractor={(item) => item.id} contentContainerStyle={{ gap: 10, paddingTop: 12, paddingBottom: 28 }} ListEmptyComponent={<View style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 18 }}><Text className="text-sm font-semibold text-foreground">Belum ada perangkat</Text><Text className="mt-1 text-xs leading-5 text-muted">Tambahkan kamera pada tab Kamera untuk memulai pemantauan berizin.</Text></View>} renderItem={({ item }) => <View style={{ borderColor: colors.border, backgroundColor: colors.surface, borderWidth: 1, borderRadius: 18, padding: 16 }}><View className="flex-row items-center justify-between"><Text className="text-base font-semibold text-foreground">{item.name}</Text><Text style={{ color: colors.success, fontSize: 11, fontWeight: "800" }}>{item.lastStatus.toUpperCase()}</Text></View><Text className="mt-2 text-xs text-muted">{item.url}</Text><Text className="mt-1 text-xs text-muted">{item.location || "Lokasi belum diatur"}</Text></View>} /><Text className="text-sm font-bold text-foreground">Audit terakhir</Text><Text className="mt-2 text-xs text-muted">{audits[0]?.note || "Belum ada audit tercatat."}</Text></View></ScreenContainer>;
}
