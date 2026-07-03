import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*, scans(count)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const qrCodes = data.map((qr) => ({
    ...qr,
    scan_count: qr.scans?.[0]?.count ?? 0,
    scans: undefined,
  }));

  return NextResponse.json(qrCodes);
}

const CUSTOM_CODE_RE = /^[a-z0-9-]{3,32}$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, destination, fgColor, bgColor, size, dotStyle, logoUrl, code: rawCode, expiresAt, groupName } = body;

  if (!name || !destination) {
    return NextResponse.json(
      { error: "name and destination are required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseClient();

  // Custom short code (ถ้าระบุ) — รองรับ a-z 0-9 - ยาว 3-32 ตัว และห้ามชนของเดิม
  let code: string;
  if (rawCode != null && String(rawCode).trim() !== "") {
    code = String(rawCode).trim().toLowerCase();
    if (!CUSTOM_CODE_RE.test(code)) {
      return NextResponse.json(
        { error: "code ต้องเป็น a-z, 0-9, - ความยาว 3-32 ตัว" },
        { status: 400 }
      );
    }
    const { data: existing } = await supabase
      .from("qr_codes")
      .select("id")
      .eq("code", code)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: "code นี้ถูกใช้แล้ว" }, { status: 409 });
    }
  } else {
    code = nanoid(8);
  }

  const { data, error } = await supabase
    .from("qr_codes")
    .insert({
      code,
      name,
      destination,
      fg_color: fgColor ?? "#000000",
      bg_color: bgColor ?? "#FFFFFF",
      size: size ?? 300,
      dot_style: dotStyle ?? "square",
      logo_url: logoUrl ?? null,
      expires_at: expiresAt || null,
      // ใส่ group_name เฉพาะเมื่อระบุ — กันการสร้างพังหากยังไม่ได้รัน migration
      ...(groupName?.trim() ? { group_name: groupName.trim() } : {}),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
