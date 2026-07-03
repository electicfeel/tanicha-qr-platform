"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  qrId: string;
  qrName: string;
  isActive: boolean;
}

export default function QRCardActions({ qrId, qrName, isActive }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function toggleActive() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch(`/api/qr/${qrId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError(isActive ? "ปิดใช้งานไม่สำเร็จ" : "เปิดใช้งานไม่สำเร็จ");
    } finally {
      setPending(false);
    }
  }

  async function deleteQR() {
    if (pending) return;
    if (!confirm(`ลบ "${qrName}" ใช่ไหม?`)) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch(`/api/qr/${qrId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("ลบไม่สำเร็จ — ลองใหม่อีกครั้ง");
      setPending(false);
    }
  }

  const FOCUS = "focus-ring";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/qr/${qrId}`}
          className={`flex-1 text-center text-xs py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-colors ${FOCUS}`}
        >
          แก้ไข
        </Link>
        <a
          href={`/api/qr/${qrId}/download`}
          className={`flex-1 text-center text-xs py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-colors ${FOCUS}`}
        >
          ดาวน์โหลด
        </a>
        <button
          onClick={toggleActive}
          disabled={pending}
          aria-pressed={!isActive}
          className={`flex-1 text-xs py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-colors disabled:opacity-50 ${FOCUS}`}
        >
          {isActive ? "ปิด" : "เปิด"}
        </button>
        <button
          onClick={deleteQR}
          disabled={pending}
          className={`text-xs py-2.5 px-3 rounded-lg border border-red-900/50 text-red-400 hover:border-red-700 hover:text-red-300 transition-colors disabled:opacity-50 ${FOCUS}`}
        >
          ลบ
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
