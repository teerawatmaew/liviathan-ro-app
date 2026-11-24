# app — domain index

โครงสร้าง, conventions และ release process ของ LiviathaN RO (React 19 + Vite SPA, ไม่มี backend)
รายละเอียดเต็มของโครงสร้างโฟลเดอร์/ขั้นตอนเพิ่มหน้า อยู่ที่ [`.github/copilot-instructions.md`](../../../.github/copilot-instructions.md) — ไฟล์ใน domain นี้เก็บเฉพาะกฎและสิ่งที่พังเงียบได้

| Entry | Status | Enforcement |
| --- | --- | --- |
| `rules.md` — stack, layout, reusable assets, กฎหลัก | proposed | — |
| `decisions/add-page-four-touchpoints.md` — เพิ่มหน้าใหม่ต้องแตะ 4 ที่: `paths.ts` → page → `lazy-pages.tsx` + `routes/index.tsx` → `MainLayout.tsx` | proposed | warn |
| `decisions/release-bumps-version-and-changelog.md` — ทุก release: bump `package.json` + entry ใหม่หัว `src/data/changelog.ts` + conventional commit | proposed | warn |
| `decisions/persist-ui-state-with-lro-keys.md` — state ที่ผู้ใช้อยากให้จำ ใช้ `useLocalStorage('lro-<page>-<field>')` | proposed | advise |
| `decisions/pure-logic-files-with-colocated-tests.md` — logic คำนวณแยกเป็นไฟล์ `.ts` pure + `*.test.ts` ข้างกัน, UI ใช้ `useMemo` | proposed | warn |
| `decisions/dark-variant-must-follow-class-toggle.md` — `index.css` ต้องมี `@custom-variant dark` ไม่งั้น `dark:` utilities ตาม OS ไม่ตาม toggle | proposed | warn |
| `skills/tailwind-v4-css-first-tokens.md` | proposed | advise |
| `skills/derive-during-render-not-effects.md` | proposed | advise |
