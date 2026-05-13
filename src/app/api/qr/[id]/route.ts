import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*, scans(count)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...data,
    scan_count: data.scans?.[0]?.count ?? 0,
    scans: undefined,
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { name, destination, fgColor, bgColor, size, isActive } = body;

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("qr_codes")
    .update({
      ...(name !== undefined && { name }),
      ...(destination !== undefined && { destination }),
      ...(fgColor !== undefined && { fg_color: fgColor }),
      ...(bgColor !== undefined && { bg_color: bgColor }),
      ...(size !== undefined && { size }),
      ...(isActive !== undefined && { is_active: isActive }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = createSupabaseClient();

  const { error } = await supabase.from("qr_codes").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
