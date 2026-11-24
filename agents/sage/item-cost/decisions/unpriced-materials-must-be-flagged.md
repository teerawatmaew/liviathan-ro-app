---
id: unpriced-materials-must-be-flagged
type: team_decision
title: วัตถุดิบที่ยังไม่ได้ใส่ราคาต้องเตือนผู้ใช้ว่ายอดรวมยังไม่ครบ
domain: item-cost
tags: [item-cost, ux, totals]
status: proposed
enforcement: warn
applies_to: [item-cost, "src/pages/tools/item-cost-calculator/**"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

ราคาที่ผู้ใช้ยังไม่กรอกถูก parse เป็น `0` (`parseInt(...) || 0`) ⇒ `total` ดูเหมือนครบแต่จริงๆ ขาดค่าวัตถุดิบ
(ตัวอย่างจริง: Supreme × 1 แสดง 740,000z ทั้งที่ยังขาด Shadowdecon 27 ชิ้น)

ดังนั้น:

- แถวรายการแสดง `+ Shadowdecon × N` (สี amber) เมื่อยังไม่มีราคา Shadowdecon
- ใต้ยอดรวมแสดงกล่องเตือน amber: "ยอดรวมยังไม่รวม…" พร้อมรายชื่อ + จำนวนวัตถุดิบที่ไม่มีราคา
  (Reform: Shadowdecon · Grade: ทุก `materialLines` ที่ `unitPrice === 0`)
- ไม่ซ่อนยอดรวม — ผู้ใช้บางคนต้องการดูเฉพาะค่าคราฟต์/NPC

ฟีเจอร์คำนวณต้นทุนใหม่ที่มีราคาให้กรอก ควรทำแบบเดียวกัน
