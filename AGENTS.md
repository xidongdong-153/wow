# AGENTS.md

## Repository Overview

本仓库是魔兽世界（World of Warcraft）高阶数据分析、WCL 榜单复盘、职业指南与每日情报知识库，配套基于 `ego-browser` 的 AI Agent 自动化采集脚本。

当前主力维护职业为死亡骑士（Death Knight，尤其是邪恶专精），目录结构设计支持未来扩展全职业。

## Repository Structure

- `classes/{class}/{spec}/`：职业专精核心手册。每个专精固定包含 `README.md`（总览/属性）、`talents.md`（天赋/英雄天赋）、`gear.md`（套装/饰品/美化/散件）、`rotation.md`（输出手法/起手/优先级）与 `logs.md`（WCL 顶尖日志精读）。
- `rankings/{mythic-plus|raid}/`：每日职业强度排行榜，按日期 `YYYY-MM-DD.md` 独立归档，记录专精梯队与版本生态。
- `news/YYYY-MM/`：每日资讯与社区热点，按月份分目录、按日期 `YYYY-MM-DD.md` 独立归档。
- `patches/{version}/`：暴雪补丁、在线热修日志与职业平衡深度量化分析，按大版本号分目录。
- `automation/`：AI Agent 自动化采集工具库。
  - `sources.md`：全生态网站直达路由速查表（供 Agent 快速拼接 URL，杜绝从首页逐级点击浪费 Token）。
  - `runbook-wcl-fetch.md`：操作 `ego-browser` 抓取 WCL / Archon 的 SOP 运行指南。
  - `scripts/`：Node.js 自动化采集脚本。

## Commands

本项目为 Markdown 知识库与 Node.js 自动化采集脚本，未引入 npm/pnpm/yarn 包管理器，无 `package.json`、构建脚本或测试套件。

所有自动化操作均依赖 `ego-browser` CLI（ESM 运行时）：

- **运行专精数据采集脚本**：
  ```bash
  ego-browser nodejs < automation/scripts/fetch-spec-data.mjs
  ```
- **指定专精与职业运行**：
  ```bash
  WOW_SPEC=unholy WOW_CLASS=death-knight ego-browser nodejs < automation/scripts/fetch-spec-data.mjs
  ```
- **内联执行轻量采集命令**：
  ```bash
  ego-browser nodejs <<'EOF'
  const task = await taskSpace("warcraft-fetch");
  const page = task.page("p1");
  await page.goto("https://www.archon.gg/wow/builds/unholy/death-knight/mythic-plus/overview/10/all-dungeons/this-week");
  // 提取操作...
  await task.finish({ keep: [] });
  EOF
  ```

## Architecture & Conventions

- **文案规范（强制遵守 xdd-plain-docs）**：
  - 默认使用中文输出。
  - 严禁出现任何 emoji（包括标题、列表与表格）。
  - 严禁客服腔（“建议您”、“请您”、“希望对您有所帮助”等）与互联网黑话。
  - 纯事实驱动：直接提供确切路径、技能名、数值权重与具体动作。
- **命名规范**：
  - 目录名统一采用英文小写破折号（`kebab-case`），如 `death-knight`, `mythic-plus`。
  - 资讯、天梯榜单统一采用 ISO 日期命名（`YYYY-MM-DD.md`）。
  - 图片资源存放在各专精或模块就近的 `assets/` 目录，命名使用 `[主题]-[内容].png`。
- **图文配合规范（缓解纯文字疲劳）**：
  - **复杂数据/实景排布**：使用 `ego-browser` 截图或放入 `assets/` 下的 PNG，相对路径引用。
  - **手法时序/决策流程**：强制采用内联 Mermaid 代码块（首行统一加 `%%{init: {"theme": "dark"}}%%` 暗色主题），避免纯文本列表堆叠。
- **数据维护原则**：
  - 每日资讯（`news/`）与天梯榜单（`rankings/`）按天新增独立文件，严禁覆盖历史旧日记录。
  - 专精核心手册（`classes/{class}/{spec}/`）保持最新状态，随最新版本改动直接更新原文件。

## Constraints & Gotchas

1. **Ego-browser TaskSpace 释放**：
   - 每次调用 `ego-browser`，脚本结束时**必须**执行 `await task.finish({ keep: [] })`。严禁遗留未关闭的后台 TaskSpace，否则会导致进程与内存泄漏。
2. **人机挑战（Cloudflare Challenge）处理**：
   - Warcraft Logs 与 Archon 频繁弹出验证。代码中必须优先检测标题是否为 `Human Verification` 或 `One Quick Check`，并自动点击 `loc=role:button[name='I am a human and not a bot']`。
   - 若遇到复杂交互式验证码，调用 `await task.handOff()` 移交人工并在终端说明，严禁盲目循环重试。
3. **Token 消耗控制（严禁首页跳转）**：
   - 严禁打开 `warcraftlogs.com` 或 `archon.gg` 首页后通过点击层层导航，这会浪费成千上万 Token。
   - 必须先查阅 `automation/sources.md` 获取直达目标 URL（如大秘境专精直接访问 `https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/overview/10/all-dungeons/this-week`）。
4. **WCL 表格提取陷阱**：
   - 邪DK等带有大量随从宠物的专精，WCL 页面会渲染成百上千个召唤物折叠节点。严禁在报告页执行 `document.body.innerText` 或无筛选的 `table` 文本导出，否则会生成上万行无用文本挤爆上下文。
   - 提取特定玩家时，应在 URL 中带上 `&source={id}`，或直接在控制台中读取 `window.reportsCache['0']` 原始数据。

## Verification

- **知识库文档修改**：
  - 检查文件路径是否符合 `classes/`、`rankings/`、`news/`、`patches/` 规定。
  - 检查全文是否包含任何 emoji（搜索验证），若有必须全部清除。
- **自动化脚本修改**：
  - 运行 `ego-browser nodejs < automation/scripts/fetch-spec-data.mjs`，确保执行无报错、输出包含抓取的有效数据、且最终正常输出 `Fetch task completed.` 退出。
