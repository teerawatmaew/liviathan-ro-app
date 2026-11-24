# item-cost — domain index

Item Cost Calculator (`/tools/item-cost-calculator`, ชื่อในหน้า "Enhancement Cost") — คำนวณ Zeny และวัตถุดิบ
ของการทำ Enhancement Stone (Reform & Craft) และ Grade Item (Etel)

Code: `src/pages/tools/item-cost-calculator/` — logic ทั้งหมดอยู่ใน `types.ts` (+ `types.test.ts`),
UI แยกเป็น `ReformSection.tsx` / `GradeSection.tsx`

| Entry | Status | Enforcement |
| --- | --- | --- |
| `context.md` — glossary: Enhancement Stone grade chain, Shadowdecon, Etel recipe, ราคาตลาด vs คำนวณจาก Etel Dust | proposed | — |
| `decisions/grade-chain-triples-per-step.md` — Supreme ← 3 High ← 3 Medium ← 3 Low ← Shadowdecon 1:1; ค่าทำต่อชิ้นตาม `CRAFT_ZENY` | proposed | block |
| `decisions/unpriced-materials-must-be-flagged.md` — ราคาที่ไม่ได้กรอก = 0 ใน `total` ⇒ UI ต้องเตือนว่ายอดยังไม่รวม | proposed | warn |
| `decisions/persisted-lists-need-safe-ids-and-validation.md` — รายการ persist ใน localStorage ⇒ id = `nextId(prev)` และกรองข้อมูลเก่าที่ไม่ valid | proposed | warn |
