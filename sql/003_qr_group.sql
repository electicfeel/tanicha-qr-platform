-- Feature: จัดกลุ่ม QR ตามแบรนด์/กลุ่ม
-- รันใน Supabase SQL Editor
-- nullable: QR เดิมจะไม่มีกลุ่ม (แสดงเป็น "ไม่มีกลุ่ม")

alter table public.qr_codes add column if not exists group_name text;

create index if not exists qr_codes_group_name_idx
  on public.qr_codes (group_name);
