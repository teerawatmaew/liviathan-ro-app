# mp-jigsaw — domain index

MP Jigsaw Calculator (`/tools/mp-jigsaw-calculator`) — จำนวน Jigsaw ที่ได้จาก Mystical Pass ตามเลเวล

Code: `src/pages/tools/mp-jigsaw-calculator/mpJigsawLogic.ts` (+ `.test.ts`), `MpJigsawCalculatorPage.tsx`

| Entry | Status | Enforcement |
| --- | --- | --- |
| `context.md` — glossary: Mystical Pass level, Box, special level bonus | proposed | — |
| `decisions/box-formula.md` — กล่อง = `fromFirst100 + floor((level−100)/levelPerBox) + (level ≥ specialLevel ? 30 : 0)` | proposed | block |
| `decisions/infinity-means-no-rule.md` — `Infinity` ใน `BOXES` = "ไม่มีกฎนี้" ⇒ ต้องกรองด้วย `Number.isFinite` ก่อนแสดง | proposed | warn |
