---
title: "毒牙祭坛 (Altar of Fangs) 首领机制与击杀指南"
description: "毒牙祭坛全首领机制时间轴、血祭连线分摊与血月狂乱斩杀时序"
category: dungeon
docType: bosses
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
  - bosses
  - altar-of-fangs
  - mythic-plus
---

# 毒牙祭坛 (Altar of Fangs) 首领机制与击杀指南

## 1. 1 号首领：剧毒女祭司苏拉 (Venom Priestess Sula)

### 机制时序图

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart LR
    Start[起手爆发] --> TotemSpawn[剧毒图腾刷新 / 远程单点秒杀]
    TotemSpawn --> NovaCast[剧毒新星读条 / 必须打断]
    NovaCast --> PoisonSpit[毒液喷吐点名 / 全员外散]
    PoisonSpit --> TotemSpawn
```

- **剧毒图腾 (Poison Ward)**：每 30 秒刷新 2 根图腾，持续对全团施加可叠加剧毒 Dot。远程必须第一时间秒点图腾。
- **剧毒新星 (Toxic Nova)**：首领 3 秒大读条，全团 60% 自然伤害。近战必须预留打断。

---

## 2. 2 号首领：暴食巨口戈尔莫 (Goremaw the Ravenous)

### 核心技能与胃酸规避
- **反刍胃酸 (Acid Regurgitation)**：
  - 首领对前方 90 度扇形喷射大量胃酸，落地形成永久绿水。坦克必须将首领拉在场地一角，面向外墙，逐步向外挪动。
- **暴食撕咬 (Gorging Bite)**：
  - 坦克死刑技能，造成极高物理穿刺伤害并附加 100% 易伤，持续 12 秒。坦克必须覆盖核心硬减伤（如炽热防御者、符文韧性）。

---

## 3. 3 号尾王：大先知祖尔卡兹 (High Prophet Zul'Kazz)

### 核心机制与血月斩杀时序

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart TD
    PhaseStart[开场站位] --> SiphonBeam[血祭连线点名 / 队员轮流挡线]
    SiphonBeam --> ShadowVolley[暗影箭雨 / 团队大减伤覆盖]
    ShadowVolley --> BloodMoon{血量降至 40%}
    BloodMoon --> EnragePhase["血月狂乱阶段: 全团每秒高压 AOE"]
    EnragePhase --> HeroismExecution[开第二轮嗜血 + 爆发药水斩杀]
```

- **暗影血祭连线 (Blood Siphon Beam)**：
  - 首领连线 1 名队员引导暗影吸血。未挡线时每秒回复首领 3% 生命值。必须由副坦克或开减伤的近战队员站在中间截断连线（挡线者每秒承受 15 万暗影伤害）。
- **血月狂乱 (Blood Moon Frenzy)**：
  - 首领 40% 血量以下狂暴，伤害提高 50%，全屏每 3 秒施放一次暗影波。全员必须在此阶段交出嗜血与全自保技能，全力斩杀本体。
