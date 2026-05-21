# Dev Session — 2026-05-21

## Release: v0.2.0

### User-facing (บันทึกใน changelog.ts)

- **feat** เพิ่มเครื่องมือ **Zeny ↔ Baht Calculator** (`/tools/zeny-calculator`)
  - แปลง Zeny → บาท และ บาท → Zeny แบบ two-way real-time
  - รองรับหน่วย M (ล้าน) และ Zeny ตัวเลขปกติ
  - ต้องกรอกอัตราตลาดเอง ไม่มีค่า default (เพราะราคาผันผวน)
  - เมนูใน sidebar: "Zeny → Baht" (icon: Coins)

---

### Internal / ไม่บันทึกใน changelog สาธารณะ

- **improve** หลายหน้าย้าย `useState` → `useLocalStorage` เพื่อ persist state ข้าม session
  | หน้า | key ที่บันทึก |
  |---|---|
  | StatCalculatorPage | `lro-stat-level`, `lro-stat-job`, `lro-stat-stats` |
  | MpJigsawCalculatorPage | `lro-mp-level` |
  | RefineSimulatorPage | `lro-refine-equipType`, `lro-refine-oreType`, `lro-refine-startLevel`, `lro-refine-targetLevel`, `lro-refine-noBreak`, `lro-refine-noLevelLoss`, `lro-refine-useEventBsb` |
  | ItemCostCalculatorPage | `lro-item-section` |
  | ReformSection | `lro-reform-sdPrice` |
  | GradeSection | `lro-grade-prices`, `lro-grade-calcEtelFromDust` |

---

## Files changed

```
src/layouts/MainLayout.tsx
src/routes/paths.ts
src/routes/lazy-pages.tsx
src/routes/index.tsx
src/pages/tools/zeny-calculator/ZenyCalculatorPage.tsx  (new)
src/pages/tools/stat/StatCalculatorPage.tsx
src/pages/tools/mp-jigsaw-calculator/MpJigsawCalculatorPage.tsx
src/pages/tools/refine-simulator/RefineSimulatorPage.tsx
src/pages/tools/item-cost-calculator/ItemCostCalculatorPage.tsx
src/pages/tools/item-cost-calculator/ReformSection.tsx
src/pages/tools/item-cost-calculator/GradeSection.tsx
src/data/changelog.ts
package.json
```
