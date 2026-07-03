import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

// ครอบค่าให้ปลอดภัยกับ CSV (กัน comma/quote/newline)
function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = createSupabaseClient();

  const { data: qr } = await supabase
    .from("qr_codes")
    .select("name")
    .eq("id", id)
    .single();

  if (!qr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // select("*") ทนต่อคอลัมน์ที่ยังไม่ migrate
  const { data: scans } = await supabase
    .from("scans")
    .select("*")
    .eq("qr_code_id", id)
    .order("scanned_at", { ascending: false });

  const header = ["scanned_at", "via", "device_type", "country", "referrer", "user_agent"];
  const rows = (scans ?? []).map((s) =>
    [s.scanned_at, s.via, s.device_type, s.country, s.referrer, s.user_agent].map(csvCell).join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${qr.name}-scans.csv"`,
    },
  });
}
