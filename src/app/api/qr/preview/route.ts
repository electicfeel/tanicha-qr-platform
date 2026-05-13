import { NextRequest, NextResponse } from "next/server";
import { generateQRSVGString } from "@/lib/qr";
import type { DotStyle } from "@/lib/qr";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const destination = searchParams.get("destination") ?? "https://example.com";
  const fgColor = searchParams.get("fgColor") ?? "#000000";
  const bgColor = searchParams.get("bgColor") ?? "#FFFFFF";
  const size = Number(searchParams.get("size") ?? 300);
  const dotStyle = (searchParams.get("dotStyle") ?? "square") as DotStyle;
  const logoUrl = searchParams.get("logoUrl") ?? undefined;

  const svg = generateQRSVGString(destination, { fgColor, bgColor, size, dotStyle, logoUrl });

  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store" },
  });
}
