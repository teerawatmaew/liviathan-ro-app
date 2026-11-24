---
id: fail-outcome-priority
type: convention
title: ลำดับผลเมื่อ refine ล้มเหลว
domain: refine
tags: [refine, simulator, game-rule]
status: proposed
enforcement: block
applies_to: [refine, "src/pages/tools/refine-simulator/refineSimulatorLogic.ts"]
source: ai
related: [rate-up-items-use-standard-mechanics]
timestamp: 2026-11-24T00:00:00Z
---

`rollOne(lvl, params)` ตัดสินผลเมื่อล้มตามลำดับนี้ (ตัวแรกที่เข้าเงื่อนไขชนะ):

1. **event item built-in** (`item.noBreak && item.noLevelLoss`) — ขั้นคงเดิม, สะสม pity, ไม่ใช้ BSB
2. **`noLevelLoss` (BSB)** — ขั้นคงเดิม, `bsbUsed = (useEventBsb ? BSB_EVENT_COSTS : BSB_COSTS)[lvl] ?? 0`
3. **ether type และ `lvl < 10`** — ลด 3 ขั้น (normal) / 1 ขั้น (enrichedHd), ไม่แตก, ไม่ต่ำกว่า 0
4. **`noBreak`** — ลด 1 ขั้น ไม่แตก
5. **default** — แตก, ขั้น → 0

สำเร็จ = `Math.random() * 100 < rate` ⇒ `lvl + 1` และ pity reset เป็น 0

ข้อ 2–5 ใช้เหมือนกันทั้งอุปกรณ์มาตรฐานและ Rate Up item (ether check ของ Rate Up ดูจาก `baseEquipType`)
เปลี่ยนลำดับนี้ = เปลี่ยนกติกาเกม ต้องมีแหล่งอ้างอิงและแก้ `refineSimulatorLogic.test.ts` ด้วย
