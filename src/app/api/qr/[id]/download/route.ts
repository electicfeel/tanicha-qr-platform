import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";
import { generateQRSVGBuffer } from "@/lib/qr";
import sharp from "sharp";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = createSupabaseClient();

  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select()
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const svgBuffer = await generateQRSVGBuffer(`${baseUrl}/r/${qr.code}`, {
    fgColor: qr.fg_color,
    bgColor: qr.bg_color,
    size: qr.size,
    dotStyle: qr.dot_style ?? "square",
    logoUrl: qr.logo_url ?? undefined,
  });

  const pngBuffer = await sharp(svgBuffer).png().toBuffer();

  return new NextResponse(pngBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${qr.name}-qr.png"`,
    },
  });
}
