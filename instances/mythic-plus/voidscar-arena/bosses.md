---
title: "虚空之痕竞技场 (Voidscar Arena) 首领机制与击杀指南"
description: "虚空之痕竞技场全首领技能时间轴、引力黑洞处理与全屏暗影尖刺对齐"
category: dungeon
docType: bosses
dungeonSlug: "voidscar-arena"
dungeonNameCn: "虚空之痕竞技场"
zoneId: 55
keystoneId: 503
gameVersion: 12.1.0
season: Midnight Season 2
updatedAt: 2026-09-14
hotfixAligned: 12.1.0.61234-hotfix.0914.1
tags:
  - dungeon
  - bosses
  - voidscar-arena
  - mythic-plus
---

# 虚空之痕竞技场 (Voidscar Arena) 首领机制与击杀指南

## 1. 1 号首领：角斗坑冠军 (The Pit Champion)

### 机制流程图

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart LR
    Start[开场拉在边缘] --> ThrowAxe[飞斧点名后排 / 迅速位移]
    ThrowAxe --> CleaveTank["致死破甲重击 (坦克开硬减)"]
    CleaveTank --> EarthRift[震地裂隙 / 留下暗影死区]
    EarthRift --> MoveBoss[坦克沿场地外缘顺时针带位]
    MoveBoss --> ThrowAxe
```

### 核心机制应对
- **狂怒投掷 (Furious Throw)**：
  - 首领随机对最远距离队员投掷飞斧，落地后持续旋转造成大范围物理伤害。远程队员沿边缘站位，被点名后向前跑位带开飞斧。
- **震地裂隙 (Ground Rift)**：
  - 坦克必须紧贴外墙顺时针带位，留出中央开阔区域供远程走位。

---

## 2. 2 号首领：裂隙编织者卡伦 (Riftbinder Karen)

### 核心技能与引力处理
- **虚空引力场 (Void Gravity Well)**：
  - 场地中央召唤巨型黑洞，持续将全员向中心拉扯，越接近中心受到伤害越高。
  - **应对**：全员开启加速技能向外圈对抗拉力；骑士可交【自由祝福】免疫部分减速。
- **虚空畸体召唤 (Spawn Aberration)**：
  - 每次黑洞结束刷新 2 只虚空畸体，读条【虚空湮灭】。全队必须迅速转火或群晕，严禁漏断。

---

## 3. 3 号尾王：吞虚巨兽 (Void-Gorged Behemoth)

### 核心循环与斩杀时序

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart TD
    PhaseStart[接怪面向外墙] --> Breath[正面虚空吐息 / 坦克硬吃覆盖]
    Breath --> SwarmCast[全屏吞噬狂潮 / 持续 6 秒全团高压 AOE]
    SwarmCast --> TeamCD["全员交核心减伤: 吼血 + 圣光道标 + 大罩"]
    TeamCD --> VoidOrbs[全场发射移动虚空黑球]
    VoidOrbs --> DodgeOrbs[蛇形走位规避黑球]
    DodgeOrbs --> HeroismBurn[血量低于 30% / 开启嗜血全力斩杀]
```

- **正面虚空吐息 (Void Breath)**：
  - 绝对不可面向人群，坦克硬吃并覆盖主动大免伤。
- **吞噬狂潮 (Gorging Tide)**：
  - 史诗级高压 AOE，全团每秒受到 22 万暗影伤害。治疗必须交出核心爆发大招，DPS 开启个人减伤。
- **狂暴阶段斩杀**：
  - 30% 血量以下场面黑球极多，全队开嗜血站桩强压首领，在场地完全崩溃前将其斩杀。
