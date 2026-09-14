---
title: "晨曦尖塔 (The Dawnspire) 首领机制与击杀指南"
description: "晨曦尖塔全首领机制时间轴、晨曦激光跑位与审判天平印记对撞时序"
category: dungeon
docType: bosses
dungeonSlug: "the-dawnspire"
dungeonNameCn: "晨曦尖塔"
zoneId: 55
keystoneId: 506
gameVersion: 12.1.0
season: Midnight Season 2
updatedAt: 2026-09-14
hotfixAligned: 12.1.0.61234-hotfix.0914.1
tags:
  - dungeon
  - bosses
  - the-dawnspire
  - mythic-plus
---

# 晨曦尖塔 (The Dawnspire) 首领机制与击杀指南

## 1. 1 号首领：日曜守卫索伦 (Solar Guardian Solenn)

### 机制流程图

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart LR
    Start[接怪面向内墙] --> FlareCast[烈阳火柱点名 / 外散排火]
    FlareCast --> TankSmash["灼热重击: 坦克死刑神圣直伤"]
    TankSmash --> TankCD[坦克开主动魔免大减伤]
    TankCD --> ChargeAOE["能量100: 日光充能全屏高压 AOE"]
    ChargeAOE --> TeamHeal[治疗交爆发群抬技能]
    TeamHeal --> FlareCast
```

- **日光充能 (Solar Overcharge)**：首领能量满 100 引导全场神圣风暴，持续 8 秒全团大掉血。全员开启个人减伤，治疗交核心群抬。
- **灼热重击 (Searing Slam)**：坦克神圣死刑，必须开启【远古列王守卫】或【绿罩+灵界打击】。

---

## 2. 2 号首领：烈阳执政官 (Archon of the Sun)

### 核心机制与旋转激光走位
- **晨曦射线 (Dawnlight Ray)**：
  - 首领跃至场地中央，射出 4 道连通边缘的高能光束，并沿顺时针匀速旋转。
  - **应对**：全员跟随旋转方向贴近内圈蛇形小步走位，严禁贪刀跨越光束（触碰即造成 200 万秒杀神圣伤害）。
- **纯净护盾 (Purifying Ward)**：
  - 激光阶段结束首领获得吸收盾，全队集火击破。

---

## 3. 3 号尾王：高阶裁决者奥蕾莉亚 (High Arbiter Aurelia)

### 审判天平印记与破狂暴时序

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart TD
    PhaseStart[开场站位展开] --> MarkCast["审判天平: 点名日光与月影双印记"]
    MarkCast --> Collision[两人迅速向中间聚拢对撞消除]
    Collision --> SwordMatrix["裁决之剑: 全屏矩阵落剑"]
    SwordMatrix --> SafeSpot[寻找地面无剑安全格站位]
    SafeSpot --> HolyNova[全屏神圣震荡]
    HolyNova --> FinalBurn[首领血量低于 30% / 开启嗜血全力斩杀]
```

- **审判天平 (Scales of Judgment)**：
  - 随机点名 2 名队员：1 名获得【日曜印记】，1 名获得【月影印记】。倒计时 6 秒内两人必须在场中相互碰撞触发抵消，若未碰撞则倒计时结束引发全团秒杀。
- **裁决之剑矩阵 (Sword of Judgment Matrix)**：
  - 场上划分棋盘格，大剑自天顶连续轰炸，全队必须看清发光安全区迅速位移。
- **斩杀阶段**：
  - 30% 血量以下落剑频次加倍，全队开第二轮嗜血斩杀。
