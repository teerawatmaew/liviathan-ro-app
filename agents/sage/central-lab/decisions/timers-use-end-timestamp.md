---
id: timers-use-end-timestamp
type: convention
title: Countdown timer นับจากเวลาสิ้นสุดจริง (Date.now) และไม่มี side effect ใน setState updater
domain: central-lab
tags: [central-lab, timer, react]
status: proposed
enforcement: warn
applies_to: [central-lab, "src/features/centrallab/CountdownTimer.tsx"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

ผู้เล่นมักสลับไปหน้าเกมระหว่างจับเวลา ⇒ แท็บอยู่เบื้องหลังและ browser throttle `setInterval`

- เก็บ `endAt = Date.now() + remaining × 1000` ตอนกดเริ่ม แล้ว tick ทุก 250ms คำนวณ `ceil((endAt − now) / 1000)`
  — เวลาไม่เพี้ยนแม้ interval ถูกหน่วง (เวอร์ชันเดิมลบทีละ 1 ต่อ tick จึงช้ากว่าจริงเมื่ออยู่เบื้องหลัง)
- หยุด/เล่นเสียงใน effect ไม่ใช่ใน `setRemaining(prev => …)` — updater ต้อง pure (StrictMode เรียกซ้ำ ⇒ เสียงดังซ้ำ)
- ใช้ `AudioContext` ตัวเดียวร่วมกัน (สร้างใหม่ทุกครั้งจะชนเพดานจำนวน context ของ browser)
- `Card` ของ shadcn ใช้ `ring` ไม่ใช่ `border` ⇒ สถานะหมดเวลาใช้ `ring-2 ring-destructive` (`border-destructive` ไม่แสดงผล)
