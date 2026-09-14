# 副本机制攻略与数据基准知识库

本模块归档魔兽世界当前大版本（12.1.0.61234，至暗之夜 Midnight Season 1/2）大秘境地下城与团队副本的结构化攻略、路线时序、高危打断与 WCL 实战基准数据。

内容体系全面采用“新人入门（平稳限时/开荒自保）”与“高层冲分（合波压缩/爆发对齐）”双轨制设计，服务于不同阶段的攻坚决策。

---

## 1. 模块导航

### 大秘境地下城库 (`instances/mythic-plus/`)
当前官方 Season 2 大秘境 8 地下城池配置（5 新本 + 3 经典回归本）：
- **夺目谷**：`instances/mythic-plus/the-blinding-vale/`
- **密谋小径**：`instances/mythic-plus/murder-row/`
- **纳洛拉克的洞穴**：`instances/mythic-plus/den-of-nalorakk/`
- **毒牙祭坛**：`instances/mythic-plus/altar-of-fangs/`
- **虚空之痕竞技场**：`instances/mythic-plus/voidscar-arena/`
- **红玉新生法池**：`instances/mythic-plus/ruby-life-pools/`
- **诸王之眠**：`instances/mythic-plus/kings-rest/`
- **塞塔里斯神庙**：`instances/mythic-plus/temple-of-sethraliss/`

> **常备扩展地下城**：[晨曦尖塔](./mythic-plus/the-dawnspire/)、[阿曼尼地穴](./mythic-plus/amani-crypts/)、[运货快道](./mythic-plus/freightrunner-run/) 亦已全套收录。

各地下城均包含 5 个核心技术文件：
1. `README.md`：地下城机制总览、环境伤害、词缀联动与掉落速查。
2. `route.md`：路线规划（新人平稳推进路线 vs 高层合波压缩路线，配暗色 Mermaid 决策时序图与拉怪批次）。
3. `trash.md`：高危小怪技能表、钢条打断控制链与进攻驱散责任清单。
4. `bosses.md`：首领战时间轴、灭团技应对、坦克死刑减伤与爆发压血时机。
5. `benchmarks.md`：WCL 官方限时分位数据表（+10 至 +22 层队伍总 DPS、承伤峰值 DTPS、治疗缺口）。

---

### 团队副本库 (`instances/raid/`)
当前赛季主力史诗团本：**烈毒之渊 (The Venomous Abyss - Zone 53)**
- 团本总览与配置基准：`instances/raid/the-venomous-abyss/README.md`
- 史诗全首领狂暴线与纯秒伤横评：`instances/raid/the-venomous-abyss/benchmarks.md`
- 首领独立攻坚指南：
  - 1 号首领：`instances/raid/the-venomous-abyss/bosses/01-acidfang.md`（腐蚀之牙 掠夺者）
  - 2 号首领：`instances/raid/the-venomous-abyss/bosses/02-vexira.md`（孵化女王 维克希拉）
  - 3 号首领：`instances/raid/the-venomous-abyss/bosses/03-tormented-amalgam.md`（受折磨的聚合体）
  - 4 号首领：`instances/raid/the-venomous-abyss/bosses/04-malakor.md`（缚影者 马拉考尔）
  - 5 号首领：`instances/raid/the-venomous-abyss/bosses/05-srikthir.md`（高阶祭司 斯里克希尔）
  - 6 号尾王：`instances/raid/the-venomous-abyss/bosses/06-ulatek.md`（亵渎者 乌拉特克）

---

## 2. 标准化模板 (`instances/_template/`)
当新增地下城或团队副本时，必须克隆模板并补齐各字段：
- 地下城模板：`instances/_template/dungeon/`
- 团队副本模板：`instances/_template/raid/`

---

## 3. 权威数据源与采集对齐
本模块所有数值门槛均通过自动化脚本提取自权威数据站点：
- **Warcraft Logs**：Zone 53（史诗团本）、Zone 55（大秘境官方日志库）。
- **Archon.gg**：大秘境地下城各层数平均通关耗时与分位秒伤。
- **大米网数据库与官方蓝贴**：国服客户端官方译名、地下城 ID、狂暴倒计时。
- **Raider.IO**：顶尖队伍限时路线、波次进度比例与词缀修正。

采集与校验命令：
```bash
# 校验全部副本攻略与版本时效
node automation/scripts/version-manager.mjs check
```
