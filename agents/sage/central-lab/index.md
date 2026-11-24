# central-lab — domain index

Central Lab Helper (`/tools/central-lab-helper`) — ช่วยเล่น dungeon Central Laboratory:
แปลงเลขเป็นสวิทช์, จับเวลา phase, ค้นหาบอส + ธาตุที่ได้เปรียบ

Code:
- `src/pages/tools/central-lab-helper/` — `SwitchDecoder.tsx` + `switchLogic.ts` (+ test), `PhaseTimers.tsx`
- `src/features/centrallab/` — `BossLookup.tsx`, `CountdownTimer.tsx`, `data/bosses.ts`, `types.ts`
- ตารางธาตุอยู่ที่ `src/data/elements.ts` (`getBestAttackerElements`) — `features/centrallab/data/elements.ts` เป็น re-export

| Entry | Status | Enforcement |
| --- | --- | --- |
| `context.md` — glossary: switch SW1–SW8, phase, stage / mini boss, defender element | proposed | — |
| `decisions/switch-bit-order.md` — SW8 = bit 7 (MSB) … SW1 = bit 0, ช่วง 1–255, ไม่ clamp ระหว่างพิมพ์ | proposed | block |
| `decisions/timers-use-end-timestamp.md` — นับถอยหลังจาก `Date.now()` ถึงเวลาสิ้นสุด ไม่ใช่ลบทีละวินาที | proposed | warn |
| `decisions/boss-data-from-irowiki.md` — ข้อมูลบอสอ้างจาก iRO Wiki; stage เป็น `'mini'` หรือ 1–3 | proposed | advise |
