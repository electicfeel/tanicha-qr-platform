import type { SupabaseClient } from "@supabase/supabase-js";
import type { Scan } from "@/lib/supabase";

export type DailyCount = { date: string; count: number };
export type Breakdown = { label: string; count: number };

export type ScanAnalytics = {
  total: number;
  lastScanAt: string | null;
  daily: DailyCount[]; // เรียงจากเก่า → ใหม่ ครบทุกวันในช่วง (วันที่ไม่มี scan = 0)
  devices: Breakdown[];
  countries: Breakdown[];
  referrers: Breakdown[];
};

// YYYY-MM-DD ตาม local time ของ server
function dayKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function tally(values: (string | null)[], fallback: string): Breakdown[] {
  const map = new Map<string, number>();
  for (const v of values) {
    const key = v && v.trim() ? v.trim() : fallback;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

// สร้างชุดวันที่ครบ days วันย้อนหลังจนถึง today
function buildDateRange(days: number): string[] {
  const nowMs = Date.now();
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    out.push(new Date(nowMs - i * 86_400_000).toISOString().slice(0, 10));
  }
  return out;
}

// ISO timestamp ของจุดเริ่มต้นย้อนหลัง days วัน (ใช้กรอง scan ล่าสุด)
export function sinceISO(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

// นับ scan รายวันจากรายการ scanned_at ครบทุกวันในช่วง (วันที่ไม่มี = 0)
// pure function — ใช้ซ้ำได้ทั้งหน้า detail และ sparkline บน dashboard
export function dailyCounts(scannedAts: string[], days: number): DailyCount[] {
  const counts = new Map<string, number>();
  for (const at of scannedAts) counts.set(dayKey(at), (counts.get(dayKey(at)) ?? 0) + 1);
  return buildDateRange(days).map((date) => ({ date, count: counts.get(date) ?? 0 }));
}

export async function getScanAnalytics(
  supabase: SupabaseClient,
  qrCodeId: string,
  opts: { days?: number } = {}
): Promise<ScanAnalytics> {
  const days = opts.days ?? 30;

  const { data } = await supabase
    .from("scans")
    .select("scanned_at, device_type, country, referrer")
    .eq("qr_code_id", qrCodeId)
    .order("scanned_at", { ascending: false });

  const scans = (data ?? []) as Pick<
    Scan,
    "scanned_at" | "device_type" | "country" | "referrer"
  >[];

  return {
    total: scans.length,
    lastScanAt: scans[0]?.scanned_at ?? null,
    daily: dailyCounts(scans.map((s) => s.scanned_at), days),
    devices: tally(scans.map((s) => s.device_type), "unknown"),
    countries: tally(scans.map((s) => s.country), "unknown"),
    referrers: tally(scans.map((s) => s.referrer), "direct"),
  };
}
