---
id: app-rules
type: convention
title: LiviathaN RO — app conventions
domain: app
status: proposed
enforcement: warn
applies_to: [app, "src/**"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

## Stack (จาก `package.json`)

React 19 · react-router-dom v7 (`createBrowserRouter`) · Vite 8 · TypeScript ~6 · Tailwind v4 (CSS-first, ไม่มี `tailwind.config.js`) · shadcn/ui style `radix-nova` + `radix-ui` · lucide-react · Vitest 4 (environment `node`) · deploy Vercel (SPA rewrite ใน `vercel.json`) · pnpm

ไม่มี backend/API — ข้อมูลเกมทั้งหมดเป็น static TS ใน repo, state ผู้ใช้อยู่ใน localStorage

## Layout

- `src/pages/<section>/<name>/<Name>Page.tsx` — page + sub-component ที่ใช้เฉพาะหน้านั้นอยู่โฟลเดอร์เดียวกัน
- `src/features/<feature>/` — component/logic ที่ใช้ข้ามหน้า
- `src/data/` — game data ที่ใช้ ≥2 features · `src/features/<x>/data/` — data เฉพาะ feature
- `src/types/index.ts` — types ที่ใช้ข้าม feature
- import ด้วย `@/…` (= `src/…`) เสมอ

## Reusable assets — ใช้ก่อนเขียนใหม่

| Asset | ใช้ทำอะไร |
| --- | --- |
| `PATHS` (`src/routes/paths.ts`) | URL ทุกตัว — ห้าม hardcode string |
| `Lazy` + `lazy()` (`src/routes/lazy-pages.tsx`) | ทุก page โหลดแบบ lazy ผ่าน Suspense + `PageLoader` |
| `useLocalStorage(key, init)` (`src/hooks/use-local-storage.ts`) | drop-in แทน `useState` ที่ persist; error/quota ถูกกลืนเงียบ |
| `usePageTitle(title)` | ตั้ง `document.title` = `<title> — LiviathaN RO` |
| `useTheme()` | `[theme, toggle]`, key `lro-theme`, default `dark` |
| `cn()` (`src/lib/utils.ts`) | รวม className (clsx + tailwind-merge) |
| `src/components/ui/*` | shadcn: badge, button, card, dialog, input, label, page-loader, select, separator, sheet, sidebar, skeleton, textarea, tooltip |
| `formatZeny()` (`pages/tools/item-cost-calculator/types.ts`) | format ตัวเลข Zeny |
| `src/data/refine-rates.ts`, `event-refine-items.ts` | ดู domain [`refine`](../refine/index.md) |

## Rules

1. ข้อความ UI เป็นภาษาไทย (ชื่อไอเทม/แร่ในเกมคงชื่ออังกฤษตามเกม) — ไม่มี i18n library
2. คำนวณด้วย `useMemo` / derive ตอน render — ห้ามใช้ `useEffect` เพื่อ sync ผลคำนวณ
3. logic เกม (สูตร, การสุ่ม) อยู่ในไฟล์ `.ts` pure function มี `*.test.ts` ข้างกัน
4. ติดตั้ง shadcn component ใหม่ด้วย `npx shadcn@latest add <x>` แล้วย้ายไฟล์จากโฟลเดอร์ `@/` ที่สร้างผิดที่เข้า `src/components/ui/` (alias ทำให้ CLI วางผิด)
5. ก่อนส่งงาน: `pnpm test` และ `pnpm run build` (build รัน `tsc -b` — import ที่หายจะ fail ที่นี่)
6. ข้อมูลเกมที่มาจากรูป/ประกาศในเกม ให้ใส่ comment อ้างแหล่งและช่วงวันที่ event ไว้ใน data file
