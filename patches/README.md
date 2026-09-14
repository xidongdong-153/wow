# 暴雪版本补丁与全职业平衡量化分析中心

本目录归档魔兽世界官方客户端补丁说明、暴雪蓝贴在线热修（Hotfixes）以及全职业、全职责、副本机制的深度量化分析报告。

当前对齐基准：**12.1.0**（客户端构建 `12.1.0.61234`，至暗之夜 Midnight Season 1）
当前生效热修：**12.1.0.61234-hotfix.0914.1**（暴雪论坛 Post ID: `1954321`，Rev 1）
官方蓝贴地址：[暴雪官方美服论坛在线修正帖 #1954321](https://us.forums.blizzard.com/en/wow/t/hotfixes-september-14-2026/1954321) | [Wowhead 热修归档镜像](https://www.wowhead.com/news=346512)

---

## 1. 补丁分类与时效响应分级

暴雪补丁按改动量级划分为三层响应模型：

| 补丁级别 | 官方命名示例 | 变更性质 | 影响系统 | 知识库响应动作 |
| :--- | :--- | :--- | :--- | :--- |
| **大版本补丁 (Major)** | 12.1.0 (Build 61234) | 赛季开启、团本开放、新大秘境池、职业机制重做 | 全职业、地下城、团本、通用系统 | 新建 `patches/{version}/` 目录；全职业手册全量校验；重置天梯榜单周期；发布正式 Git Tag |
| **次版本补丁 (Minor)** | 12.1.5 (Build 61890) | 赛季中期平衡大改、英雄天赋重构、小团本 | 多数职业、英雄天赋树、特定副本地图 | 归档中期补丁分析；核验重做专精的 `talents.md` 与 `rotation.md`；打对应版本 Tag |
| **在线热修 (Hotfix / Tuning)** | 2026-09-14 在线修正 (Post 1954321) | 每周例行维护数值微调、异常伤害修复、副本数值削弱 | 受影响职业、单体/AOE 上限、特定首领机制 | 归档单篇热修量化分析；触发 `version-manager.mjs` 标记待审专精；更新天梯排行榜 |
| **同日追加修正 (Revision)** | Rev 2 / Additional Hotfix | 上线同日紧急撤回或补丁补漏 | 特定单一技能或穿透机制 | 更新现有热修文档；递增 `revision` 字段；发布复合精细 Tag |

---

## 2. 全职业四维量化分析框架

每篇补丁或热修分析文档必须涵盖完整的四维量化评估，覆盖坦克、治疗、近战与远程全部专精，严禁仅针对单一职业：

1. **官方改动条目原文与确切中译**
   - 提取各职业、天赋、通用技能的官方数值改动百分比、机制描述及改动动机。
2. **纯数值与机制量化评估**
   - **技能倍率折算**：改动对基础伤害、攻击强度（AP）/法术强度（SP）加成系数的真实影响。
   - **目标衰减与阈值**：超出软上限（如 5 目标、8 目标）后的递减计算与波次真实净损益。
   - **资源循环变动**：冷却时间（CD）、公共冷却（GCD）、怒气/能量/符文获取速率的变化。
3. **全职责实战生态位移**
   - **坦克职责（Tank）**：硬免伤覆盖率、尖刺物理承伤、自愈吞吐量与战术聚怪能力变化。
   - **治疗职责（Healer）**：瞬时爆发抬血（HPS）、持续平稳预铺、蓝耗经济性与全队减伤光环变动。
   - **伤害输出（DPS）**：单体纯木桩吞吐量、短 CD 波次爆发峰值、斩杀期处决伤害与移动战无损能力。
4. **配装、天赋与手法应对动作**
   - **配装与饰品**：BiS 饰品组合是否变更、制造装双美化优先级调整、四件套部件替换。
   - **天赋重构**：英雄天赋树分流（如单体选天启、AOE 选萨莱茵）、核心天赋点取舍。
   - **施法时序图调整**：技能释放优先级更替、资源防溢出阈值修正。

---

## 3. 全职业全专精监控矩阵

本目录持续跟踪监控魔兽世界全部 13 个职业共 39+ 专精的补丁变动：

| 职业 (Class) | 专精 (Specs) | 职责与主要监控机制 | 对应指南目录 |
| :--- | :--- | :--- | :--- |
| **死亡骑士 (Death Knight)** | 鲜血 (Blood)、冰霜 (Frost)、邪恶 (Unholy) | 坦克尖刺自愈与群拉；冰龙与湮灭爆发；血兽自爆与随从大军 | `classes/death-knight/` |
| **圣骑士 (Paladin)** | 神圣 (Holy)、防护 (Protection)、惩戒 (Retribution) | 美德道标群抬；飞盾打断与奉献减伤；征伐翅膀爆发与保护圣疗容错 | `classes/paladin/` |
| **战士 (Warrior)** | 武器 (Arms)、狂怒 (Fury)、防护 (Protection) | 巨力顺劈与处决斩杀；平稳双持直伤；盾牌格挡与全队集结呐喊 | `classes/warrior/` (待扩展) |
| **萨满祭司 (Shaman)** | 元素 (Elemental)、增强 (Enhancement)、恢复 (Restoration) | 狂风怒号波次融怪；风暴使者始源顺劈；灵力风剪与先祖图腾 | `classes/shaman/` (待扩展) |
| **法师 (Mage)** | 奥术 (Arcane)、火焰 (Fire)、冰霜 (Frost) | 法阵单体压血与智力光环；燃烧爆发轴；双目标冰枪顺劈与减速控场 | `classes/mage/` (待扩展) |
| **潜行者 (Rogue)** | 奇袭 (Assassination)、狂徒 (Outlaw)、敏锐 (Subtlety) | 绞喉割裂单体顺劈；高频控场帷幕跳怪；暗影之舞定点刺杀大怪 | `classes/rogue/` (待扩展) |
| **恶魔猎手 (Demon Hunter)** | 浩劫 (Havoc)、复仇 (Vengeance)、噬灭 (Devourer) | 魔法易伤与群晕；沉默咒符大波控场；虚空吞噬长轴爆发 | `classes/demon-hunter/` (待扩展) |
| **术士 (Warlock)** | 痛苦 (Affliction)、恶魔学识 (Demonology)、毁灭 (Destruction) | 多目标长线跳伤；小鬼海暴君平稳压怪；浩劫双目标定点爆发 | `classes/warlock/` (待扩展) |
| **德鲁伊 (Druid)** | 平衡 (Balance)、野性 (Feral)、守护 (Guardian)、恢复 (Restoration) | 日光群体沉默与超凡；流血多线割裂；铁鬃硬免伤与群奔战复 | `classes/druid/` (待扩展) |
| **武僧 (Monk)** | 酒仙 (Brewmaster)、织雾 (Mistweaver)、踏风 (Windwalker) | 醉拳平滑尖刺；氤氲雾群抬；5% 物理易伤与扫堂腿平心环控场 | `classes/monk/` (待扩展) |
| **猎人 (Hunter)** | 野兽控制 (Beast Mastery)、射击 (Marksmanship)、生存 (Survival) | 全移动无损平滑走位；超远距离狙击单体；炸弹顺劈爆发 | `classes/hunter/` (待扩展) |
| **牧师 (Priest)** | 戒律 (Discipline)、神圣 (Holy)、暗影 (Shadow) | 救赎转化输出抬血；守护之魂防猝死；能量灌注与虚空爆发 | `classes/priest/` (待扩展) |
| **唤魔师 (Evoker)** | 湮灭 (Devastation)、恩护 (Preservation)、增辉 (Augmentation) | 深呼吸蓄力爆发；回响群抬时空压缩；黑檀先祖队友数值放大 | `classes/evoker/` (待扩展) |

---

## 4. 12.1 版本补丁与在线修正归档索引

### 当前生效补丁（12.1 系列）

- **2026-09-14 在线热修与职业调整深度分析**
  - 文件路径：`patches/12.1/2026-09-14-tuning.md`
  - 关联版本：`12.1.0.61234-hotfix.0914.1`（Post ID: `1954321`，Rev 1）
  - 官方蓝贴直达：
    - 暴雪官方论坛原文：`https://us.forums.blizzard.com/en/wow/t/hotfixes-september-14-2026/1954321`
    - Wowhead 蓝贴追踪镜像：`https://www.wowhead.com/news=346512/wow-hotfixes-september-14-2026`
    - 国服战网热修同步公告：`https://wow.blizzard.cn/news/1954321`
  - 核心改动摘要：
    - **死亡骑士**：萨莱茵血兽 8 目标以上溢出伤害衰减 10%，大秘境极端拉怪削弱，常规波次不受影响；天启骑士莫格莱尼与怀特迈恩直伤提高 5%，巩固团本单体地位；冰霜专精湮灭基础伤害提高 4%，冰龙吐息消耗降低 5%。
    - **战士**：武器战斩杀系数高位保持，天梯评分稳居近战首位。
    - **萨满祭司**：元素萨升腾伤害未作削弱，持续领跑远程法系。
    - **专精联动状态**：`death-knight/unholy` 与 `death-knight/frost` 判定对齐完成，天梯榜单与指南手法已同步。

---

## 5. 副本机制与系统平衡专项

除职业专属技能调整外，本目录同步归档地下城、团本与装备系统的全局修正：

1. **地下城与大秘境词缀调整**
   - 词缀数值与判定窗口修正（强韧、残暴、萨拉塔斯的狡诈）。
   - 特定副本致命技能伤害衰减（如 Murder Row 大怪穿透流血、毒液深渊环境腐蚀伤害）。
2. **史诗团本（The Venomous Abyss）机制热修**
   - 首领血量与狂暴时限微调（尾王 Ula'tek P3 阶段血量平衡）。
   - 灭团技机制窗口宽限（点名分摊人数要求、不可规避穿透伤害削弱）。
3. **装备、饰品与美化平衡**
   - 饰品触发率与数值修正（如乌拉特克的饕餮之心急速加成、轻装连队战旗被动叠层）。
   - 制造装双美化内置冷却机制修复。

---

## 7. 官方蓝贴与权威追踪直达源

用于 Agent 或开发人员快速查验官方一手改动，避免在无关页面层层跳转：

| 来源名称 | 平台定位 | 直达路由 URL | 抓取与监控建议 |
| :--- | :--- | :--- | :--- |
| **暴雪官方蓝贴论坛** | 官方热修与职业设计师第一发声地 | `https://us.forums.blizzard.com/en/wow/c/community/blizzard-posts/19` | 监控帖名包含 `Hotfixes:` 的主题，提取数字 Post ID |
| **暴雪官方补丁说明专区** | 大版本/次版本官方完整更新日志 | `https://worldofwarcraft.blizzard.com/en-us/news/patch-notes` | 获取完整机制说明与系统功能清单 |
| **Wowhead 蓝贴追踪器** | 社区最快实时抓取聚合站 | `https://www.wowhead.com/blue-tracker` | 带分类筛选与职业高亮，信息密度高 |
| **Wowhead 热修新闻分类** | 官方在线热修结构化历史列表 | `https://www.wowhead.com/news?filter=34` | 查验历史各周二例行维护热修记录 |
| **国服官方新闻中心** | 国服本地化官方译名核对 | `https://wow.blizzard.cn/news` | 官方技能名与装备中译对照 |


当暴雪发布新补丁说明或在线热修时，通过以下命令维持知识库时效：

### 1. 录入新热修并自动提取受影响职业
```bash
node automation/scripts/version-manager.mjs record-hotfix patches/12.1/YYYY-MM-DD-tuning.md --build 61234 --post-id 1954321 --rev 1
```

### 2. 检查全库时效对齐状态
```bash
node automation/scripts/version-manager.mjs check
```

### 3. 标记特定专精指南完成手法对齐
```bash
node automation/scripts/version-manager.mjs mark-synced death-knight/unholy
node automation/scripts/version-manager.mjs mark-synced warrior/arms
```

### 4. 获取当前版本建议的 Git Tag 发布命令
```bash
node automation/scripts/version-manager.mjs tag-info
```
