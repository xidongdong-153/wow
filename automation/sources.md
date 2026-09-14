---
title: 魔兽世界数据源与资讯站点速查表
description: 魔兽全生态数据站点直达 URL 模板、选择器与反爬策略索引表
category: automation
docType: reference
updatedAt: 2026-09-14
tags:
  - automation
  - data-sources
  - wcl
  - archon
  - reference
---

# 魔兽世界数据源与资讯站点速查表 (Agent 直达索引)

本文件供 AI Agent 快速检索目标网址与路由参数，严禁在各网站首页层层点击导航浪费 Token。各站点均提供直达 URL 模板、核心提取选择器及反爬提示。

---

## 1. 实战统计与日志类（核心排名前列）

### 1.1 Warcraft Logs (WCL)
- **定位**：全球最权威的真实战斗日志库、首领秒伤榜、大秘境限时记录。
- **直达 URL 规则**：
  - 团本全职业统计：`https://www.warcraftlogs.com/zone/statistics/{zone_id}?class={Class}&spec={Spec}`
  - 团本首领排行：`https://www.warcraftlogs.com/zone/rankings/{zone_id}?class={Class}&spec={Spec}&boss={boss_id}`
  - 大秘境专精统计：`https://www.warcraftlogs.com/zone/statistics/{zone_id}?class={Class}&spec={Spec}`
  - 大秘境高层积分榜：`https://www.warcraftlogs.com/zone/rankings/{zone_id}#class={Class}&spec={Spec}`
  - 战斗报告伤害表：`https://www.warcraftlogs.com/reports/{report_id}?fight={fight_id}&type=damage-done`
- **常用 Zone ID**：
  - `53`：The Venomous Abyss（当前赛季团本）
  - `55`：Mythic+ Season 2（当前大秘境赛季）
- **抓取与 Token 优化建议**：
  - 存在 Cloudflare 验证，必须使用 `ego-browser`。
  - 直接读取 `window.reportsCache['0']` 可直接获取原始表格 JSON，避免抓取数千行 DOM 文本。

### 1.2 Archon.gg (WCL 官方大数据聚合站)
- **定位**：WCL 官方对高层大秘境与团本日志聚合出的天赋、装备、饰品、美化与输出时间线，结构化程度极高，是 Agent 获取 Meta 数据的首选。
- **直达 URL 规则**：
  - 大秘境概览：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/overview/10/all-dungeons/this-week`
  - 大秘境天赋：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/talents/10/all-dungeons/this-week`
  - 大秘境饰品：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/trinkets/10/all-dungeons/this-week`
  - 大秘境配装：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/gear-and-tier-set/10/all-dungeons/this-week`
  - 大秘境施法时间线：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/rotation/10/all-dungeons/this-week`
  - 团本史诗概览：`https://www.archon.gg/wow/builds/{spec}/{class}/raid/overview/mythic/all-bosses`
  - 专精强度天梯榜：
    - 大秘境 DPS 榜：`https://www.archon.gg/wow/tier-list/dps-rankings/mythic-plus/10/all-dungeons/this-week`
    - 大秘境 坦克 榜：`https://www.archon.gg/wow/tier-list/tank-rankings/mythic-plus/10/all-dungeons/this-week`
    - 大秘境 治疗 榜：`https://www.archon.gg/wow/tier-list/healer-rankings/mythic-plus/10/all-dungeons/this-week`
    - 团本 DPS 榜：`https://www.archon.gg/wow/tier-list/dps-rankings/raid/mythic/all-bosses`
    - 团本 坦克 榜：`https://www.archon.gg/wow/tier-list/tank-rankings/raid/mythic/all-bosses`
    - 团本 治疗 榜：`https://www.archon.gg/wow/tier-list/healer-rankings/raid/mythic/all-bosses`
- **参数命名规范**：
  - `{class}`：用连字符小写，如 `death-knight`, `demon-hunter`
  - `{spec}`：用小写，如 `unholy`, `frost`, `blood`
- **抓取与 Token 优化建议**：
  - 页面结构规范，直接用 `table` 或针对性标题选择器提取，严禁 `document.body.innerText` 整页 dump。

### 1.3 Raider.IO
- **定位**：大秘境实时积分榜、首杀竞速追踪、词缀轮换、顶尖队伍配置。
- **直达 URL 规则**：
  - 大秘境天梯总榜：`https://raider.io/mythic-plus-rankings/season-current/world/leaderboards-strict`
  - 专精积分榜：`https://raider.io/mythic-plus-spec-rankings/season-current/world/{class}/{spec}`
  - 本周词缀与路线：`https://raider.io/mythic-plus-weekly-affixes`
- **抓取建议**：
  - Raider.IO 提供了公开 REST API（`https://raider.io/api/v1/...`），不需要使用浏览器即可通过普通 `fetch` 直接获取 JSON，极大降低 Token 与资源消耗。

### 1.4 Subcreation
- **定位**：基于 WCL 近期限时高层日志纯算法计算出的专精 Tier List 与装备组合热力图。
- **直达 URL 规则**：
  - 大秘境专精强度榜：`https://mplus.subcreation.net/`
  - 单专精配装与天赋分析：`https://mplus.subcreation.net/{spec}-{class}.html`
  - 团本首领专精强度：`https://subcreation.net/`

---

## 2. 资讯、蓝贴、补丁与数据库

### 2.1 Wowhead
- **定位**：全球最大魔兽综合资讯站、蓝贴（Blue Tracker）、在线热修（Hotfixes）、装备与法术数据库、主流职业攻略。
- **直达 URL 规则**：
  - 官方蓝贴聚合：`https://www.wowhead.com/blue-tracker`
  - 在线热修总表：`https://www.wowhead.com/news?filter=34`
  - 每日综合新闻：`https://www.wowhead.com/news`
  - 物品数据库：`https://www.wowhead.com/item={item_id}`
  - 职业指南：`https://www.wowhead.com/guide/classes/{class}/{spec}`
- **抓取与 Token 优化建议**：
  - 蓝贴新闻页文字密度高，提取新闻时直接定位 `.news-post-body` 或 `.article-body`，过滤侧边栏与广告。

### 2.2 暴雪官方资讯（Blizzard Official News）
- **定位**：版本补丁更新说明完整版（Patch Notes）、开发团队设计访谈。
- **直达 URL 规则**：
  - 官方新闻中心（美服英文）：`https://worldofwarcraft.blizzard.com/en-us/news`
  - 补丁说明专区：`https://worldofwarcraft.blizzard.com/en-us/news/patch-notes`
  - 国服官网新闻：`https://wow.blizzard.cn/news`

---

## 3. 理论模拟与数值优化类

### 3.1 Bloodmallet
- **定位**：基于 SimulationCraft（SimC）对各专精进行多变量量化模拟的权威图表站（饰品排名、种族加成、附魔收益、副属性收益曲线）。
- **直达 URL 规则**：
  - 专精饰品模拟：`https://bloodmallet.com/chart/{class}/{spec}/trinkets/castingpatchwerk`
  - 专精种族收益：`https://bloodmallet.com/chart/{class}/{spec}/races/castingpatchwerk`
  - 副属性缩放曲线：`https://bloodmallet.com/chart/{class}/{spec}/secondary_distributions/castingpatchwerk`
- **抓取与 Token 优化建议**：
  - 图表数据内嵌在页面 Highcharts 中，直接 `evaluate` 提取图表 series 数据，比解析 SVG 节省 90% 以上 Token。

### 3.2 Raidbots
- **定位**：云端 SimC 模拟平台。
- **直达 URL 规则**：
  - 首页模拟入口：`https://www.raidbots.com/simbot`
  - 快速装备模拟（Top Gear）：`https://www.raidbots.com/simbot/topgear`
  - 掉落优化模拟（Droptimizer）：`https://www.raidbots.com/simbot/droptimizer`

---

## 4. 机制攻略与分析诊断类

### 4.1 Mythic Trap
- **定位**：大秘境地下城小怪机制、词缀规避与团本首领机制视觉化交互手册。
- **直达 URL 规则**：
  - 大秘境地下城机制速查：`https://www.mythictrap.com/en/dungeons`
  - 团本机制速查：`https://www.mythictrap.com/en/raids`

### 4.2 WowAnalyzer
- **定位**：输入 WCL 报告链接后自动分析技能覆盖率、资源溢出、GCD 浪费的自动化诊断工具。
- **直达 URL 规则**：
  - 报告诊断：`https://wowanalyzer.com/report/{report_id}/{fight_id}/{player_id}`

### 4.3 顶尖公会专栏与职业社区
- **Method 指南**：`https://www.method.gg/guides/{class}/{spec}`
- **Icy-Veins 专精指南**：`https://www.icy-veins.com/wow/{spec}-{class}-pve-dps-guide`
- **Acherus (DK 官方 Discord 社区资源)**：用于查阅 Acherus 维护的 SimC 优先级动作列表（APL）与常见 FAQ。

---

## 5. Agent Token 节约核心守则

1. **优先选二级 API 或纯结构站**：
   - 查专精整体 Meta：优先选 `Archon.gg`，不要去 WCL 首页逐层点击。
   - 查大秘境积分榜：优先用 `raider.io/api`，无需启浏览器。
   - 查技能与饰品理论强弱：优先选 `bloodmallet.com` 读取单一图表。
2. **严禁整页 Dump**：
   - 必须通过 CSS 选择器（如 `table`, `article`, `h2 + p`）限定抽取范围。
   - 提取表格时提取纯文本数组，滤除无意义的空白与换行。
3. **URL 参数一次性拼装到位**：
   - 参考上述规则直接构造包含专精名、地下城 ID、层数的最终 URL，杜绝“进首页 -> 点击职业 -> 点击专精 -> 点击天赋”的无效多轮交互。
