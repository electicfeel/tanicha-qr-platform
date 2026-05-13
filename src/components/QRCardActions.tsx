"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  qrId: string;
  qrName: string;
  isActive: boolean;
}

export default function QRCardActions({ qrId, qrName, isActive }: Props) {
  const router = useRouter();

  async function toggleActive() {
    await fetch(`/api/qr/${qrId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  }

  async function deleteQR() {
    if (!confirm(`ลบ "${qrName}" ใช่ไหม?`)) return;
    await fetch(`/api/qr/${qrId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex gap-2 pt-1 border-t border-neutral-800">
      <Link
        href={`/qr/${qrId}`}
        className="flex-1 text-center text-xs py-2 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-colors"
      >
        แก้ไข
      </Link>
      <a
        href={`/api/qr/${qrId}/download`}
        className="flex-1 text-center text-xs py-2 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-colors"
      >
        ดาวน์โหลด
      </a>
      <button
        onClick={toggleActive}
        className="flex-1 text-xs py-2 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-colors"
      >
        {isActive ? "ปิด" : "เปิด"}
      </button>
      <button
        onClick={deleteQR}
        className="text-xs py-2 px-3 rounded-lg border border-red-900/50 text-red-500 hover:border-red-700 transition-colors"
      >
        ลบ
      </button>
    </div>
  );
}
