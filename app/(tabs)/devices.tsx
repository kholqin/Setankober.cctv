import { FlatList, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useCctv } from "@/lib/cctv-context";
import { useColors } from "@/hooks/use-colors";

export default function DevicesScreen() {
  const colors = useColors();
  const { cameras, audits } = useCctv();
  const title = { color: colors.foreground };
  const muted = { color: colors.muted };
  return <ScreenContainer className="px-5 pt-4" containerClassName="bg-background"><Text style={title} className="text-3xl font-bold">Perangkat</Text><Text style={muted} className="mt-2 text-sm leading-5">Daftar aset kamera yang Anda tambahkan secara eksplisit. Hasil audit tidak menebak kredensial.</Text><View className="mt-5"><Text style={title} className="text-sm font-bold">Kamera terdaftar</Text><FlatList data={cameras} keyExtractor={(item) => item.id} contentContainerStyle={{ gap: 10, paddingTop: 12, paddingBottom: 28 }} ListEmptyComponent={<View style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 18 }}><Text style={title} className="text-sm font-semibold">Belum ada perangkat</Text><Text style={muted} className="mt-1 text-xs leading-5">Tambahkan kamera pada tab Kamera untuk memulai pemantauan berizin.</Text></View>} renderItem={({ item }) => <View style={{ borderColor: colors.border, backgroundColor: colors.surface, borderWidth: 1, borderRadius: 18, padding: 16 }}><View className="flex-row items-center justify-between"><Text style={title} className="text-base font-semibold">{item.name}</Text><Text style={{ color: colors.success, fontSize: 11, fontWeight: "800" }}>{item.lastStatus.toUpperCase()}</Text></View><Text style={muted} className="mt-2 text-xs">{item.url}</Text><Text style={muted} className="mt-1 text-xs">{item.location || "Lokasi belum diatur"}</Text></View>} /><Text style={title} className="text-sm font-bold">Audit terakhir</Text><Text style={muted} className="mt-2 text-xs">{audits[0]?.note || "Belum ada audit tercatat."}</Text></View></ScreenContainer>;
}
