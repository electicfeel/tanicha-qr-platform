import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

type Params = { params: Promise<{ code: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { code } = await params;
  const supabase = createSupabaseClient();

  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select()
    .eq("code", code)
    .single();

  if (error || !qr || !qr.is_active) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  await supabase.from("scans").insert({ qr_code_id: qr.id });

  return NextResponse.redirect(qr.destination);
}
