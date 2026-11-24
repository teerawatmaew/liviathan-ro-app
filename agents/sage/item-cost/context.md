# item-cost — glossary

## Enhancement Stone

**Definition:** หินเสริมพลังที่คราฟต์เป็นขั้น `Low → Medium → High → Supreme` แยกประเภท Weapon / Armor / Accessory
**Invariants:** ประเภท (`ItemType`) ไม่มีผลกับต้นทุน — ใช้เพื่อแสดงผลเท่านั้น
**Related:** Grade chain, Shadowdecon

## Grade chain

**Definition:** การคราฟต์ขั้นสูงต้องใช้ขั้นก่อนหน้า 3 ชิ้น (`PREV_GRADE_NEEDED`) และ Low ต้องใช้ Shadowdecon 1 ชิ้น
**Invariants:** Supreme 1 ชิ้น = High 3 = Medium 9 = Low 27 = Shadowdecon 27 · ค่าคราฟต์ต่อครั้ง `CRAFT_ZENY` (Low 20k, Medium 10k, High 20k, Supreme 50k)

## Shadowdecon

**Definition:** แร่ที่ใช้คราฟต์ Enhancement Stone ขั้น Low — ราคาผู้ใช้กรอกเอง (`lro-reform-sdPrice`)

## Other item

**Definition:** รายการอิสระในหน้า Reform (ชื่อ + ราคา + จำนวน) หรือ preset จาก `PRESET_ITEMS` — ไม่มีสูตร

## Etel recipe

**Definition:** สูตร Grade Item ใน `GRADE_RECIPES` — ค่า NPC (`npcZeny`) + วัตถุดิบ เช่น Etel Topaz = 200k + Etel Stone × 6 + Topaz × 1
**Includes:** Etel Stone, Blessed Etel Dust, Etel Aquamarine/Topaz/Amethyst/Amber

## Etel Stone pricing mode

**Definition:** ราคา Etel Stone มาจาก "ราคาตลาด" (กรอกเอง) หรือ "คำนวณจาก Etel Dust" = 100,000 + 5 × ราคา Etel Dust (`calcEtelFromDust`)
