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
  // QR ที่ระบบสร้างฝัง ?qr=1 ไว้ → แยก "สแกน QR" ออกจาก "คลิกลิงก์"
  const via = req.nextUrl.searchParams.get("qr") === "1" ? "qr" : "link";
  try {
    const analyticsRow = {
      qr_code_id: qr.id,
      user_agent: userAgent,
      referrer: req.headers.get("referer"),
      device_type: detectDeviceType(userAgent),
      country: req.headers.get("x-vercel-ip-country"),
    };
    const { error: insertError } = await supabase.from("scans").insert({ ...analyticsRow, via });
    if (insertError) {
      // ถอยทีละขั้นระหว่างรอ migration: ตัด via ก่อน (คงข้อมูล analytics) แล้วค่อยเหลือขั้นต่ำ
      const { error: retryError } = await supabase.from("scans").insert(analyticsRow);
      if (retryError) await supabase.from("scans").insert({ qr_code_id: qr.id });
    }
  } catch {
    // ไม่ทำอะไร — ปล่อยให้ผู้ใช้ถูก redirect ตามปกติแม้บันทึกไม่สำเร็จ
  }

  return NextResponse.redirect(qr.destination);
}
