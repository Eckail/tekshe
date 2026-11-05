# Tekshe — Project Master Plan

**Product:** Tekshe  
**Mission:** Help Kazakh-speaking beginners, especially learners aged 10–14, acquire practical Mandarin through a structured, engaging, measurable learning experience.  
**Primary teaching language:** Kazakh  
**Target language:** Mandarin Chinese (Simplified characters, standard Putonghua pronunciation)  
**Current stack:** Next.js 16.4.3, React 19.3, TypeScript 5, Tailwind CSS 4  
**Current repository baseline:** `main` at `d94885593c53b29fb748c9c3abf0f4e8cac2b7e4`

---

## 1. Product principles

1. **Learning before gamification.** XP, streaks, quests, and achievements reinforce real learning. They never replace it.
2. **Kazakh-first instruction.** Explanations, translations, hints, and feedback must be natural Kazakh. Russian and English may be added as optional interface languages later.
3. **Progressive difficulty.** Every lesson has prerequisites, clear objectives, practice, feedback, and a completion rule.
4. **Four-skill coverage.** Listening, speaking, reading, and writing develop together. Vocabulary, characters, grammar, and pronunciation support those skills.
5. **Content is data.** Curriculum content must not be buried in page components. Content has stable IDs, version metadata, review status, and source/copyright metadata where relevant.
6. **Reliable progress.** A learning attempt, its progress record, and its reward must be represented consistently. Client-side storage is an MVP persistence layer, not a source of truth for a production account system.
7. **Age-appropriate product.** Use clear instructions, safe defaults, restrained social features, and privacy-minimizing data collection.
8. **Accessible by default.** Keyboard support, readable contrast, responsive layouts, captions/transcripts, and clear feedback are baseline requirements.
9. **Small verified releases.** Each implementation step must have a bounded scope, tests or explicit manual QA, and a changelog entry.

## 2. Product scope

### Learner experience

- Landing/dashboard with next recommended activity, current progress, and a clear continue-learning action.
- Structured course catalog with curriculum standard/version, levels, units, modules, and lessons.
- Pinyin and pronunciation course: initials, finals, syllable structure, tone contours, tone changes, listening discrimination, and pronunciation practice.
- Vocabulary and characters: meaning, pinyin, tone, stroke order, recognition, recall, and spaced review.
- Grammar: concise Kazakh explanations, patterns, examples, guided construction, and contextual practice.
- Daily communication: useful dialogues, listening, role-play, sentence building, and practical scenarios.
- Four skills: listening, speaking, reading, and writing, with independent skill progress and integrated tasks.
- Practice center: diagnostic, lesson-linked exercises, mixed review, and spaced repetition.
- Progress center: mastery, course completion, study time, review queue, history, and goals.
- Gamification: one XP ledger, levels, daily quests, achievements, streaks, and rewards with idempotent award IDs.
- Profile and settings: learner preferences, accessibility, language, privacy, and account controls.
- AI Chinese teacher: conversational practice, Kazakh explanations, controlled correction, hints, role-play, and adaptive difficulty.

### Platform and operations

- Authentication and learner profiles.
- Persistent database and server-authoritative progress/reward operations.
- Content administration and curriculum versioning.
- Analytics limited to learning/product quality needs.
- Error monitoring, backups, security controls, and deployment automation.
- Mobile-first responsive web experience; installable PWA can follow after core workflows stabilize.

### Explicitly out of scope for the first release

- Public social feed, unrestricted messaging, public leaderboards, and user-generated public content.
- Unreviewed AI-generated curriculum presented as authoritative.
- Paid subscriptions, payments, or marketplace features before retention and learning value are validated.
- Claims of official HSK endorsement or exam alignment unless the selected standard and content have been verified.

## 3. Target information architecture

| Route | Purpose |
| --- | --- |
| `/` | Public landing page and learner dashboard entry |
| `/learn` | Learning home: continue, recommended lesson, daily plan |
| `/courses` | Curriculum catalog and standards |
| `/courses/[courseId]` | Course overview, units, prerequisites, completion |
| `/learn/[lessonId]` | Lesson player and guided learning flow |
| `/practice` | Practice center and review queue |
| `/practice/[exerciseId]` | Exercise session and result |
| `/progress` | Learning history, mastery, skill breakdown |
| `/achievements` | Achievements, quests, levels, streaks |
| `/vocabulary` | Vocabulary and character review |
| `/teacher` | AI tutor |
| `/profile` | Learner profile and preferences |
| `/settings` | Accessibility, language, privacy, account |

Routes should be introduced incrementally. Existing homepage sections remain functional until their replacement routes are tested.

## 4. Technical architecture

### Application layers

- **App layer:** route pages, layouts, navigation, loading and error states.
- **Feature layer:** lesson player, course catalog, quiz runner, vocabulary review, progress dashboard, tutor UI.
- **Domain layer:** curriculum, learning attempts, mastery, XP awards, quests, achievements, review scheduling.
- **Data layer:** typed repositories and storage adapters. Components do not read/write localStorage directly.
- **Infrastructure layer:** authentication, database, AI provider abstraction, audio/media storage, monitoring.

### Core domain entities

- CurriculumStandard → CurriculumVersion → Level → Unit → Module → Lesson.
- Lesson → LearningObjective, VocabularyEntry, GrammarPoint, ReadingMaterial, AudioAsset, Exercise.
- Learner → Enrollment, LessonProgress, ExerciseAttempt, VocabularyMastery, SkillMastery.
- XPEvent, QuestProgress, AchievementUnlock, StudySession.
- TutorConversation and TutorMessage (only after privacy, retention, and safety requirements are defined).

### Key invariants

- Every entity has a stable ID. Content IDs do not depend on display text or array position.
- Every lesson belongs to exactly one curriculum version, level, unit, and module.
- Prerequisite references must resolve and must not create cycles.
- Every exercise answer is validated against its declared type.
- An exercise attempt is immutable once submitted; retries create new attempt IDs.
- An XP event has a unique idempotency key. Replaying an event cannot award XP twice.
- Completion is derived from explicit lesson/course completion rules, not from merely opening a page.
- Local storage is accessed only through data-layer adapters.
- Server-backed progress becomes authoritative after authentication/database migration.

## 5. Delivery roadmap

### Phase 0 — Stabilize the foundation
- [x] Read repository and inspect current architecture.
- [x] Identify existing learning, progress, XP, quest, achievement, and curriculum foundations.
- [ ] Add this master plan and a living task log.
- [ ] Confirm local branch and working-tree synchronization before implementation.
- [ ] Add a repeatable verification checklist.

**Exit criteria:** one documented source of truth for scope, architecture, decisions, and next tasks.

### Phase 1 — Curriculum and content foundation
- [ ] Define curriculum registry and version selection.
- [ ] Add curriculum integrity validation (IDs, references, prerequisites, duplicate content).
- [ ] Separate embedded quiz prompts and lesson content from React components.
- [ ] Build a small reviewed beginner curriculum slice, not a huge unverified content dump.
- [ ] Connect lesson/course identity to the existing progress and XP domain.
- [ ] Add content tests and authoring conventions.

**Exit criteria:** a new lesson can be added as data without editing the lesson-player UI; curriculum references validate automatically.

### Phase 2 — Learning experience and navigation
- [ ] Introduce shared application shell and route-level navigation.
- [ ] Build course catalog, course overview, and lesson-player routes.
- [ ] Add clear objectives, examples, guided practice, feedback, and completion criteria.
- [ ] Improve responsive/mobile layouts, loading/empty/error states, keyboard access, and accessibility.
- [ ] Preserve and migrate existing learner progress.

**Exit criteria:** a learner can enter a course, complete a lesson, see progress, and resume later.

### Phase 3 — Complete the core Mandarin curriculum
- [ ] Pinyin and pronunciation mastery.
- [ ] Beginner vocabulary and character recognition/writing.
- [ ] Core grammar and sentence patterns.
- [ ] Daily communication and dialogues.
- [ ] Integrated listening, speaking, reading, and writing activities.
- [ ] Review queue and spaced repetition.
- [ ] Content review and source/copyright tracking.

**Exit criteria:** a coherent beginner learning path with measurable outcomes across all four skills.

### Phase 4 — Reliable learner model and gamification
- [ ] Define mastery and course-completion rules.
- [ ] Make learning attempt persistence and XP award handling consistent.
- [ ] Add learner levels, daily quests, achievements, streaks, and anti-duplication tests.
- [ ] Add progress history and useful learning analytics.
- [ ] Prepare storage interfaces for database migration.

**Exit criteria:** progress and rewards are explainable, testable, and cannot be duplicated through repeated client actions.

### Phase 5 — Accounts and backend
- [ ] Select authentication approach and privacy model.
- [ ] Design and migrate to PostgreSQL.
- [ ] Add server-side validation and authoritative progress/XP transactions.
- [ ] Add account recovery, data export/deletion, backups, and access controls.
- [ ] Add sync conflict handling and migration tests.

**Exit criteria:** a learner can securely access consistent progress across devices.

### Phase 6 — AI Chinese teacher
- [ ] Define tutor capabilities and strict boundaries.
- [ ] Add provider abstraction and server-side API integration.
- [ ] Ground explanations in reviewed course content.
- [ ] Add dialogue role-play, sentence correction, hints, and adaptive practice.
- [ ] Add age-appropriate privacy, moderation, rate limits, and cost controls.
- [ ] Evaluate answer quality with a fixed test set.

**Exit criteria:** the tutor reliably supports the curriculum and does not invent course facts or expose secrets.

### Phase 7 — Product quality and release
- [ ] Automated unit, integration, and end-to-end tests.
- [ ] Performance, accessibility, security, and mobile QA.
- [ ] Error monitoring and operational runbooks.
- [ ] Small pilot with target learners and feedback loop.
- [ ] Domain, production deployment, privacy/terms pages, and release checklist.

**Exit criteria:** stable pilot release with measured learning outcomes and a maintainable operating process.

## 6. Working agreement

For every development task:

1. Inspect the current branch and relevant files before editing.
2. State the problem, intended behavior, affected files, and acceptance criteria.
3. Make the smallest coherent change. Avoid unrelated refactors.
4. Add or update tests for domain behavior.
5. Run lint, type-check, tests, and production build when local tooling is available.
6. Review the diff for regressions, secrets, accessibility, and data migration risks.
7. Update `CHANGELOG.md` and this plan when scope or architecture changes.
8. Commit to a feature branch. Merge to `main` only after verification.

**Collaboration boundary:** ChatGPT can inspect and edit repository files through the connected GitHub integration and provide local commands. It cannot see unsaved VS Code buffers, inspect the user's local working tree, or run commands on the user's computer. Before pulling remote changes, the learner must check and preserve any local uncommitted work.

## 7. Current known limitations

- Progress and XP are stored in browser localStorage.
- No authentication, database, cloud sync, or server-authoritative reward validation exists.
- HSK curriculum types exist, but curriculum records and pages are not yet populated.
- The home page composes most learning modules in one long route.
- Some lesson and quiz content remains embedded in UI components.
- Browser speech synthesis is not a substitute for reviewed native-speaker audio.
- The repository has passed its recorded type, lint, XP test, and production-build checks, but every new change must be verified again locally.

## 8. Immediate next task

**Task:** Curriculum foundation v1.

1. Define a typed curriculum registry for one selected standard/version.
2. Add a validator for unique IDs, valid references, level/unit/module/lesson consistency, and prerequisite cycles.
3. Move one small existing learning slice into curriculum data.
4. Keep the current UI working while the new data model is introduced.
5. Add tests before expanding the content volume.

Do not claim official HSK alignment until the exact standard version and source requirements are confirmed.
