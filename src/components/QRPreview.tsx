"use client";

import { useEffect, useState } from "react";
import type { DotStyle } from "@/lib/qr";

interface Props {
  destination: string;
  fgColor: string;
  bgColor: string;
  size: number;
  dotStyle: DotStyle;
  logoUrl?: string;
}

export default function QRPreview(props: Props) {
  const [src, setSrc] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({
      destination: props.destination,
      fgColor: props.fgColor,
      bgColor: props.bgColor,
      size: String(props.size),
      dotStyle: props.dotStyle,
      ...(props.logoUrl && { logoUrl: props.logoUrl }),
    });

    setLoading(true);
    const controller = new AbortController();

    fetch(`/api/qr/preview?${params}`, { signal: controller.signal })
      .then((r) => r.text())
      .then((svg) => {
        const encoded = btoa(unescape(encodeURIComponent(svg)));
        setSrc(`data:image/svg+xml;base64,${encoded}`);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => controller.abort();
  }, [props.destination, props.fgColor, props.bgColor, props.size, props.dotStyle, props.logoUrl]);

  return (
    <div
      className="rounded-2xl border border-neutral-800 flex items-center justify-center overflow-hidden"
      style={{ width: props.size, height: props.size, background: props.bgColor }}
    >
      {loading ? (
        <span className="text-neutral-600 text-sm">กำลังสร้าง...</span>
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="QR Preview" width={props.size} height={props.size} />
      ) : null}
    </div>
  );
}
