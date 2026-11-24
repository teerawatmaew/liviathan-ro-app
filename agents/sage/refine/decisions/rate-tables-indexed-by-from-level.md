---
id: rate-tables-indexed-by-from-level
type: convention
title: ตาราง rate ใช้ index = fromLevel และยาวเท่า maxLevel
domain: refine
tags: [refine, data, rates]
status: proposed
enforcement: block
applies_to: [refine, "src/data/refine-rates.ts", "src/data/event-refine-items.ts"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

ทุก array ของ rate (`REFINE_RATES[type].normal/enrichedHd`, `EventRefineItem.rates/enrichedRates/pityCaps`):

- `rates[i]` = % สำเร็จของการตีจาก **+i → +i+1** (0–100) — ไม่ใช่ขั้นปลายทาง
- ความยาว = `maxLevel` (เช่น maxLevel 20 ⇒ 20 ค่า, index 0–19)
- ค่าที่หาย ระบบ fallback เป็น 100 (`?? 100`) **เงียบๆ** ⇒ array สั้นไปหนึ่งตัวจะทำให้ขั้นสุดท้ายสำเร็จ 100% โดยไม่มี error
- เขียน comment หัวคอลัมน์ `// +0 +1 +2 …` เหนือ array (แบบที่ Rate Up items ทำ) เพื่อจับตำแหน่งผิดง่าย
- ค่าที่ประมาณเอง (ไม่มีในต้นฉบับ) ให้ comment บอกว่าประมาณ และอ้างอิงจากอะไร
- `BSB_COSTS` เป็น `Record<fromLevel, count>` เช่นกัน

เพิ่ม/แก้ตาราง ⇒ เพิ่ม test ที่เช็คความยาว array = `maxLevel` และค่าตัวอย่างอย่างน้อยหนึ่งขั้น
