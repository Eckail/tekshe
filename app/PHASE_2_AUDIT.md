# Tekshe Phase 2 — 项目真实状态审查（修订版）

审查/修订日期：2026-11-27
仓库：Eckail/tekshe
仓库根目录：C:/Users/lenovo/tekshe
产品决策：Hybrid Curriculum；完整 HSK 1 为第一套教学产品；长期覆盖 HSK 1–9。

## 审查范围与证据边界

审查依据当前 checkout 的源码和文档：Git 状态/HEAD、PROJECT_MASTER.md、CHANGELOG.md、app/PROJECT_AUDIT.md、README.md、package.json、package-lock.json、next.config.ts，以及课程、学习记录、奖励、Review、Calendar、Profile、Settings、AI API 和页面组件。

结论以源码为准。历史测试记录没有在本次重跑。本次未启动应用、测试、构建或浏览器；未访问 GitHub/Vercel 控制台。未改业务代码、依赖、配置或数据库；未执行清理、分支切换、提交、推送、合并或部署。

标准资料根据官方来源核对。官方 HSK 大纲标注 2025-11 发布、2026-07 实施；截至本次审查日，考试服务网另公告 HSK 3.0 将于 2026-12-13 全球正式开考。课程可按已生效大纲建立范围，但不能把考试正式开考状态写成已发生。

## Git 与依赖快照

本轮文档修订前的状态：

| 项目 | 结果 |
| --- | --- |
| 当前分支 | feature/startup-demo-mvp |
| HEAD | 4ca640e21e4229837fc98c6cc71ed7486e5a6f0b（2026-11-26） |
| 远程跟踪 | feature/startup-demo-mvp 跟踪 origin；状态未显示 ahead/behind。本次未 fetch，不代表已实时核验 GitHub |
| 工作区 | 14 个已跟踪文件修改、15 个未跟踪路径，其中包含此前新增但未跟踪的四份 Phase 2 规划文档 |
| 最新学习成果 | 未提交工作区包含课程执行器与 HSK 数据改动、Review/SRS、Calendar、AI unavailable 边界和测试；这些不属于 HEAD |
| 当前 Next.js | package.json/package-lock.json 仍是 Next.js 16.4.3、React/React DOM 19.3.0、TypeScript 5.9.3、Tailwind CSS 4 |
| 安全升级 | 16.4.6 安全升级据产品上下文仍在独立 worktree。本次没有读取、复制、合并或部署它 |

工作区已有改动均须保留。此处的分支名是本次实际检查结果；不能按旧任务上下文擅自改到 feature/learning-system。

## 已有实现、部分实现与未实现

| 模块 | 真实状态 | 证据与限制 |
| --- | --- | --- |
| 课程入口 | 已实现基础页面 | App Router 有 Dashboard、Learn、Pinyin、HSK、Practice、Progress、Review、Wallet、Profile、Settings。 |
| 拼音与发音 | 有基础课程 | pinyinCurriculum 有 5 节、21 个声母、36 个分组韵母拼写及声调/拼读练习；播放依赖设备 SpeechSynthesis zh-CN，不是审核录音。它是 Tekshe 基础模块，不是 HSK 官方词汇覆盖表。 |
| HSK 课程 | 有小型 HSK 1 样例，未达到完整课程 | 当前 hsk1Foundation 为 29 个词、3 节课、7 个词汇关联选择题；未有逐项任务/话题/300 词/汉字/语法 coverage ledger。 |
| 课程数据合同 | 类型预留较丰富 | Curriculum 有标准版本、Level/Unit/Lesson、Vocabulary、Grammar、Reading、Audio 和多种 ExerciseType。类型定义不代表内容或交互已经完成；当前 HSK grammarPoints、readings、audioAssets 为空，汉字笔顺字段未形成写字课程。 |
| 课程运行器 | 部分实现 | Pinyin/HSK 共用 CurriculumCourseRunner，支持目标、讲解、示例、选择题反馈、前置关系、本地完成和现有奖励流程。课内答案状态在组件内；不是通用的可恢复 Attempt/Assessment 服务。 |
| Hybrid Curriculum | 尚未实现为统一产品模型 | 目前有课程主线/旧五阶段和多个知识页面，但没有“主线步骤”和“独立模块”共享同一内容/知识点 ID 的正式目录，也没有独立入口证据映射到主线进度的通用投影。 |
| 学习记录与进度 | 部分实现 | 旧练习、课程完成、Review、Profile、XP、Coin 分散在 localStorage/IndexedDB。没有统一学习事件；Calendar 只从有限的带日期记录生成。 |
| XP 与 Tek Coin | 有本地账本 | XP、Tek Coin 分开，部分奖励有稳定幂等 ID。数据可由用户修改；跨标签页本地写入非事务性。Wallet 没有消费流程；streak 常量不等于已实现连续学习奖励。 |
| Review / Mastery | Review 有限实现；Mastery 未实现 | Review 固定使用当前 HSK 1 词汇目录。排期和历史保存在浏览器；无统一跨模块薄弱点目录、mastery 计算版本或证据置信度。 |
| AI Tutor | 产品功能未实现 | app/api/ai-tutor 会校验请求并报告 unavailable；无 provider adapter、生成回答、Tutor UI、用户身份、配额和费用控制。 |
| Database / Auth / Sync | 未实现 | 当前无应用数据库、认证和跨设备学习记录同步层。 |
| UX/UI | 主框架已实现，验收不完整 | 当前 CSS 有浅冰蓝、薄荷青、暖白 token；AppShell 有移动底栏/桌面侧栏。源码有响应式类、焦点与主题处理，但本次没有浏览器/真机复测。 |

## 官方标准核对与产品边界

1. **HSK 主覆盖标准：**《HSK 考试大纲 / Syllabus for the Chinese Proficiency Test》，中外语言交流合作中心发布，2025-11 发布、2026-07 实施。新版按三等九级长期组织，内容含任务、话题、词汇、汉字、语法五大纲。官方大纲的 HSK 1 词表为 300 条，话题为 5 个一级/15 个二级/30 个三级主题项。认读字按等级列出；书写字采用 HSK 1–9 的累计表，需要按来源给出的等级字段映射。
2. **补充能力框架：**GF 0025—2021《国际中文教育中文水平等级标准》，2021-03 发布、2021-07-01 实施，三等九级；以音节、汉字、词汇、语法为量化维度，并结合任务、话题及听说读写译能力。其一级量化数值（269 音节、300 汉字、500 词汇、48 语法）属于 GF 标准，不是 HSK 3.0 HSK 1 数量，不得混用。
3. 新 HSK 官网的正式考试启动公告日期为 2026-12-13；截至 2026-11-27 这是未来日期。产品用已发布/已实施的大纲建课，不宣称正式考试已经启动。
4. HSK 2.0 仅作为历史版本，不把其等级/词表并入 HSK 3.0 课程。
5. 拼音按汉语拼音方案及正词法来源独立版本管理，并作为中文学习先修/伴随模块关联 HSK 知识点；不把拼音基础要求冒充 HSK 1 词汇要求。

官方来源见 [HSK syllabus PDF](https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf)、[中文考试服务网 HSK 3.0 说明](https://www.chinesetest.cn/hsk)、[HSK 3.0 全球考试公告](https://admin.chinesetest.cn/gonewcontent.do?id=51336724)、[GF0025—2021 官方标准 PDF](https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202103/W020210329527301787356.pdf) 和 [教育部标准说明](https://www.moe.gov.cn/jyb_xwfb/s271/202104/t20210402_524194.html)。

## 已确认 UI 决策与代码现状

产品负责人确认以浅冰蓝、薄荷青、暖白、柔和低压力的当前方向为基准，移动端优先，同时保留桌面体验、Tekshe 品牌和现有 Logo，不模仿 Duolingo。

这与 app/globals.css 当前 Ice/Sky/Blue/Mint/Warm White token 相符。PROJECT_MASTER.md 中旧 Cream/Charcoal/Burnt Orange 方案是过时视觉记录，不是本阶段设计依据。本次未改旧文档或视觉代码。Phase 2.1 应正式记录 token、字体、间距、卡片、按钮、导航、焦点和轻量动效规范。

## 主要架构缺口

1. 缺少可被 Structured Learning Path 与 Independent Modules 共同引用的正式 KnowledgePoint 目录。
2. 课程目标大多是字符串；缺少标准要求 → 知识点 → 原创内容 → 练习 → Assessment 的逐项可追溯覆盖账。
3. 独立模块学习尚不能给主线学习进度提供同 ID 的学习证据。
4. Exercise Attempt、课程完成、Review、XP/Coin 是多套本地记录，无法统一恢复/分析，也无法原子提交。
5. HSK 1 内容未完整：当前 29/官方大纲 300 词只说明词汇条目覆盖约 9.7%；不能推导为 HSK 1 整体完成度。完整任务、话题、汉字和语法映射也尚未建立。
6. 当前练习以选择题为主；听说读写的能力目标、口语反馈和写字练习尚未成为完整模块。
7. 账号、服务端数据库、跨设备同步、服务端权限和防篡改奖励不存在。
8. AI API 只是 unavailable 安全边界样例；不能作为已可用功能介绍。
9. 旧项目文档、实际源码 token 和本次确认的视觉决策不一致，需要在后续文档治理中统一，但本次范围不包含修改 PROJECT_MASTER/CHANGELOG。

## 验证记录与限制

CHANGELOG.md/app/PROJECT_AUDIT.md 记载 2026-11-27 时 31 项测试、TypeScript、ESLint 和 Next.js build 通过；这是既有开发记录，本次未重跑。本次也未做浏览器、触屏、屏幕阅读器、外部服务或官方词表数据导入验证。规划文档不是功能实现证明。
