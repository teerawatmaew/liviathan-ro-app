---
id: dark-variant-must-follow-class-toggle
type: team_decision
title: "`dark:` utilities ต้องผูกกับ class `.dark` ไม่ใช่ OS preference"
domain: app
tags: [theme, dark-mode, tailwind-v4, bug]
status: proposed
enforcement: warn
applies_to: [app, "src/index.css", "src/hooks/use-theme.ts"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

`useTheme()` สลับธีมด้วยการใส่/ถอด class `dark` ที่ `<html>` และ CSS variables ใน `src/index.css` สลับตาม `.dark`
ถูกต้องแล้ว — **แต่** Tailwind v4 โดย default ให้ variant `dark:` ทำงานตาม `prefers-color-scheme` ของ OS

ดังนั้น `src/index.css` **ต้องมี** บรรทัดนี้ใต้ `@import "tailwindcss";` (เพิ่มแล้ว 2026-11-24 — ห้ามลบ):

```css
@custom-variant dark (&:where(.dark, .dark *));
```

ถ้าไม่มี: ผู้ใช้ที่ OS เป็น light แต่กด toggle เป็น dark (หรือกลับกัน) จะเห็น `dark:` utilities ไม่ตรงธีม
(ใช้อยู่ใน `components/ui/{badge,button,input,select,textarea}.tsx` และ `MpJigsawCalculatorPage.tsx`)

ยังควรใช้ semantic token (`bg-card`, `text-muted-foreground`, …) เป็นหลัก และใช้ `dark:` เฉพาะกรณีจำเป็น
