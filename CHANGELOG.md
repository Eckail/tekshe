# Changelog

## 2026-11-05 — Platform foundation and curriculum registry

### Added

- Added `PROJECT_MASTER.md` with product principles, information architecture, technical architecture, delivery phases, domain invariants, and working agreement.
- Added `DEVELOPMENT_LOG.md` for verified implementation decisions and outcomes.
- Added a Tekshe-owned beginner curriculum registry with a first Pinyin lesson, a vocabulary entry, and a linked exercise. This is explicitly not an official HSK syllabus.
- Added curriculum structural validation for duplicate/empty IDs, unresolved references, parent consistency, sequence/duration values, and prerequisite cycles.
- Added curriculum validation tests.
- Added `npm run test` and `npm run typecheck` scripts.

### Changed

- Added `pronunciation` as a first-class curriculum module kind.
- Created the `feature/platform-foundation` branch from `main`.

### Verification status

- Repository files were read back from the feature branch after writes.
- Automated tests, TypeScript, ESLint, and production build have **not yet been executed** for this change because the connected GitHub integration cannot run commands on the local development environment.
- Run `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build` locally before merging.

---

## 2026-11-05 — Learning core and curriculum foundation

### Added

- Central XP ledger with idempotent award IDs for quiz attempts, course completions, daily quests, and achievements.
- One-time migration for existing local exercise, daily quest, achievement, and course XP.
- Versioned curriculum contracts that support data-defined level IDs and multiple standard versions.
- XP ledger tests for duplicate awards, invalid values, and legacy migration.
- Repository audit in `app/PROJECT_AUDIT.md`.

### Changed

- All four quizzes now save attempts and award XP through the shared progress layer.
- Course completion grants a one-time 50 XP reward.
- Progress, quest, achievement, and course status refresh from the shared local progress event and browser storage changes.
- Quiz results show earned exercise XP and newly earned course completion XP.
- Pinyin syllable breakdowns and tone descriptions now live in typed data; tone cards are keyboard-operable.
- Replaced starter metadata and set the document language to Kazakh; course cards now link to their matching learning sections.
- Corrected sentence and syllable quizzes so the last correct answer is counted once.

### Previous verification

- XP tests: 3 passed.
- TypeScript check: passed.
- ESLint: passed.
- Next.js production build: passed; `/` and `/_not-found` prerender successfully.

### Known limitations

- XP and progress remain in browser localStorage. Authentication, cloud synchronization, and server-validated awards remain future work.
- The curriculum registry currently contains only a small structural starter slice. It is not yet connected to the learner-facing course pages.
