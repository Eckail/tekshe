# Tekshe repository audit

**Audit date:** 2026-11-05
**Branch:** `feature/learning-system` tracking `origin/feature/learning-system`

The initial findings below describe the repository before the Pinyin/HSK follow-up recorded at the end of this file.

## Repository state

- The repository root is `C:\Users\lenovo\tekshe`; the application source is in `app/`.
- The repository uses Next.js 16.4.3, React 19.3.0, TypeScript 5, Tailwind CSS 4, and the App Router. Cache Components and Partial Prefetching are enabled.
- The root `AGENTS.md` is present. No `PROJECT_MASTER.md` existed at initial inspection; the Pinyin/HSK follow-up adds one at the repository root.
- `app/page.tsx` assembles the product as one landing page. The app now uses Tekshe-specific page metadata and declares Kazakh (`lang="kk"`).
- The delivery review found no unrelated local changes. Next.js added its managed agent-feedback block to `AGENTS.md` when the development server started; it is retained as instructed by Next.js.
- `next.config.ts` has framework settings only. No app database, authentication, or Vercel project configuration is present in the repository.

## Implemented learning features (initial baseline)

| Area | Current implementation |
| --- | --- |
| Pinyin and tones | A five-card `ma` tone/neutral-tone set in `data/pinyin.ts`; a syllable lesson covers sound structure, zero initials, finals, and tone examples. |
| Quizzes | Tone, syllable, first-word, and simple-sentence quizzes are rendered on the home page. Tone playback uses browser speech synthesis. |
| Learning path | Five fixed stages stored in `data/courseProgress.ts`; completion and unlock state live in localStorage. |
| Daily quests | Three fixed daily quests, derived from saved exercise records. |
| Achievements | Five fixed achievements, derived from saved exercise records and XP. |
| Progress | Exercise records and course completion are saved in the browser. There is no account or cross-device sync. |
| HSK | No HSK curriculum dataset, level pages, or standard-version metadata existed before this task. |
| Four skills and media | No reading library, listening studio, writing studio, speaking practice, media library, or AI teacher module exists yet. |

Some vocabulary examples and quiz question sets are still embedded in React components. The current content is not yet a separately versioned curriculum that can be managed independently from the UI.

## Learning-core changes made

- Added a single XP award ledger with stable event IDs for quiz attempts, course completion, daily quests, and achievements.
- Added a one-time migration for existing exercise, daily-reward, achievement-reward, and completed-course data. Existing browser XP is retained in the total.
- Made all four quiz results create learning records and use the same score-based XP calculation. Repeated handling of one attempt and repeated quest, achievement, or course claims cannot add the same event twice.
- Added visible XP feedback and a 50 XP one-time course completion reward.
- Switched progress-driven client UI to `useSyncExternalStore`, keeping localStorage reads out of render-side state-setting effects and supporting same-tab and storage-event refreshes.
- Added versioned HSK curriculum contracts in `data/curriculum.ts`. Level identifiers are data-defined so a curriculum version is not locked to a fixed 1–6 enum. The contracts are not populated or wired to pages yet.
- Moved syllable breakdowns and tone descriptions into typed Pinyin data, and made the expandable tone cards keyboard-operable.
- Corrected course-card destinations, and fixed sentence and syllable quizzes so the final correct answer is not counted twice.
- Replaced the starter page title and description with Tekshe metadata and set the document language to Kazakh.

XP remains client-side and can be edited by the learner through browser storage. Cross-device consistency and tamper-resistant awards require the later account/database phase.

## Recommended architecture sequence

### Current foundation

- Keep XP awards and progress events behind data-layer functions; keep React components focused on presentation and interaction.
- Keep curriculum records in versioned data files or a content service, rather than embedding new course data in components.
- Preserve `CurriculumStandard` metadata and version-specific level IDs when adding HSK content.

### Next implementation stage (pre-follow-up plan; completed below)

1. Continue the Pinyin course: review and expand the sound inventory, add lesson objectives and completion criteria, and move the remaining quiz prompts into structured data.
2. Create a curriculum registry and integrity checks for level, unit, lesson, vocabulary, and prerequisite IDs.
3. Add a small, reviewed HSK 1 starter dataset for the selected standard version; do not preload every HSK level.
4. Make the learning path and quiz awards consume that course data instead of duplicating course identity in components.

### Later phases

- Add spaced repetition and review scheduling on top of the existing exercise history.
- Build reading, listening, writing, and speaking modules with independent skill progress.
- Add authentication and a database, then move XP and progress mutations to server-validated operations.
- Add age-appropriate AI tutoring and licensed media/content workflows after the learning data and user model are established.

## Verification

- XP ledger tests: 3 passed, covering duplicate award rejection, invalid values, and migration of existing XP.
- TypeScript: passed with `tsc --noEmit`.
- ESLint: passed.
- Production build: passed with Next.js 16.4.3; `/` and `/_not-found` prerender successfully.
- Local development server returned HTTP 200 for `/`; all rendered in-page anchor links resolved to existing section IDs. `/learn`, `/courses`, and `/xp` are not routes; the learning path, course content, and XP UI are sections on `/`.
- Vercel is connected to GitHub. Production deployment metadata points to `main`; pushes to `feature/learning-system` create READY Preview deployments. Preview hosts redirect to Vercel sign-in.

## Pinyin refinement and HSK 1 foundation follow-up

**Completed:** 2026-11-05 on `feature/learning-system`.

### Current implementation

- `data/pinyinCurriculum.ts` defines a five-lesson, ordered Pinyin course: 21 initials; grouped simple, compound, nasal, special, and medial-combination finals; ü spelling; all five tones; third-tone sandhi; 一/不 tone changes; y/w, contracted finals, tone-mark placement, apostrophe use, and common sound contrasts.
- Pinyin lessons include objectives, Kazakh explanations, examples, listening-selection exercises, syllable-building and reading exercises, and contrast practice. Audio selection uses browser speech synthesis with `zh-CN`; voice availability and quality depend on the learner's device.
- `data/curriculum.ts` now defines a shared versioned curriculum model with source references, per-syllable tone arrays, lesson teaching sections, answer choices, character-study metadata, collocations, grammar references, and common-error fields.
- `CurriculumCourseRunner.tsx` runs both the Pinyin and HSK starter courses. It renders lesson goals, explanations, examples, practice, answer feedback, prerequisites, completion, local progress, and the existing one-time course XP reward. The Pinyin course also writes the legacy `pinyin-basics` completion ID so the current learning path continues to work.
- `data/hsk1Foundation.ts` adds 29 level-one words in three themed lessons. Each entry includes characters, pinyin, lexical tones, part of speech, Kazakh gloss, example sentence and translation, curriculum/level IDs, and an official syllabus source reference.
- The selected content source is the Chinese Proficiency Test HSK syllabus published by the Center for Language Education and Cooperation in 2025-11 and effective 2026-07. The 2021 International Chinese Education Chinese Proficiency Standards and historical HSK 2.0 are recorded as separate references in the master project document; their word lists are not mixed into this dataset.
- Kazakh explanations and glosses are marked as editorial drafts and need review by a native Kazakh editor before publication. This is a known content-review requirement, not an automated translation claim.
- HSK levels remain data-defined strings and arrays. Future character strokes/radicals/structure, collocations, grammar links, and error notes have optional typed fields.
- No standalone Lesson Engine or lesson routes existed beforehand. This is a small shared runner over the existing App Router page and contracts; no broader route or storage rewrite was made.

### Quality checks

- `npx --no-install tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; the home page and not-found page prerender.
- `node --experimental-strip-types --test app/data/xp.test.mjs app/data/curriculum.test.mjs app/data/curriculumProgress.test.mjs`: 8 passed.
- Curriculum tests verify the inventory, referenced IDs, required explanations/examples/translations, pinyin character validity, tone counts, source-version agreement, and the 29-entry starter set.
- XP/progress tests verify incomplete-course gating, repeat submissions, invalid IDs, and one-time awards.
- Progress storage preserves unknown lesson IDs so a future client version does not erase progress it cannot currently render.

### Known gaps and next stage

1. Get native Kazakh editorial review for every course explanation, gloss, and sentence translation before public release.
2. Replace device-dependent speech synthesis with reviewed, licensed standard-Mandarin recordings when an audio workflow is chosen.
3. Expand HSK 1 beyond this 29-word starter only after checking the selected syllabus and translations; keep each new standard version isolated.
4. Add browser-level keyboard, phone-layout, and speech playback checks. The current quality pass covers static checks, data validation, and a production build, not visual cross-device QA.
5. Add HSK character-writing and recognition records, grammar points, and review scheduling without changing the versioned level IDs already stored.

## Product UI redesign and mobile beta

**Implemented:** 2026-11-05 on `feature/learning-system`.

### Routes and interface

- Added route-based pages for the dashboard (`/`), learning center, Pinyin module and lessons, HSK academy, HSK level and lesson pages, practice, progress, Tek Coin wallet, and profile.
- Added a shared responsive app shell with a desktop sidebar, mobile bottom navigation, safe-area padding, route-aware active states, and a last-learning-route preference stored locally.
- Added reusable page headings, icons, course catalogs, module summaries, and dashboard panels. Existing lesson data and `CurriculumCourseRunner` remain the execution path.
- Centralized the Cream, Charcoal, Burnt Orange, Steppe Green, Sand, and Paper palette plus typography, spacing, focus, and reduced-motion styles in `app/globals.css`.

### XP and Tek Coin

- Kept XP and Tek Coin as separate ledgers. XP migration and level progression are unchanged; old XP is not converted into currency.
- Added the versioned `tekshe-wallet:v1` transaction ledger with stable source activity IDs, idempotent lesson/milestone/quest/achievement awards, balance summaries, and preservation of unknown or invalid wallet schemas.
- Added a wallet route showing balance, earned total, recent transaction history, reward rules, and a clearly marked future store. No purchase or spend flow is enabled.
- Daily quest XP awards remain in the XP ledger and can award a separate, one-time 15 Tek Coin transaction. Lesson and course milestone rewards are likewise separate from their existing XP awards.
- Local progress and wallet data remain device-specific browser storage and are not synchronized to an account.

### PWA and verification

- Added a web manifest, SVG app icon, mobile viewport/theme metadata, offline fallback page, and a production-only service worker. The worker uses network-first navigation and caches only the fallback page.
- Verified `npm run lint`, `npx tsc --noEmit --incremental false`, the Next.js production build, and 14 XP/curriculum/wallet tests. The build generated all route entries successfully.
- Local HTTP smoke checks returned 200 for the dashboard, module, lesson, practice, progress, wallet, profile, manifest, service worker, offline page, and icon. Unknown Pinyin and HSK routes returned 404.
- Restored the existing five-stage Learning Path on `/learn`, retargeted its stages to working module/lesson routes, and kept the legacy `pinyin-basics` course completion/XP event when the five-lesson Pinyin curriculum is completed.
- `node-ts-extension-hooks.mjs` is used only by the standalone Node test command so existing Next.js-style extensionless TypeScript imports can load under Node's type-stripping test runner.
- Responsive behavior was reviewed in code, but no browser automation tool is available in this environment; physical-device and 360–1440 px visual QA remain unverified. PWA installation and offline behavior also still need device testing.
- A public, logged-out beta URL is not yet verified. Vercel preview protection must be checked before sharing a deployment URL.
- Vercel's project list returned the `tekshe` project, but project details and deployment settings returned 403 for the `eckail` scope. The earlier audit noted authenticated Preview pages; that setting was not revalidated in this pass. A new one-time owner access link was issued, and Preview details remain pending approval.

### Remaining limitations

1. Kazakh learning copy still needs review by a native editor.
2. Pinyin playback uses device-provided speech synthesis; voice availability and pronunciation are not guaranteed.
3. The streak reward amount is reserved in configuration but streak tracking and payouts are not implemented.
4. Wallet persistence, learning progress, and the remembered learning route are local to the current browser/device.
5. Complete mobile viewport, assistive-technology, installability, and offline acceptance testing before describing the beta as device-verified.
