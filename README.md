# TANICHA Link Platform

เครื่องมือภายในทีมการตลาด (หลายแบรนด์) แนว Bitly — **dynamic short links** เป็นแกน ต่อยอดด้วย QR, analytics และ bio pages

- `/r/{code}` — short link เปลี่ยนปลายทางได้ตลอด (ลิงก์/QR ที่แชร์ไปแล้วไม่เปลี่ยน)
- QR ปรับแต่งได้ (สี, dot style, โลโก้แบรนด์) ดาวน์โหลด PNG/SVG
- Analytics ต่อลิงก์: อุปกรณ์ / referrer / ประเทศ / กราฟรายวัน / export CSV
- จัดกลุ่มตามแบรนด์แบบโฟลเดอร์ (drag & drop)
- (แผน) Bio pages `/p/{handle}` แบบ Linktree + custom domain ต่อแบรนด์ — ดู [ROADMAP.md](ROADMAP.md)

## เอกสารโปรเจกต์

| ไฟล์ | เนื้อหา |
|---|---|
| [PRODUCT.md](PRODUCT.md) | ผู้ใช้, จุดประสงค์, design principles, ขอบเขตที่ตัด |
| [DESIGN.md](DESIGN.md) | visual system (tokens, components, กติกา) |
| [ROADMAP.md](ROADMAP.md) | แผนพัฒนา Phase A–H |
| [AGENTS.md](AGENTS.md) | context + ข้อจำกัดสำหรับ AI agents |

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind 4 · Supabase (Postgres + Storage) · `qrcode` + `sharp`

## Setup

```bash
npm install
cp /path/to/.env .env   # ต้องมี NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
npm run dev             # http://localhost:3000
```

**Database migrations:** ไม่มี tooling อัตโนมัติ — รันไฟล์ใน [`sql/`](sql/) ตามลำดับเลขใน Supabase Dashboard → SQL Editor (ทุกไฟล์เป็น `if not exists` รันซ้ำได้)

**Env สำคัญ:** อย่าตั้ง `NEXT_PUBLIC_BASE_URL` บน production — ระบบอ่านโดเมนจาก request host เอง (รองรับหลายโดเมน) ตั้งเฉพาะเมื่อต้องการบังคับ canonical domain

## คำสั่ง

```bash
npm run dev     # dev server (Turbopack)
npm run build   # production build + typecheck
npm run lint    # eslint
```
