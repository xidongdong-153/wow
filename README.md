# 魔兽世界数据与职业指南知识库

本项目用于归档与维护魔兽世界各职业的高阶玩法数据、WCL 榜单复盘、每日资讯、职业强度天梯排行以及暴雪补丁更新分析。同时提供专供 AI Agent（基于 ego-browser / ego-lite）自动化采集与更新数据的操作手册与脚本。

## 当前版本与时效状态

- 游戏基准版本：**12.1.0**（客户端构建：`12.1.0.61234`，至暗之夜 Midnight Season 1）
- 精细热修版本：**12.1.0.61234-hotfix.0914.1**（暴雪论坛 Post ID: `1954321`，Rev 1）
- 生效热修文档：`patches/12.1/2026-09-14-tuning.md`
- 数据同步状态：已同步（对齐 2026-09-14 天梯数据）
- 建议归档标签：`v12.1.0.61234-hotfix.20260914.1`
- 版本规范说明：`VERSION.md`
- 版本状态自检：`node automation/scripts/version-manager.mjs check`

## 目录索引

- `classes/`：各职业专精深度库（配装、天赋、属性、手法、日志精读）。当前主维护：死亡骑士（DK）、圣骑士（Paladin）；新增专精标准模板位于 `classes/_template/`。
- `rankings/`：每日职业强度排行榜（大秘境与团本分榜，包含分级、样本量与关键改动影响）。
- `news/`：每日官方资讯、社区热点与活动速报（按月归档）。
- `patches/`：暴雪补丁日志、职业平衡调整与加强削弱深度量化分析。
- `automation/`：AI Agent 自动化操作手册（Runbook）、资讯数据源速查表（Sources）与采集脚本。

## 快速导航

- 资讯与数据源直达表（Agent 省 Token 速查）：`automation/sources.md`
- Agent 抓取操作手册（SOP）：`automation/runbook-wcl-fetch.md`
- 邪恶死亡骑士指南：`classes/death-knight/unholy/`
  - 专精总览与属性：`classes/death-knight/unholy/README.md`
  - 天赋与英雄天赋：`classes/death-knight/unholy/talents.md`
  - 配装与饰品排行：`classes/death-knight/unholy/gear.md`
  - 输出手法与循环：`classes/death-knight/unholy/rotation.md`
  - WCL 高分日志复盘：`classes/death-knight/unholy/logs.md`
- 惩戒圣骑士指南：`classes/paladin/retribution/`
  - 专精总览与属性：`classes/paladin/retribution/README.md`
  - 天赋与英雄天赋：`classes/paladin/retribution/talents.md`
  - 配装与饰品排行：`classes/paladin/retribution/gear.md`
  - 输出手法与循环：`classes/paladin/retribution/rotation.md`
  - WCL 高分日志复盘：`classes/paladin/retribution/logs.md`
- 今日大秘境天梯榜：`rankings/mythic-plus/2026-09-14.md`
- 今日团本天梯榜：`rankings/raid/2026-09-14.md`
- 补丁调整分析：`patches/12.1/2026-09-14-tuning.md`
- 版本规范与蓝贴时效：`VERSION.md`
- 版本与时效管理脚本：`automation/scripts/version-manager.mjs`
