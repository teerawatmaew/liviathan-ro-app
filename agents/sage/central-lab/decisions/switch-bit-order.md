---
id: switch-bit-order
type: convention
title: สวิทช์ SW8 = bit 7 (MSB) … SW1 = bit 0 และรับค่า 1–255 โดยไม่ clamp ระหว่างพิมพ์
domain: central-lab
tags: [central-lab, game-rule, input]
status: proposed
enforcement: block
applies_to: [central-lab, "src/pages/tools/central-lab-helper/switchLogic.ts", "src/pages/tools/central-lab-helper/SwitchDecoder.tsx"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

- `decimalToBits(n)` คืน 8 ตัว เรียง SW8 (bit 7) → SW1 (bit 0) เช่น 170 = `10101010` = เปิด SW8, SW6, SW4, SW2
- `parseSwitchInput(raw)` คืน `empty | invalid(message) | ok(value)` — ค่านอก 1–255 หรือไม่ใช่จำนวนเต็มแสดงข้อความ error
  **ห้าม clamp เงียบระหว่างพิมพ์** (เวอร์ชันเดิมเปลี่ยน 300 เป็น 255 และ 0 เป็น 1 ทันที ทำให้ผู้ใช้แก้เลขไม่ได้และเห็นสวิทช์ผิด)
- UI แสดงรายชื่อสวิทช์ที่ต้องเปิด + เลขฐาน 2 ใต้ภาพสวิทช์ เพื่ออ่านเร็วระหว่างเล่น
- logic อยู่ใน `switchLogic.ts` (pure) และ test ใน `switchLogic.test.ts`
