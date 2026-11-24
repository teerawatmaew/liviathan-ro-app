---
id: pure-logic-files-with-colocated-tests
type: convention
title: แยก logic เกมเป็น pure `.ts` + `*.test.ts` ข้างกัน
domain: app
tags: [testing, vitest, architecture]
status: proposed
enforcement: warn
applies_to: [app, "src/**/*.ts"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

Pattern ที่ใช้ซ้ำ: `refineSimulatorLogic.ts`, `mpJigsawLogic.ts`, `item-cost-calculator/types.ts`,
`features/calculator/formulas.ts`, `data/refine-rates.ts` — แต่ละตัวมี `*.test.ts` อยู่ข้างไฟล์

- สูตร/กติกาเกมอยู่ใน pure function (ไม่แตะ React, DOM, localStorage) ⇒ test ได้ด้วย Vitest `environment: 'node'`
- Page `.tsx` เรียก function เหล่านี้ใน `useMemo` หรือ event handler
- ฟังก์ชันที่สุ่ม (`rollOne`) ใช้ `Math.random()` ตรงๆ — test ด้วย `vi.spyOn(Math, 'random')` หรือกรณี rate 100%
- แก้กฎเกม/ตาราง rate ⇒ เพิ่มหรือแก้ test ที่ล็อกพฤติกรรมนั้นในรอบเดียวกัน
- ยังไม่มี component test (ไม่มี jsdom/Testing Library) — ถ้าจะเพิ่มต้องตั้ง environment แยก ไม่เปลี่ยน default `node`
