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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, destination, fgColor, bgColor, size, dotStyle, logoUrl } = body;

  if (!name || !destination) {
    return NextResponse.json(
      { error: "name and destination are required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseClient();
  const code = nanoid(8);

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
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
