import { headers } from "next/headers";

// ตั้ง NEXT_PUBLIC_BASE_URL ได้ถ้าอยากบังคับโดเมน canonical
// ปกติไม่ต้องตั้ง — ระบบจะอ่านจาก request header ให้เอง (โดเมนไหนก็ใช้ได้)
function envOverride(): string | null {
  const v = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  return v ? v.replace(/\/+$/, "") : null;
}

// แปลง request headers → origin เช่น https://qr.example.com
function fromHeaders(h: Headers): string {
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto") ??
      (/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(host) ? "http" : "https");
    return `${proto}://${host}`;
  }
  // fallback สุดท้ายเมื่ออ่าน host ไม่ได้
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** ใช้ใน Server Component (อยู่ใน request scope) */
export async function getBaseUrl(): Promise<string> {
  return envOverride() ?? fromHeaders(await headers());
}

/** ใช้ใน Route Handler ที่มี req อยู่แล้ว */
export function getBaseUrlFromRequest(req: { headers: Headers }): string {
  return envOverride() ?? fromHeaders(req.headers);
}
