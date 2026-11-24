# refine — glossary

## Safety level

**Definition:** ขั้นที่ต่ำกว่านี้ตีบวกสำเร็จ 100%
**Invariants:** `fromLevel < safetyLevel` ⇒ success rate = 100
**Related:** Refine equip type

## Refine equip type

**Definition:** ชนิดอุปกรณ์ที่กำหนดตาราง rate: `weapon_lv1`–`weapon_lv5`, `armor_lv1`, `armor_lv2`, `shadow_weapon`, `shadow_armor` (`RefineEquipType`)
**Excludes:** event item id (`event_*`) — เป็น string แยก ตรวจด้วย `isEventRefineType()`

## Ore ปกติ / Enriched-HD

**Definition:** `oreType: 'normal' | 'enrichedHd'` — แร่ปกติ (Oridecon/Elunium/Bradium/Carnium/Etherdeocon/Ethernium) กับแร่ Enriched/HD ที่ rate สูงกว่าและลดความเสียหายตอนล้ม
**Invariants:** ชื่อแร่เปลี่ยนที่ +10 (เช่น Oridecon → Bradium) ยกเว้นประเภท ether

## Ether type

**Definition:** `weapon_lv5` และ `armor_lv2` — ใช้แร่ Ether
**Invariants:** ล้มที่ต่ำกว่า +10 ไม่แตก แต่ลดขั้น 3 (ปกติ) หรือ 1 (Enriched/HD)

## BSB (Blacksmith's Blessing)

**Definition:** ไอเทมกันลดขั้น/แตกเมื่อล้ม (`noLevelLoss`) จำนวนตาม `BSB_COSTS[fromLevel]` (+7 ถึง +13) หรือ `BSB_EVENT_COSTS` ช่วง event
**Related:** noBreak

## Event item

**Definition:** ไอเทมที่มีตาราง refine ของตัวเองใน `EVENT_REFINE_ITEMS` (`[Event]`, `[MP]` shadow, `[Rate Up]`)
**Includes:** built-in no-break/no-level-loss items (Ayothaya Helm, MP shadow) ที่มี ore + zeny ของตัวเอง
**Related:** Rate Up item, Pity

## Rate Up item

**Definition:** event item ที่จำลองช่วง "Grade & Refine Rate Up" — อุปกรณ์มาตรฐาน (`baseEquipType`) แต่ rate สูงขึ้นชั่วคราว
**Invariants:** ใช้กลไกล้มเหลวมาตรฐานเหมือน base type; มี `enrichedRates` แยก

## Pity

**Definition:** ทุกครั้งที่ล้มที่ขั้นเดิม rate เพิ่ม `pityPerFail`% จนถึง `pityCaps[fromLevel]`; reset เป็น 0 เมื่อสำเร็จ
**Invariants:** ใช้เฉพาะ item ที่ไม่ลดขั้น (ขั้นคงที่ pity จึงสะสมได้); เมื่อใช้ `enrichedRates` จะไม่คิด pity
