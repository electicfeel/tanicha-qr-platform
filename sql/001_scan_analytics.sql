-- Phase 1: enrich scan records for analytics
-- รันใน Supabase SQL Editor (Project > SQL Editor)
-- ปลอดภัยกับข้อมูลเดิม: เพิ่มคอลัมน์แบบ nullable, scan เก่าจะเป็น NULL

alter table public.scans add column if not exists user_agent  text;
alter table public.scans add column if not exists referrer    text;
alter table public.scans add column if not exists device_type text;
alter table public.scans add column if not exists country     text;

-- index สำหรับ query analytics ตามช่วงเวลาของ QR แต่ละตัว
create index if not exists scans_qr_code_id_scanned_at_idx
  on public.scans (qr_code_id, scanned_at desc);
