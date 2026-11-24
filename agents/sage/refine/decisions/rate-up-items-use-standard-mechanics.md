---
id: rate-up-items-use-standard-mechanics
type: team_decision
title: Rate Up event item ต้องใช้กลไกล้มเหลวมาตรฐาน — ห้ามบังคับ noBreak/noLevelLoss
domain: refine
tags: [refine, event, regression]
status: proposed
enforcement: block
applies_to: [refine, "src/data/event-refine-items.ts", "src/pages/tools/refine-simulator/**"]
source: ai
related: [fail-outcome-priority]
timestamp: 2026-11-24T00:00:00Z
---

Rate Up item (`event_rateup_*`) จำลองอุปกรณ์ปกติในช่วง rate up ⇒ ต้อง:

- `noBreak: false`, `noLevelLoss: false` ในข้อมูล
- ระบุ `baseEquipType` (ใช้เลือกชื่อแร่มาตรฐาน + ตรวจ ether type)
- มี `enrichedRates` สำหรับ Enriched/HD ore
- `zenyCost: 0`, ไม่มี pity

ใน UI ผู้ใช้ต้องเปิด/ปิด noBreak / BSB / event BSB ได้เองเหมือนอุปกรณ์ปกติ — ห้าม page บังคับเป็น `true`
เมื่อเลือก event item (บั๊กใน 0.6.0 ที่ทำให้ Rate Up ไม่ลดขั้น/ไม่แตกเลย แก้ใน 0.6.1, commit 9a2da33)

การบังคับ `noBreak/noLevelLoss = true` ใช้ได้เฉพาะ event item แบบ built-in (เช่น Ayothaya Helm, MP shadow)
ซึ่งกำหนดผ่านข้อมูลของ item เอง ไม่ใช่ผ่าน toggle ของ page

Rate Up เป็นของช่วงเวลา — ใส่ช่วงวันที่ของ event ใน comment/ชื่อ และพิจารณาถอดออกหรือซ่อนเมื่อหมด event
