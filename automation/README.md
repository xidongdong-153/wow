# 自动化采集与 Agent 运行手册

本目录包含供 AI Agent 自动维护魔兽世界数据的操作流程规范（SOP）与脚本。

## 目录索引

- `sources.md`：魔兽全生态资讯与数据站点直达速查表（专供 Agent 快速定位与省 Token）。
- `runbook-wcl-fetch.md`：Agent 操作 EGO LITE（ego-browser）抓取 WCL 与 Archon 的完整标准操作手册。
- `scripts/`：自动化运维与采集脚本。
  - `version-manager.mjs`：版本与蓝贴时效管理脚本（状态自检、接入新蓝贴、专精对齐、Git Tag 建议）。
  - `fetch-rankings.mjs`：基于 ego-browser 抓取 Archon/WCL 官方天梯数据。
  - `generate-rankings-md.mjs`：将抓取的排行榜数据转换为标准大秘境与团本报告。
  - `fetch-spec-data.mjs`：抓取单专精构建数据（天赋、配装、属性）。
