---
title: "毒牙祭坛 (Altar of Fangs) WCL 实战限时基准与数据门槛"
description: "基于 WCL 与 Archon 近期全通样本的毒牙祭坛限时耗时、队伍秒伤与承伤峰值"
category: dungeon
docType: benchmarks
dungeonSlug: "altar-of-fangs"
dungeonNameCn: "毒牙祭坛"
zoneId: 55
keystoneId: 504
gameVersion: 12.1.0
season: Midnight Season 2
updatedAt: 2026-09-14
hotfixAligned: 12.1.0.61234-hotfix.0914.1
tags:
  - dungeon
  - benchmarks
  - wcl
  - archon
---

# 毒牙祭坛 (Altar of Fangs) WCL 实战限时基准与数据门槛

数据来源：Warcraft Logs (Zone 55) 与 Archon 官方大数据，统计当季限时样本 36,800 份。
基准限时：35:00（2100 秒）。

## 1. 官方限时分位与吞吐量基准表

| 钥石层数 | 50th 限时耗时 | 95th 极限耗时 | 队伍总 DPS 门槛 | 坦克 DPS 均值 | 治疗 DPS 均值 | DPS 均秒伤 | 团队全程 DTPS | 尖峰波次 DTPS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **+10 (及格线)** | 30:40 | 26:15 | 740k | 108k | 27k | 201k | 215k | 510k |
| **+15 (低保线)** | 32:40 | 27:50 | 900k | 132k | 31k | 245k | 270k | 670k |
| **+18 (传送门)** | 33:40 | 28:40 | 1010k | 148k | 35k | 275k | 315k | 810k |
| **+20 (冲分线)** | 34:25 | 29:20 | 1100k | 162k | 39k | 299k | 360k | 940k |
| **+22 (极限突破)**| 34:45 | 29:50 | 1200k | 178k | 44k | 326k | 405k | 1090k |

---

## 2. 死亡日志统计前三大致死伤害源

1. **血祭连线未挡 (Unblocked Blood Siphon)**：占尾王战团灭的 41.2%。队员未替残血队友挡线，导致点名队员被吸死且首领回血狂暴。
2. **麻痹毒素瘫痪倒坦 (Paralytic Venom Paralysis)**：占小怪阶段的 28.5%。坦克身上 5 层毒素未驱散，定身受重击猝死。
3. **剧毒新星全团穿透 (Toxic Nova Burst)**：占 1 号灭团的 19.3%。

---

## 3. 世界顶尖通关配置复盘

- **实战案例**：Bigsnoot (Mal'Ganis - US) —— 毒牙祭坛 +19 限时（27分44秒）。
- **阵容搭配**：邪恶死亡骑士 + 惩戒圣骑士 + 武器战士 + 防护圣骑士 + 神圣圣骑士。
- **关键动作**：
  - 双圣骑阵容轮流施放清毒术，整场麻痹毒素平均层数未超过 1.5 层。
  - 尾王血月狂乱阶段，邪DK天启大军与惩戒骑征伐爆发齐开，在 38 秒内将首领 40% 血量强行融化。
