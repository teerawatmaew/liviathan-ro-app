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

---

## Release: v0.7.0 — `/sage-learning` + ปรับ UX/UI Item Cost, MP Jigsaw, Central Lab

ทดสอบ production (https://liviathan-ro-app.vercel.app) ด้วย Playwright MCP ที่ 390px และ desktop แล้วแก้ที่เจอ
จากนั้นทดสอบซ้ำบน `vite preview` (localhost:4173)

### ปัญหาที่เจอบน production

| หน้า | ปัญหา |
|---|---|
| MP Jigsaw | "โบนัสที่กำลังจะถึง" แสดง `เวล ∞ … อีก ∞ เวล` ของ Start Premium / Bonus Jigsaw |
| MP Jigsaw | มือถือ: ตาราง 7 คอลัมน์ล้น — คอลัมน์ "รวม Jigsaw" หลุดจอ; การ์ดอ้างอิงขาด Box 4–5 |
| Central Lab | สวิทช์บนมือถือ: ปุ่ม knob ทับตัวหนังสือ ON/OFF |
| Central Lab | Stage filter ไม่แสดงอะไรจนกว่าจะพิมพ์ชื่อ; ไม่มี keyboard nav |
| Central Lab | กรอก 300 → เปลี่ยนเป็น 255 เอง, 0 → 1 (clamp เงียบ) |
| Central Lab | timer ลบทีละวินาที (เพี้ยนเมื่อแท็บเบื้องหลัง), กรอบแดงตอนหมดเวลาไม่แสดง (Card ใช้ `ring`), timer 3 ใบกินจอมือถือ |
| Central Lab | สีธาตุ hardcode โทนมืด — Light mode อ่านยาก |
| Item Cost | ยอดรวม 740,000z ดูครบทั้งที่ยังไม่รวม Shadowdecon 27 ชิ้น; รายการหายเมื่อรีเฟรช |
| ทุกหน้า | header มือถือ: ชื่อหน้าถูกตัดหาย, ปุ่มสนับสนุนกินที่ |

### สิ่งที่แก้ (บันทึกใน changelog 0.7.0)

- MP Jigsaw: `getUpcomingBonuses()` (+ test) กรอง `Infinity`, progress bar, การ์ดอ้างอิงสร้างจาก `BOXES`, ซ่อนคอลัมน์รายละเอียดบนมือถือ
- Central Lab: `switchLogic.ts` (+ test) — ไม่ clamp, แสดง error, สรุปสวิทช์ที่ต้องเปิด + เลขฐาน 2; สวิทช์ responsive
- Central Lab: Boss Lookup แสดงรายชื่อบอสตาม stage, ↑ ↓ / Enter / Esc, aria; สีธาตุมี light/dark
- Central Lab: CountdownTimer นับจาก end timestamp, AudioContext ตัวเดียว, `ring-destructive`, progress bar, grid 3 คอลัมน์บนมือถือ
- Item Cost: persist `lro-reform-items` / `lro-grade-items`, `nextId(prev)` (+ test), กรองสูตรที่ไม่มีแล้ว, ปุ่ม "ล้าง", กล่องเตือนวัตถุดิบไม่มีราคา
- Layout: header มือถือแสดงเฉพาะชื่อหน้า, ปุ่มสนับสนุนเหลือไอคอน (มี `aria-label`)
- `.gitignore`: `.playwright-mcp`

### Knowledge ใหม่ (`status: proposed`)

| Domain | Entry |
|---|---|
| `item-cost` | `context.md`, `grade-chain-triples-per-step`, `unpriced-materials-must-be-flagged`, `persisted-lists-need-safe-ids-and-validation` |
| `mp-jigsaw` | `context.md`, `box-formula`, `infinity-means-no-rule` |
| `central-lab` | `context.md`, `switch-bit-order`, `timers-use-end-timestamp`, `boss-data-from-irowiki` |

ผลตรวจ: `pnpm test` 118/118 · lint 0 error · build ผ่าน · ยืนยันใน CSS ว่า `dark:` compile เป็น `:where(.dark, .dark *)`

---

## ค้างไว้

- [ ] review knowledge ใน `agents/sage/` แล้ว approve entry ที่ถูกต้อง
- [ ] ยังไม่มี knowledge ของ Stat formulas, Zeny calculator, Damage (WIP)
- [ ] ยังไม่มี component test (ไม่มี jsdom / Testing Library) — ทดสอบ UI ด้วย Playwright MCP แบบ manual
- [ ] ไอเทมในรายการ Item Cost ช่อง "จำนวน" ลบตัวเลขให้ว่างแล้วพิมพ์ใหม่ไม่ได้ (ต้อง select ทั้งช่อง)

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
