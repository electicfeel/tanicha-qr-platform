import type { ScanAnalytics as Analytics, Breakdown } from "@/lib/analytics";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
}

function BarChart({ daily }: { daily: Analytics["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  return (
    <div className="flex items-end gap-[2px] h-32">
      {daily.map((d) => (
        <div key={d.date} className="flex-1 group relative flex items-end h-full">
          <div
            className="w-full bg-emerald-500/70 rounded-sm hover:bg-emerald-400 transition-colors min-h-[2px]"
            style={{ height: `${(d.count / max) * 100}%` }}
          />
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-neutral-800 text-neutral-100 text-xs px-2 py-1 rounded">
            {formatDate(d.date)}: {d.count}
          </div>
        </div>
      ))}
    </div>
  );
}

function BreakdownList({ items, total }: { items: Breakdown[]; total: number }) {
  if (items.length === 0) return <p className="text-neutral-500 text-sm">ยังไม่มีข้อมูล</p>;
  return (
    <ul className="flex flex-col gap-2">
      {items.slice(0, 5).map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <li key={item.label} className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-neutral-300 truncate max-w-[70%]">{item.label}</span>
              <span className="text-neutral-500">{item.count} · {pct}%</span>
            </div>
            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-neutral-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function ScanAnalytics({
  analytics,
  exportHref,
}: {
  analytics: Analytics;
  exportHref: string;
}) {
  const { total, qrScans, linkClicks, lastScanAt, daily, devices, countries, referrers } = analytics;
  const legacy = total - qrScans - linkClicks; // แถวเก่าก่อนมีระบบแยกช่องทาง

  return (
    <section className="mt-12 border-t border-neutral-800 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">สถิติการเข้าถึง</h2>
        <a
          href={exportHref}
          className="focus-ring text-xs border border-neutral-700 rounded-lg px-3 py-1.5 hover:border-neutral-400 transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-500 text-xs">เข้าถึงทั้งหมด</p>
          <p className="text-2xl font-semibold mt-1">{total}</p>
        </div>
        <div className="border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-500 text-xs">สแกน QR</p>
          <p className="text-2xl font-semibold mt-1">{qrScans}</p>
        </div>
        <div className="border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-500 text-xs">คลิกลิงก์</p>
          <p className="text-2xl font-semibold mt-1">{linkClicks}</p>
        </div>
        <div className="border border-neutral-800 rounded-xl p-4">
          <p className="text-neutral-500 text-xs">ล่าสุด</p>
          <p className="text-sm font-medium mt-2">
            {lastScanAt ? new Date(lastScanAt).toLocaleString("th-TH") : "—"}
          </p>
        </div>
      </div>
      {legacy > 0 && (
        <p className="text-neutral-500 text-xs mt-2">
          * {legacy} ครั้งเป็นข้อมูลเก่าก่อนระบบแยกช่องทาง (นับรวมใน &ldquo;เข้าถึงทั้งหมด&rdquo;)
        </p>
      )}
      </div>

      <div className="border border-neutral-800 rounded-xl p-5 mb-8">
        <p className="text-neutral-400 text-sm mb-4">30 วันล่าสุด</p>
        <BarChart daily={daily} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-neutral-400 mb-3">อุปกรณ์</h3>
          <BreakdownList items={devices} total={total} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-400 mb-3">ประเทศ</h3>
          <BreakdownList items={countries} total={total} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-400 mb-3">ที่มา (Referrer)</h3>
          <BreakdownList items={referrers} total={total} />
        </div>
      </div>
    </section>
  );
}
