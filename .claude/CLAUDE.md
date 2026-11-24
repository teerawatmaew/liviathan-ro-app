# LiviathaN RO

เว็บรวมเครื่องมือ / คำนวณ / คอนเทนต์สำหรับ Ragnarok Online — React 19 + Vite SPA, ไม่มี backend, deploy บน Vercel

## ⚠️ ภาษา — ใช้ภาษาไทยเป็นหลัก

ผู้พัฒนามีคนเดียวและใช้ภาษาไทย ⇒ ตอบ, สรุปงาน, ข้อความ UI, changelog, docs, knowledge, comment และ bullet ใน commit
เป็น**ภาษาไทย** · คงภาษาอังกฤษเฉพาะโค้ด (ชื่อตัวแปร/ไฟล์/route), ศัพท์เทคนิค และชื่อไอเทมในเกม
รายละเอียด: `agents/sage/app/decisions/thai-first-language.md`

## Knowledge sources

1. **Team decisions (Sage)** — `agents/sage/index.md` → `<domain>/index.md` → `rules.md` / `decisions/<slug>.md`
   - `app` — routing/pages, data layer, localStorage, release/changelog, theming
   - `refine` — กติกา refine, ตาราง rate, BSB, event / Rate Up items, pity
   อ่าน `index.md` ของ domain ที่เกี่ยวข้องก่อนแก้โค้ดในส่วนนั้น และทำตาม `enforcement` (`block` > `warn` > `advise`)
2. **โครงสร้างโปรเจกต์ + ขั้นตอนเพิ่มหน้า/ข้อมูล** — `.github/copilot-instructions.md`
3. **บันทึกแต่ละ session** — `docs/dev-session-*.md`

**Sage protocol** — `agents/sage/AGENTS.md` (อยู่ใต้ `agents/sage/` ไม่ใช่ root) Claude Code **ไม่โหลดอัตโนมัติ**
สั่ง `/sage` เมื่อจะทำงานที่ไม่ trivial · `/sage-learning` เพื่อเก็บ knowledge เพิ่ม · `/sage-update` เพื่ออัปเดต Sage

## บันทึกความรู้

| ความรู้ | ที่บันทึก |
|---|---|
| กฎ · กับดัก · กติกาเกม · convention ที่ลงโค้ดแล้ว | `agents/sage/<domain>/decisions/<slug>.md` (`status: proposed`, `source: ai`) + เพิ่มแถวใน `<domain>/index.md` |
| คำศัพท์ของ domain | `agents/sage/<domain>/context.md` |
| สิ่งที่ทำในแต่ละรอบ / ของค้าง | `docs/dev-session-YYYY-MM-DD.md` |

ห้ามแก้ไฟล์ที่อยู่ใน `agents/sage/install-manifest.txt` หรือ `agents/sage/commands/` — `/sage-update` จะเขียนทับ

## Precedence

โค้ดปัจจุบันชนะเสมอ — ถ้า knowledge ไม่ตรงกับโค้ด ให้แก้ knowledge ในรอบเดียวกัน

## Commands

```bash
pnpm dev          # http://localhost:5173
pnpm test         # vitest run
pnpm run lint
pnpm run build    # tsc -b && vite build
```

ก่อนส่งงาน: `pnpm test`, `pnpm run lint`, `pnpm run build` ต้องผ่านทั้งหมด
การเปลี่ยนที่ผู้ใช้เห็น ⇒ bump `package.json` + เพิ่ม entry หัว `src/data/changelog.ts`
