export type DeviceType = "mobile" | "tablet" | "desktop";

// แยกประเภทอุปกรณ์จาก user-agent แบบเบาๆ (พอสำหรับ analytics เชิงภาพรวม)
export function detectDeviceType(userAgent: string | null): DeviceType {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)) return "mobile";
  return "desktop";
}
