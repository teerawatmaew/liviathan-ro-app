# central-lab — glossary

## Switch (SW1–SW8)

**Definition:** สวิทช์ 8 ตัวในด่านที่ต้องเปิด/ปิดให้ตรงกับเลขฐาน 10 ที่เกมบอก
**Invariants:** แสดงเรียง SW8 → SW1 (ซ้ายไปขวา); SW*n* = bit *n−1*; ค่าที่ใช้ได้ 1–255

## Phase

**Definition:** ช่วงเวลาของด่านที่ต้องจับเวลา — Phase 1 = 110 วินาที, Phase 2 = 80, Phase 3 = 140 (`PhaseTimers.tsx`)

## Stage / Mini boss

**Definition:** `StageType = 'mini' | 1 | 2 | 3` — `'mini'` คือบอสที่โผล่ได้ทุกรอบ, 1–3 คือบอสเฉพาะรอบนั้น

## Defender element

**Definition:** ธาตุ + เลเวลธาตุ (1–4) ของบอส ใช้หาธาตุโจมตีที่ได้เปรียบผ่าน `getBestAttackerElements(element, level)`
**Includes:** ได้เปรียบ (> 100%), ลดความเสียหาย (1–99%), ภูมิคุ้มกัน (0%)
