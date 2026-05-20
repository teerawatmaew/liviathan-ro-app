# Production Readiness Audit — LiviathaN RO

> วันที่ตรวจ: 20 พ.ค. 2026 | อัปเดต: 20 พ.ค. 2026  
> Stack: React 19 + Vite + TypeScript + React Router v7 + Tailwind CSS v4  
> Target Deployment: Vercel (SPA)

---

## 🔴 Critical Issues (ต้องแก้ก่อน deploy)

### 1. ไม่มี `vercel.json` — SPA Refresh จะ 404 ทุกหน้า

**ปัญหา:** Vercel เป็น static hosting ไม่รู้จัก client-side route เช่น `/tools/stat`  
เมื่อ user refresh หน้าหรือเข้า URL โดยตรง จะได้ 404 ทันที

**แก้ไข:** สร้างไฟล์ `vercel.json` ที่ root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### 2. `@types/react-router-dom@^5.3.3` ผิด version และอยู่ผิด section

**ปัญหา:**
- ใช้ `react-router-dom@^7` แต่ types เป็น v5 → type conflict
- อยู่ใน `dependencies` แทน `devDependencies`

**แก้ไข:** ลบออกจาก `dependencies` ได้เลย — react-router-dom v7 bundle types ของตัวเองมาแล้ว:

```bash
pnpm remove @types/react-router-dom
```

---

### 3. Build-time packages อยู่ใน `dependencies` แทน `devDependencies`

**ปัญหา:** `@tailwindcss/vite` และ `tailwindcss` ไม่ใช่ runtime dependency — ควรอยู่ใน `devDependencies`  
Vercel จะ install ทั้ง `dependencies` + `devDependencies` ตอน build อยู่แล้ว แต่เป็น bad practice

**แก้ไข:**

```bash
pnpm remove @tailwindcss/vite tailwindcss
pnpm add -D @tailwindcss/vite tailwindcss
```

---

### 4. ไม่มี Lazy Loading — Initial Bundle ใหญ่โดยไม่จำเป็น

**ปัญหา:** `src/routes/index.tsx` import ทุก page แบบ eager:

```ts
import StatCalculatorPage from '@/pages/tools/stat/StatCalculatorPage'
import DamageCalculatorPage from '@/pages/tools/damage/DamageCalculatorPage'
// ... ทุก page eager import
```

ผู้ใช้เปิดหน้าแรกแต่ต้องโหลด JS ของทุกหน้า รวมถึง RefineSimulatorPage ที่มี `REFINE_RATES` data

**แก้ไข:** ใช้ `React.lazy()` + Suspense:

```tsx
import { lazy, Suspense } from 'react'

const StatCalculatorPage   = lazy(() => import('@/pages/tools/stat/StatCalculatorPage'))
const DamageCalculatorPage = lazy(() => import('@/pages/tools/damage/DamageCalculatorPage'))
// ... ทุก page ใช้ lazy

// ใน router config:
{
  element: <MainLayout />,
  errorElement: <ErrorPage />,
  children: [
    { path: PATHS.HOME, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
    // ...
  ]
}
```

---

## 🟡 Important Improvements (ควรแก้ก่อน production)

### 5. `BossLookup.tsx` ใช้ hardcoded Light-mode Colors ในแอปที่เป็น Dark-only

**ปัญหา:** `elementCls` ใน `BossLookup.tsx`:

```ts
const elementCls = {
  Neutral: 'bg-slate-100 text-slate-700 border-slate-300',  // สีขาว
  Water:   'bg-blue-100  text-blue-700  border-blue-300',   // สีฟ้าอ่อน
  // ...
}
```

แอปเป็น dark mode ถาวร สีเหล่านี้จะดูผิดปกติมากบน background มืด

**แก้ไข:** เปลี่ยนเป็น dark-mode variants:

```ts
const elementCls = {
  Neutral: 'bg-slate-800 text-slate-200 border-slate-600',
  Water:   'bg-blue-900/60 text-blue-300 border-blue-700',
  Earth:   'bg-amber-900/60 text-amber-300 border-amber-700',
  Fire:    'bg-red-900/60 text-red-300 border-red-700',
  Wind:    'bg-green-900/60 text-green-300 border-green-700',
  Poison:  'bg-purple-900/60 text-purple-300 border-purple-700',
  Holy:    'bg-yellow-900/60 text-yellow-300 border-yellow-700',
  Shadow:  'bg-indigo-900/60 text-indigo-300 border-indigo-700',
  Ghost:   'bg-gray-800 text-gray-300 border-gray-600',
  Undead:  'bg-zinc-900 text-zinc-300 border-zinc-700',
}
```

---

### 6. ไม่มีการอัปเดต `<title>` ต่อ Route

**ปัญหา:** ทุกหน้าแสดง tab title เป็น "LiviathaN RO" เหมือนกัน ไม่เป็นมิตรกับ SEO และ UX

**แก้ไข (React Router v7 built-in):** ใช้ `<title>` tag ผ่าน document.title ใน useEffect หรือ React Router v7 loader:

```tsx
// วิธีง่ายที่สุด — เพิ่มใน page component:
useEffect(() => {
  document.title = 'คำนวณ Stat — LiviathaN RO'
  return () => { document.title = 'LiviathaN RO' }
}, [])
```

หรือสร้าง hook `usePageTitle(title: string)` กลาง:

```ts
// src/hooks/use-page-title.ts
import { useEffect } from 'react'
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — LiviathaN RO`
    return () => { document.title = 'LiviathaN RO' }
  }, [title])
}
```

---

### 7. `vite.config.ts` ไม่มี Build Optimizations

**ปัญหา:** ไม่มี manual chunk splitting → vendor libraries bundle รวมกับ app code

**แก้ไข:**

```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui:     ['radix-ui', 'lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
```

---

### 8. `ContentPage` — ไม่ได้ memoize `filtered`

**ปัญหา:** `filtered = articles.filter(...)` คำนวณใหม่ทุก render รวมถึง re-render จาก parent

```tsx
// ปัจจุบัน:
const filtered = articles.filter((a) => { ... })

// แก้ไข:
const filtered = useMemo(
  () => articles.filter((a) => { ... }),
  [search, activeCategory]
)
```

---

### 9. Missing OG Image

**ปัญหา:** `index.html` ไม่มี `og:image` และ `twitter:image` — เวลา share Facebook/Twitter จะไม่มีรูป

**แก้ไข:** เพิ่มรูป 1200×630px ใน `public/images/og-image.png` แล้วเพิ่ม tag:

```html
<meta property="og:image" content="https://your-domain.vercel.app/images/og-image.png" />
<meta property="og:url" content="https://your-domain.vercel.app" />
<meta name="twitter:image" content="https://your-domain.vercel.app/images/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
```

---

### 10. `apple-touch-icon` ชี้ไปที่ SVG

**ปัญหา:** iOS ไม่ support SVG เป็น touch icon — จะ fallback ไปใช้ screenshot แทน

```html
<!-- ปัจจุบัน: -->
<link rel="apple-touch-icon" href="/favicon.svg" />

<!-- แก้ไข: สร้าง apple-touch-icon.png ขนาด 180×180px แล้วแก้เป็น: -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

---

### 11. `FormPage.tsx` — Dead Code

**ปัญหา:** `src/pages/tools/form/FormPage.tsx` มีอยู่แต่ไม่ได้ลงทะเบียน route ไหนเลย

**แก้ไข:** ลบทิ้ง หรือถ้าเป็น template ให้ย้ายไปไว้ที่ `docs/` หรือ add comment ชี้แจง

---

## 🟢 Optional Improvements (ปรับปรุงเพิ่มเติม)

### 12. เพิ่ม `sitemap.xml` ⏳ รอ domain

Vercel Deployment จะได้รับ domain ถาวร — ควรมี sitemap สำหรับ SEO:

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://your-domain.vercel.app/</loc></url>
  <url><loc>https://your-domain.vercel.app/content</loc></url>
  <url><loc>https://your-domain.vercel.app/tools/stat</loc></url>
  <!-- ... -->
</urlset>
```

---

### 13. เพิ่ม `.gitattributes` แก้ LF/CRLF Warning ✅ เสร็จแล้ว

```gitattributes
* text=auto
*.ts  text eol=lf
*.tsx text eol=lf
*.css text eol=lf
*.md  text eol=lf
*.json text eol=lf
```

---

### 14. `key={i}` ใน navSections.map ✅ เสร็จแล้ว

**ปัญหา:** ใช้ array index เป็น key — ยอมรับได้เพราะ static data แต่ควรใช้ค่าที่มีความหมาย

```tsx
// แก้เป็น:
navSections.map((section) => (
  <SidebarGroup key={section.label ?? 'home'}>
```

---

### 15. ไม่มี Error Boundary ระดับ Page ⏳ optional

**ปัญหา:** มีแค่ `errorElement` ระดับ root — ถ้า component ลูกใดใดทำให้เกิด JS runtime error จะ crash ทั้งแอป

**แก้ไข:** เพิ่ม React Error Boundary class component สำหรับ `<Outlet />` หรือใช้ library `react-error-boundary`:

```bash
pnpm add react-error-boundary
```

```tsx
import { ErrorBoundary } from 'react-error-boundary'

// ใน MainLayout:
<main className="flex-1 min-h-0">
  <ErrorBoundary fallback={<div>เกิดข้อผิดพลาด</div>}>
    <Outlet />
  </ErrorBoundary>
</main>
```

---

### 16. ไม่มี Loading State สำหรับ Lazy Pages ✅ เสร็จแล้ว (`PageLoader` + `Lazy` wrapper)

เมื่อเพิ่ม lazy loading (ข้อ 4) ควรสร้าง fallback ที่สวยงาม:

```tsx
// src/components/ui/page-loader.tsx
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin size-8 rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}
```

---

### 17. `tsconfig.app.json` ควรเพิ่ม `strict: true` อย่างชัดเจน

```json
{
  "compilerOptions": {
    "strict": true,
    // ไม่ต้องลบ flags เดิม — strict ครอบคลุมอยู่แล้ว
  }
}
```

---

### 18. `ignoreDeprecations: "6.0"` ซ่อน TypeScript warnings

**ปัญหา:** อาจซ่อนปัญหาจริงที่ TypeScript 6 ต้องการแจ้ง  
**แก้ไข:** ลองรัน build โดยไม่มี flag นี้ก่อน แล้วค่อยแก้ตามที่ TypeScript แนะนำ

---

## ⭐ สิ่งที่ดีอยู่แล้ว

| รายการ | สถานะ |
|---|---|
| `errorElement` ระดับ root Router | ✅ |
| `NotFoundPage` wildcard `*` | ✅ |
| `useMemo` สำหรับ computation ทุกที่ | ✅ |
| `useCallback` + `useEffect` cleanup ใน `CountdownTimer` | ✅ |
| ไม่มี hardcoded URL strings — ใช้ `PATHS` constants | ✅ |
| ไม่มี `dangerouslySetInnerHTML` | ✅ |
| External links มี `rel="noopener noreferrer"` | ✅ |
| ไม่มี `console.log` เหลือใน production | ✅ |
| `StrictMode` ใน development | ✅ |
| Dark mode via CSS variables (ไม่ใช้ JS toggle) | ✅ |
| `lang="th"` ใน `<html>` | ✅ |
| OG + Twitter Card meta tags พื้นฐาน | ✅ |
| `robots.txt` | ✅ |
| TypeScript strict flags (noUnusedLocals, noUnusedParameters) | ✅ |
| Feature-based folder structure | ✅ |

---

## 📊 Scores (อัปเดต 20 พ.ค. 2026)

| หัวข้อ | คะแนน | เหตุผล |
|---|---|---|
| **Production Readiness** | **8.5 / 10** | Lazy loading, page titles, error boundary (root), dark mode, clean architecture |
| **Vercel Compatibility** | **9.5 / 10** | `vercel.json` พร้อม, build ผ่าน, SPA routing ถูกต้อง — รอ OG image + sitemap |

---

## 🚀 Suggested Refactor Priority Order

| ลำดับ | งาน | สถานะ |
|---|---|---|
| 1 | สร้าง `vercel.json` | ✅ เสร็จ |
| 2 | ลบ `@types/react-router-dom@5` | ✅ เสร็จ |
| 3 | ย้าย build deps → `devDependencies` | ✅ เสร็จ |
| 4 | เพิ่ม Lazy Loading ทุก page | ✅ เสร็จ |
| 5 | แก้ `BossLookup` element badge colors | ✅ เสร็จ |
| 6 | เพิ่ม `usePageTitle` hook | ✅ เสร็จ |
| 7 | เพิ่ม `build.rollupOptions` ใน `vite.config.ts` | ✅ เสร็จ |
| 8 | memoize `filtered` ใน `ContentPage` | ✅ เสร็จ |
| 9 | เพิ่ม OG image | ⏳ รอ domain |
| 10 | แก้ `apple-touch-icon` เป็น PNG | ⏳ รอ domain / asset |
| 11 | ลบ `FormPage.tsx` dead code | ✅ เสร็จ |
| 12 | เพิ่ม `.gitattributes` | ✅ เสร็จ |
| 13 | เพิ่ม `sitemap.xml` | ⏳ รอ domain |
| 14 | เพิ่ม per-page Error Boundary | ⏳ optional |

---

## 📋 Vercel Deployment Checklist

> ไฟล์นี้เป็น checklist สำหรับ deploy ไปยัง Vercel หรือเจ้าอื่น (Netlify / Cloudflare Pages)

### ต้องมีก่อน deploy ทุกกรณี

- [x] `vercel.json` (หรือ `_redirects` สำหรับ Netlify / `_headers` สำหรับ Cloudflare)
- [x] ลบ `@types/react-router-dom@5`
- [x] ย้าย build tools → devDependencies
- [x] `pnpm run build` ผ่าน error-free

### ควรมีสำหรับ production quality

- [x] Lazy loading ทุก route page
- [x] `usePageTitle` hook ครบทุกหน้า
- [ ] OG image + `og:url` ที่ถูกต้อง ⏳ รอ domain
- [ ] `apple-touch-icon.png` ⏳ รอ asset
- [ ] `sitemap.xml` ⏳ รอ domain
- [x] ลบ dead code (`FormPage.tsx`)
- [x] `.gitattributes`

### เจ้า Hosting อื่น (ถ้าเปลี่ยนในอนาคต)

| Hosting | SPA Config File | ไฟล์ที่ต้องสร้าง |
|---|---|---|
| **Vercel** | `vercel.json` | `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}` |
| **Netlify** | `public/_redirects` | `/* /index.html 200` |
| **Cloudflare Pages** | `public/_redirects` | `/* /index.html 200` |
| **GitHub Pages** | ไม่ native รองรับ | ต้องใช้ `404.html` trick หรือ HashRouter |
| **Firebase Hosting** | `firebase.json` | rewrites config ใน `hosting.rewrites` |

> หมายเหตุ: ถ้าเปลี่ยนจาก Vercel ไปยังเจ้าอื่น ให้สลับ SPA config file ตามตารางด้านบน  
> โค้ด React Router ไม่ต้องเปลี่ยนแปลงใด ๆ

---

*Generated by GitHub Copilot — Production Audit*
