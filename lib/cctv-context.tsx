import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isAuthorizedPrivateUrl } from "@/lib/cctv-validation";

export type Camera = {
  id: string;
  name: string;
  url: string;
  location?: string;
  createdAt: string;
  lastStatus: "unknown" | "online" | "offline";
};

export type Audit = {
  id: string;
  scope: string;
  createdAt: string;
  result: "ready" | "blocked";
  note: string;
};

type CctvContextValue = {
  cameras: Camera[];
  audits: Audit[];
  authorized: boolean;
  hydrated: boolean;
  storageError: string | null;
  clearStorageError: () => void;
  setAuthorized: (value: boolean) => Promise<void>;
  addCamera: (input: { name: string; url: string; location?: string }) => Promise<{ ok: boolean; message: string }>;
  removeCamera: (id: string) => Promise<void>;
  addAudit: (scope: string) => Promise<void>;
};

const CctvContext = createContext<CctvContextValue | null>(null);
const CAMERAS_KEY = "setankober.cctv.cameras";
const AUDITS_KEY = "setankober.cctv.audits";
const AUTH_KEY = "setankober.cctv.authorized";

function parseArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

export function CctvProvider({ children }: { children: React.ReactNode }) {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [authorized, setAuthorizedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      AsyncStorage.getItem(CAMERAS_KEY),
      AsyncStorage.getItem(AUDITS_KEY),
      SecureStore.getItemAsync(AUTH_KEY),
    ]).then(([cameraResult, auditResult, authResult]) => {
      if (!active) return;
      const cameraRaw = cameraResult.status === "fulfilled" ? cameraResult.value : null;
      const auditRaw = auditResult.status === "fulfilled" ? auditResult.value : null;
      const authRaw = authResult.status === "fulfilled" ? authResult.value : null;
      if ([cameraResult, auditResult, authResult].some((result) => result.status === "rejected")) {
        setStorageError("Sebagian data lokal tidak dapat dimuat. Data yang tersedia tetap ditampilkan; coba muat ulang aplikasi.");
      }
      setCameras(parseArray<Camera>(cameraRaw));
      setAudits(parseArray<Audit>(auditRaw));
      setAuthorizedState(authRaw === "true");
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  const clearStorageError = () => setStorageError(null);

  const setAuthorized = async (value: boolean) => {
    setAuthorizedState(value);
    await SecureStore.setItemAsync(AUTH_KEY, String(value));
  };

  const addCamera = async (input: { name: string; url: string; location?: string }) => {
    if (!authorized) return { ok: false, message: "Konfirmasi otorisasi sebelum menambahkan kamera." };
    if (!input.name.trim()) return { ok: false, message: "Nama kamera wajib diisi." };
    if (!isAuthorizedPrivateUrl(input.url.trim())) return { ok: false, message: "Gunakan URL RTSP/HTTP dari jaringan privat yang Anda miliki atau kuasai." };
    const camera: Camera = { id: `${Date.now()}`, name: input.name.trim(), url: input.url.trim(), location: input.location?.trim(), createdAt: new Date().toISOString(), lastStatus: "unknown" };
    const next = [camera, ...cameras];
    setCameras(next);
    await AsyncStorage.setItem(CAMERAS_KEY, JSON.stringify(next));
    return { ok: true, message: "Kamera tersimpan secara lokal." };
  };

  const removeCamera = async (id: string) => {
    const next = cameras.filter((camera) => camera.id !== id);
    setCameras(next);
    await AsyncStorage.setItem(CAMERAS_KEY, JSON.stringify(next));
  };

  const addAudit = async (scope: string) => {
    const audit: Audit = { id: `${Date.now()}`, scope, createdAt: new Date().toISOString(), result: authorized ? "ready" : "blocked", note: authorized ? "Audit terbatas siap dijalankan pada aset berizin." : "Diblokir karena otorisasi belum dikonfirmasi." };
    const next = [audit, ...audits].slice(0, 50);
    setAudits(next);
    await AsyncStorage.setItem(AUDITS_KEY, JSON.stringify(next));
  };

  const value = useMemo(() => ({ cameras, audits, authorized, hydrated, storageError, clearStorageError, setAuthorized, addCamera, removeCamera, addAudit }), [cameras, audits, authorized, hydrated, storageError]);
  return <CctvContext.Provider value={value}>{children}</CctvContext.Provider>;
}

export function useCctv() {
  const context = useContext(CctvContext);
  if (!context) throw new Error("useCctv must be used inside CctvProvider");
  return context;
}
