import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";
import { detectDeviceType } from "@/lib/device";

type Params = { params: Promise<{ code: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { code } = await params;
  const supabase = createSupabaseClient();

  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select()
    .eq("code", code)
    .single();

  const expired = qr?.expires_at != null && new Date(qr.expires_at) < new Date();
  if (error || !qr || !qr.is_active || expired) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  // บันทึก scan พร้อมข้อมูลสำหรับ analytics — ห้ามให้ error ตรงนี้ block การ redirect
  const userAgent = req.headers.get("user-agent");
  try {
    const { error: insertError } = await supabase.from("scans").insert({
      qr_code_id: qr.id,
      user_agent: userAgent,
      referrer: req.headers.get("referer"),
      device_type: detectDeviceType(userAgent),
      country: req.headers.get("x-vercel-ip-country"),
    });
    // ถ้าคอลัมน์ analytics ยังไม่มี (ยังไม่ได้รัน migration) ให้ถอยไปบันทึกแบบเดิม
    // เพื่อไม่ให้การนับ scan พังระหว่างรอ migration
    if (insertError) {
      await supabase.from("scans").insert({ qr_code_id: qr.id });
    }
  } catch {
    // ไม่ทำอะไร — ปล่อยให้ผู้ใช้ถูก redirect ตามปกติแม้บันทึกไม่สำเร็จ
  }

  return NextResponse.redirect(qr.destination);
}
