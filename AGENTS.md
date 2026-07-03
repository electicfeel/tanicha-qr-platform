<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project context

**TANICHA Link Platform** — เครื่องมือภายในทีมการตลาด (หลายแบรนด์) แนว Bitly: dynamic short links (`/r/{code}`) เป็นแกน, QR + analytics + bio pages (`/p/{handle}`) ต่อยอดจากลิงก์ UI ภาษาไทย

อ่านก่อนทำงาน:
- `PRODUCT.md` — users, purpose, design principles, ขอบเขตที่ตัด (ไม่มี auth/public API โดยตั้งใจ — ใช้ภายใน)
- `DESIGN.md` — visual system (dark, flat, border-defined; emerald = state signal เท่านั้น; WCAG AA)
- `ROADMAP.md` — แผน Phase A–H และลำดับ

ข้อจำกัดทางเทคนิค:
- **DB schema เปลี่ยนต้องรัน SQL เองใน Supabase SQL Editor** — เขียน migration ไว้ที่ `sql/NNN_*.sql` แล้วให้ผู้ใช้รัน (service key รัน DDL ไม่ได้, ไม่มี migration tooling)
- Prisma schema เป็นเอกสารเท่านั้น — runtime ใช้ Supabase JS client, ตาราง DB เป็น snake_case
- โค้ดที่แตะคอลัมน์ใหม่ต้องมี fallback กันพังระหว่างที่ migration ยังไม่ถูกรัน
- `.env` ถูก gitignore — worktree ใหม่ต้อง copy จาก project root
- Base URL อ่านจาก request host (dynamic) — ห้าม hardcode domain, อย่าตั้ง `NEXT_PUBLIC_BASE_URL` บน production
