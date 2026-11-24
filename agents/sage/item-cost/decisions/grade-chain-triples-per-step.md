---
id: grade-chain-triples-per-step
type: convention
title: Enhancement Stone ใช้ขั้นก่อนหน้า 3 ชิ้นต่อขั้น และ Low ใช้ Shadowdecon 1:1
domain: item-cost
tags: [item-cost, game-rule, reform]
status: proposed
enforcement: block
applies_to: [item-cost, "src/pages/tools/item-cost-calculator/types.ts"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

`calcBreakdown(grade, qty)` ไล่จากขั้นที่ต้องการลงไปถึง Low โดยคูณ 3 ทุกขั้น:

| ต้องการ Supreme × 1 | จำนวนที่ต้องคราฟต์ | ค่าคราฟต์/ครั้ง |
| --- | --- | --- |
| Supreme | 1 | 50,000 |
| High | 3 | 20,000 |
| Medium | 9 | 10,000 |
| Low | 27 | 20,000 |
| Shadowdecon | 27 (= จำนวน Low) | ราคาตลาด |

`calcReformTotal = zenyCraft + shadowdecon × ราคา Shadowdecon` — ไม่ได้คิดโอกาสล้มเหลว (สมมติว่าสำเร็จ 100%)

แก้ตัวคูณหรือ `CRAFT_ZENY` = เปลี่ยนกติกาเกม ต้องมีแหล่งอ้างอิงและแก้ `types.test.ts` ในรอบเดียวกัน
