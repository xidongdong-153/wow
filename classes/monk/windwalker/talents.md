---
title: 踏风武僧天赋配置
description: 天神御尊英雄天赋使用率对比、大秘境核心天赋与官方代码
category: class-guide
docType: talents
class: monk
spec: windwalker
role: dps
damageProfile: burst-aoe
targetCapType: square-root
gameVersion: 12.1.0
season: Midnight Season 1
updatedAt: 2026-09-14
hotfixAligned: 12.1.0.61234-hotfix.0914.1
tags:
  - monk
  - windwalker
  - talents
  - hero-talents
  - 12.1
---

# 踏风武僧天赋配置

数据来源于 Warcraft Logs 与 Archon 近期 91,834 份 +7 至 +21 层大秘境有效实战记录。

## 1. 英雄天赋对比（Hero Talents）

| 英雄天赋 | 大秘境使用率 | 大秘境均伤 (DPS) | 特点定位 |
| :--- | :--- | :--- | :--- |
| **天神御尊 (CONDUIT OF THE CELESTIALS)** | **50.7%** (主流配置) | **328.8K** | 大秘境高层与冲榜首选，伤害爆发与机制联动契合当前地下城节奏 |

### 核心机制解析

#### 1. 天神御尊（CONDUIT OF THE CELESTIALS）
- **使用率表现**：**50.7%**（绝对主流优选）。
- **核心机制**：天神御尊（Conduit of the Celestials）：分身期间召唤白虎雪怒与赤精天神下凡，怒雷破附带天神光波，多目标顺劈毁天灭地。
- **实战价值**：面对大秘境多目标合波时具备显著的资源回馈与数值放大能力，有效压缩高层处理时间。



---

## 2. 官方推荐构建（Recommended Build）

当前大秘境大数据统计下的主流限时优选组合：

| 评估指标 | 官方推荐统计值 |
| :--- | :--- |
| **首选英雄天赋** | **影踪派 (Shado-Pan)** |
| **构建综合使用率** | 34.8% |
| **验证最高限时** | **+18** |
| **样本量** | 91,834 |

### 暴雪官方天赋导入代码（一键复制）

在游戏内按 `N` 打开天赋面板，点击左下角【导入】，粘贴下方代码即可载入整套加点：

```text
C0QAAAAAAAAAAAAAAAAAAAAAAMzYAMGbzMz2MAAAAAAAAAAAALDzEmhhBMjhZmZGmNMDzyMBAsYmtZmxMzMDAgNAYWmlmZmZBgZgZGAYZMgBM
```

---

## 3. 精确天赋点数分配清单（71 点全量明细）

### 英雄天赋树（影踪派，投入 15 点）
| 层级/位置 | 天赋名称 (中文/英文) | 投入点数 | 节点类型与抉择 |
| :--- | :--- | :--- | :--- |
| 第 0 层 | **影踪派** (Shado-Pan) | `1/1` | 核心被动/主动 |
| 第 4 层 | **警戒戍望** (Vigilant Watch) | `1/1` | 核心被动/主动 |
| 第 3 层 | **钢铁漩涡** (Whirling Steel) | `1/1` | 分支二选一 (已选选项 1) |
| 第 2 层 | **武技精准** (Martial Precision) | `1/1` | 核心被动/主动 |
| 第 2 层 | **潘达利亚之豪** (Pride of Pandaria) | `1/1` | 分支二选一 (已选选项 1) |
| 第 1 层 | **疾风乱打** (Flurry Strikes) | `1/1` | 核心被动/主动 |
| 第 2 层 | **精兵之目** (Veteran's Eye) | `1/1` | 核心被动/主动 |
| 第 3 层 | **只身克众** (One Versus Many) | `1/1` | 核心被动/主动 |
| 第 4 层 | **高效演武** (Efficient Training) | `1/1` | 核心被动/主动 |
| 第 5 层 | **城壁之智** (Wisdom of the Wall) | `1/1` | 核心被动/主动 |
| 第 4 层 | **不惧万难** (Against All Odds) | `1/1` | 核心被动/主动 |
| 第 3 层 | **作战姿态** (Combat Stance) | `1/1` | 分支二选一 (已选选项 1) |
| 第 2 层 | **战场隐踪** (Shado Over the Battlefield) | `1/1` | 核心被动/主动 |
| 第 3 层 | **准备就绪** (Stand Ready) | `1/1` | 核心被动/主动 |
| 第 4 层 | **城壁兵械** (Weapons of the Wall) | `1/1` | 核心被动/主动 |

### 专精核心树（踏风，投入 34 点）
| 行数 | 天赋名称 (中文/英文) | 投入点数 | 节点特性 |
| :--- | :--- | :--- | :--- |
| 第 1 行 | **怒雷破** (Fists of Fury) | `1/1` | 标准节点 |
| 第 2 行 | **身法如风** (Sharp Reflexes) | `1/1` | 标准节点 |
| 第 2 行 | **疾拳之势** (Momentum Boost) | `1/1` | 标准节点 |
| 第 2 行 | **战斗贤才** (Combat Wisdom) | `1/1` | 标准节点 |
| 第 3 行 | **虎威** (Ferociousness) | `2/2` | 两点进阶强化 |
| 第 3 行 | **真气升腾** (Ascension) | `1/1` | 标准节点 |
| 第 4 行 | **旭日峥嵘** (Glory of the Dawn) | `1/1` | 标准节点 |
| 第 4 行 | **禅院教诲** (Teachings of the Monastery) | `1/1` | 标准节点 |
| 第 4 行 | **拳脚齐施** (Dual Threat) | `1/1` | 标准节点 |
| 第 5 行 | **乾元之巅** (Zenith) | `1/1` | 标准节点 |
| 第 5 行 | **东升之星** (Rising Star) | `1/1` | 标准节点 |
| 第 5 行 | **鹤舞龙卷** (Crane Vortex) | `1/1` | 标准节点 |
| 第 5 行 | **连击** (Hit Combo) | `1/1` | 标准节点 |
| 第 6 行 | **青玉破** (Jade Ignition) | `1/1` | 标准节点 |
| 第 6 行 | **灵魂专注** (Spiritual Focus) | `1/1` | 抉择分支 (选项 2) |
| 第 6 行 | **踏风连击** (Combo Breaker) | `1/1` | 标准节点 |
| 第 6 行 | **霹雳拳** (Crashing Fists) | `1/1` | 抉择分支 (选项 2) |
| 第 7 行 | **能量爆裂** (Energy Burst) | `1/1` | 标准节点 |
| 第 7 行 | **赤精之舞** (Dance of Chi-Ji) | `1/1` | 标准节点 |
| 第 7 行 | **平常心** (Inner Peace) | `1/1` | 标准节点 |
| 第 7 行 | **升龙霸** (Whirling Dragon Punch) | `1/1` | 抉择分支 (选项 2) |
| 第 8 行 | **川流不息** (Sequenced Strikes) | `1/1` | 标准节点 |
| 第 8 行 | **旋升劲风** (Revolving Whirl) | `1/1` | 抉择分支 (选项 1) |
| 第 8 行 | **禅院故思** (Memory of the Monastery) | `1/1` | 标准节点 |
| 第 8 行 | **阳炎螺旋** (Sunfire Spiral) | `1/1` | 标准节点 |
| 第 9 行 | **风之武器** (Weapon of Wind) | `1/1` | 标准节点 |
| 第 9 行 | **雪怒的战甲** (Xuen's Battlegear) | `1/1` | 标准节点 |
| 第 9 行 | **疾风呼啸踢** (Rushing Wind Kick) | `1/1` | 标准节点 |
| 第 10 行 | **尚武敏捷** (Martial Agility) | `1/1` | 标准节点 |
| 第 11 行 | **虎眼酒** (Tigereye Brew) | `1/4` | 两点进阶强化 |
| 第 11 行 | **虎眼酒** (Tigereye Brew) | `2/4` | 两点进阶强化 |
| 第 11 行 | **虎眼酒** (Tigereye Brew) | `1/4` | 两点进阶强化 |

### 职业通用树（武僧，投入 36 点）
| 行数 | 天赋名称 (中文/英文) | 投入点数 | 功能分类 |
| :--- | :--- | :--- | :--- |
| 第 1 行 | **分筋错骨** (Paralysis) | `1/1` | 主动自保/控制/位移 |
| 第 1 行 | **旭日东升踢** (Rising Sun Kick) | `1/1` | 主动自保/控制/位移 |
| 第 2 行 | **迅如猛虎** (Tiger's Lust) | `1/1` | 主动自保/控制/位移 |
| 第 2 行 | **无影步** (Fast Feet) | `1/1` | 主动自保/控制/位移 |
| 第 3 行 | **神鹤恩典** (Grace of the Crane) | `1/1` | 主动自保/控制/位移 |
| 第 3 行 | **清创生血** (Detox) | `1/1` | 主动自保/控制/位移 |
| 第 3 行 | **平心静气** (Calming Presence) | `1/1` | 主动自保/控制/位移 |
| 第 4 行 | **正中死穴** (Pressure Points) | `1/1` | 主动自保/控制/位移 |
| 第 4 行 | **踏玉步** (Jade Walk) | `1/1` | 主动自保/控制/位移 |
| 第 4 行 | **止戈古训** (Ancient Arts) | `2/2` | 属性与防御强化 |
| 第 4 行 | **活力苏醒** (Vivacious Vivification) | `1/1` | 主动自保/控制/位移 |
| 第 4 行 | **切喉手** (Spear Hand Strike) | `1/1` | 主动自保/控制/位移 |
| 第 5 行 | **猛虎之牙** (Tiger Fang) | `1/1` | 主动自保/控制/位移 |
| 第 5 行 | **魂体双分** (Transcendence) | `1/1` | 主动自保/控制/位移 |
| 第 5 行 | **动如脱兔** (Celerity) | `1/1` | 功能抉择 (选项 1) |
| 第 5 行 | **盘蛇静步** (Stillstep Coil) | `1/1` | 主动自保/控制/位移 |
| 第 6 行 | **平心之环** (Ring of Peace) | `1/1` | 功能抉择 (选项 1) |
| 第 6 行 | **强化轮回之触** (Improved Touch of Death) | `1/1` | 主动自保/控制/位移 |
| 第 6 行 | **雪怒之勇** (Ferocity of Xuen) | `2/2` | 属性与防御强化 |
| 第 6 行 | **猛虎扫尾** (Tiger Tail Sweep) | `1/1` | 主动自保/控制/位移 |
| 第 7 行 | **风之舞** (Dance of the Wind) | `1/1` | 主动自保/控制/位移 |
| 第 7 行 | **玉珑的优雅** (Yu'lon's Grace) | `1/1` | 主动自保/控制/位移 |
| 第 7 行 | **壮胆酒** (Fortifying Brew) | `1/1` | 主动自保/控制/位移 |
| 第 8 行 | **乾元镇踏** (Zenith Stomp) | `1/1` | 主动自保/控制/位移 |
| 第 8 行 | **迅疾豪胆** (Expeditious Fortification) | `1/1` | 功能抉择 (选项 2) |
| 第 8 行 | **散魔功** (Diffuse Magic) | `1/1` | 主动自保/控制/位移 |
| 第 8 行 | **灵魂之力** (Strength of Spirit) | `1/1` | 功能抉择 (选项 1) |
| 第 9 行 | **真气熟稔** (Chi Proficiency) | `2/2` | 属性与防御强化 |
| 第 9 行 | **以武立身** (Martial Instincts) | `2/2` | 属性与防御强化 |
| 第 10 行 | **身轻如羽** (Lighter Than Air) | `1/1` | 主动自保/控制/位移 |
| 第 10 行 | **真气流转** (Flow of Chi) | `1/1` | 主动自保/控制/位移 |
| 第 10 行 | **致命之触** (Fatal Touch) | `1/1` | 主动自保/控制/位移 |
