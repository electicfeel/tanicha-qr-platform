import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase";
import { generateQRDataURL } from "@/lib/qr";
import { getBaseUrl } from "@/lib/url";
import { dailyCounts, sinceISO } from "@/lib/analytics";
import DriveView, { type DriveQR } from "@/components/DriveView";

export const dynamic = "force-dynamic";

const SPARK_DAYS = 7;

type Props = { searchParams: Promise<{ group?: string }> };

export default async function DashboardPage({ searchParams }: Props) {
  const { group: selected } = await searchParams;
  const supabase = createSupabaseClient();

  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*, scans(count)")
    .order("created_at", { ascending: false });

  const all = qrCodes ?? [];
  const baseUrl = await getBaseUrl();

  // ดึง scan ช่วง SPARK_DAYS วันล่าสุดของทุก QR ในคิวรีเดียว แล้วจัดกลุ่มต่อ QR
  const { data: recentScans } = await supabase
    .from("scans")
    .select("qr_code_id, scanned_at")
    .gte("scanned_at", sinceISO(SPARK_DAYS));

  const scanDatesByQr = new Map<string, string[]>();
  for (const s of recentScans ?? []) {
    const arr = scanDatesByQr.get(s.qr_code_id) ?? [];
    arr.push(s.scanned_at);
    scanDatesByQr.set(s.qr_code_id, arr);
  }

  const qrs: DriveQR[] = await Promise.all(
    all.map(async (qr) => ({
      id: qr.id,
      name: qr.name,
      code: qr.code,
      destination: qr.destination,
      isActive: qr.is_active,
      groupName: qr.group_name ?? null,
      scanCount: qr.scans?.[0]?.count ?? 0,
      sparkDaily: dailyCounts(scanDatesByQr.get(qr.id) ?? [], SPARK_DAYS),
      imageSrc: await generateQRDataURL(`${baseUrl}/r/${qr.code}`, {
        fgColor: qr.fg_color,
        bgColor: qr.bg_color,
        size: 200,
        dotStyle: qr.dot_style ?? "square",
        logoUrl: qr.logo_url ?? undefined,
      }),
    }))
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">QR ทั้งหมด</h1>
        <p className="text-neutral-400 text-sm mt-1">{all.length} รายการ</p>
      </div>

      {all.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-800 rounded-2xl">
          <p className="text-neutral-500 mb-4">ยังไม่มี QR code</p>
          <Link
            href="/create"
            className="bg-neutral-100 text-neutral-950 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-white transition-colors"
          >
            + สร้าง QR แรกของคุณ
          </Link>
        </div>
      ) : (
        <DriveView qrs={qrs} currentFolder={selected ?? null} />
      )}
    </div>
  );
}
