---
id: release-bumps-version-and-changelog
type: convention
title: ทุก release bump version + เพิ่ม changelog entry ที่หัว array
domain: app
tags: [release, changelog, versioning]
status: proposed
enforcement: warn
applies_to: [app, "package.json", "src/data/changelog.ts"]
source: ai
timestamp: 2026-11-24T00:00:00Z
---

เวอร์ชันแสดงในแอปผ่าน `__APP_VERSION__` (inject จาก `package.json` ใน `vite.config.ts`) และหน้า `/changelog`
อ่านจาก `src/data/changelog.ts`

ทุกการเปลี่ยนที่ผู้ใช้เห็น:

- bump `package.json` `version` (semver: feat → minor, fix → patch)
- เพิ่ม `ChangelogEntry` **ที่หัว array** (ใหม่สุดก่อน) — `version` ตรงกับ package.json, `date` เป็น `YYYY-MM-DD`,
  `changes[]` แต่ละอันมี `type: 'feat' | 'fix' | 'improve'` + `description` ภาษาไทย
- commit แบบ conventional `feat(scope): …` / `fix(scope): …` / `improve(scope): …` + bullet ภาษาไทย + บรรทัด `bump version to x.y.z`

งานภายใน (refactor, persist state, tooling) ไม่ต้องลง changelog สาธารณะ — จดใน `docs/dev-session-*.md` ได้

**ระวัง merge conflict ใน `changelog.ts`** — เคยทำ entry 0.5.0 ขาด `changes` array (แก้ใน 0.6.1);
หลัง resolve conflict ให้รัน `pnpm run build` เพื่อให้ `tsc` จับ shape ผิด
