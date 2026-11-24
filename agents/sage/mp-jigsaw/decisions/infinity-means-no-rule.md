---
id: infinity-means-no-rule
type: convention
title: "`Infinity` ใน BOXES หมายถึง 'ไม่มีกฎนี้' — กรองด้วย Number.isFinite ก่อนแสดงผล"
domain: mp-jigsaw
tags: [mp-jigsaw, ui, regression]
status: proposed
enforcement: warn
applies_to: [mp-jigsaw, "src/pages/tools/mp-jigsaw-calculator/**"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

Start Premium Jigsaw และ Bonus Jigsaw ใช้ `levelPerBox: Infinity` และ `specialLevel: Infinity` เพื่อให้สูตรใน
`calcBox` ได้ 0 อัตโนมัติ (`floor(x / Infinity) = 0`, `level ≥ Infinity` เป็น false)

แต่ถ้าเอาค่าไปแสดงหรือใช้กรองตรงๆ จะได้ผลผิด — เคยเกิดบน production: กล่อง "โบนัสที่กำลังจะถึง" แสดง
**"เวล ∞ (+30 กล่อง) — อีก ∞ เวล"** (`level < Infinity` เป็น true เสมอ)

- ใช้ `getUpcomingBonuses(level)` ซึ่งกรอง `Number.isFinite(box.specialLevel)` แล้ว
- โค้ด UI ใหม่ที่อ่าน `levelPerBox` / `specialLevel` ต้องเช็ค `Number.isFinite` ก่อนแสดง
