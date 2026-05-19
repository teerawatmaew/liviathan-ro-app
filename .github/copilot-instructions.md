# LiviathaN RO — Agent & Developer Instructions

> ไฟล์นี้เป็น **แหล่งความรู้กลาง** สำหรับ AI agents (GitHub Copilot, Claude ฯลฯ) และ developer ทุกคน
> อ่านให้ครบก่อนพัฒนาหรือเพิ่มฟีเจอร์ใหม่

---

## 1. Project Overview

| ข้อมูล | ค่า |
|---|---|
| ชื่อ | LiviathaN RO |
| ประเภท | Single-page web app (ไม่มี backend API) |
| เกม | Ragnarok Online |
| ภาษา | TypeScript |
| Framework | React 19 + Vite + React Router v7 |
| UI | Tailwind CSS v4 + shadcn/ui (radix-nova) + Lucide React |

**จุดประสงค์:** เว็บรวมเครื่องมือ / คำนวณ / คอนเทนต์สำหรับเกม Ragnarok Online
- คำนวณ Stat / Damage / Enhancement Cost
- Helper สำหรับ dungeon พิเศษ (Central Lab)
- บทความ / คู่มือ / แกลเลอรี่

---

## 2. Tech Stack & Versions

```
react                 ^19
react-dom             ^19
react-router-dom      ^7   (createBrowserRouter)
tailwindcss           ^4   (ไม่ใช้ tailwind.config.js, ใช้ CSS @import)
radix-ui              ^1   (shadcn base)
lucide-react          ^1
class-variance-authority
clsx + tailwind-merge  (cn() helper)
typescript            ~6
vite                  ^8
```

---

## 3. Folder Structure & Conventions

```
src/
  assets/            # รูปภาพ / static files
  components/
    ui/              # shadcn/ui components (Badge, Button, Card ฯลฯ)
  features/          # Business logic จัดกลุ่มตามฟีเจอร์
    calculator/      # formulas.ts — ฟังก์ชันคำนวณ RO
    centrallab/      # BossLookup, CountdownTimer, types, data/
    content/         # ArticleCard, data.ts
    gallery/         # GalleryGrid
  hooks/             # Custom React hooks (use-mobile.ts ฯลฯ)
  layouts/           # MainLayout.tsx — sidebar layout หลัก
  lib/
    utils.ts         # cn() = clsx + tailwind-merge
  pages/             # Page components — แต่ละ page อยู่ใน subfolder ของตัวเอง
    content/
      ContentPage.tsx
    gallery/
      GalleryPage.tsx
    home/
      HomePage.tsx
    tools/           # แต่ละ tool page มี subfolder แยก
      stat/
        StatCalculatorPage.tsx
        # (sub-components เพิ่มที่นี่เมื่อ page ขยาย)
      damage/
        DamageCalculatorPage.tsx
      central-lab-helper/
        CentralLabHelperPage.tsx
        # (sub-components เพิ่มที่นี่เมื่อ page ขยาย)
      item-cost-calculator/
        ItemCostCalculatorPage.tsx
      mp-jigsaw-calculator/
        MpJigsawCalculatorPage.tsx
      form/
        FormPage.tsx
  routes/
    index.tsx        # createBrowserRouter config
    paths.ts         # PATHS constants ทั้งหมด
  types/
    index.ts         # TypeScript types กลาง
```

### กฎ Naming
- **Page files:** `<Name>Page.tsx` อยู่ใน `src/pages/<section>/<name>/` (แต่ละ page มี subfolder เป็นของตัวเอง)
- **Page sub-components:** วางในโฟลเดอร์เดียวกับ Page ที่ใช้ เช่น `src/pages/tools/stat/StatForm.tsx`
- **Feature components:** PascalCase, อยู่ใน `src/features/<feature>/` — ใช้ข้ามหน้าได้
- **Types:** รวมที่ `src/types/index.ts` ยกเว้นถ้า type ใช้เฉพาะใน feature เดียว ให้วางใน feature นั้น
- **Data files:** `data.ts` หรือ `bosses.ts` / `elements.ts` ใน `data/` subfolder
- **Path constants:** ใช้ `PATHS` จาก `src/routes/paths.ts` เสมอ ห้าม hardcode URL string

### เมื่อไหร่ควรแยก Component ออกจาก Page
- Page มีมากกว่า 1 section / card ที่มี logic เป็นของตัวเอง
- Component นั้นมีสถานะ (state) หรือ useMemo เป็นของตัวเอง
- ไฟล์ Page เริ่มยาวเกิน ~150 บรรทัด
- แยกแล้ววางใน subfolder เดียวกับ Page ไม่ใช่ใน `features/` (เพราะใช้เฉพาะ page นั้น)

---

## 4. How to Add a New Page / Menu

ทำตามลำดับนี้ **ทุกครั้ง** เมื่อเพิ่มหน้าหรือเมนูใหม่:

### Step 1 — เพิ่ม path ใน `src/routes/paths.ts`
```ts
export const PATHS = {
  // ... existing ...
  TOOLS_NEW_FEATURE: '/tools/new-feature',
} as const
```

### Step 2 — สร้าง subfolder + Page component ใน `src/pages/<section>/<name>/<Name>Page.tsx`
```tsx
// src/pages/tools/new-feature/NewFeaturePage.tsx
export default function NewFeaturePage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ชื่อหน้า</h1>
        <p className="text-muted-foreground text-sm mt-1">คำอธิบาย</p>
      </div>
      {/* content */}
    </div>
  )
}
```

> ถ้า page มีหลาย component ให้สร้างไฟล์เพิ่มใน **folder เดียวกัน**:
> ```
> src/pages/tools/new-feature/
>   NewFeaturePage.tsx   ← entry point
>   FeatureForm.tsx      ← sub-component
>   FeatureResults.tsx   ← sub-component
> ```

### Step 3 — ลงทะเบียน Route ใน `src/routes/index.tsx`
```tsx
import NewFeaturePage from '@/pages/tools/new-feature/NewFeaturePage'

// เพิ่มใน children array:
{ path: PATHS.TOOLS_NEW_FEATURE, element: <NewFeaturePage /> },
```

### Step 4 — เพิ่มเมนูใน `src/layouts/MainLayout.tsx`
```tsx
import { IconName } from 'lucide-react'

// เพิ่มใน navSections array ใน section ที่เกี่ยวข้อง:
{ title: 'ชื่อเมนู', url: PATHS.TOOLS_NEW_FEATURE, icon: IconName },
```

> **ไม่มี** step อื่นเพิ่มเติม — ไม่ต้องแก้ไฟล์อื่น

---

## 5. UI Patterns

### Layout หน้า (Page Layout)
ทุกหน้าใช้ wrapper นี้:
```tsx
<div className="p-6 max-w-{size} mx-auto space-y-6">
  <div>
    <h1 className="text-2xl font-bold">ชื่อหน้า</h1>
    <p className="text-muted-foreground text-sm mt-1">คำอธิบาย</p>
  </div>
  {/* sections */}
</div>
```
- `max-w-3xl` — หน้าแคบ (calculator form)
- `max-w-5xl` — หน้ากว้าง (multi-column, lookup table)

### Card Pattern
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-base">หัวข้อ</CardTitle>
    <CardDescription>คำอธิบาย</CardDescription>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

### Result Display
```tsx
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  <div className="rounded-lg border p-3 text-center">
    <div className="text-xs text-muted-foreground mb-1">Label</div>
    <div className="text-xl font-bold tabular-nums">{value}</div>
  </div>
</div>
```

### Form + useMemo Pattern (ใช้ใน calculator pages)
```tsx
const result = useMemo(() => compute(inputs), [inputs])
```
ไม่ใช้ useEffect สำหรับการคำนวณ — ใช้ useMemo แทนเสมอ

### shadcn/ui Components ที่ติดตั้งแล้ว
`badge`, `button`, `card`, `input`, `label`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `textarea`, `tooltip`

### ติดตั้ง shadcn Component ใหม่
```bash
npx shadcn@latest add <component>
# หลังรัน ต้อง move ไฟล์:
Move-Item "@\components\ui\*" src\components\ui\ -Force
Remove-Item "@" -Recurse -Force
```
> สาเหตุ: tsconfig paths alias ทำให้ shadcn drop ไฟล์ผิด folder

---

## 6. Feature Architecture

### features/ vs pages/
- **`features/`** = reusable logic + components (ไม่ผูกกับ route)
- **`pages/`** = page entry point ที่ใช้ features + layout

### Data Layer
ข้อมูลทั้งหมดเป็น **static TypeScript arrays/objects** ใน `data.ts` ไม่มี API call
- Articles: `src/features/content/data.ts`
- Bosses: `src/features/centrallab/data/bosses.ts`
- Job Classes: `src/features/calculator/formulas.ts` (export `jobClasses`)

### Types
- Types ที่ใช้ข้าม feature → `src/types/index.ts`
- Types เฉพาะ feature → ไฟล์ใน feature นั้น (เช่น `centrallab/types.ts`)

---

## 7. Routing

ใช้ `createBrowserRouter` (React Router v7), nested routes ทั้งหมดอยู่ภายใต้ `<MainLayout />`

```
/                   HomePage
/content            ContentPage
/gallery            GalleryPage
/tools/stat         StatCalculatorPage
/tools/damage       DamageCalculatorPage
/tools/central-lab-helper   CentralLabHelperPage
/tools/item-cost-calculator  ItemCostCalculatorPage
/tools/mp-jigsaw-calculator  MpJigsawCalculatorPage
```

Import `PATHS` จาก `@/routes/paths` เสมอเมื่อ navigate หรือ link

---

## 8. Navigation Sections (Sidebar)

Sidebar ใน `MainLayout.tsx` แบ่งเป็น section:

| Section label | เมนู |
|---|---|
| (ไม่มี label) | หน้าหลัก |
| คอนเทนต์ | บทความ / คู่มือ, แกลเลอรี่ |
| เครื่องมือ | คำนวณ Stat, คำนวณ Damage, Central Lab Helper, Item Cost Calculator, MP Jigsaw Calculator |

เมื่อเพิ่มเมนูใหม่ให้เลือก section ที่เหมาะสม หรือสร้าง section ใหม่ถ้าหมวดหมู่ต่างออกไป

---

## 9. Existing Features (ณ พ.ค. 2026)

| หน้า | Path | คำอธิบาย |
|---|---|---|
| HomePage | `/` | หน้าแรก / landing |
| ContentPage | `/content` | รายการบทความพร้อม search + category filter |
| GalleryPage | `/gallery` | แกลเลอรี่รูป |
| StatCalculatorPage | `/tools/stat` | คำนวณ HP/SP/ATK/MATK/HIT/FLEE/DEF/MDEF จาก Stat + Job + Level |
| DamageCalculatorPage | `/tools/damage` | คำนวณ Damage |
| CentralLabHelperPage | `/tools/central-lab-helper` | แปลงเลขฐาน 10 → bit switch (SW1–SW8) + Boss Lookup + Countdown Timer |
| ItemCostCalculatorPage | `/tools/item-cost-calculator` | คำนวณ Zeny / วัตถุดิบในการ Enhancement |
| MpJigsawCalculatorPage | `/tools/mp-jigsaw-calculator` | คำนวณจำนวน Jigsaw ที่ได้จาก Mystical Pass ตามเลเวลปัจจุบัน |

---

## 10. Ideas / Roadmap (feature ที่อาจเพิ่มในอนาคต)

### เครื่องมือ (Tools)
- **Refine Cost Calculator** — คำนวณโอกาสและวัสดุในการ refine อาวุธ/เกราะ
- **MVP Timer** — จับเวลา respawn MVP boss หลายตัวพร้อมกัน
- **Equipment Simulator** — จำลอง equipment slot + แสดง stat ที่เปลี่ยนแปลง
- **Skill Simulator** — วางแผน skill tree / skill build
- **Zeny Calculator** — คำนวณ buy/sell NPC / market price
- **Quest Tracker** — ติดตาม quest ที่กำลังทำ (local storage)

### คอนเทนต์
- **Content Detail Page** — เปิดบทความแบบ full page ผ่าน `/content/:slug`
  - PATHS.CONTENT_DETAIL มีพร้อมแล้วใน paths.ts แต่ยังไม่มี route
- **Tag filter** ใน ContentPage
- **Gallery categories** + lightbox viewer

### UI / UX
- **Dark / Light mode toggle** — เป็น dark mode ถาวรตลอด (เพิ่ม `class="dark"` ที่ `<html>` ใน index.html แล้ว) — อาจเพิ่ม toggle ในอนาคต
- **Breadcrumb** ใน SidebarInset header
- **Search bar** global ใน header
- **Tooltip** บน stat labels ใน calculator

### Architecture
- **LocalStorage hooks** — บันทึก state ล่าสุด (stats, form values)
- **i18n** — รองรับหลายภาษา (TH / EN)

---

## 11. Import Aliases

```ts
@/components  → src/components
@/features    → src/features
@/hooks       → src/hooks
@/layouts     → src/layouts
@/lib         → src/lib
@/pages       → src/pages
@/routes      → src/routes
@/types       → src/types
```

กำหนดใน `tsconfig.app.json` → `compilerOptions.paths`

---

## 12. Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # tsc + vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```
