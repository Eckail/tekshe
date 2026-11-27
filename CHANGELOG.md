# Changelog

## 2026-11-05 — Learning core and curriculum foundation

### Added

- Central XP ledger with idempotent award IDs for quiz attempts, course completions, daily quests, and achievements.
- One-time migration for existing local exercise, daily quest, achievement, and course XP.
- Versioned HSK curriculum types that support data-defined level IDs and multiple standard versions.
- XP ledger tests for duplicate awards, invalid values, and legacy migration.
- Repository audit and staged architecture plan in `app/PROJECT_AUDIT.md`.

### Changed

- All four quizzes now save attempts and award XP through the shared progress layer.
- Course completion grants a one-time 50 XP reward.
- Progress, quest, achievement, and course status refresh from the shared local progress event and browser storage changes.
- Quiz results show earned exercise XP and newly earned course completion XP.
- Pinyin syllable breakdowns and tone descriptions now live in typed data; tone cards are keyboard-operable.

### Verification

- XP tests: 3 passed.
- TypeScript check: passed.
- ESLint: passed.
- Next.js production build: passed; `/` and `/_not-found` prerender successfully.

### Notes

- XP and progress remain in browser localStorage. Authentication, cloud synchronization, and server-validated awards remain future work.
- The HSK curriculum contracts are not populated with level content or connected to pages yet.

### Delivery QA follow-up

- Replaced starter metadata and set the document language to Kazakh; course cards now link to their matching learning sections.
- Corrected sentence and syllable quiz totals so the last correct answer is counted once.
- Re-ran XP tests, ESLint, TypeScript, and the production build successfully.

## 2026-11-05 — Pinyin curriculum refinement and HSK 1 foundation

### Added

- A versioned five-lesson Pinyin curriculum covering all 21 basic initials, 36 grouped final forms, ü spelling, tone patterns and sandhi, y/w spellings, apostrophes, contracted finals, syllable reading, listening selection, and common sound contrasts.
- A shared CurriculumCourseRunner used by the Pinyin and HSK starter curricula. It renders objectives, explanations, examples, exercises, answer feedback, prerequisites, lesson progress, completion, and XP.
- Versioned HSK curriculum/source metadata and 29 HSK 1 vocabulary entries. Each entry includes characters, Pinyin, lexical tones, part of speech, Kazakh gloss, an example and translation, level/course IDs, and an official source reference.
- Optional typed fields for character strokes, radicals, structure, collocations, grammar links, and common errors.
- Curriculum and completion tests covering content integrity, missing IDs, invalid Pinyin characters, tones, sources, empty fields, repeated submissions, and one-time XP.

### Changed

- HSK content is explicitly tied to the CLEC 2025 HSK examination syllabus, published 2025-11 and effective 2026-07. HSK 2.0 and GF0025-2021 remain separate references; their word lists are not mixed.
- The Pinyin course writes its completed state through the existing pinyin-basics course ID to preserve learning-path compatibility.
- app/PROJECT_AUDIT.md records the implementation and verification results.

### Sources

- Official HSK 2025 syllabus: https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf
- Official MOE GF0025-2021 explainer: https://dxs.moe.gov.cn/zx/a/jj/210402/1614015.shtml
- Official historical HSK 2.0 overview: https://admin.chinesetest.cn/gonewcontent.do?id=677484
- MOE Pinyin scheme and orthography sources are recorded in app/data/pinyinCurriculum.ts.

### Verification

- XP and curriculum tests: 8 passed.
- TypeScript check: passed.
- ESLint: passed.
- Next.js production build: passed; / and /_not-found prerender successfully.
- No production deployment was triggered.

### Known gaps

- Kazakh explanations and translations are editorial drafts and still require native-editor review.
- Listening items use browser speech synthesis with zh-CN; pronunciation depends on available system voices.
- The HSK 1 dataset contains 29 words and is only a starter subset, not the full level list.

## 2026-11-05 — Product UI redesign and mobile beta foundation

### Added

- Route-based dashboard, learning center, Pinyin and HSK module/lesson pages, practice, progress, wallet, and profile.
- Responsive shared navigation, Tekshe design tokens, reusable page and icon components, and a locally remembered learning route.
- Versioned Tek Coin transaction ledger and wallet page, keeping coins separate from XP and preserving existing XP migration.
- Web manifest, SVG app icon, mobile metadata, offline fallback, and a production-only network-first service worker.

### Verification

- ESLint: passed.
- TypeScript (`npx tsc --noEmit --incremental false`): passed.
- Next.js production build: passed; all new route entries generated.
- XP, curriculum, progress, and wallet tests: 14 passed.
- Local HTTP checks returned 200 for the primary routes and PWA assets, with 404 for invalid routes. No browser automation is available in this environment, so actual phone viewport, logged-out Preview, PWA installability, and offline behavior remain unverified.
- GitHub reports a successful Vercel status check for the feature push; deployment details and a logged-out Preview URL could not be verified because the Vercel team API returned 403.
- No Production deployment was triggered.

## 2026-11-22 — Startup MVP demo polish

### Added

- A redesigned Dashboard with a clear resume action, accurate saved-learning statistics, daily lesson goal, course progress, and direct Profile access.
- Responsive navigation tuned for phone, tablet, and desktop widths.
- An editable local learner profile with nickname, avatar, and daily lesson goal, stored in versioned browser localStorage without asking for identifying information.
- Learner profile storage tests and `npm test` / `npm run typecheck` scripts.

### Verification

- Tests: 18 passed across XP, curriculum, lesson progress, Tek Coin, and local profile data.
- TypeScript and ESLint: passed.
- Production build: passed after the Next.js advisory retry.
- Browser QA: Dashboard and Profile checked at 360–1440 px, keyboard focus checked, profile settings persisted after reload, Pinyin completion/reward flow exercised, and HSK 1 page loaded. No console errors, failed requests, or horizontal overflow were found in the checked routes.
- Vercel Preview `https://tekshe-git-feature-startup-demo-mvp-eckail.vercel.app` reached READY for the development branch and returned HTTP 200 without login after a Preview-alias-only protection exception. Production deployment and `main` were untouched.

### Commits

- `feat(ui): polish startup demo dashboard and app shell`
- `feat(profile): add editable local learner profile`

### Limits and next steps

- Profile and learning data remain local to the current browser; account and sync support are not included.
- Next.js 16.4.3 reports a known security advisory. Review its security upgrade recommendation before production release.
- Continue with native Kazakh review, judge-facing demo rehearsal, and a deliberate release review before merging to `main`.

## 2026-11-27 — Vocabulary review and AI boundary foundation

### Added

- A versioned local spaced-repetition system for the current HSK 1 vocabulary, with lesson exposure, mapped exercise evidence, four recall ratings, due-card counts, and review history.
- A responsive `/review` page linked from the Dashboard, Progress, and app navigation. A five-card daily review quest uses the existing one-time XP and Tek Coin reward ledgers.
- Typed AI tutor request/context boundaries and a status-only API route. The route reports unavailable until a real provider and server-side credentials are configured; no AI response is simulated.
- Review scheduler and AI boundary test suites in the default `npm test` command.

### Verification

- Tests: 28 passed, including XP, curriculum, progress, wallet, profile, review scheduling, and AI boundary cases.
- TypeScript, ESLint, and the Next.js production build passed. The build continued successfully after the required retry following Next.js 16.4.3's security advisory notice.
- Local production HTTP checks returned 200 for `/`, `/review`, and a representative HSK lesson.

### Limits

- Review history and rewards remain browser-local; they are not synchronized or server-authoritative.
- AI tutoring is not available until a provider, secure server-side key configuration, and user-facing experience are deliberately implemented.
- Node's native TypeScript test runner prints non-blocking module-type detection warnings for the existing package module style.

## 2026-11-27 — Dated learning calendar

### Added

- A responsive, Monday-first month calendar on Progress, with month navigation, daily selection, real lesson/exercise/review activity, and monthly totals.
- Calendar events are read from existing local records; older lesson completion flags with no timestamp are not assigned a guessed date.
- Three calendar tests for activity aggregation, month boundaries, and invalid or undated records.

### Verification

- Full test suite: 31 passed. TypeScript and ESLint passed after the calendar implementation.
- Production build passed; `/progress`, `/review`, and the dynamic AI status API were generated. The known Next.js 16.4.3 security reminder was displayed, and the build continued successfully.
- Local production HTTP checks returned 200 for `/progress`, `/review`, and a representative HSK lesson; the temporary server was stopped.
