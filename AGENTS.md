# AGENTS.md

## Repository Overview

本仓库是魔兽世界（World of Warcraft）高阶数据分析、WCL 榜单复盘、职业指南与每日情报知识库，配套基于 `ego-browser` 的 AI Agent 自动化采集脚本。

当前主力维护职业为死亡骑士（Death Knight，尤其是邪恶专精）与圣骑士（Paladin，尤其是惩戒专精），目录结构设计支持未来扩展全职业。

## Repository Structure

- `classes/{class}/{spec}/`：职业专精核心手册。每个专精固定包含 `README.md`（总览/属性）、`talents.md`（天赋/英雄天赋）、`gear.md`（套装/饰品/美化/散件）、`rotation.md`（输出手法/起手/优先级）与 `logs.md`（WCL 顶尖日志精读）。标准模板位于 `classes/_template/`。
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
- **版本与蓝贴时效状态自检**：
  ```bash
  node automation/scripts/version-manager.mjs check
  ```
- **录入新蓝贴在线热修**：
  ```bash
  node automation/scripts/version-manager.mjs record-hotfix patches/12.1/YYYY-MM-DD-tuning.md
  ```
- **标记专精与热修对齐完成**：
  ```bash
  node automation/scripts/version-manager.mjs mark-synced death-knight/unholy
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
- **YAML Front Matter 元数据规范**：
  - 除所有 `README.md` 与 `AGENTS.md` 豁免外，仓库内所有 Markdown 文章必须在文件起始处包含标准的 YAML Front Matter（`---` 包裹）。
  - 通用必填字段：`title`、`description`、`category`、`docType`、`tags`。
  - 专精手册特有字段：`class`、`spec`、`role`、`gameVersion`、`season`、`updatedAt`、`hotfixAligned`。
  - 天梯排行榜特有字段：`mode`、`gameVersion`、`season`、`date`、`sampleSize`、`dataSource`。
  - 补丁热修特有字段：`patchType`、`gameVersion`、`date`、`affectedClasses`、`affectedSpecs`。

## Spec Onboarding Rules (新增专精强制标准)

当 Agent 被要求新增职业或专精时，**必须严格按 `classes/_template/` 结构生成全部 5 个文件加 1 张实景截图**，严禁自由发挥漏项：

1. **文件完整度（缺一不可）**：
   - `README.md`：专精定位、机制核心、大秘境与团本属性优先级及数值均值。
   - `talents.md`：英雄天赋对比表（必须含大秘境/团本使用率与均伤）、主流机制拆解、通用/专精树核心推荐；顶端必须内嵌实景截图 `![天赋概览](./assets/talents-overview.png)`。
   - `gear.md`：套装 4 件套各部位穿戴率表、武器排行（区分制造与掉落）、双美化方案、单体饰品榜与双 BiS 组合榜、6 个关键散件速查。
   - `rotation.md`：资源防溢出原则、大秘境 AOE 爆发循环（**必须包含 Mermaid 暗色流程图**）、团本单体优先级（**必须包含 Mermaid 流程图**）、4 条具体新手易错自查。
   - `logs.md`：世界前 3 选手拆解、单场高层限时日志的 5 项主要伤害来源占比、史诗团本代表性击杀日志。
2. **实景截图要求**：
   - 调用 `ego-browser` 打开 Archon/WCL 天赋页并截图，保存至 `classes/{class}/{spec}/assets/talents-overview.png`。
3. **全局索引联动**：
   - 在 `classes/{class}/README.md` 中添加专精导航。
   - 在根目录 `README.md` 的“快速导航”中增加该专精条目。
   - 在 `AGENTS.md` 的 `Repository Overview` 更新当前主力维护职业列表。

## Versioning & Blue Post Sync Rules (版本与蓝贴时效规范)

仓库全面对齐暴雪魔兽世界官方客户端版本（当前客户端构建：`12.1.0.61234`，至暗之夜 Midnight Season 1），以暴雪官方蓝贴（Patch Notes 与 Hotfixes 在线修正）为唯一时效驱动源，采用“客户端 Build + 蓝贴 Post ID + 同日修订号”复合版本体系：

1. **版本元数据唯一真实源（version.json）**：
   - 根目录 `version.json` 必须记录当前主版本 `gameVersion`（如 `12.1.0`）、客户端构建 `clientBuild`（如 `61234`）、完整四位版本 `fullVersion`（如 `12.1.0.61234`）、生效热修 `activeHotfix`（含精细版本号 `versionId`、日期、暴雪论坛 `bluePostId`、修订号 `revision` 与对应文档路径）、专精对齐状态 `specStatus` 以及建议标签 `gitTag`。
   - 任何涉及补丁分析或专精手册改动后，必须同步更新 `version.json`。
2. **蓝贴时效同步标准操作流（SOP）**：
   - 第一步：将暴雪新发布的改动写入 `patches/{version}/{YYYY-MM-DD}-tuning.md`。
   - 第二步：运行 `node automation/scripts/version-manager.mjs record-hotfix patches/{version}/{YYYY-MM-DD}-tuning.md [--build <build>] [--post-id <id>] [--rev <rev>]`，自动生成精细热修版本号（例如 `12.1.0.61234-hotfix.0914.1`），并将受影响专精状态置为 `needs-review`。
   - 第三步：复核并修改对应专精的 `talents.md`、`gear.md` 与 `rotation.md`，修改完成后运行 `node automation/scripts/version-manager.mjs mark-synced {class}/{spec}`。
   - 第四步：根据新热修生效后的天梯环境，运行排行榜采集脚本更新 `rankings/`。
   - 第五步：运行 `node automation/scripts/version-manager.mjs check` 确保零未对齐项。
   - 第六步：经用户确认后，依据 `node automation/scripts/version-manager.mjs tag-info` 打上 Git Tag。
3. **Git Tag 命名规范**：
   - 大补丁基线：`v12.1.0.61234`
   - 次补丁基线：`v12.1.5.61890`
   - 热修精细快照：`v{Major}.{Minor}.{Patch}.{Build}-hotfix.{YYYYMMDD}.{rev}`（如 `v12.1.0.61234-hotfix.20260914.1`）

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
  - 运行 `node automation/scripts/version-manager.mjs check`，确保版本与蓝贴时效检测结果为“全面同步完成”。
- **自动化脚本修改**：
  - 运行 `ego-browser nodejs < automation/scripts/fetch-spec-data.mjs`，确保执行无报错、输出包含抓取的有效数据、且最终正常输出 `Fetch task completed.` 退出。
