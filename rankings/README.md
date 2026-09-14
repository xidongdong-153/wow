# 职业强度排行榜 (Tier Lists)

本目录按日期归档魔兽世界大秘境与史诗团本的各专精强度天梯排行。所有数据均来自 Warcraft Logs 与 Archon 大数据聚合，杜绝主观臆断与虚假排位。

## 评估维度与指标标准

### 1. 大秘境强度天梯 (Mythic+)
- **核心指标**：暴雪官方大秘境天梯在册通过记录的 95th 分位大秘境积分（Mythic+ Score）。
- **评级逻辑**：高层大秘境需要伤害输出、控场打断、战术跳怪、团队增益与极限生存综合支撑。纯 DPS 无法反映高层真实通过率，官方天梯 95th 分位分客观反映专精在高层的整体上限与表现。
  - **S Tier**：积分 > 3450，冲层核心专精与版本答案。
  - **A Tier**：积分 3350 - 3450，主流强力专精，机制全面且容错率高。
  - **B Tier**：积分 3250 - 3350，常规可用，但在极端高层受制于减伤空档或控场能力。
  - **C Tier**：积分 < 3250，机制不契合当前赛季节奏或数值受到压制。

### 2. 史诗团本强度天梯 (Mythic Raid)
- **纯输出吞吐量 (Throughput)**：全首领 95th 分位纯秒伤 (DPS)，反映该专精极限输出潜力与木桩/顺劈爆发。
- **综合进本热度 (Popularity / Meta)**：综合考量团队 5% 属性光环、嗜血、战复、团队大减伤、单吃点名能力与开荒不可替代性。

## 自动化数据更新与生成流程

所有排行文件由自动化采集脚本直接拉取官方大数据，并由渲染脚本自动生成，严禁手工伪造数据：

1. **执行官方天梯数据采集**：
   ```bash
   ego-browser nodejs < automation/scripts/fetch-rankings.mjs
   ```
   数据落盘至 `automation/data/rankings-latest.json`。
2. **生成每日 Markdown 报告**：
   ```bash
   node automation/scripts/generate-rankings-md.mjs
   ```
   文件落盘至 `rankings/mythic-plus/YYYY-MM-DD.md` 与 `rankings/raid/YYYY-MM-DD.md`。

## 目录结构

- `mythic-plus/`：大秘境强度天梯，按天独立归档（`YYYY-MM-DD.md`）。
- `raid/`：史诗团本强度天梯，按天独立归档（`YYYY-MM-DD.md`）。
