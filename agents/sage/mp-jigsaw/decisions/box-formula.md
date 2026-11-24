---
id: box-formula
type: convention
title: สูตรจำนวนกล่อง MP Jigsaw และข้อมูลกล่องอ้างอิงจากรูปในเกม
domain: mp-jigsaw
tags: [mp-jigsaw, game-rule, data]
status: proposed
enforcement: block
applies_to: [mp-jigsaw, "src/pages/tools/mp-jigsaw-calculator/mpJigsawLogic.ts"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

`calcBox(level, box)`:

```
fromAbove100 = floor((level − 100) / levelPerBox)
fromBonus    = level ≥ specialLevel ? 30 : 0
totalBoxes   = fromFirst100 + fromAbove100 + fromBonus
totalJigsaw  = totalBoxes × jigsawPerBox
```

ค่าใน `BOXES` มาจากรูปตารางรางวัลในเกม — เคยแก้ Box 1 `fromFirst100` 32 → 31 และ Box 2 13 → 11 (commit 7db3c97)
โดยลืมแก้ test ทำให้ main test พังจนถึง 2026-11-24 ⇒ **แก้ค่าใน `BOXES` ต้องแก้ `mpJigsawLogic.test.ts` ในรอบเดียวกัน**

ข้อความอ้างอิงในหน้า (การ์ด "ข้อมูลอ้างอิง") สร้างจาก `BOXES` โดยตรง — ห้ามเขียนตัวเลขซ้ำเป็นข้อความ hardcode
