# Dev Session — 2026-11-24

## สรุป

ติดตั้ง **Sage** (cognition protocol สำหรับ AI agents) พร้อมบันทึกความรู้ของโปรเจกต์ลง `agents/sage/`
และแก้ปัญหาที่ทำให้ `main` build / test / lint ไม่ผ่าน

Commits: `59f6ecd` (Sage + knowledge), `9bb7ace` (code fixes), และ commit ปิดงาน (CLAUDE.md, v0.6.2, docs)

## Release: v0.6.2

---

### User-facing (บันทึกใน changelog.ts)

- **fix** Dark / Light toggle: utility `dark:` (ใน badge, button, input, select, textarea และหน้า MP Jigsaw)
  เดิมเปลี่ยนตาม OS ไม่ใช่ปุ่ม toggle — เพิ่ม `@custom-variant dark (&:where(.dark, .dark *));` ใน `src/index.css`

---

### Internal / ไม่บันทึกใน changelog สาธารณะ

- **chore** ติดตั้ง Sage จาก `qorstack/sage` — adapters: Claude Code, GitHub Copilot, Codex, Cursor, Windsurf, Cline
  - command: `/sage`, `/sage-learning`, `/sage-review`, `/sage-update` ฯลฯ (ทั้งหมด 14)
  - อัปเดตภายหลังด้วย `/sage-update` — installer เขียนทับเฉพาะไฟล์ใน `agents/sage/install-manifest.txt`,
    `agents/sage/commands/` และ adapter ของ Sage; knowledge ที่เราเขียนเองไม่ถูกแตะ
- **docs** บันทึกความรู้ (ทุก entry เป็น `status: proposed` — เปลี่ยนเป็น `approved` เมื่อต้องการบังคับใช้)

  | Domain | Entry |
  |---|---|
  | `app` | `rules.md` (stack, layout, reusable assets, กฎหลัก) |
  | `app` | `add-page-four-touchpoints`, `release-bumps-version-and-changelog`, `persist-ui-state-with-lro-keys`, `pure-logic-files-with-colocated-tests`, `dark-variant-must-follow-class-toggle` |
  | `app` | skills: `tailwind-v4-css-first-tokens`, `derive-during-render-not-effects` |
  | `refine` | `context.md` (glossary), `fail-outcome-priority`, `rate-tables-indexed-by-from-level`, `rate-up-items-use-standard-mechanics` |
  | roles | `role-codebase-analyst`, `role-researcher` |

- **docs** `.github/copilot-instructions.md` — เพิ่ม route `/tools/zeny-calculator`, `/changelog` และลิงก์ไป `agents/sage/`
- **fix** กู้ `src/pages/content/ContentPage.tsx` ที่ถูกลบใน working tree (ยังถูกอ้างจาก routes, sidebar, HomePage → build พัง)
- **test** `mpJigsawLogic.test.ts` — อัปเดตค่า Box 1 `fromFirst100` 32 → 31 ให้ตรงกับข้อมูลที่แก้ใน `7db3c97`
- **refactor** `use-mobile.ts` → `useSyncExternalStore` (แก้ lint `react-hooks/set-state-in-effect`)
- **chore** `eslint.config.js` — ปิด `react-refresh/only-export-components` เฉพาะ `src/components/ui/**` (shadcn export variants คู่ component)

- **docs** `.claude/CLAUDE.md` (ใหม่) — ชี้ Claude Code ไปที่ `agents/sage/`, copilot-instructions และ dev-session
  (Claude Code ไม่โหลด `agents/sage/AGENTS.md` เอง)
- **docs** `.github/copilot-instructions.md` — §8 sidebar เพิ่ม Changelog / Zeny → Baht + หมายเหตุ `PAGE_LABELS`,
  §9 เพิ่ม Zeny / Changelog, §13 og:image ทำแล้ว (เหลือ apple-touch-icon PNG + sitemap)
- **chore** bump version `0.6.2` + changelog entry fix dark mode
- **docs** กฎใหม่ `app/decisions/thai-first-language` (approved · block) — ใช้ภาษาไทยเป็นหลัก
  อ้างไว้ใน `.claude/CLAUDE.md`, `copilot-instructions.md`, `app/rules.md`

ผลตรวจหลังแก้: `pnpm test` 107/107 ผ่าน · `pnpm run lint` 0 error · `pnpm run build` ผ่าน

---

## ค้างไว้

- [ ] ทดสอบ toggle ธีมด้วยตาบน browser จริง (ทดสอบแค่ build)
- [ ] review knowledge ใน `agents/sage/` แล้ว approve entry ที่ถูกต้อง
- [ ] ยังไม่มี knowledge ของ Item Cost (Grade/Reform), MP Jigsaw, Central Lab, Stat formulas, Zeny calculator

---

## Files changed

```
.claude/ .clinerules/ .codex/ .cursor/ .windsurf/          (Sage adapters, new)
.claude/CLAUDE.md                                          (new)
package.json                                               (0.6.2)
src/data/changelog.ts
.github/instructions/ .github/prompts/sage.prompt.md       (Sage adapters, new)
.github/copilot-instructions.md
agents/sage/**                                             (new)
docs/dev-session-2026-11-24.md                             (new)
eslint.config.js
src/hooks/use-mobile.ts
src/index.css
src/pages/tools/mp-jigsaw-calculator/mpJigsawLogic.test.ts
```
