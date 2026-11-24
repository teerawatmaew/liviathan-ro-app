# mp-jigsaw — glossary

## Mystical Pass level

**Definition:** เลเวลของ Mystical Pass (MP) ที่ผู้เล่นทำได้ — เครื่องคำนวณรับเฉพาะ > 100
**Invariants:** 100 เลเวลแรกให้กล่องจำนวนคงที่ (`fromFirst100`) ไม่ขึ้นกับเลเวลจริง

## Box

**Definition:** กล่องรางวัลแต่ละชนิดใน `BOXES` (Box 1–3, Start Premium Jigsaw, Bonus Jigsaw) แต่ละชนิดให้ Jigsaw ต่อกล่องคงที่ (`jigsawPerBox`)
**Includes:** Box 1 = 2, Box 2 = 3, Box 3 = 5, Start Premium = 10, Bonus = 3 Jigsaw/กล่อง

## Special level bonus

**Definition:** โบนัส +30 กล่องเมื่อถึง `specialLevel` (Box 1 = 350, Box 2 = 800, Box 3 = 1500)
**Excludes:** Start Premium Jigsaw และ Bonus Jigsaw — ไม่มีโบนัสและไม่เพิ่มตามเลเวล
