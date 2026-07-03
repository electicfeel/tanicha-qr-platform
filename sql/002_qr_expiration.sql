-- Phase 3: เพิ่มวันหมดอายุให้ QR (optional ต่อ QR)
-- รันใน Supabase SQL Editor
-- nullable: QR เดิมไม่มีวันหมดอายุ = ใช้ได้ตลอด

alter table public.qr_codes add column if not exists expires_at timestamptz;
