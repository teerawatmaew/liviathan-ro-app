---
id: boss-data-from-irowiki
type: convention
title: ข้อมูลบอส Central Lab อ้างอิง iRO Wiki และมีครบทุก field
domain: central-lab
tags: [central-lab, data]
status: proposed
enforcement: advise
applies_to: [central-lab, "src/features/centrallab/data/bosses.ts"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

`centralLabBosses` (45 ตัว ณ 2026-11-24) เรียงตามตัวอักษร แหล่งข้อมูลอ้างใน comment หัวไฟล์
(irowiki.org/wiki/Central_Laboratory, db.irowiki.org/db/map-info/1@lab/)

- ทุก boss ต้องมี `id` (slug), `name`, `element`, `elementLevel`, `race`, `size`, `stage`; `notes` เป็นภาษาไทย (optional)
- อัปเดตตาม patch ให้ commit แบบ `chore(centrallab): update boss data for patch <วันที่>` (เหมือน bcf46bc)
- หน้า Boss Lookup แสดงรายชื่อบอสของ stage ที่เลือกเมื่อยังไม่พิมพ์ค้นหา — เพิ่มบอสแล้วจะขึ้นอัตโนมัติ
