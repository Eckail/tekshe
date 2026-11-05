# TEKSHE — Master Project Specification

## Product vision

Tekshe is a Chinese-learning platform for Kazakh-speaking learners. It teaches standard Mandarin pronunciation and useful Chinese through structured lessons, clear examples, practice, feedback, progress, and XP. Kazakh is the instructional language; Chinese and Pinyin content use standard Mandarin conventions.

The product keeps its Premium Bauhaus visual direction:

- Cream: #F3EDE1
- Charcoal: #242321
- Burnt Orange: #B85F3D

## Current product state

The repository is a Next.js App Router project. The home route at / currently composes the landing page, learning path, Pinyin, HSK starter course, first-word and sentence practice, progress, quests, achievements, and supporting sections. Course material is shown on the home route; there are no separate /learn, /courses, or /xp routes.

Current foundation:

- Next.js 16.4.3, React 19.3.0, TypeScript 5, Tailwind CSS 4.
- next.config.ts enables Cache Components, Partial Prefetching, and the project's existing Turbopack CSS loader.
- app/page.tsx remains a Server Component and composes smaller client components for interaction.
- Learning and XP progress are stored in browser localStorage. There is no account system, database, or cross-device synchronization.
- The established Git workflow is development on feature/learning-system; main is the production branch. Do not push development work directly to main or trigger a production deploy without an explicit release decision.

## Curriculum architecture

Curriculum records live in app/data/, outside page components. app/data/curriculum.ts defines versioned standards, levels, modules, units, lessons, sources, vocabulary, examples, exercises, and optional future character-learning metadata. Level IDs are data-defined; the application does not assume a permanent six-level HSK structure.

app/components/CurriculumCourseRunner.tsx is the shared lesson execution component. It presents learning objectives, Kazakh explanations, examples, interactive exercises, answer feedback, prerequisite locks, lesson progress, completion, and one-time XP. Pinyin and HSK content use this runner without replacing the existing learning path, XP ledger, first-word course, or sentence course.

The existing XP ledger is in app/data/xp.ts. Stable award IDs prevent repeated course completion and exercise submission from granting the same XP event twice.

### Pinyin curriculum

The current Pinyin foundation is versioned as pinyin-foundations-v1. It contains five sequenced lessons covering:

- All 21 basic initials and contrasts such as b/p, j/q, zh/ch, z/c.
- 36 listed final forms grouped as simple, compound, nasal, special, and medial combinations. Full and contracted spellings such as iou/iu, uei/ui, and uen/un are explained separately.
- The four lexical tones and neutral tone, including third-tone behavior, consecutive third tones, 一/不 tone changes, and a first-tone plus third-tone example.
- ü spelling after j/q/x and n/l, zero-initial y/w spellings, tone-mark placement, apostrophe use, syllable reading, listening selection, and common sound confusions.
- Keyboard-operable exercises and browser speech synthesis requested in zh-CN. Actual voice availability and pronunciation quality depend on the learner's device.

Sources:

- The Ministry of Education copy of 汉语拼音方案: https://hudong.moe.gov.cn/jyb_sjzl/ziliao/A19/195802/t19580201_186000.html
- GB/T 16159—2012 汉语拼音正词法基本规则: https://www.moe.gov.cn/ewebeditor/uploadfile/2015/01/13/20150113091717604.pdf
- CUHK Independent Learning Centre teaching reference on third-tone changes: https://www.ilc.cuhk.edu.hk/chinese/re_PTHforForeigners_Phonetics3.html

### Selected HSK standard

The HSK starter content uses one standard version: HSK 考试大纲 / Syllabus for the Chinese Proficiency Test, published by the Center for Language Education and Cooperation (CLEC) in November 2025 and effective July 2026. The official syllabus PDF is versioned in the data source record:
https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf

The current course includes 29 words checked against the HSK 1 list. This is a starter subset, not a copy of the complete level list. Example sentences are original learning examples; their Kazakh translations are editorial drafts.

Keep the following standards distinct:

| Standard | Structure and scope | How Tekshe uses it |
| --- | --- | --- |
| Historical HSK 2.0 | Six written test levels. The official 2009 HSK overview gives cumulative vocabulary targets of 150, 300, 600, 1,200, 2,500, and 5,000+ across levels 1–6. That overview does not provide per-level character quotas, so no character-count comparison is inferred from it. | Historical compatibility reference only. Do not mix its vocabulary list with the selected syllabus. |
| 国际中文教育中文水平等级标准 (GF0025-2021) | Three bands and nine levels; the official overview reports totals of 1,110 syllables, 3,000 characters, 11,092 vocabulary items, and 572 grammar points, and includes listening, speaking, reading, writing, and translation skills. | A separate proficiency benchmark and reference for future alignment, not the source of the current HSK word list. |
| HSK 2025 examination syllabus | Published 2025-11 and effective 2026-07. It organizes HSK 1–6 and HSK 7–9 and provides task, topic, vocabulary, character, and grammar sections. It has level-specific recognition-character tables and a writing-character list for levels 1–9. | Selected source for HSK course labels and the 29 HSK 1 starter entries in this version. |

The MOE describes GF0025-2021 as a three-band, nine-level standard and an HSK reference. HSK exam content remains versioned separately because the exam syllabus and the broader proficiency standard are distinct publications:

- MOE explainer for GF0025-2021: https://dxs.moe.gov.cn/zx/a/jj/210402/1614015.shtml
- Official historical HSK 2.0 overview: https://admin.chinesetest.cn/gonewcontent.do?id=677484

Every vocabulary entry stores its curriculum ID, versioned level ID, characters, Pinyin, a tone per syllable, part of speech, Kazakh gloss, example, and source ID. Optional fields reserve typed space for strokes, radicals, character structure, collocations, grammar links, and common errors. Add future standards as new versioned data instead of relabeling existing records.

### Editorial and data policy

- Each official word-list entry links to a source record and locator.
- Do not combine terms from different HSK editions in one curriculum version.
- Kazakh strings currently have editorial-draft status. A native Kazakh editor must review the explanations, glosses, and example translations before public release.
- Do not claim that device speech synthesis is a reviewed standard-Mandarin recording.
- Prefer original examples or appropriately licensed material; record licensing for added audio and reading sources.

## Development and verification

Run commands from C:\Users\lenovo\tekshe:

- npm run dev — start local development at http://localhost:3000.
- npm run lint — ESLint.
- npx --no-install tsc --noEmit --incremental false — TypeScript check without writing incremental state.
- node --import app\data\node-ts-extension-hooks.mjs --experimental-strip-types --test app\data\xp.test.mjs app\data\curriculum.test.mjs app\data\curriculumProgress.test.mjs app\data\tekCoins.test.mjs — XP, curriculum, and wallet tests.
- npm run build — Next.js production build.

The course integrity tests check IDs, sources, vocabulary, pinyin characters, tone counts, examples, exercise answers, and version metadata. Completion tests check prerequisites, repeated submission, and one-time rewards.

## Known gaps and next work

1. Native Kazakh editorial review is still required.
2. Speech playback depends on device-provided zh-CN voices; reviewed recordings are not yet included.
3. The HSK 1 dataset has 29 entries and is not the complete level vocabulary list.
4. HSK 2–9, writing/character practice, grammar lessons, and spaced repetition are not yet implemented.
5. Browser-level visual QA for phone layouts and assistive technology should be added.
6. Progress remains device-local and client-side; accounts, sync, and server-validated XP are later platform work.

Recommended next stage: get native Kazakh review for the current material, then expand HSK 1 by source-verified themes and add a small set of character-recognition records using the existing extension fields.

## 2026-11-05 — Product UI redesign and mobile beta foundation

### Application architecture

- Tekshe now has route-based Dashboard, Learning Center, Pinyin module/lesson, HSK academy/level/lesson, Practice, Progress, Tek Coin Wallet, and Profile pages.
- A shared `AppShell` provides desktop sidebar navigation and mobile bottom navigation, safe-area spacing, route-aware state, and a versioned last-learning-route preference.
- Module and lesson views continue using the existing curriculum data and `CurriculumCourseRunner`; the redesign does not replace the curriculum or XP engine. The five-stage legacy learning path remains available at `/learn`, and Pinyin completion still records the legacy course ID and XP event.
- `app/globals.css` defines the core Cream, Charcoal, Burnt Orange palette and Steppe Green, Sand, and Paper support tokens, plus type/spacing scales, visible focus, and reduced-motion rules.

### Separate XP and Tek Coin ledgers

- XP remains the internal progression measure in its existing ledger. Existing XP migration is preserved and no XP is converted into Tek Coins.
- `app/data/tekCoins.ts` stores wallet transactions under `tekshe-wallet:v1`, with idempotent activity IDs for lesson, daily quest, milestone, and achievement rewards. Unknown or invalid schemas are preserved instead of overwritten.
- The wallet page shows balance, total earned, transaction history, and earning rules. It has no purchase or spend flow; the future store is labeled as upcoming.
- Browser storage is device-local. Progress and wallet records do not sync across devices or accounts.

### PWA and verification

- Added an app manifest, SVG icon, mobile theme/viewport metadata, an offline page, and a production-only network-first service worker that caches only the offline fallback.
- `npm run lint`, `npx tsc --noEmit --incremental false`, and the production build passed. XP, curriculum, progress, and wallet suites passed 14 tests.
- Local HTTP smoke checks returned 200 for all primary routes and PWA assets; unknown Pinyin and HSK routes returned 404. Build output includes all application routes. Browser-based viewport, keyboard, assistive-technology, PWA-installation, and offline tests were not available in this environment and remain unverified.

### Known limitations and next work

- Obtain native Kazakh editorial review and use reviewed Mandarin recordings instead of relying solely on device speech synthesis.
- Implement streak tracking before paying the configured streak reward.
- GitHub reported a successful Vercel check for the pushed feature branch; deployment detail access is 403, so the Preview hostname and logged-out access remain unverified. Verify access and test before sharing a public mobile beta.
- Perform visual acceptance checks at 360, 375, 390, 430, 768, 1024, and 1440 px and test localStorage persistence on a real phone.
