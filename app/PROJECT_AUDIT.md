# Tekshe repository audit

**Audit date:** 2026-11-05
**Branch:** `feature/learning-system` tracking `origin/feature/learning-system`

## Repository state

- The repository root is `C:\Users\lenovo\tekshe`; the application source is in `app/`.
- The repository uses Next.js 16.4.3, React 19.3.0, TypeScript 5, Tailwind CSS 4, and the App Router. Cache Components and Partial Prefetching are enabled.
- The root `AGENTS.md` is present. No `PROJECT_MASTER.md` was found; a `CHANGELOG.md` was added with the learning-core changes.
- `app/page.tsx` assembles the product as one landing page. The app now uses Tekshe-specific page metadata and declares Kazakh (`lang="kk"`).
- The delivery review found no unrelated local changes. Next.js added its managed agent-feedback block to `AGENTS.md` when the development server started; it is retained as instructed by Next.js.
- `next.config.ts` has framework settings only. No app database, authentication, or Vercel project configuration is present in the repository.

## Implemented learning features

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

### Next implementation stage

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
