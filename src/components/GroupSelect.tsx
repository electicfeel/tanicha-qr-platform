"use client";

import { useEffect, useId, useState } from "react";

// ช่องเลือกแบรนด์/กลุ่ม — พิมพ์ใหม่ได้ หรือเลือกจากที่เคยมี (datalist)
export default function GroupSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [groups, setGroups] = useState<string[]>([]);
  const uid = useId();
  const inputId = `${uid}-group`;
  const listId = `${uid}-grouplist`;

  useEffect(() => {
    fetch("/api/qr/groups")
      .then((r) => (r.ok ? r.json() : []))
      .then((g) => setGroups(Array.isArray(g) ? g : []))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm text-neutral-400">แบรนด์ / กลุ่ม</label>
      <input
        id={inputId}
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="เช่น TANICHA, แบรนด์ A (เว้นว่างได้)"
        className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-400 placeholder-neutral-500"
      />
      <datalist id={listId}>
        {groups.map((g) => (
          <option key={g} value={g} />
        ))}
      </datalist>
    </div>
  );
}
