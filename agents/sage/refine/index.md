# refine — domain index

กติกาการตีบวก (refine) ของ Ragnarok Online ที่ Refine Simulator จำลอง —
อัตราสำเร็จ, ผลเมื่อล้มเหลว, BSB, event items และ pity

Code: `src/data/refine-rates.ts`, `src/data/event-refine-items.ts`,
`src/pages/tools/refine-simulator/refineSimulatorLogic.ts` (+ `.test.ts`)

| Entry | Status | Enforcement |
| --- | --- | --- |
| `context.md` — glossary: safety level, BSB, ore ปกติ/Enriched-HD, ether type, event item, Rate Up, pity | proposed | — |
| `decisions/fail-outcome-priority.md` — ลำดับผลเมื่อล้มเหลว: BSB → ether drop (<+10) → noBreak −1 → แตก | proposed | block |
| `decisions/rate-tables-indexed-by-from-level.md` — `rates[i]` = โอกาส +i→+i+1, ยาวเท่า `maxLevel` | proposed | block |
| `decisions/rate-up-items-use-standard-mechanics.md` — Rate Up item ต้อง `noBreak/noLevelLoss: false` + `baseEquipType` | proposed | block |
