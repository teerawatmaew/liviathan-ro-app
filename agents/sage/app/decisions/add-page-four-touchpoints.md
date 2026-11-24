---
id: add-page-four-touchpoints
type: convention
title: เพิ่มหน้าใหม่ต้องแตะ 4 ที่ — และลบหน้าก็ต้องถอนครบ 4 ที่
domain: app
tags: [routing, navigation, lazy-loading]
status: proposed
enforcement: warn
applies_to: [app, "src/routes/**", "src/layouts/MainLayout.tsx", "src/pages/**"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

เพิ่มหน้า (ขั้นตอนเต็มใน `.github/copilot-instructions.md` §4):

1. `src/routes/paths.ts` — เพิ่ม key ใน `PATHS`
2. `src/pages/<section>/<name>/<Name>Page.tsx` — `export default`
3. `src/routes/lazy-pages.tsx` (`lazy(() => import(...))`) **และ** `src/routes/index.tsx` (`<Lazy><XPage /></Lazy>`)
4. `src/layouts/MainLayout.tsx` — เพิ่มใน `navSections` (+ lucide icon)

**ลบหน้า = ถอนทั้ง 4 จุด** ถ้าลบไฟล์ page แต่ยังเหลือ `lazy(() => import(...))` ชี้อยู่ `tsc -b` / Vite build จะ fail
(dynamic import ชี้ไฟล์ที่ไม่มี) — ตรวจด้วย `pnpm run build` ทุกครั้ง

ถ้ามีหน้าที่ควรขึ้นหน้าแรก ให้ดู shortcut ใน `HomePage.tsx` ด้วย และเพิ่ม entry `feat` ใน changelog
(ดู `release-bumps-version-and-changelog`).
