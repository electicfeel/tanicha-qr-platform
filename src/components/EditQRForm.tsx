"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoUploader from "./LogoUploader";
import type { DotStyle } from "@/lib/qr";

interface QRData {
  id: string;
  name: string;
  destination: string;
  fgColor: string;
  bgColor: string;
  size: number;
  isActive: boolean;
  dotStyle: DotStyle;
  logoUrl: string;
}

export default function EditQRForm({ qr }: { qr: QRData }) {
  const router = useRouter();
  const [form, setForm] = useState(qr);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof QRData>(field: K, value: QRData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await fetch(`/api/qr/${qr.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        destination: form.destination,
        fgColor: form.fgColor,
        bgColor: form.bgColor,
        size: form.size,
        isActive: form.isActive,
        dotStyle: form.dotStyle,
        logoUrl: form.logoUrl || null,
      }),
    });

    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-neutral-400">ชื่อ QR</label>
        <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} required
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-400" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-neutral-400">URL ปลายทาง</label>
        <input type="url" value={form.destination} onChange={(e) => update("destination", e.target.value)} required
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-400" />
        <p className="text-xs text-neutral-600">เปลี่ยน URL โดยไม่ต้องพิมพ์ QR ใหม่</p>
      </div>

      {/* Dot Style */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-400">รูปทรง Pixel</label>
        <div className="flex gap-3">
          {(["square", "round"] as DotStyle[]).map((style) => (
            <button key={style} type="button" onClick={() => update("dotStyle", style)}
              className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border transition-colors ${
                form.dotStyle === style ? "border-neutral-100 bg-neutral-900" : "border-neutral-700 hover:border-neutral-500"
              }`}>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className={`w-3 h-3 bg-neutral-100 ${style === "round" ? "rounded-full" : "rounded-none"}`} />
                ))}
              </div>
              <span className="text-xs text-neutral-400">{style === "square" ? "เหลี่ยม" : "กลม"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-400">สี QR</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.fgColor} onChange={(e) => update("fgColor", e.target.value)}
              className="w-9 h-9 rounded border border-neutral-700 bg-transparent cursor-pointer" />
            <span className="text-xs font-mono text-neutral-500">{form.fgColor}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-400">สีพื้นหลัง</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.bgColor} onChange={(e) => update("bgColor", e.target.value)}
              className="w-9 h-9 rounded border border-neutral-700 bg-transparent cursor-pointer" />
            <span className="text-xs font-mono text-neutral-500">{form.bgColor}</span>
          </div>
        </div>
      </div>

      <LogoUploader value={form.logoUrl} onChange={(url) => update("logoUrl", url)} />

      <div className="flex items-center justify-between">
        <label className="text-sm text-neutral-400">สถานะ QR</label>
        <button type="button" onClick={() => update("isActive", !form.isActive)}
          className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? "bg-emerald-600" : "bg-neutral-700"}`}>
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isActive ? "left-6" : "left-1"}`} />
        </button>
      </div>

      <button type="submit" disabled={loading}
        className="bg-neutral-100 text-neutral-950 rounded-lg py-2.5 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 mt-2">
        {loading ? "กำลังบันทึก..." : saved ? "บันทึกแล้ว ✓" : "บันทึก"}
      </button>
    </form>
  );
}
