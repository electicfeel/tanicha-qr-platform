import type { DailyCount } from "@/lib/analytics";

// แท่งกราฟจิ๋วแสดงเทรนด์ scan รายวัน (ใช้บนการ์ด dashboard)
export default function Sparkline({ daily }: { daily: DailyCount[] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  return (
    <div className="flex items-end gap-[3px] h-6" aria-hidden>
      {daily.map((d) => (
        <div
          key={d.date}
          title={`${d.date}: ${d.count}`}
          className="flex-1 bg-emerald-500/60 rounded-[1px] min-h-[2px]"
          style={{ height: `${(d.count / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
