# Tekshe Phase 2 — 混合式课程数据模型与领域合同 v1

本文件定义 Phase 2.1 可直接实现的领域合同 v1，不是已创建的 TypeScript 实现或数据库 schema。当前课程和学习数据仍是静态 TypeScript + 浏览器存储。本次定稿 KnowledgePoint、LearningEvent、Assessment 和 Editorial Workflow 四项合同；不引入 DB/Auth/AI 依赖。

## 0. 合同边界与共同规则

- 下列 ID 均为不透明、区分大小写的字符串；创建后不得因标题、释义、标准版本或课程位置改变而重用。
- 发布版数据不可原地编辑。内容变更形成新 revision/release；历史学习事件继续引用其发生时的 release 和 schema/rule 版本。
- 客户端本地合同只用于当前本机 learner。未来服务端必须以 session 确认用户身份，不能信任客户端传来的 owner 字段。
- 标准条目、Tekshe 知识点、内容 revision、练习尝试和课程完成是不同实体，不以一个状态字段互相代替。

四项合同的完整定义见下文第 3–6 节；摘要如下：

| 合同 | v1 决定 |
| --- | --- |
| KnowledgePoint | 稳定语义 ID 与可变的内容 revision 分离；CurriculumRelease 固定引用具体 revision。 |
| LearningEvent | 按 `type` 判别的联合类型；不允许 `Record<string, unknown>` payload。事件只追加，以 eventId 幂等。 |
| Assessment | 评分、通过阈值、必需目标和主线完成规则全部版本化；通过不是页面自行判断。 |
| Editorial Workflow | `draft → pending-review → reviewed → published`；退回修改回到 draft，发布内容不可变。 |

## 1. 标准、版本与内容来源

HSK syllabus、GF0025—2021、拼音方案是独立的标准/来源记录。HSK 2025 syllabus 决定 HSK 1 的考试覆盖项；GF 标准用于明确标注的能力 crosswalk；拼音方案用于 Tekshe 的拼音基础模块。任何“对齐”都必须带 mapping 来源和审核状态，不能把 GF Level 1 的 500 词写成 HSK 1 词表。

```ts
type StandardRef = {
  standardId: string;       // e.g. hsk-exam-syllabus
  edition: string;           // e.g. 2025-11
  publisher: string;
  publishedAt?: string;
  effectiveFrom?: string;
  officialSourceIds: string[];
};

type CurriculumRelease = {
  curriculumId: string;      // tekshe-hsk
  contentVersion: string;    // Tekshe authored content revision
  standardRefs: StandardRef[];
  releasedAt?: string;
  language: "kk";
};

type SourceRef = {
  sourceId: string;
  sourceVersion: string;
  locator: string;            // official list/table/page/item, not copied text
  usage: "coverage-reference" | "language-standard" | "licensed-media";
};
```

标准版本和 Tekshe 内容版本分别记录。修改例句不创建新的官方标准；考试标准换版不能静默覆盖旧版本。

## 2. Coverage Requirement 与 HSK 1 覆盖账

每个官方条目/要求须能独立追踪并可验收。Coverage ledger 记录范围，不代替原创教学内容：

```ts
type CoverageSection =
  | "task" | "topic" | "vocabulary"
  | "recognition-character" | "writing-character"
  | "grammar" | "skill-crosswalk";

type EditorialState = "draft" | "pending-review" | "reviewed" | "published";

type CoverageRequirement = {
  requirementId: string;     // unique inside StandardRef + official level
  standard: StandardRef;
  officialLevelId: string;   // data-defined HSK/GF level ID
  section: CoverageSection;
  officialItemKey: string;   // stable normalized source key
  sourceRef: SourceRef;
  knowledgePointIds: string[];
  unitIds: string[];
  exerciseIds: string[];
  contentStatus: "not-started" | EditorialState;
  acceptanceStatus: "unmapped" | "mapped" | "content-checked" | "accepted";
  reviewerRef?: string;
};
```

进度矩阵按 section 分开统计：tasks、topics、vocabulary、recognition characters、writing characters、grammar、skill goals。全覆盖要求是每个应有的 requirement 都有来源、KP、教学单元、原创内容/活动和验收记录；不以词汇数或单一总百分比冒充完成度。

## 3. 课程、知识点与 Hybrid 入口

```ts
type LearningObjective = {
  id: string;
  statementKazakh: string;
  successCriteria: string[];
  coverageRequirementIds: string[];
  knowledgePointIds: string[];
};

type KnowledgePointId = string;
type KnowledgePointRevisionId = string;

type KnowledgePointKind =
    | "pinyin" | "pronunciation" | "character" | "vocabulary"
    | "grammar" | "listening" | "speaking" | "reading" | "writing";

// Stable identity: describes one teachable concept, not one authored wording/version.
type KnowledgePoint = {
  id: KnowledgePointId;
  kind: KnowledgePointKind;  // immutable after publication
  lifecycle: "active" | "deprecated";
  supersedes?: KnowledgePointId;
  createdAt: string;
};

// Versioned authored representation of the stable concept.
type KnowledgePointRevision = {
  revisionId: KnowledgePointRevisionId;
  knowledgePointId: KnowledgePointId;
  revision: number;          // monotonically increases for this KP
  editorialStatus: EditorialState;
  titleKazakh: string;
  explanationKazakh?: string;
  prerequisiteIds: KnowledgePointId[];
  sourceRequirementIds: string[];
  contentBlockIds: string[];
};

type KnowledgePointPin = {
  knowledgePointId: KnowledgePointId;
  revisionId: KnowledgePointRevisionId;
};

// CurriculumRelease.contentVersion pins the exact published revisions used by a learner.
type CurriculumKnowledgePointCatalog = {
  curriculumId: string;
  contentVersion: string;
  knowledgePoints: KnowledgePointPin[];
};

type Lesson = {
  id: string;
  levelId: string;
  unitId: string;
  sequence: number;
  learningObjectiveIds: string[];
  knowledgePointIds: string[];
  exerciseIds: string[];
  assessmentIds: string[];
  prerequisiteLessonIds: string[];
};

type LearningPath = {
  id: string;
  curriculumId: string;
  levelId: string;
  orderedSteps: Array<{ lessonId: string; sequence: number }>;
};

type IndependentModule = {
  id: string;
  curriculumId: string;
  title: string;
  knowledgePointIds: string[];
  contentBlockIds: string[];
  exerciseIds: string[];
  assessmentIds: string[];
};
```

LearningPath 和 IndependentModule 是编排/入口；它们只引用已存在的 Lesson、KnowledgePoint、ContentBlock、Exercise、Assessment。不能为相同词汇或语法复制另一条实体。一个 KP 可以同时属于若干路径课、独立模块、练习和标准要求。课程发布时必须将每个引用解析到 release 内的 revision pin，不能运行时取“最新 revision”。

### KnowledgePoint 稳定 ID 合同

1. `KnowledgePoint.id` 表示可复用的语义概念，创建后永久稳定；ID 不编码标题、哈萨克语译文、HSK 版本或单元序号。
2. 修改讲解、翻译、先修、例句引用或教学呈现，创建新的 `KnowledgePointRevision`，保留原 `KnowledgePoint.id`。已经发布的 revision 不可覆盖。
3. CurriculumRelease 固定 `knowledgePointId + revisionId`。新的内容发布可选择新 revision；旧 release 和旧事件仍可解析。
4. 如果概念本身发生变化，不能借 revision 改写其语义；创建新 ID，并以 `supersedes`/显式 mapping 关联。旧 ID 标记 deprecated，历史数据不重写。
5. 主线、独立模块、覆盖账、练习和测评只保存同一 canonical ID 的引用。内容版本不同不构成新知识点。

当前层级沿用：
Curriculum Release → Level → Unit → Lesson → Learning Objective → KnowledgePoint → Content → Exercise → Assessment。

拼音 KP 属于独立的 pinyin-foundations CurriculumRelease/contentVersion，但其稳定 ID 与 revision 仍遵循同一合同；HSK 词汇/语法/汉字 KP 关联 HSK syllabus + Tekshe content version。Level ID 保持字符串，不锁定六级枚举；长期可容纳 HSK 1–9 和其他标准。

## 4. LearningEvent 合同：强类型、追加式、可幂等

```ts
type LearnerId = string; // v1 local pseudonymous ID; future server derives owner from session
type EntryPoint =
  | { mode: "path"; pathId: string; lessonId: string }
  | { mode: "independent"; moduleId: string };
type PathEntryPoint = Extract<EntryPoint, { mode: "path" }>;
type IndependentEntryPoint = Extract<EntryPoint, { mode: "independent" }>;

type LearningEventBase<TType extends string, TPayload, TEntryPoint extends EntryPoint = EntryPoint> = {
  eventId: string;           // stable idempotency key
  schemaVersion: 1;
  type: TType;
  learnerId: LearnerId;
  occurredAt: string;         // ISO-8601 UTC
  curriculumId: string;
  contentVersion: string;    // immutable CurriculumRelease ID/version
  entryPoint: TEntryPoint;
  knowledgePointIds: KnowledgePointId[];
  payload: TPayload;
};

type LearningEvent =
  | LearningEventBase<"module_opened", null, IndependentEntryPoint>
  | LearningEventBase<"lesson_started", null, PathEntryPoint>
  | LearningEventBase<"exercise_submitted", {
      exerciseId: string;
      exerciseRevisionId: string;
      attemptId: string;
      scoringRuleVersion: string;
      answer: SubmittedAnswer;
      result: { earnedPoints: number; possiblePoints: number; outcome: "correct" | "partial" | "incorrect" };
    }>
  | LearningEventBase<"assessment_completed", {
      assessmentId: string;
      assessmentRevisionId: string;
      attemptId: string;
      scoringRuleVersion: string;
      result: AssessmentResult;
    }>
  | LearningEventBase<"lesson_completed", {
      lessonId: string;
      completionRuleVersion: string;
      qualifyingAssessmentAttemptIds: string[];
    }, PathEntryPoint>
  | LearningEventBase<"review_graded", {
      reviewItemId: string;
      grade: "again" | "hard" | "good" | "easy";
      algorithmVersion: string;
    }>;

type SubmittedAnswer =
  | { kind: "choice"; optionId: string }
  | { kind: "text"; value: string }
  | { kind: "self-rating"; rating: "needs-practice" | "comfortable" };
```

`type` 是判别字段，每一种事件只有对应 payload；新增事件类型必须提升 schema 或经过向后兼容评审，禁止退回任意键值对象。v1 的 event 必须通过运行时 schema 校验，正确性/得分由版本化 scorer 产生，UI 不能自行写入可信的评分结论。只记录答题所需的最少数据；不把原始麦克风录音放进事件。

同一个 KP 的事件无论来自主线或独立入口，都进入同一证据集合；entryPoint 保留来源用于分析体验，不创建“主线词汇”和“独立模块词汇”副本。事件只追加：相同 `eventId` 重放只生效一次；新尝试使用新 `attemptId`；答案修正通过新尝试或新事件表达，不能覆写历史。

LearningProgress projection 至少区分：
- exposure：看过讲解/例子；
- practiceEvidence：有作答记录；
- masteryEvidence：有通过明确评分规则的多次证据；
- pathStepStatus：未开始/学习中/Assessment 达标/已完成。

独立模块证据可更新主线页的 KP 状态和推荐内容，但只有配置的主线 assessment/equivalent assessment 通过才把 pathStepStatus 标为完成。重复 eventId 只生效一次；原答案事件不可覆盖，纠正通过新 attempt 追加。

## 5. Assessment 合同：可复现评分与主线完成

```ts
type ContentBlock = {
  id: string;
  revisionId: string;
  kind: "explanation" | "example" | "dialogue" | "reading" | "audio" | "writing-model";
  textChinese?: string;
  pinyin?: string;
  explanationKazakh?: string;
  sourceRefIds: string[];
  authorship: "original" | "licensed";
  editorialStatus: EditorialState;
};

type Exercise = {
  id: string;
  revisionId: string;
  kind: string;
  knowledgePointIds: string[];
  objectiveIds: string[];
  skill: "listening" | "speaking" | "reading" | "writing" | "language-form";
  scoringRuleVersion: string;
  explanationKazakh: string;
  sourceRefIds: string[];
};

type Assessment = {
  id: string;
  revisionId: string;
  kind: "lesson-check" | "unit-review" | "integrated";
  exerciseIds: string[];
  objectiveIds: string[];
  scoringRuleVersion: string;
  passRule: {
    version: string;
    minimumTotalPercent: number; // integer in [0, 100]
    requiredObjectiveMinimumPercent: Record<string, number>;
    allRequiredItemsMustBeScored: true;
  };
};

type ObjectiveScore = {
  objectiveId: string;
  earnedPoints: number;
  possiblePoints: number;
  required: boolean;
};

type AssessmentResult = {
  earnedPoints: number;
  possiblePoints: number;
  objectiveScores: ObjectiveScore[];
  passed: boolean;           // derived by the pinned passRule, never UI-authored
};

type LessonCompletionRule = {
  version: string;
  requiredAssessmentIds: string[];
  eligibleEntryModes: Array<"path" | "independent">;
  requirePrerequisiteLessonsComplete: true;
};
```

### v1 评分与通过规则

- 每个可评分题目有正整数 `possiblePoints`；答案根据固定的 `scoringRuleVersion` 评分，`0 <= earnedPoints <= possiblePoints`。passRule 中所有百分比均为 0–100 的整数。未答或无法评分的必答题不得视为通过。
- 总分是所有纳入评分题目的 earned/possible 点数之和。通过比较精确比例，不依赖显示百分比的四舍五入：`earnedPoints × 100 >= possiblePoints × minimumTotalPercent`。
- 每个必需学习目标单独聚合其题目点数，并满足该目标在 passRule 中指定的最低比例。Assessment 定义若缺少必需目标对应题目、分母为零或引用无效，内容校验失败，不能发布。
- U01 样板默认通过阈值为总分至少 80%，且每个必需目标至少 70%；必答项全部评分。具体规则必须随 Assessment revision 固定，发布后不能静默修改。
- 允许重试。每个尝试保留独立 attemptId 和结果；第一个符合规则的有效通过尝试即可满足该 Assessment，不以最高分覆盖历史。

### 主线 Lesson 完成条件

- Lesson 的发布版本固定所需 Assessment ID/revision、passRule version 与 `LessonCompletionRule` version。
- v1 默认完成规则是：路径先修 Lesson 已完成；指定的所有必需 Assessment 至少有一个本学习者的有效通过 attempt；attempt 的标准、课程 release、Assessment revision 和评分规则与该 Lesson 发布配置匹配。
- Phase 2.1 的 `eligibleEntryModes` 固定为 `["path"]`。独立模块的打开、练习或通过测评可以更新 KP 证据和主线展示，但不完成路径 Lesson。将来若批准等价测评，必须在新发布版本中显式列出允许的 Assessment 与入口，不能运行时推断。
- 只有完成规则服务基于有效事件生成 `lesson_completed`；UI 不可直接发完成事件。完成键以 learner + path + lesson + completionRuleVersion 唯一，重复处理幂等。已发布历史完成记录不因新 revision 被重写。

### 原创内容合同

官方大纲用来判断教什么和覆盖到哪里；解释、例句、练习指令、听力对话及综合任务由 Tekshe 原创或明确许可。来源 locator 用于可追溯性，不把教材段落或真题复制进产品内容。

## 6. Editorial Workflow 合同

```ts
type EditorialRevision = {
  entityId: string;
  revisionId: string;
  state: EditorialState;
  contentDigest: string;
  transitions: EditorialTransition[];
  reviews: EditorialReview[];
};

type EditorialTransition = {
  from: EditorialState | null;
  to: EditorialState;
  actorId: string;
  at: string;
  revisionId: string;
};

type EditorialReview = {
  reviewerId: string;
  role: "kazakh-language" | "chinese-pedagogy" | "standards" | "accessibility";
  decision: "pass" | "changes-requested";
  checklistVersion: string;
  notesRef?: string;
  at: string;
};
```

状态转换规则：

1. `draft → pending-review`：作者提交不可变 revision snapshot，记录 digest、来源引用和所需审校角色；缺项不得提交。
2. `pending-review → reviewed`：所有该内容类型必需的审校角色均通过。HSK 教学内容至少需要哈萨克语语言审校、中文教学/内容审校和标准映射检查；审校者不得是本 revision 的作者。任一审校请求修改则 `pending-review → draft`，保留意见和旧 snapshot。
3. `reviewed → published`：发布检查通过并由发布责任人纳入不可变 CurriculumRelease。若审校后内容有任何编辑，旧 revision 不能继续发布，必须创建新 draft revision 并重新走审校。
4. `published` 为终态，不允许编辑、退回或删除；修订通过新 revision 和新 release 完成。回滚通过选择先前 release，不改写旧事件或旧版本。
5. 只有 `published` revision 可出现在学习运行时；Draft/待审校/已审校内容只能用于作者和审校工作流。

每个转换和审核决定保存 revisionId、角色、时间、digest 和结果。业务页面状态不得代替审校记录。自动检查（ID 引用、必填翻译、拼音/答案结构、测评分母等）通过也不能替代人工语言与教学审校。

官方大纲用来判断教什么和覆盖到哪里；解释、例句、练习指令、听力对话及综合任务由 Tekshe 原创或明确许可。来源 locator 用于可追溯性，不把教材段落或真题复制进产品内容。

## 7. 学习智能与奖励数据

SRS Schedule、ErrorSummary、MasterySnapshot、PersonalizedPlan 是从原始 LearningEvent 派生、带算法版本的 projection。记录来源 event IDs、时间窗口、证据数、置信状态和生成理由。数据不足时显示“继续学习/证据不足”；Review 到期与 mastery 不是同一指标。

RewardTransaction 至少含 learnerId、ledger（xp/tek-coin）、direction、amount、sourceEventId、ruleVersion、createdAt。XP、Tek Coin、mastery、正确率、学习时间分开计算。当前本地账本可以继续使用作兼容 adapter；服务端授权和余额权威性留到 Phase 2.5。

## 8. 本地数据、Repository 与未来后端

Phase 2.1 定义 LearningRepository / LearningEventService 接口，只实现支持样板单元的本地 adapter；不先引入数据库或云 SDK。旧 storage key 不重命名、不删除。

后续迁移原则：
1. 为匿名本地学习者建立映射及完整数据备份。
2. 统计和预览待迁移对象，保留不能解释的旧记录。
3. 用稳定 eventId 幂等写入新结构，并对账旧进度/XP/Coin。
4. 登录后由服务端 session 确定 owner；用户可撤销/恢复迁移。
5. 多设备只合并不可变事件；可编辑偏好用显式 revision 冲突规则。
6. 只有回滚期结束并验证所有设备后，才考虑退役旧存储。

## 9. 内容数据验收不变量

- 同一标准版本 + 官方等级 + 官方条目最多一个 CoverageRequirement。
- 每个 Requirement 能解析到 SourceRef、KP、Unit/Module 引用、相关 Exercise 和 acceptance 状态。
- 每个 KP 在路径/独立模块共用同一 ID；数据检验禁止复制相同语义条目。
- 每个 KP 引用在 CurriculumRelease 中解析到唯一 revision pin；发布 revision 不可变，语义变化必须使用新 ID。
- 每个 LearningEvent 的 type/schemaVersion 与 payload schema 一致；eventId 重放幂等，attemptId 不能被重复复用。
- assessment score 与通过结果能由固定题目、scoringRuleVersion 和 passRule 重算；Lesson 完成只由固定完成规则派生。
- 只有完成 Editorial Workflow 的 published revision 可进入学习运行时；编辑已发布内容必须生成新 revision。
- HSK 与 GF 条目不得因级别序号相同而自动混合；crosswalk 必须独立、可审计。
- 认读字与书写字分别记录能力；GF 量化数值和 HSK 词表数值分开保存。
- Exercise 的技能、题型、答案规则与运行时 renderer/scoring 版本一致。
- 例句/解释记录原创或许可状态、哈萨克语编辑状态和标准来源 locator。
