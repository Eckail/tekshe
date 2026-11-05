# Tekshe Development Log

This file records implementation decisions and verified outcomes. Newest entries go first.

## 2026-11-05 — Curriculum foundation v1 (implementation drafted)

- Problem: the repository had curriculum type contracts but no concrete registry, no integrity checks, and no curriculum validation tests.
- Decision: start with a small Tekshe-owned beginner curriculum slice. Do not label it as official HSK content. Keep the registry separate from UI components.
- Files added:
  - `PROJECT_MASTER.md` — product scope, architecture, roadmap, domain invariants, and collaboration process.
  - `DEVELOPMENT_LOG.md` — this implementation record.
  - `app/data/curriculumRegistry.ts` — a beginner curriculum containing one level, one pronunciation module, one unit, one Pinyin lesson, one vocabulary item, and one exercise.
  - `app/data/curriculumValidation.ts` — structural validation for IDs, references, parent links, sequence/duration, and prerequisite cycles.
  - `app/data/curriculumValidation.test.mjs` — tests for valid data, duplicate IDs, missing references, invalid duration, and prerequisite cycles.
- Files changed:
  - `app/data/curriculum.ts` — added the `pronunciation` module kind.
  - `package.json` — added `npm run test` and `npm run typecheck`.
  - `CHANGELOG.md` — recorded scope and verification requirements.
- Branch: `feature/platform-foundation`, created from `main`.
- Verification: GitHub read-back confirms the new files and package scripts are present. Local test, typecheck, lint, and production build are **pending**; this integration cannot execute commands on the user's computer.
- Next: pull this branch locally, run the four verification commands, fix any failures, then wire the registry into the course/lesson UI without breaking the current homepage.

## 2026-11-05 — Platform foundation kickoff

- Reviewed the default branch `main` and the complete tracked file tree.
- Read `AGENTS.md`, `README.md`, `CHANGELOG.md`, `app/PROJECT_AUDIT.md`, the app entry point, XP ledger, progress store, learning records, course progress, curriculum contracts, quests, achievements, and XP tests.
- Confirmed the repository has a working learning prototype and a centralized XP ledger, but still lacks route-level learning architecture, populated curriculum data, backend persistence, authentication, and AI tutoring.
- Created feature branch `feature/platform-foundation` from `main`.
- Added `PROJECT_MASTER.md` as the product, architecture, delivery roadmap, invariants, and collaboration source of truth.

## Entry template

### YYYY-MM-DD — Short task name
- Problem:
- Decision:
- Files:
- Tests:
- Result:
- Follow-up:
