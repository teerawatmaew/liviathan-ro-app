---
id: tailwind-v4-css-first-tokens
type: skill
title: Tailwind v4 — tokens ใน CSS, สีผ่าน semantic variables
domain: app
status: proposed
source: ai
enforcement: advise
tags: [tailwind-v4, design-tokens, dark-mode, shadcn]
---

Tailwind v4 ตั้งค่าใน CSS ไม่ใช่ `tailwind.config.js`: ค่าจริงของสีอยู่ใน `:root` / `.dark` แล้ว map เป็น utility ผ่าน
`@theme inline { --color-x: var(--x) }` (pattern ที่ `src/index.css` ใช้อยู่แล้ว) ทำให้ dark mode สลับได้ด้วยการเปลี่ยน
variable ชุดเดียว ไม่ต้องใส่ `dark:` ทุก element

**Do:**

- ใช้ semantic class (`bg-background`, `bg-card`, `text-muted-foreground`, `border-border`, `text-primary`)
- เพิ่มสีใหม่: ประกาศใน `:root` + `.dark` แล้ว map ใน `@theme inline`
- ใช้ `@custom-variant dark (&:where(.dark, .dark *));` เมื่อ toggle ธีมด้วย class (ดู `dark-variant-must-follow-class-toggle`)
- syntax v4: `bg-(--my-var)` แทน `bg-[--my-var]` แบบ v3

**Avoid:**

- hardcode palette (`bg-zinc-900`, `text-white`) สำหรับพื้นผิวหลัก — ไม่ตามธีม
- nested `@theme` หรือใส่ค่า dark ใน `@theme` ตรงๆ
