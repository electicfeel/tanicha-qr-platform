import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

// คืนรายชื่อกลุ่ม/แบรนด์ที่มีอยู่ (distinct, เรียงตามตัวอักษร) ใช้เป็น datalist ในฟอร์ม
export async function GET() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("qr_codes")
    .select("group_name")
    .not("group_name", "is", null);

  // ถ้าคอลัมน์ยังไม่มี (ยังไม่ได้รัน migration) คืน list ว่างแทนการ error
  if (error) return NextResponse.json([]);

  const groups = [...new Set((data ?? []).map((r) => r.group_name).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  );
  return NextResponse.json(groups);
}
