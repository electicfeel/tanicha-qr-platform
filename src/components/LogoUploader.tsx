"use client";

import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function LogoUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "อัปโหลดไม่สำเร็จ");
    } else {
      onChange(data.url);
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-neutral-400">Logo CI Brand (ไม่บังคับ)</label>

      {value ? (
        <div className="flex items-center gap-3 p-3 border border-neutral-700 rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="logo" className="w-12 h-12 object-contain rounded-lg bg-white p-1" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-400 truncate">{value}</p>
          </div>
          <button type="button" onClick={() => onChange("")}
            className="focus-ring rounded text-xs text-red-400 hover:text-red-300 shrink-0">
            ลบ
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring border border-dashed border-neutral-700 rounded-xl py-6 text-sm text-neutral-400 hover:border-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-50"
        >
          {uploading ? "กำลังอัปโหลด..." : "+ คลิกเพื่ออัปโหลด logo (PNG, JPG, SVG)"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        aria-label="อัปโหลดไฟล์ logo"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
