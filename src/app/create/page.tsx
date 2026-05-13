"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoUploader from "@/components/LogoUploader";
import QRPreview from "@/components/QRPreview";
import type { DotStyle } from "@/lib/qr";

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    destination: "",
    fgColor: "#000000",
    bgColor: "#FFFFFF",
    size: 300,
    dotStyle: "square" as DotStyle,
    logoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        destination: form.destination,
        fgColor: form.fgColor,
        bgColor: form.bgColor,
        size: form.size,
        dotStyle: form.dotStyle,
        logoUrl: form.logoUrl || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "เกิดข้อผิดพลาด");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold mb-8">สร้าง QR ใหม่</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-neutral-400">ชื่อ QR</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="เช่น โปรโมชั่น เดือนพฤษภาคม"
              required
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-400 placeholder-neutral-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-neutral-400">URL ปลายทาง</label>
            <input
              type="url"
              value={form.destination}
              onChange={(e) => update("destination", e.target.value)}
              placeholder="https://example.com"
              required
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-400 placeholder-neutral-600"
            />
          </div>

          {/* Dot Style */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-400">รูปทรง Pixel</label>
            <div className="flex gap-3">
              {(["square", "round"] as DotStyle[]).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => update("dotStyle", style)}
                  className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border transition-colors ${
                    form.dotStyle === style
                      ? "border-neutral-100 bg-neutral-900"
                      : "border-neutral-700 hover:border-neutral-500"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-0.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 bg-neutral-100 ${style === "round" ? "rounded-full" : "rounded-none"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400">{style === "square" ? "เหลี่ยม" : "กลม"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-neutral-400">สี QR</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.fgColor} onChange={(e) => update("fgColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-neutral-700 bg-transparent cursor-pointer" />
                <span className="text-sm font-mono text-neutral-400">{form.fgColor}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-neutral-400">สีพื้นหลัง</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.bgColor} onChange={(e) => update("bgColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-neutral-700 bg-transparent cursor-pointer" />
                <span className="text-sm font-mono text-neutral-400">{form.bgColor}</span>
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-neutral-400">ขนาด: {form.size}px</label>
            <input type="range" min={200} max={600} step={50} value={form.size}
              onChange={(e) => update("size", Number(e.target.value))}
              className="accent-neutral-100" />
            <div className="flex justify-between text-xs text-neutral-600">
              <span>200px</span><span>600px</span>
            </div>
          </div>

          {/* Logo Upload */}
          <LogoUploader
            value={form.logoUrl}
            onChange={(url) => update("logoUrl", url)}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()}
              className="flex-1 border border-neutral-700 rounded-lg py-2.5 text-sm hover:border-neutral-500 transition-colors">
              ยกเลิก
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-neutral-100 text-neutral-950 rounded-lg py-2.5 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50">
              {loading ? "กำลังสร้าง..." : "สร้าง QR"}
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4 lg:pt-10">
          <p className="text-sm text-neutral-500">ตัวอย่าง QR</p>
          <QRPreview
            destination={form.destination || "https://example.com"}
            fgColor={form.fgColor}
            bgColor={form.bgColor}
            size={280}
            dotStyle={form.dotStyle}
            logoUrl={form.logoUrl}
          />
        </div>
      </div>
    </div>
  );
}
