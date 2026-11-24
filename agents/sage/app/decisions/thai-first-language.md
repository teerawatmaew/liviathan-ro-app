---
id: thai-first-language
type: team_decision
title: ใช้ภาษาไทยเป็นหลัก — ผู้พัฒนามีคนเดียวและใช้ภาษาไทย
domain: app
tags: [language, docs, communication, commit]
status: approved
enforcement: block
applies_to: [app, refine, "**"]
source: human
timestamp: 2026-11-24T00:00:00Z
---

โปรเจกต์นี้มีผู้พัฒนาคนเดียวและใช้ภาษาไทย ⇒ ทุกอย่างที่คนอ่าน เขียนเป็น**ภาษาไทยเป็นหลัก**

| ส่วน | ภาษา |
| --- | --- |
| การตอบ / สรุปงาน / คำถามถึงผู้พัฒนา | ไทย |
| ข้อความ UI ที่ผู้ใช้เห็น | ไทย |
| `src/data/changelog.ts` `description` | ไทย |
| knowledge ใน `agents/sage/` (decision, rules, context, skills), `docs/`, `.claude/CLAUDE.md`, `.github/copilot-instructions.md` | ไทย |
| commit message | หัวเรื่อง conventional (`feat(scope): …`) ได้ แต่ bullet รายละเอียดเป็นไทย |
| comment ในโค้ด | ไทย |

**คงเป็นภาษาอังกฤษ:**

- โค้ด: ชื่อตัวแปร, function, type, ไฟล์, โฟลเดอร์, route, localStorage key
- ศัพท์เทคนิค / ชื่อ library / คำสั่ง (เช่น `useMemo`, BSB, lazy loading) — ไม่ต้องแปลฝืน
- ชื่อไอเทม แร่ มอนสเตอร์ ที่เกมใช้เป็นภาษาอังกฤษ (Oridecon, Etherdeocon, Blacksmith's Blessing)
- frontmatter key ของ Sage และไฟล์ที่ Sage installer เป็นเจ้าของ (`agents/sage/install-manifest.txt`, `agents/sage/commands/`)
