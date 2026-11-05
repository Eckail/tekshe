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
