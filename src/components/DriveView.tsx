"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DailyCount } from "@/lib/analytics";
import QRCardActions from "@/components/QRCardActions";
import Sparkline from "@/components/Sparkline";

export type DriveQR = {
  id: string;
  name: string;
  code: string;
  destination: string;
  isActive: boolean;
  groupName: string | null;
  scanCount: number;
  imageSrc: string;
  sparkDaily: DailyCount[];
};

const SPARK_DAYS = 7;
// โฟกัสคีย์บอร์ด — ใช้ utility กลาง .focus-ring (นิยามใน globals.css)
const FOCUS = "focus-ring";

export default function DriveView({
  qrs,
  currentFolder,
}: {
  qrs: DriveQR[];
  currentFolder: string | null;
}) {
  const router = useRouter();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  // โฟลเดอร์ว่างที่เพิ่งสร้าง (ยังไม่มีไฟล์) — เก็บชั่วคราวจนกว่าจะมี QR ย้ายเข้า
  const [sessionFolders, setSessionFolders] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  // โฟลเดอร์จริง = แบรนด์ที่มี QR อยู่ (นับจำนวน)
  const counts = new Map<string, number>();
  for (const q of qrs) if (q.groupName) counts.set(q.groupName, (counts.get(q.groupName) ?? 0) + 1);
  const realFolders = [...counts.keys()];
  const folders = [...new Set([...realFolders, ...sessionFolders])].sort((a, b) => a.localeCompare(b));

  // ไฟล์ที่แสดง: ในโฟลเดอร์ที่เปิด / หรือไฟล์ที่ยังไม่มีกลุ่ม (root)
  const visible = currentFolder
    ? qrs.filter((q) => q.groupName === currentFolder)
    : qrs.filter((q) => !q.groupName);

  async function moveTo(id: string, folder: string | null) {
    const target = qrs.find((q) => q.id === id);
    if (!target || moving || (target.groupName ?? null) === (folder ?? null)) return;
    setMoving(true);
    setError("");
    const dest = folder || "ไม่มีกลุ่ม";
    try {
      const res = await fetch(`/api/qr/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName: folder ?? "" }),
      });
      if (!res.ok) throw new Error();
      setStatus(`ย้าย “${target.name}” ไปยัง ${dest} แล้ว`);
      router.refresh();
    } catch {
      setError(`ย้าย “${target.name}” ไม่สำเร็จ — ลองใหม่อีกครั้ง`);
    } finally {
      setMoving(false);
    }
  }

  function submitFolder() {
    const name = newName.trim();
    if (name && !folders.includes(name)) setSessionFolders((prev) => [...prev, name]);
    setNewName("");
    setCreating(false);
  }

  function endDrag() {
    setDraggedId(null);
    setDropTarget(null);
  }

  return (
    <div>
      {/* breadcrumb — "หน้าแรก" เป็นเป้า drop เพื่อเอาออกจากกลุ่ม */}
      <div className="flex items-center gap-2 text-sm mb-5">
        <button
          onClick={() => router.push("/")}
          onDragOver={(e) => { e.preventDefault(); setDropTarget("__root__"); }}
          onDragLeave={() => setDropTarget((t) => (t === "__root__" ? null : t))}
          onDrop={() => { if (draggedId) moveTo(draggedId, null); endDrag(); }}
          className={`transition-colors rounded px-1 ${FOCUS} ${
            dropTarget === "__root__" ? "bg-emerald-500/20 text-emerald-300" : "text-neutral-400 hover:text-neutral-100"
          }`}
        >
          หน้าแรก
        </button>
        {currentFolder && (
          <>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-100 font-medium">📁 {currentFolder}</span>
          </>
        )}
        {moving && <span className="text-neutral-400 text-xs ml-2">กำลังย้าย…</span>}
      </div>

      {/* ประกาศผลให้ screen reader + แสดง error ให้ทุกคนเห็น */}
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400 border border-red-900/50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* หัวข้อโฟลเดอร์ + ปุ่มสร้าง (inline input) */}
      <div className="flex items-center justify-between gap-3 mb-2 min-h-[34px]">
        <p className="text-xs text-neutral-500">โฟลเดอร์</p>
        {creating ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitFolder();
                if (e.key === "Escape") { setNewName(""); setCreating(false); }
              }}
              placeholder="ชื่อโฟลเดอร์ / แบรนด์"
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs w-44 focus:outline-none focus:border-neutral-400 placeholder-neutral-500"
            />
            <button onClick={submitFolder}
              className={`text-xs bg-neutral-100 text-neutral-950 rounded-lg px-3 py-1.5 font-medium hover:bg-white transition-colors ${FOCUS}`}>
              สร้าง
            </button>
            <button onClick={() => { setNewName(""); setCreating(false); }}
              className={`text-xs text-neutral-400 hover:text-neutral-100 px-1.5 py-1 rounded ${FOCUS}`}>
              ยกเลิก
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className={`text-xs border border-neutral-700 rounded-lg px-3 py-1.5 hover:border-neutral-400 transition-colors ${FOCUS}`}
          >
            + โฟลเดอร์ใหม่
          </button>
        )}
      </div>

      {folders.length === 0 ? (
        <p className="text-neutral-500 text-sm py-6 text-center border border-dashed border-neutral-800 rounded-xl mb-8">
          ยังไม่มีโฟลเดอร์ — กด “+ โฟลเดอร์ใหม่” หรือสร้างแล้วลาก QR มาวาง
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {folders.map((f) => (
            <FolderTile
              key={f}
              label={f}
              count={counts.get(f) ?? 0}
              active={currentFolder === f}
              isDropTarget={dropTarget === f}
              onOpen={() => router.push(`/?group=${encodeURIComponent(f)}`)}
              onDragOver={(e) => { e.preventDefault(); setDropTarget(f); }}
              onDragLeave={() => setDropTarget((t) => (t === f ? null : t))}
              onDrop={() => { if (draggedId) moveTo(draggedId, f); endDrag(); }}
            />
          ))}
        </div>
      )}

      {/* ไฟล์ QR */}
      <p className="text-xs text-neutral-500 mb-2">
        QR {currentFolder ? `ในโฟลเดอร์ "${currentFolder}"` : "ที่ยังไม่จัดกลุ่ม"} · {visible.length} รายการ
      </p>
      {visible.length === 0 ? (
        <p className="text-neutral-500 text-sm py-8 text-center border border-dashed border-neutral-800 rounded-xl">
          {currentFolder ? "โฟลเดอร์นี้ยังไม่มี QR — ลากไฟล์จากหน้าแรกมาวางที่โฟลเดอร์นี้" : "ไม่มี QR ที่ยังไม่จัดกลุ่ม"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((qr) => (
            <div
              key={qr.id}
              draggable
              onDragStart={() => setDraggedId(qr.id)}
              onDragEnd={endDrag}
              className={`border rounded-2xl p-5 flex flex-col gap-4 transition-colors cursor-grab active:cursor-grabbing ${
                draggedId === qr.id ? "border-neutral-500 opacity-50" : "border-neutral-800 hover:border-neutral-600"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="font-medium truncate">{qr.name}</h2>
                  <p className="text-neutral-400 text-xs truncate mt-0.5">{qr.destination}</p>
                </div>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${qr.isActive ? "bg-emerald-900/40 text-emerald-400" : "bg-neutral-800 text-neutral-500"}`}>
                  {qr.isActive ? "เปิด" : "ปิด"}
                </span>
              </div>

              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr.imageSrc} alt={qr.name} width={140} height={140} className="rounded-lg pointer-events-none" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">
                  สแกน <span className="text-neutral-100 font-medium">{qr.scanCount}</span> ครั้ง
                </span>
                <span className="text-neutral-500 text-xs font-mono">/r/{qr.code}</span>
              </div>

              <div className="flex items-center gap-2">
                <Sparkline daily={qr.sparkDaily} />
                <span className="text-neutral-500 text-[10px] shrink-0">{SPARK_DAYS} วัน</span>
              </div>

              {/* ทางเลือกที่ใช้คีย์บอร์ด/ทัชได้ (นอกจากลาก) สำหรับย้ายเข้าโฟลเดอร์ */}
              <div className="flex items-center gap-2">
                <label htmlFor={`move-${qr.id}`} className="text-neutral-500 text-xs shrink-0">
                  โฟลเดอร์
                </label>
                <select
                  id={`move-${qr.id}`}
                  value={qr.groupName ?? ""}
                  disabled={moving}
                  onChange={(e) => moveTo(qr.id, e.target.value || null)}
                  aria-label={`ย้าย ${qr.name} ไปโฟลเดอร์`}
                  className={`flex-1 min-w-0 bg-neutral-900 border border-neutral-700 rounded-lg text-xs px-2 py-1.5 text-neutral-200 hover:border-neutral-500 transition-colors disabled:opacity-50 ${FOCUS}`}
                >
                  <option value="">ไม่มีกลุ่ม</option>
                  {folders.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <QRCardActions qrId={qr.id} qrName={qr.name} isActive={qr.isActive} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FolderTile({
  label,
  count,
  active,
  isDropTarget,
  onOpen,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  label: string;
  count: number;
  active: boolean;
  isDropTarget: boolean;
  onOpen: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-label={`โฟลเดอร์ ${label}, ${count} รายการ — เปิดดู`}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${FOCUS} ${
        isDropTarget
          ? "border-emerald-500 bg-emerald-500/10"
          : active
          ? "border-neutral-100 bg-neutral-900"
          : "border-neutral-800 hover:border-neutral-600"
      }`}
    >
      <span className="text-xl shrink-0" aria-hidden>📁</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm truncate">{label}</span>
        <span className="block text-xs text-neutral-500">{count} รายการ</span>
      </span>
    </button>
  );
}
