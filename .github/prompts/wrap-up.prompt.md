---
description: "สรุปงานท้ายรอบ — เขียน changelog เป็นภาษาทางการ, อัปเดต src/data/changelog.ts, bump package.json version และเตรียม commit message"
name: "Wrap Up / Changelog"
argument-hint: "ประเภทการเปลี่ยนแปลง: patch | minor | major (default: patch)"
agent: "agent"
---

คุณคือ release manager ของโปรเจกต์ LiviathaN RO
เมื่อผู้ใช้เรียก prompt นี้ ให้ทำตามขั้นตอนต่อไปนี้ครบทุกข้อ:

---

## ขั้นตอนที่ 1 — รวบรวมการเปลี่ยนแปลง

ใช้ git เพื่อดูว่าเซสชันนี้มีอะไรเปลี่ยนแปลงบ้าง:

```
git diff HEAD --stat
git diff HEAD --unified=0
```

วิเคราะห์ไฟล์ที่เปลี่ยนแปลงและสรุปเป็นรายการ โดยจัดกลุ่มตาม type:
- **feat** — เพิ่มฟีเจอร์ใหม่ / หน้าใหม่ / component ใหม่
- **fix** — แก้ bug / แก้ type error / แก้ runtime error
- **improve** — ปรับปรุง UI / refactor / performance / UX

---

## ขั้นตอนที่ 2 — กำหนด version ใหม่

อ่าน version ปัจจุบันจาก [package.json](../../package.json)

กฎ semver:
- `patch` (x.x.**+1**) — มีแค่ fix / improve ไม่มี feat
- `minor` (x.**+1**.0) — มี feat อย่างน้อย 1 รายการ (default เมื่อไม่ระบุ argument)
- `major` (**+1**.0.0) — มี breaking change หรือ redesign ขนาดใหญ่

ถ้าผู้ใช้ระบุ argument (`patch` / `minor` / `major`) ให้ใช้ตามที่ระบุ

---

## ขั้นตอนที่ 3 — อัปเดต src/data/changelog.ts

เพิ่ม entry ใหม่ **ที่หัว array** ของ `changelog` ใน [src/data/changelog.ts](../../src/data/changelog.ts)

รูปแบบที่ต้องใช้:
```ts
{
  version: '<new_version>',
  date: '<YYYY-MM-DD วันนี้>',
  changes: [
    { type: 'feat' | 'fix' | 'improve', description: '<ภาษาไทย ทางการ กระชับ>' },
    // ...
  ],
},
```

กฎการเขียน description:
- ใช้ภาษาไทยที่เป็นทางการ กระชับ ไม่ใช้ภาษาพูด
- ขึ้นต้นด้วยกริยาในรูปกระทำ เช่น "เพิ่ม", "แก้ไข", "ปรับปรุง", "รองรับ"
- ถ้าเป็น fix ระบุว่าแก้อะไร เช่น "แก้ไขข้อผิดพลาด TypeScript ใน vite.config.ts"
- ไม่ต้องระบุชื่อไฟล์ ยกเว้นสำคัญมาก

---

## ขั้นตอนที่ 4 — bump version ใน package.json

แก้ `"version"` ใน [package.json](../../package.json) เป็น version ใหม่

---

## ขั้นตอนที่ 5 — แสดงผลลัพธ์

แสดงผลดังนี้:

### Changelog entry ที่เพิ่ม
(แสดง object ที่เพิ่มเข้าไป)

### Commit message
```
<type>(<scope>): <subject>  ← บรรทัดเดียว ไม่เกิน 72 ตัวอักษร ภาษาอังกฤษ

<body>  ← รายการ bullet point สรุปสิ่งที่เปลี่ยน ภาษาไทย
- ...
- ...

bump version to <new_version>
```

กฎ commit message:
- `type`: `feat` / `fix` / `refactor` / `chore` / `style` / `docs`
- `scope`: ชื่อ feature / section เช่น `changelog`, `refine`, `build`
- `subject`: อธิบายสั้นๆ เป็นภาษาอังกฤษ (imperative mood)
- `body`: รายการสิ่งที่เปลี่ยนเป็นภาษาไทย เพื่อให้ทีมอ่านได้ง่าย
