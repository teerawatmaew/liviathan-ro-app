---
id: persist-ui-state-with-lro-keys
type: convention
title: Persist input ของผู้ใช้ด้วย useLocalStorage และ key prefix `lro-`
domain: app
tags: [state, localStorage, hooks]
status: proposed
enforcement: advise
applies_to: [app, "src/pages/tools/**"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

input ของ calculator/simulator ที่ผู้ใช้อยากให้จำข้ามการเปิดหน้า ใช้
`useLocalStorage<T>('lro-<page>-<field>', initial)` แทน `useState` (API เหมือนกัน)
ตัวอย่าง key ที่มีอยู่: `lro-stat-level`, `lro-refine-equipType`, `lro-grade-prices`, `lro-theme`,
`lro-reform-items`, `lro-grade-items` (รายการ — ดู `item-cost/decisions/persisted-lists-need-safe-ids-and-validation`)

- key ต้องไม่ซ้ำข้ามหน้า และ**อย่าเปลี่ยนชื่อ key เดิม** (ผู้ใช้จะเสียค่าที่บันทึกไว้)
- ถ้าเปลี่ยน shape ของค่า (เช่นเพิ่ม field ใน object หรือเปลี่ยน union ของ id) ค่าเก่าใน localStorage จะถูก parse
  มาตรงๆ ไม่มี validation ⇒ ต้อง fallback เอง (เช่นเช็คว่า id ยังมีอยู่ใน list) หรือเปลี่ยนเป็น key ใหม่
- ผลลัพธ์ที่ derive ได้ ไม่ต้อง persist — persist เฉพาะ input
