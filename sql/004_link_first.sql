-- Phase A: Link-first — แยกช่องทางเข้าถึง (คลิกลิงก์ vs สแกน QR)
-- รันใน Supabase SQL Editor
-- หมายเหตุ: รวมเนื้อหา 003 (group_name) ไว้ด้วย — ถ้ายังไม่เคยรัน 003 รันไฟล์นี้ไฟล์เดียวพอ

-- จาก 003 (idempotent)
alter table public.qr_codes add column if not exists group_name text;
create index if not exists qr_codes_group_name_idx
  on public.qr_codes (group_name);

-- ช่องทางการเข้าถึงลิงก์: 'qr' = สแกนจาก QR (?qr=1), 'link' = คลิกลิงก์ตรง
-- แถวเก่าเป็น NULL = ไม่ระบุ (เก็บก่อนมีระบบแยก)
alter table public.scans add column if not exists via text;

create index if not exists scans_via_idx on public.scans (via);
