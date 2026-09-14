---
title: 团队副本总览与史诗攻坚体系 (Midnight Season 1)
description: 当前赛季团队副本烈毒之渊 (The Venomous Abyss) 分区架构、全通门槛与进本配置
category: raid
docType: overview
gameVersion: 12.1.0
season: Midnight Season 1
updatedAt: 2026-09-14
hotfixAligned: 12.1.0.61234-hotfix.0914.1
tags:
  - raid
  - overview
  - 12.1
---

# 团队副本总览与史诗攻坚体系 (Midnight Season 1)

## 1. 团本基础概况

当前基准版本主要团队副本为 **烈毒之渊 (The Venomous Abyss)**，WCL Zone ID 为 `53`。共设 6 位首领，战斗环境以高频全团穿透法术尖刺、流血撕裂与多阶段场地压缩为核心特征。

- **史诗模式人数**：固定 20 人（标准开荒配置：2 坦克 + 4 治疗 + 14 输出；伐木期部分首领压缩为 3 治疗）。
- **通关总装等门槛**：全团平均装等建议达到 630+，武器与核心饰品需达到英雄升级上限。
- **狂暴与极限时序**：后置首领（5 号、尾王）要求全团人均输出突破 230k - 240k DPS，任何早期减员将直接导致狂暴灭团。

---

## 2. 首领结构与击杀难度梯度

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart LR
    B1["1号: 腐蚀之牙 掠夺者<br/>入门检验 / 狂暴 7:00"] --> B2["2号: 孵化女王 维克希拉<br/>多目标转火 / 狂暴 7:30"]
    B2 --> B3["3号: 受折磨的聚合体<br/>团队大减伤链 / 狂暴 8:00"]
    B3 --> B4["4号: 缚影者 马拉考尔<br/>场地跑位与驱散 / 狂暴 8:30"]
    B4 --> B5["5号: 高阶祭司 斯里克希尔<br/>高压尖刺与狂暴 9:00"]
    B5 --> B6["6号尾王: 亵渎者 乌拉特克<br/>终极门槛 / 狂暴 10:00"]
```

---

## 3. 首领攻略目录直达

- **团队副本总览**：`instances/raid/the-venomous-abyss/README.md`
- **史诗全首领狂暴线与秒伤门槛横评**：`instances/raid/the-venomous-abyss/benchmarks.md`
- **1 号首领：腐蚀之牙 掠夺者**：`instances/raid/the-venomous-abyss/bosses/01-acidfang.md`
- **2 号首领：孵化女王 维克希拉**：`instances/raid/the-venomous-abyss/bosses/02-vexira.md`
- **3 号首领：受折磨的聚合体**：`instances/raid/the-venomous-abyss/bosses/03-tormented-amalgam.md`
- **4 号首领：缚影者 马拉考尔**：`instances/raid/the-venomous-abyss/bosses/04-malakor.md`
- **5 号首领：高阶祭司 斯里克希尔**：`instances/raid/the-venomous-abyss/bosses/05-srikthir.md`
- **6 号尾王：亵渎者 乌拉特克**：`instances/raid/the-venomous-abyss/bosses/06-ulatek.md`
