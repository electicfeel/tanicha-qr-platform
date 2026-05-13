import EditQRForm from "@/components/EditQRForm";
import { createSupabaseClient } from "@/lib/supabase";
import { generateQRSVGString } from "@/lib/qr";
import type { DotStyle } from "@/lib/qr";
import { getBaseUrl } from "@/lib/url";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditQRPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseClient();

  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select("*, scans(count)")
    .eq("id", id)
    .single();

  if (error || !qr) notFound();

  const baseUrl = getBaseUrl();
  const redirectUrl = `${baseUrl}/r/${qr.code}`;

  const svg = await generateQRSVGString(redirectUrl, {
    fgColor: qr.fg_color,
    bgColor: qr.bg_color,
    size: 280,
    dotStyle: (qr.dot_style ?? "square") as DotStyle,
    logoUrl: qr.logo_url ?? undefined,
  });
  const qrSrc = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-2">{qr.name}</h1>
      <p className="text-neutral-400 text-sm mb-8">
        สแกนแล้ว {qr.scans?.[0]?.count ?? 0} ครั้ง · Short URL:{" "}
        <span className="font-mono">{redirectUrl}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt={qr.name} width={280} height={280}
            className="rounded-xl border border-neutral-800" />
          <a href={`/api/qr/${qr.id}/download`}
            className="w-full text-center border border-neutral-700 rounded-lg py-2.5 text-sm hover:border-neutral-400 transition-colors">
            ดาวน์โหลด PNG
          </a>
        </div>

        <EditQRForm
          qr={{
            id: qr.id,
            name: qr.name,
            destination: qr.destination,
            fgColor: qr.fg_color,
            bgColor: qr.bg_color,
            size: qr.size,
            isActive: qr.is_active,
            dotStyle: (qr.dot_style ?? "square") as DotStyle,
            logoUrl: qr.logo_url ?? "",
          }}
        />
      </div>
    </div>
  );
}
