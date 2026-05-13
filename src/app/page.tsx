import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase";
import { generateQRDataURL } from "@/lib/qr";
import QRCardActions from "@/components/QRCardActions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createSupabaseClient();

  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*, scans(count)")
    .order("created_at", { ascending: false });

  const list = qrCodes ?? [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const qrImages = await Promise.all(
    list.map((qr) =>
      generateQRDataURL(`${baseUrl}/r/${qr.code}`, {
        fgColor: qr.fg_color,
        bgColor: qr.bg_color,
        size: 200,
      })
    )
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">QR ทั้งหมด</h1>
          <p className="text-neutral-400 text-sm mt-1">{list.length} รายการ</p>
        </div>
      </div>

      {list.length === 0 ? (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((qr, i) => (
            <div
              key={qr.id}
              className="border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="font-medium truncate">{qr.name}</h2>
                  <p className="text-neutral-400 text-xs truncate mt-0.5">{qr.destination}</p>
                </div>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${qr.is_active ? "bg-emerald-900/40 text-emerald-400" : "bg-neutral-800 text-neutral-500"}`}>
                  {qr.is_active ? "เปิด" : "ปิด"}
                </span>
              </div>

              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrImages[i]} alt={qr.name} width={140} height={140} className="rounded-lg" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">
                  สแกน <span className="text-neutral-100 font-medium">{qr.scans?.[0]?.count ?? 0}</span> ครั้ง
                </span>
                <span className="text-neutral-600 text-xs font-mono">/r/{qr.code}</span>
              </div>

              <QRCardActions qrId={qr.id} qrName={qr.name} isActive={qr.is_active} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
