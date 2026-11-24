---
id: derive-during-render-not-effects
type: skill
title: React 19 — derive ค่าตอน render, ไม่ sync ด้วย useEffect
domain: app
status: proposed
source: ai
enforcement: advise
tags: [react-19, state, performance]
---

ค่าที่คำนวณได้จาก props/state ให้คำนวณตอน render (หรือ `useMemo` ถ้าหนัก) แทนการเก็บใน state แล้ว sync ด้วย
`useEffect` — แบบหลังทำให้ render เพิ่ม 1 รอบและมีช่วงที่ค่า stale (react.dev: "You Might Not Need an Effect")
Calculator ใน repo นี้ทำแบบนี้อยู่แล้ว

**Do:**

- `const result = useMemo(() => calc(inputs), [inputs])` หรือคำนวณตรงๆ ถ้าเบา
- logic ที่ซับซ้อน ดึงเป็น pure function แล้ว test ด้วย Vitest
- `useEffect` ใช้เฉพาะ sync กับระบบนอก React (document.title, timer, localStorage, classList)

**Avoid:**

- `useState` + `useEffect(() => setTotal(...), [deps])`
- ใส่ `useMemo`/`useCallback` ทุกที่โดยไม่มีเหตุผล — ใช้เมื่อคำนวณหนักหรือต้องการ reference คงที่
