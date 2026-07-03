import EditQRForm from "@/components/EditQRForm";
import ScanAnalytics from "@/components/ScanAnalytics";
import CopyButton from "@/components/CopyButton";
import { createSupabaseClient } from "@/lib/supabase";
import { generateQRSVGString } from "@/lib/qr";
import type { DotStyle } from "@/lib/qr";
import { getScanAnalytics } from "@/lib/analytics";
import { getBaseUrl } from "@/lib/url";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

  const analytics = await getScanAnalytics(supabase, qr.id);

  const baseUrl = await getBaseUrl();
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
      <h1 className="text-2xl font-semibold mb-1">{qr.name}</h1>
      <p className="text-neutral-400 text-sm mb-3">
        สแกนแล้ว <span className="text-neutral-100 font-medium">{qr.scans?.[0]?.count ?? 0}</span> ครั้ง
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs text-neutral-500">Short URL</span>
        <span className="font-mono text-xs text-neutral-300 break-all">{redirectUrl}</span>
        <CopyButton text={redirectUrl} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt={qr.name} width={280} height={280}
            className="rounded-xl border border-neutral-800" />
          <div className="grid grid-cols-2 gap-2 w-full">
            <a href={`/api/qr/${qr.id}/download?format=png`}
              className="focus-ring text-center border border-neutral-700 rounded-lg py-2.5 text-sm hover:border-neutral-400 transition-colors">
              PNG
            </a>
            <a href={`/api/qr/${qr.id}/download?format=svg`}
              className="focus-ring text-center border border-neutral-700 rounded-lg py-2.5 text-sm hover:border-neutral-400 transition-colors">
              SVG
            </a>
          </div>
        </div>

        <EditQRForm
          qr={{
            id: qr.id,
            name: qr.name,
            destination: qr.destination,
            groupName: qr.group_name ?? "",
            fgColor: qr.fg_color,
            bgColor: qr.bg_color,
            size: qr.size,
            isActive: qr.is_active,
            dotStyle: (qr.dot_style ?? "square") as DotStyle,
            logoUrl: qr.logo_url ?? "",
          }}
        />
      </div>

      <ScanAnalytics analytics={analytics} exportHref={`/api/qr/${qr.id}/scans/export`} />
    </div>
  );
}
