# Tekshe Phase 2 — 修订后的开发路线图

## 原则与排序

按产品负责人确认的顺序推进：

1. Curriculum Foundation
2. Complete HSK 1 Content
3. Interactive Learning Experience
4. Learning Intelligence
5. Backend Foundation
6. AI Tutor & Expansion

UI/UX 是从 2.1 开始的连续工作流，每个单元同步做视觉/交互和响应式验收；2.3 对教学交互做系统测试，2.6 对完整产品体验终验。技术依赖允许更早定义薄接口：Phase 2.1 的样板单元必须保存最小学习事件，因此学习事件合同和本地 repository adapter 会先做最小实现；Phase 2.4 再推广为全产品学习智能。数据库、认证供应商和 AI provider 均不提前强制选定。

估算按一位熟悉 Next.js/TypeScript 工程师计工程人日；完整 HSK 1 内容制作还需哈萨克语母语编辑/中文教学专家工作量，单列估计。均不含外部审批、等待和整套 HSK 2–9 内容制作。

| 阶段 | 目标 | 工程估算 | 内容审校/外部工作 |
| --- | --- | ---: | --- |
| 2.1 Curriculum Foundation | 标准清单、内容模板/关系、Design System、一个完整 HSK 1 垂直单元 | 8–12 人日 | 2–4 人日教学/哈萨克语审阅 |
| 2.2 Complete HSK 1 Content | 完成全部任务/话题/300 词/汉字/语法覆盖与原创单元内容 | 25–40 人日 | 10–18 人日母语编辑及中文教学审校 |
| 2.3 Interactive Learning Experience | 听说读写、练习反馈、单元/综合测试、端到端响应式验收 | 12–18 人日 | 口语/发音评审；录音授权或制作按素材范围另估 |
| 2.4 Learning Intelligence | 统一事件、错题、Review、Mastery、计划与奖励规则 | 10–16 人日 | 教学专家确认 mastery 证据规则 |
| 2.5 Backend Foundation | 数据库/Repository/Auth/云同步/迁移/安全 | 12–20 人日 | 供应商选型、隐私/安全评审和服务配置 |
| 2.6 AI Tutor & Expansion | 受控 AI Tutor MVP；启动 HSK 2–9 增量蓝图 | AI 8–14 人日 | AI 服务密钥与预算；扩充各级内容需单独估算 |
| 合计（不含 HSK 2–9 完整内容生产） | 先完成 HSK 1 教学产品和平台基础 | 75–120 工程人日 | 另约 12–22 人日审校，取决于内容审核轮次 |

## Phase 2.1 — Curriculum Foundation

**目标：** 冻结标准版本策略及四项领域合同 v1；拆出 HSK 1 全部覆盖要求；建立 Hybrid Path/Modules、canonical KnowledgePoint 和内容模板；将当前视觉 token 形成 Design System；交付一个端到端 HSK 1 单元样板。

**涉及页面/模块：** 新/改课程目录与独立模块入口、Learn/HSK、单元课、独立词汇/语法等知识视图、Dashboard 学习入口；设计 token 和共用教学组件。现有主页结构和 Logo 不重做。

**数据：** CurriculumRelease、StandardRef、CoverageRequirement、LearningObjective、KnowledgePoint identity/revision、LearningPath、IndependentModule、ContentBlock、Exercise、Assessment/pass rule、强类型 LearningEvent 与 Editorial Workflow 合同；只做本地 repository adapter。

**技术风险：** 标准/版本/内容版本混淆；知识点重复；独立模块错误地把主线 Lesson 标为完成；旧 localStorage 进度 ID 被替换；未审校的哈萨克语进入公开内容。

**样板单元建议：** HSK 1「个人基本信息与初次见面」，映射官方 Task 1 和个人信息/日常交往话题。包括原创哈萨克语讲解、词汇/汉字/语法关联、拼音先修、对话/例句、听/说/读/写小练习、单元小测、learning event 和 path/module 两种响应式入口。

**验收标准：**
- HSK、GF、拼音来源以独立版本和 source locator 表示。
- 主线课和独立入口渲染同一 KPs/内容/练习 ID，无重复实体。
- KnowledgePoint 稳定 ID 与 revision 分离，发布 release 固定具体 revision；发布内容修改会形成新 revision。
- LearningEvent 的每个 type 都有明确 payload schema，运行时校验通过；重复 eventId 幂等，新 attemptId 才代表重试。
- Assessment 使用随发布版本固定的计分和通过规则；U01 默认总分至少 80%、每个必需目标至少 70%、必答项全部评分。
- Editorial 状态只按 draft → pending-review → reviewed → published 流转；所需哈萨克语、中文教学及标准映射审校未通过时不得发布。
- 在 path 和 independent 任一入口学习该单元，结果都写入同一学习事件与知识点；主线进度能展示证据，但只有通过约定 assessment 才完成 lesson。
- 单元教学内容原创、哈萨克语通过母语审核；标准 requirement、目标、KPs、练习、assessment 有完整引用。
- 浅冰蓝/薄荷青/暖白 Design System 文档化，保留 Logo；在窄手机、常见手机和桌面完成手动浏览器验收。
- 现有 Pinyin/HSK 路由、进度与 XP/Coin 行为不回归；无数据库、认证、AI provider 或新外部依赖。

**外部服务/API key：** 不需要。需要人工教学和哈萨克语审校。

四项领域合同的字段、幂等和版本规则、U01 评分阈值、路径完成条件及审校状态机以 [PHASE_2_DATA_MODEL.md](./PHASE_2_DATA_MODEL.md) 第 3–6 节为准；此路线图不重复定义第二套 schema。

## Phase 2.2 — Complete HSK 1 Content

**目标：** 将样板模板扩展为完整 HSK 1 教学范围，而不是只累加词卡。覆盖官方 15 项任务、5/15/30 层级话题、300 个 HSK 1 词条、一级认读字、书写字等级表中的一级要求和语法大纲每一条；完成听说读写能力目标映射。拼音体系仍独立版本化并和 HSK1 KPs关联。

**涉及模块：** HSK 1 Curriculum Catalog、HSK Academy/Level/Unit/Lesson、独立 Vocabulary/Character/Grammar/Pinyin 模块、coverage report、内容完整性测试。

**数据：** 全量 CoverageRequirement、Canonical KnowledgePoint、词汇/汉字/语法实体、原创内容块和单元/综合 assessment。官方书写字表如为累计表，按源等级列映射，不能把整张 1–9 表当作一级要求。

**技术风险：** 以词汇数量冒充完成度；官方与 GF 级别误混；例句超出已教知识；复制教材/真题；中文或哈萨克语错误；词项被拆成重复 KP。

**验收标准：**
- 每个官方 task/topic/vocab/recognition-character/writing-character/grammar 项有 source version + locator、KP IDs、主线 Unit、独立模块入口、原创内容、练习和接受状态。
- 300 个官方一级词条逐项核验来源和拼音/词性；当前 29 词仅作为已存在样例迁移/核对。
- 同一个汉字/词汇知识点可以由多个课/练习引用，存储只保留一份 canonical 实体。
- 每个单元有目标、哈萨克语解释、原创中文例句及拼音、练习、反馈和阶段测评。
- 分栏目报告 coverage；所有必需项达到 accepted 后才称“HSK 1 内容覆盖完成”。教材/真题不复制。
- 无数据库/provider/API key。

## Phase 2.3 — Interactive Learning Experience

**目标：** 把合同支持的题型变成可用、可访问、可保存的听说读写交互，并完成浏览器端验收。

**页面/模块：** Path Lesson、Independent Modules、Practice、Review 入口、单元与综合测评、Dashboard/Progress 状态。小屏优先，同时验收桌面端。

**数据：** 可恢复 session、exercise attempt、assessment result、答案引用、评分规则版本、错题反馈 code 和关联 KPs。错误解释从 Tekshe 内容来源可追溯。

**技术风险：** SpeechSynthesis 声音不一致；麦克风/录音权限中断；键盘与触屏反馈不一致；答案状态丢失；离线状态重复提交。

**验收标准：**
- 拼音/声调辨别、听音选择、听力理解、录音练习/口语自评、阅读理解、汉字识读/书写都各有明确标准和非 AI fallback。
- 每题反馈解释为何正确/错误，能带到关联 KP/Review；最终 assessment 展示各目标表现。
- 用真实数据在主线和独立模块走通；键盘可用、焦点和 aria 状态正确。
- 每个教学模块在移动/桌面进行浏览器检查；建议覆盖 360/390/768/1024/1440 px、无横向溢出、基本屏幕阅读器流程。
- 浏览器发音只标注为设备合成语音。若引入外部 TTS、语音识别/评分，需要单独选择服务、成本评估和 API 配置。

## Phase 2.4 — Learning Intelligence

**目标：** 将所有学习活动记录到统一事件系统，提供错题分析、间隔复习、可解释 mastery、个性化计划和分开的 XP/Tek Coin/成就。

**涉及模块：** progressStore 及现有 progress/XP/review/tekCoins/dailyQuests/achievements、Dashboard、Review、Progress/Calendar、Wallet、Profile 学习目标。

**数据：** 统一 LearningEvent、ExerciseAttempt、ErrorEvidence、ReviewScheduleState、MasterySnapshot、PersonalizedPlan、XP/Coin RewardTransaction。旧记录仅保留能可靠证明的字段，不伪造历史作答/时间。

**技术风险：** 多个现有 localStorage key 之间不具备原子性；回填历史会误发奖励；SRS 与 mastery 混为一谈；独立模块的证据让整课被错误标完成。

**验收标准：**
- Path 与 independent 事件都映射稳定 KPs，重复 eventId 无重复 attempt/排期/奖励。
- 错题按技能/KP/内容版本汇总，并显示可追溯解释和 Review 原因。
- SRS、Mastery、学习时长、XP、Tek Coin 分开；证据不足不报确定掌握率。
- 计划建议符合主线先修、到期 Review 和目标，说明推荐原因且可忽略。
- 旧数据迁移只做可核对的映射，奖励与历史测试覆盖重复、异常、失败存储和回滚。
- 此阶段仍可只运行本地适配器；不需要外部 API key。

## Phase 2.5 — Backend Foundation

**目标：** 在模型稳定后提供账户、服务端权限、云端同步和数据迁移；不以提前上云为目标。

**涉及模块：** Repository/Service、server APIs、登录/账户页、同步状态、Dashboard/Progress/Review/Wallet/Settings/数据导出删除。

**数据：** AccountIdentity、owner-scoped events、SyncCursor/Outbox、server reward ledger、迁移状态、删除/保留策略。

**技术风险：** provider/区域未选、匿名数据误绑定账号、冲突/重复奖励、用户删除不完整、将本地可篡改余额信任为服务端事实。

**验收标准：**
- 先备份/预览/确认，再幂等迁移匿名记录；迁移失败可恢复。
- 服务端从 session 确定 owner；跨用户读取/写入测试拒绝。
- 离线 outbox 断网重试、并发设备合并及冲突展示通过验证。
- XP 与 Coin 由服务端规则批准，client 的余额值不作为权威。
- 定义导出、删除和数据留存边界，密钥仅在服务端。
- 需要产品另行批准 Auth/DB provider，且需要供应商配置和 server env secrets；本次未选型。

## Phase 2.6 — AI Tutor & Expansion

**目标：** 在前置课程、账户/权限、学习证据和费用控制成熟后推出受约束 AI Tutor；用同一版本化目录滚动扩展 HSK 2–9。

**涉及模块：** 课程内 Tutor、AI API gateway/provider adapter、练习审核工具、后续 HSK level catalog；可并行设计内容蓝图，但不阻塞 HSK 1 发布。

**数据：** AI 请求/响应类别、model/prompt version、context requirement IDs、generated exercise review status、usage/cost metadata；少收或不长期存储聊天正文。

**技术风险：** 哈萨克语解释质量、越级/幻觉/提示注入、未审校题目冒充官方要求、成本滥用、个人数据外发。HSK 2–9 是持续内容生产项目，不是一个短周期 phase 自动完成的目标。

**验收标准：**
- 无 provider 时继续明确 unavailable；真正启用前完成人工批准、隐私说明和预算上限。
- 服务端从官方/已发布目录重建受限上下文，做身份、配额、请求字节上限、限流、超时、错误脱敏和输出验证。
- AI 内容与官方 coverage requirement 分开标记；哈萨克语评测集、边界安全集和费用告警通过后才开放。
- HSK 2–9 每级建立单独标准版本/coverage ledger，按级发布，不与 HSK1 或 HSK2.0 合并。

## 全阶段门槛与第一项任务

每阶段做文档/代码 review、类型/数据测试、关键流程浏览器验证和 Preview 验收；未经负责人批准不得合并 main 或 Production deploy。原有用户工作区改动与安全升级 worktree 均不自动带入。

**Phase 2.1 第一张实际工单：交付 HSK 1「个人基本信息与初次见面」端到端样板单元。**

验收同时包含：
1. 教学：对齐 HSK syllabus Task 1 与对应 topic requirement；哈萨克语讲解经母语审校，词汇/汉字/语法/Pinyin KPs 和原创对话、例句、练习有标准来源及内容版本。
2. Hybrid：同一单元可从 Structured Path 与 Independent Module 两个入口访问；两个入口使用相同 KPs、内容、练习和事件 ID，不复制数据。
3. 学习记录：开始、作答、单元 assessment 记录到 typed local LearningEvent；重复提交幂等；独立模块证据更新主线 KP 展示但未通过约定 assessment 时不误标完整主线 Lesson。
4. UI：使用确认的冰蓝/薄荷青/暖白 Design System 和现有 Logo；手机和桌面完整响应；键盘操作、焦点、答题正误/错误解释/保存失败都有明确反馈。
5. 架构：静态数据有唯一 ID/引用校验和 repository interface + 本地 adapter；不添加数据库、认证或 AI provider，不改现有 XP/Coin/localStorage 行为。
6. 回归：当前路由、旧进度和浏览器数据保留；执行内容/事件单测、TypeScript、ESLint、production build 与浏览器验收并记录结果。

本工单现在仅作为候选方案；本次没有开始代码开发。
