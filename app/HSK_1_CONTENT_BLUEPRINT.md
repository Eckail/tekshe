# Tekshe — HSK 1 完整课程内容蓝图

状态：规划蓝图，不是已实现的课程/数据集。
蓝图日期：2026-11-27。
产品决定：HSK 1 是 Tekshe 第一套完整教学产品；长期课程路线覆盖 HSK 1–9；课程同时支持 Structured Learning Path 与 Independent Learning Modules。

## 1. 标准选择、版本和使用边界

### 主标准：新版 HSK syllabus

采用中外语言交流合作中心发布的《HSK 考试大纲 / Syllabus for the Chinese Proficiency Test》，版本 2025-11，文件标注 2026-07 实施。课程按 HSK 3.0 三等九级组织，HSK 1 的考试覆盖清单来自同一版本的大纲。

官方说明新版大纲包含五部分：任务、话题、词汇、汉字、语法。HSK 1 章节范围可按 PDF 目录定位：

- 任务大纲：HSK 1，第 2–5 页附近；
- 话题大纲：HSK 1，第 56–57 页；5 个一级话题、15 个二级话题、30 个三级话题；
- 词汇大纲：HSK 1，第 77–83 页，编号 1–300，共 300 个词条；
- 汉字大纲：HSK 1 认读字从第 353 页附近起；书写字使用 HSK 1–9 累积表（第 374 页附近），必须按源表等级映射；
- 语法大纲：HSK 1 从第 383 页附近起，按官方表的每一条/细目建立 coverage row。

考试服务网公告 HSK 3.0 全球正式考试日期为 2026-12-13。以 2026-11-27 的信息为准，该日期尚未来到；大纲已经标注 2026-07 实施。产品以已发布版本建课，同时维护考试运营状态和课程标准版本，不将两者混作一个日期。

官方来源：
- [HSK 考试大纲 PDF（2025-11 / 2026-07）](https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf)
- [中文考试服务网：HSK 3.0 结构和五部分大纲](https://www.chinesetest.cn/hsk)
- [中文考试服务网：HSK 3.0 全球正式开考公告](https://admin.chinesetest.cn/gonewcontent.do?id=51336724)

### 补充框架：GF0025—2021

《国际中文教育中文水平等级标准》（GF 0025—2021）作为能力描述和长期课程设计参考，单独保存标准 ID、版次与来源，不把 GF 的量化值当成 HSK 词表数量。

教育部官方说明：标准为三等九级；以音节、汉字、词汇、语法为四维基准，结合任务/话题和听、说、读、写、译五种技能。GF 一级量化表为 269 个音节、300 个汉字、500 个词汇、48 项语法。这些数字只标为 GF0025 Level 1，不能写成 HSK 3.0 HSK 1 数量。两套等级之间使用显式 crosswalk；若没有官方/专家确认，不假设同序号等级完全等价。

- [GF0025—2021 官方 PDF](https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202103/W020210329527301787356.pdf)
- [教育部发布说明](https://hudong.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202103/t20210329_523304.html)
- [教育部关于三等九级、量化基准和技能的说明](https://www.moe.gov.cn/jyb_xwfb/s271/202104/t20210402_524194.html)

### 拼音的边界

拼音按《汉语拼音方案》与 GB/T 16159—2012 等独立来源/version 管理。拼音声母、韵母、声调、拼读/正字法与听音训练是 Tekshe 的基础模块，可通过先修/相关 KnowledgePoint 关联 HSK 1 词汇、汉字和听说目标；它们不增加/替代 HSK 官方词汇、汉字、语法覆盖数量。

HSK 2.0 的旧六级大纲不进入此 release。未来保留为单独 historical standard，仅在明确的兼容页引用，绝不把旧词表迁入新 HSK coverage ledger。

## 2. HSK 1 Coverage Matrix 设计

Coverage matrix 的正式数据粒度是“一个官方要求/词项一行”，不是仅有一个分类总计。每行至少记录：

| 字段 | 含义 |
| --- | --- |
| requirementId | 标准版本和官方等级内稳定唯一 ID |
| standardId / edition / officialLevelId | HSK syllabus 2025-11、HSK level 1；或独立 GF crosswalk |
| section / officialItemKey | task、topic、vocabulary、recognition-character、writing-character、grammar、skill-crosswalk |
| sourceId / sourceLocator | 官方来源与页/表/行/词条位置 |
| knowledgePointIds | canonical 知识点 ID；多个要求可关联一个 KP |
| unitIds / moduleIds | 主线课程单元和独立模块入口，均只引用同一个 KP/内容 |
| contentStatus | not-started / draft / pending-review / reviewed / published |
| exerciseIds / assessmentIds | 可验证教学覆盖的练习和测评 |
| acceptanceStatus | unmapped / mapped / content-checked / accepted |
| reviewer / reviewAt | 中文教学、普通话和哈萨克语审校记录 |

矩阵按任务、话题、词汇、认读字、书写字、语法、听说读写技能分别呈现覆盖情况。不用单一词汇百分比声称“HSK 1 完成”。课程页中的任务/话题描述与例句为原创表达；官方大纲用于范围映射，不复制教材正文或考试题目。

### 当前基线与待办

截至本蓝图日期，源码只包含 29 个 HSK 1 示例词条（官方 300 词表中的小部分，约 9.7% 的词条数量），3 节主题课。29/300 只表示词汇数据数量粗略覆盖，不表示词汇教学质量，更不代表整个 HSK 1 覆盖度。当前没有逐项任务/话题矩阵，grammarPoints/readings/audioAssets 为空，尚无完整汉字识读/书写目录或听说读写能力验收矩阵。所有完整覆盖项目前状态都应视为待制作/待验收。

## 3. 官方范围清单

### 3.1 HSK 1 任务大纲：15 项任务要求

以下 task 分类映射到建议单元。源文的详细描述由每个 requirement row 的 PDF locator 追溯，不在本文件复制大纲段落。

| 官方任务 | 建议单元 |
| --- | --- |
| T01 问答个人基本信息 | U01 |
| T02 问答事件信息 | U02 |
| T03 问答物品信息 | U03 |
| T04 问答天气 | U04 |
| T05 问答环境信息 | U05 |
| T06 日常言语交往 | U06 |
| T07 问答饮食喜好 | U07 |
| T08 问答出行信息 | U08 |
| T09 问答商品信息 | U09 |
| T10 告知生病、探病 | U10 |
| T11 交流休闲活动 | U11 |
| T12 介绍学习情况 | U12 |
| T13 交流学校情况、课后活动 | U12 |
| T14 交流工作信息 | U13 |
| T15 问答中国传统饮食 | U07 |

每个 task 需检查听懂、发问/回应、简短表达、阅读识别等源表具体能力描述，并映射到目标/知识点/原创活动。除标准确实列出的能力外，不宣称额外考试要求。

### 3.2 HSK 1 话题大纲：5 / 15 / 30 层级结构

| 一级话题 | 二级话题 | 三级话题覆盖 |
| --- | --- | --- |
| 基本信息（7 项） | 个人信息 | 姓名/国籍/年龄/性别/喜好/习惯；身份/家庭成员/朋友/技能 |
| 基本信息 | 事件信息 | 日期、时间、地点、方位、参加者、号码 |
| 基本信息 | 物品信息 | 物品名称、物品特征 |
| 基本信息 | 环境信息 | 天气、环境特点 |
| 日常生活（13 项） | 交往 | 基本礼貌、简单互动、意愿感受 |
| 日常生活 | 饮食 | 食物饮品、就餐 |
| 日常生活 | 交通出行 | 问路、出行方式、出行安排 |
| 日常生活 | 购物 | 商品名称、商品价格、商品选购 |
| 日常生活 | 医疗健康 | 生病、看病、探病 |
| 日常生活 | 休闲 | 休闲活动 |
| 教育情况（5 项） | 学习情况 | 课程信息、学习内容、教育层次 |
| 教育情况 | 校园生活 | 学校情况、课后活动 |
| 职场生活（3 项） | 工作情况 | 工作信息、工作评价 |
| 职场生活 | 职业 | 职业种类 |
| 文化与传统（2 项） | 饮食文化 | 中餐、传统饮品 |

话题总计：5 个一级、15 个二级、30 个三级项。上表中括号里的数量按官方表计；终端项逐一进入 coverage ledger。合并到一个教学单元不代表删掉官方要求行。

### 3.3 词汇、汉字和语法

| 标准部分 | 覆盖要求 | 数据组织与验收 |
| --- | --- | --- |
| 词汇 | HSK 1 官方表 300 个编号条目 | 每条逐项保留词头 key、来源 locator、拼音/词性核对状态、一个 canonical vocabulary KP、原创哈萨克语释义/例句、单元和复习链接；不在蓝图重复抄录 300 个词。 |
| 认读字 | HSK 1 独立认读字清单 | 每个字符独立 requirement 和 canonical character KP；核对形、音、义、认读练习及和词汇字形的关系。 |
| 书写字 | HSK 1–9 书写字表中的一级要求 | 按表中的等级/累计含义筛取 HSK 1 范围；字符只存一份，recognition/writing capability 分开记录。不能把完整累计表误判为 HSK 1 清单。 |
| 语法 | HSK 1 语法大纲全部行/细目 | 每一官方细目建 requirement；映射语法 KP、先修词汇、原创解释/最小对比例句、情境练习和可观察 assessment。不能只建“语序/疑问句”几个宽泛卡片就标全覆盖。 |
| GF crosswalk | GF0025 Level 1 的能力/量化条目 | 独立 requirement IDs/来源；与 HSK requirement 的关系标明 exact/partial/related/unmapped 和审校人，量化数据不能相加。 |

语法表按原文栏目继续拆分，例如语素、词类、短语、句子成分、句型/句类等；最终颗粒度以官方表的每个细目为准。要求覆盖规则和教学组织，不从这一蓝图推导未核验的 HSK 语法项总数。

## 4. 听、说、读、写和拼音基础目标

以下是 Tekshe 的教学目标映射；不能将没有在 HSK 1 任务表明确要求的项目标成考试任务。GF0025 的相应能力描述另挂 crosswalk。

| 知识模块 | HSK 1/Tekshe 目标 | 可验收证据 |
| --- | --- | --- |
| Pinyin & Pronunciation | 学会普通话声母/韵母、声调/轻声、音节组合、常见拼读规则；识别 HSK 词汇拼音并建立听辨先修 | 声音对比/选音/拼读；每个词的拼音与声调来源检查。设备合成语音标记为 TTS，不冒充标准录音。 |
| Chinese Characters | 认读字形，区分字与词；按一级书写要求练基础笔画/笔顺和常见结构 | 认读题、部件/字形辨析、可键盘或触屏完成的书写/临摹证据 |
| Vocabulary | 全部 300 项有拼音、声调、词性、哈萨克语解释、原创例句和主题/任务关系 | 词汇识别、理解、听辨、语境选择与累积测验 |
| Grammar & Sentence Patterns | 覆盖官方一级语法细目，能在交际任务中理解和生成短句 | 句型重组、情境填空、对比选择/口语生成，并链接具体语法 KP |
| Listening | 听辨音节/声调并理解简短个人、事件、物品、交际等信息 | 原创短对话/录音、关键词辨认、听后选答；标记设备/TTS/授权音频来源 |
| Speaking | 问答个人信息、礼貌互动、表达简单需要/偏好、完成基础角色对话 | 录音、自评/同伴评或后续经验证的发音反馈；未有验证前不输出自动发音分数 |
| Reading | 看懂个人信息卡、标签、菜单、时刻表、标识、短消息等简单材料 | 原创短文本/界面材料理解题，引用词汇/字形/任务 KP |
| Writing | 在 GF crosswalk 和 HSK 书写字范围下练字形、复制/书写基础字符与短信息 | 汉字书写/描摹、填写字段、编写短句；把“书写目标”与 HSK 考试是否考查分开注明 |

## 5. 建议 HSK 1 单元划分与知识关联

这是教学编排提案，不是源大纲新增等级。合并任务以减少碎片，但 coverage ledger 仍保留每个官方 task/topic requirement。每单元既是主线步骤候选，也可引用到若干独立知识模块。

| 单元 | 教学主题与目标 | 官方任务/话题映射 | 共享知识关联（示例类型） |
| --- | --- | --- | --- |
| U01 | 个人基本信息与初次见面：自我介绍、询问/回答身份信息 | T01；基本信息/个人信息；日常生活/交往 | Pinyin、personal vocabulary、pronouns、是/吗句型、listening/speaking/reading/writing |
| U02 | 时间、日期与事件：理解并询问事件的时间、地点、参与者 | T02；事件信息 | number/time vocabulary、疑问词、时间表达、reading schedule、listening |
| U03 | 常见物品、数量与特点：介绍和询问物品 | T03；物品信息 | character recognition、vocabulary/classifiers、形容词、对象描述 |
| U04 | 天气与简单偏好：询问、描述天气 | T04；环境/天气 | weather vocabulary、简单形容描述、听说辨认 |
| U05 | 地点与环境：描述常见场所、方位和简单好恶 | T05；环境特点 | location KPs、在/方位表达、阅读标识、问答 |
| U06 | 礼貌交往、请求与感受：问候、感谢、道歉、简单请求 | T06；交往/礼貌/互动/意愿感受 | discourse phrases、pronunciation、dialogue listening/speaking、message reading |
| U07 | 食物、就餐与中国传统饮食：表达偏好并完成简短点餐 | T07/T15；饮食、饮食文化 | food vocabulary、measure words、question/negation patterns、menu listening/reading/writing |
| U08 | 出行方式与问路：询问方向和简单出行安排 | T08；交通出行 | direction/location KPs、时地表达、听说角色扮演、交通信息阅读 |
| U09 | 购物与商品信息：识别名称/价格并表达简单选购意愿 | T09；购物 | money/number vocabulary、量词/指示表达、price tags、dialogue |
| U10 | 生病、就医与探望：表达简单身体不适和关心 | T10；医疗健康 | related vocabulary、简单请求/建议表达、听说短对话 |
| U11 | 休闲活动与安排：介绍喜欢的活动和时间地点 | T11；休闲 | preference/time/place KPs、邀请/回应、活动信息阅读 |
| U12 | 学习与校园生活：介绍课程、学习情况、学校和课后活动 | T12/T13；教育情况/学习/校园 | school vocabulary、time phrases、reading timetable, short self-introduction |
| U13 | 工作与职业：简单介绍工作信息、职业及评价 | T14；职场生活/工作/职业 | occupation vocabulary、question/description patterns、listening/reading/speaking |

先做 U01 作为 Phase 2.1 端到端样板，其余单元按词汇/语法/字符先修图调整排序，不按当前 29 词的覆盖情况倒推完整课程。

## 6. Hybrid Learning 模块编排

至少建设以下可独立进入的模块组；它们必须复用同一 KP/Content IDs：

1. Pinyin & Pronunciation
2. Chinese Characters
3. Vocabulary
4. Grammar & Sentence Patterns
5. Listening
6. Speaking
7. Reading
8. Writing

独立模块可以按技能、主题或一个 KP 集合组织，但不能保存重复词条。进入来源写入 event.entryPoint；Progress/Dashboard 显示同一知识点的证据。独立模块测评达到等价条件时可满足主线某一步骤，等价规则须显式审校，不能按模块“打开过”自动解锁。

## 7. 内容制作流程与质量验收

### 每个内容条目必备字段

- HSK/GF/Pinyin StandardRef、版本、等级、官方 source locator；
- requirementId、knowledgePointId、unitId、关联 independent module IDs；
- 中文字/词/语法或能力目标、拼音/声调、词性（适用时）；
- 哈萨克语解释、原创中文例句/短对话和例句拼音；
- 练习/Assessment IDs、反馈和成功标准；
- 内容状态、哈萨克语母语审校人/日期、普通话与教学审校、版权/素材状态。

### 发布验收

1. **标准准确性：** 官方一级要求逐项建账；HSK 2025、GF 2021、Pinyin 和旧 HSK 2.0 分开。
2. **关系完整性：** 每条 requirement 连到 canonical KP、主线 unit、独立入口、原创内容、练习和验收；所有 ID 可解析，重复实体检查通过。
3. **教学质量：** 每单元有清楚目标、先修知识、解释、至少一个示例、可操作练习、明确反馈和迁移/复习提示。
4. **语言质量：** 中文/拼音符合标准普通话书写；哈萨克语自然准确并由母语编辑审校，不能以机器翻译未审稿发布。
5. **原创/版权：** 不复制教材段落或考试题；录音、图像和字体有来源/授权；原创标记不能用于实为改写的受保护题目。
6. **覆盖报告：** tasks/topics/vocabulary/recognition characters/writing characters/grammar/listening/speaking/reading/writing 分栏显示 requirement 总数、已映射、已编写、已审校、已验收。只在每个强制项都 accepted 且测评覆盖达标时宣布完整 HSK 1。
7. **体验质量：** 独立入口与主线路径可互通；键盘/触屏/屏幕阅读器有明确交互；手机和桌面均完成功能/布局验证；保存失败和网络不可用状态诚实呈现。

本蓝图只建立范围、映射结构和原创制作规则。HSK 1 全量词汇、汉字、语法内容和课程单元仍待 Phase 2.1/2.2 实际制作及验收。
