# Agent 操作 EGO LITE 抓取 WCL / Archon 数据运行手册 (Runbook)

本手册专供 AI Agent 在终端环境中使用 `ego-browser` 自动执行魔兽世界数据抓取与知识库更新。

---

## 1. 运行环境与调用命令

所有浏览器操作均通过 `bash` 工具调用 `ego-browser nodejs` 脚本块执行。严禁在没有必要的情况下启动额外的外部浏览器。

标准调用骨架：
```bash
ego-browser nodejs <<'EOF'
const task = await taskSpace("warcraft-data-fetch");
const page = task.page("p1");

// 导航与业务逻辑...
await page.goto("https://www.archon.gg/wow/builds/unholy/death-knight/mythic-plus/overview/10/all-dungeons/this-week");

// 任务结束必须调用 finish 释放
await task.finish({ keep: [] });
EOF
```

---

## 2. 核心数据源与 URL 路由规则

### A. Warcraft Logs 官方站（用于原始排行与具体 Parse 日志）
- **当前团本（The Venomous Abyss）**：Zone ID 为 `53`
  - 团本全职业/专精统计：`https://www.warcraftlogs.com/zone/statistics/53?class={Class}&spec={Spec}`
  - 团本史诗排名：`https://www.warcraftlogs.com/zone/rankings/53?class={Class}&spec={Spec}`
- **当前大秘境（Mythic+ Season 2）**：Zone ID 为 `55`
  - 大秘境专精统计：`https://www.warcraftlogs.com/zone/statistics/55?class={Class}&spec={Spec}`
  - 大秘境积分榜：`https://www.warcraftlogs.com/zone/rankings/55#class={Class}&spec={Spec}`
- **具体战斗报告日志**：
  - URL 格式：`https://www.warcraftlogs.com/reports/{reportId}?fight={fightId}&type=damage-done`

### B. Archon.gg 聚合站（WCL 官方出品，用于结构化统计）
- **大秘境专精聚合（近两周 7-21 层聚合）**：
  - 总览（Overview）：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/overview/10/all-dungeons/this-week`
  - 天赋与英雄天赋（Talents）：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/talents/10/all-dungeons/this-week`
  - 饰品排行与组合（Trinkets）：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/trinkets/10/all-dungeons/this-week`
  - 装备与美化（Gear）：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/gear-and-tier-set/10/all-dungeons/this-week`
  - 施法时间线与手法（Rotation）：`https://www.archon.gg/wow/builds/{spec}/{class}/mythic-plus/rotation/10/all-dungeons/this-week`
- **团本史诗聚合**：
  - 总览：`https://www.archon.gg/wow/builds/{spec}/{class}/raid/overview/mythic/all-bosses`
  - 天赋：`https://www.archon.gg/wow/builds/{spec}/{class}/raid/talents/mythic/all-bosses`
  - 饰品：`https://www.archon.gg/wow/builds/{spec}/{class}/raid/trinkets/mythic/all-bosses`
- **天梯强度榜单（Tier List）**：
  - 大秘境强度榜：`https://www.archon.gg/wow/tier-list/dps-rankings/mythic-plus/10/all-dungeons/this-week`
  - 团本强度榜：`https://www.archon.gg/wow/tier-list/dps-rankings/raid/mythic/all-bosses`

---

## 3. 人机验证（Cloudflare Challenge）标准处理动作

Warcraft Logs 与 Archon 频繁弹出 Human Verification 页面。处理标准流程如下：

```javascript
// 1. 检查页面 Title 或 H1 是否为 "Human Verification" 或 "One Quick Check"
const title = await page.title();
if (title.includes("Human Verification") || title.includes("One Quick Check")) {
  // 2. 点击页面自带的表单确认按钮
  await page.click("loc=role:button[name='I am a human and not a bot']").catch(() => {});
  // 3. 等待网络与页面加载完成
  await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
}
```

如果遇到必须滑块或画图的强阻断验证码，必须调用 `await task.handOff()` 将控制权转交人工，并在终端提示用户在浏览器窗口中完成验证，待用户确认后再 resume 继续执行。

---

## 4. 关键数据提取 DOM 与选择器清单

在 `page.evaluate()` 回调中提取以下核心元素：

### 1. 属性优先级与采样数值
- 目标区域：包含文本 `Unholy Death Knight Stats` 的容器。
- 提取规则：读取文本块中的 `Strength > Crit > Mastery > Haste > Vers` 以及下方数字。

### 2. 英雄天赋（Hero Talents）占比
- 目标区域：文本包含 `Hero Talents` 的卡片。
- 提取字段：
  - 英雄天赋名称（如 `SAN'LAYN`、`RIDER OF THE APOCALYPSE`）
  - 使用率百分比（如 `57.7%`）
  - 对应 DPS 样本均值（如 `311.3K`）

### 3. 饰品排行榜
- 目标表格：Trinkets 页面中的 `table`。
- 提取字段：
  - 饰品名称（含 BiS 标记）
  - 普及率（Popularity）
  - 最高到达层数（Max Key）

### 4. 套装与美化
- 目标：Gear 页面中的 `Unholy Death Knight Tier Set Slots` 及 `Embellishments` 区域。
- 提取字段：各部位穿戴率、双美化组合名称与占比。

---

## 5. 数据与截图落盘规范

Agent 采集到新数据后，严格按以下路径更新：
1. 职业专精数据：覆盖或增量写入 `classes/{class}/{spec}/` 下对应 `.md` 文件。
2. 截图落盘：
   - 实景/数据图：保存到就近的 `classes/{class}/{spec}/assets/` 目录，文件名统一使用小写中划线（如 `talents-overview.png`），在 Markdown 中通过 `![说明](./assets/xxx.png)` 引用。
   - 流程/手法图：优先使用内联 Mermaid 图表（暗色主题：代码块首行加 `%%{init: {"theme": "dark"}}%%`），不要截纯文本或简单表格的图片。
3. 每日排行榜单：新增写入 `rankings/mythic-plus/YYYY-MM-DD.md` 和 `rankings/raid/YYYY-MM-DD.md`。
4. 采集日志记录：简短更新 `automation/logs.md` 记录采集时间戳与状态。

---

## 6. 清理规范

无论采集成功与否，脚本结束时必须执行：
```javascript
await task.finish({ keep: [] });
```
严禁无故保留后台未关闭的 TaskSpace，避免占用系统内存与端口。
