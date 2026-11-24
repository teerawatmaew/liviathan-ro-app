---
id: persisted-lists-need-safe-ids-and-validation
type: convention
title: รายการที่ persist ใน localStorage ต้องสร้าง id จากรายการเดิม และกรองข้อมูลเก่าที่ไม่ valid
domain: item-cost
tags: [item-cost, localStorage, state]
status: proposed
enforcement: warn
applies_to: [item-cost, app, "src/pages/tools/**"]
source: ai
related: [persist-ui-state-with-lro-keys]
timestamp: 2026-11-24T00:00:00Z
---

รายการ Reform (`lro-reform-items`) และ Grade (`lro-grade-items`) ถูกเก็บใน localStorage (ตั้งแต่ v0.7.0)

- **id:** ใช้ `nextId(prev)` (= id สูงสุด + 1) ภายใน `setItems(prev => …)` — ห้ามใช้ตัวนับระดับ module
  เพราะตัวนับเริ่มที่ 1 ทุกครั้งที่โหลดหน้า แล้วจะชนกับ id ที่โหลดกลับมา (React key ซ้ำ, ลบ/แก้ผิดแถว)
- **validation:** ข้อมูลเก่าอาจอ้างสูตรที่ถูกถอดออกแล้ว ⇒ กรองก่อนคำนวณ
  (`storedGradeItems.filter(i => i.recipe in GRADE_RECIPES)`) ไม่งั้น `GRADE_RECIPES[recipe]` เป็น undefined แล้วหน้าพัง
- มีปุ่ม "ล้าง" ให้ผู้ใช้เริ่มใหม่ได้เมื่อรายการถูกจำไว้

ใช้หลักเดียวกันกับรายการแบบ dynamic อื่นที่จะ persist ในอนาคต
