# ROADMAP — จาก QR Platform สู่ Link Platform (แนว Bitly)

> อัปเดต: 2026-06-26 · สถานะปัจจุบัน: Dynamic QR + analytics + โฟลเดอร์ (MVP+) เสร็จ
> หลักคิด: Bitly = "ลิงก์เป็นพระเอก, QR เป็น feature ของลิงก์" — เราต้องกลับ hierarchy จาก QR-first เป็น Link-first

---

## Phase A — Link-first Architecture ✅ (เสร็จ 2026-06-26)

เปลี่ยน mental model: ตาราง `qr_codes` → แนวคิด `links` ที่ "มี QR ได้" ไม่ใช่ "เป็น QR"

1. **DB**: rename/ปรับ `qr_codes` → `links` (หรือคง table เดิม เพิ่ม view) + เพิ่มคอลัมน์
   - `title`, `tags text[]`, `utm_source/medium/campaign` (หรือเก็บใน destination ตรงๆ)
   - `has_qr boolean` หรือแยกตาราง `qr_styles` (1:1 กับ link) เก็บ fg/bg/dot/logo/size
   - migration: `sql/004_links_refactor.sql`
2. **UI**: หน้า List แสดง "ลิงก์" เป็นแถว (สแกน/คลิกรวมกัน) — การ์ด QR ใหญ่เปลี่ยนเป็น thumbnail เล็ก/ปุ่ม "ดู QR"
3. **สร้างลิงก์โดยไม่ต้องมี QR** — ฟอร์มสร้างสั้นลงเหลือ URL + code แล้วค่อยแต่ง QR ทีหลัง
4. **นับ "คลิก" ไม่ใช่แค่ "สแกน"** — ตาราง `scans` → `clicks` + คอลัมน์ `via` (`qr` / `link`) โดยตรวจจาก referrer/UA ไม่ได้ 100% ให้ใช้ query param `?qr=1` ที่ฝังใน QR URL

**ผลลัพธ์:** สร้าง short link แชร์ในแชท/อีเมลได้เหมือน Bitly โดย QR เป็นออปชัน

**สิ่งที่ทำจริง (deviation จากแผน):** ไม่ rename ตาราง (prod ใช้ DB เดียวกัน เสี่ยงพังช่วงคาบเกี่ยว) — แยกช่องทางด้วย `scans.via` ('qr'/'link') โดย QR ฝัง `?qr=1` (`sql/004`); "ลิงก์ไม่มี QR" = ฟอร์มสร้างพับส่วน QR เก็บ (styles มี default ไม่ต้องแก้ DB); หน้า List เป็นแถวลิงก์ (QR เป็น thumbnail) + CopyButton ทุกแถว; analytics แยกการ์ด สแกน QR / คลิกลิงก์ (แถวเก่า = "ไม่ระบุ")
**ข้อจำกัดที่รู้:** QR ที่พิมพ์ก่อน Phase A ไม่มี `?qr=1` → สแกนจะนับเป็น "คลิกลิงก์"

---

## Phase B — Link Management ครบมือ (คุณภาพชีวิตแบบ Bitly)

1. **ค้นหา + filter** ในหน้า List (ชื่อ/URL/code/แท็ก) — จำเป็นเมื่อลิงก์เกิน ~20 ตัว
2. **Tags** (หลายแท็กต่อลิงก์ เสริมจากโฟลเดอร์) + filter ตามแท็ก
3. **UTM Builder** ในฟอร์มสร้าง/แก้ไข — กรอก source/medium/campaign แล้ว compose ลง destination อัตโนมัติ
4. **Bulk create** — วาง URL หลายบรรทัด / import CSV → สร้างทีละชุด
5. **Copy affordance ทุกที่** (มี CopyButton แล้ว — กระจายไปหน้า List)
6. **Archive** แทนลบจริง (soft delete: `archived_at`)

**ประมาณงาน:** 4–6 วัน · ส่วนใหญ่เป็น UI + query

---

## Phase C — Analytics ระดับ Bitly

1. **Unique vs total clicks** — เก็บ visitor hash (IP+UA daily salt, ไม่เก็บ PII ตรง) นับ unique ต่อวัน
2. **กรอง bot** — UA list (facebookexternalhit, Slackbot, curl ฯลฯ) → คอลัมน์ `is_bot`
3. **Geo ละเอียดขึ้น** — เก็บ `x-vercel-ip-city`, `x-vercel-ip-country-region` เพิ่มจาก country
4. **Dashboard รวม** (ทุกลิงก์) — top links, คลิกรวมรายวัน, breakdown รวม ที่หน้าแรกหรือ `/analytics`
5. **เปรียบเทียบช่วงเวลา** (7 วันนี้ vs 7 วันก่อน) + เลือก date range
6. **Aggregation table** — สรุปรายวัน (`daily_stats`) ด้วย Postgres trigger หรือ cron เพื่อไม่ scan ตาราง clicks ทั้งก้อนทุกครั้ง (สำคัญเมื่อคลิกหลักหมื่น+)

**ประมาณงาน:** 5–8 วัน · `sql/005_analytics_v2.sql`, `src/lib/analytics.ts`, dashboard ใหม่

---

## Phase D — Custom Domains (จุดขายอันดับ 1 ของ Bitly)

ให้แต่ละแบรนด์ใช้โดเมนตัวเอง เช่น `go.tanicha.co/summer`

1. ตาราง `domains` (hostname, brand/group, verified_at)
2. **Middleware** อ่าน `Host` header → ทุกโดเมนที่ verify แล้ว ชี้ path `/{code}` ตรง (ไม่ต้องมี `/r/`) — โค้ด dynamic URL ที่ทำไว้แล้วคือครึ่งทาง
3. ผูกลิงก์กับโดเมน (`domain_id` ใน links, code unique ต่อโดเมน)
4. เพิ่มโดเมนเข้า Vercel อัตโนมัติผ่าน Vercel API (มี MCP/token) + สอนผู้ใช้ตั้ง CNAME
5. UI จัดการโดเมนใน settings

**ประมาณงาน:** 4–6 วัน (ยากตรง DNS flow) · ต้องมี Vercel project + โดเมนจริงทดสอบ

---

## Phase E — Bio Pages แบบ Linktree (หน้ารวมลิงก์ต่อแบรนด์)

หน้า public รวมหลายลิงก์ของแบรนด์ — จุดแข็งของเรา: ลิงก์ในหน้าชี้ผ่าน `/r/{code}` เดิม → **ได้ analytics ต่อคลิกฟรี** และสร้าง QR ให้ทั้งหน้าได้จากระบบ QR ที่มีอยู่

1. **DB** (`sql/00X_bio_pages.sql`):
   - `pages` — `handle` (unique, ใช้ใน URL), `title`, `bio`, `avatar_url`, `theme` (jsonb: สี/พื้นหลัง), `group_name` (ผูกแบรนด์), `is_active`
   - `page_links` — `page_id`, `sort_order`, `label`, และ `link_id` → ชี้ short link ที่มีอยู่ (ได้ tracking) หรือ `url` ตรง (ลิงก์ภายนอกไม่ track)
   - `page_views` — บันทึกเข้าชมหน้า (ใช้โครงเดียวกับ scans: device/referrer/country)
2. **หน้า public `/p/[handle]`** — mobile-first (คนเปิดจาก IG/TikTok bio), theme ตามแบรนด์ (โลโก้+สีจาก group), เร็ว ไม่มี JS หนัก
3. **Editor** — สร้าง/แก้หน้า, เพิ่มลิงก์จาก short links ที่มี (dropdown) หรือใส่ URL ใหม่ (auto-สร้าง short link ให้เลย), ลากเรียงลำดับ (reuse pattern จาก DriveView), preview สด (reuse pattern จาก QRPreview)
4. **Analytics ของหน้า** — views + คลิกต่อปุ่ม (มาจาก scans ของแต่ละ code อยู่แล้ว) + CTR
5. **QR ของหน้า bio** — ปุ่มเดียวสร้าง QR ชี้ `/p/{handle}` พร้อมโลโก้แบรนด์ → use case จริงของทีม: พิมพ์ QR เดียวแปะหน้าร้าน เปิดหน้ารวมทุกช่องทาง

**ประมาณงาน:** 5–7 วัน · เพจ public + editor + SQL

---

## Phase G — Performance & Scale (redirect ต้องเร็วเท่า Bitly)

ตอนนี้ทุก hit = query Supabase (~ร้อย ms) Bitly ตอบระดับ ~10ms

1. **ย้าย redirect ไป Edge Middleware** + cache code→destination (Vercel Edge Config / KV / Upstash) TTL สั้น, invalidate ตอน PATCH
2. **เขียน click log แบบ fire-and-forget** (`waitUntil`) ไม่ block redirect (ตอนนี้ await อยู่)
3. Cache รูป QR (ตอนนี้ gen ใหม่ทุก load — จุดที่ audit เจอแล้ว): เก็บ SVG ลง Supabase Storage ตอนสร้าง/แก้ไข แล้วเสิร์ฟ URL
4. Pagination หน้า List เมื่อลิงก์เยอะ

**ประมาณงาน:** 3–5 วัน · ทำเมื่อเริ่มมี traffic จริง

---

## Phase H — ของแถม (ทำเมื่อ core แน่นแล้ว)

- Password-protected links / คลิกแล้วถามรหัส
- Deep links (เปิดแอปมือถือ)
- Webhook/Integration (แจ้ง Slack เมื่อยอดคลิกถึงเป้า)
- A/B redirect (สุ่มปลายทางตามน้ำหนัก)
- Scheduled destination (เปลี่ยนปลายทางตามช่วงเวลาแคมเปญอัตโนมัติ)

---

## ❌ ตัดออกโดยตั้งใจ (ใช้ภายในทีมเดียว — ยืนยัน 2026-06-26)

- **Auth / Users / Workspaces / สิทธิ์** — ไม่มีผู้ใช้ภายนอก ไม่ต้อง login/RLS
- **Public API + API keys + rate limiting ต่อ key** — ไม่มี consumer ภายนอก
- ถ้าวันหน้าจะเปิดให้เกินทีม ให้กลับมาทำสองเรื่องนี้ *ก่อน* มีข้อมูลหลายทีมจริง (ยิ่งช้ายิ่ง migrate เจ็บ)

---

## ลำดับที่แนะนำ (ใช้ภายใน)

| ลำดับ | Phase | เหตุผล |
|---|---|---|
| 1 | **A** Link-first | รากฐาน ทุก phase อื่นต่อจากนี้ ยิ่งช้ายิ่ง migrate เจ็บ |
| 2 | **B** Management + **C** Analytics | คุณค่าต่อทีมการตลาดทันที ไม่มี dependency ภายนอก |
| 3 | **E** Bio Pages (Linktree) | use case ตรงทีมการตลาดหลายแบรนด์ — QR เดียวเปิดทุกช่องทาง + ได้ analytics ฟรีจากโครงเดิม |
| 4 | **D** Custom domain | จุดที่ทำให้ "แบรนด์" จริงจัง — ลิงก์/หน้า bio สวยระดับ Bitly paid |
| 5 | **G** Performance | ก่อนแคมเปญใหญ่ / QR บนสื่อสิ่งพิมพ์จำนวนมาก |
| 6 | **H** extras | ตามความต้องการจริง |

รวมประมาณ **24–37 วันทำงาน** ครบทุก phase (A→B→C→E→D→G)

## หมายเหตุทางเทคนิคที่สั่งสมไว้แล้ว (ได้เปรียบ)

- Dynamic base URL จาก Host header ✅ → Phase D ง่ายขึ้นมาก
- โครง analytics (device/referrer/country + fallback insert) ✅ → Phase C ต่อยอดตรงๆ
- DESIGN.md + PRODUCT.md ✅ → ทุกหน้าใหม่มีสเปกดีไซน์กำกับ
- ข้อจำกัดที่ต้องจำ: schema เปลี่ยนต้องรัน SQL เองใน Supabase (ไม่มี migration tooling), Prisma เป็นแค่เอกสาร
