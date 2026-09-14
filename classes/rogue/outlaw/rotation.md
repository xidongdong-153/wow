---
title: 狂徒潜行者实战手法与循环优先级
description: 核心资源循环机制、大秘境爆发时序流程图与易错自查
category: class-guide
docType: rotation
class: rogue
spec: outlaw
role: dps
damageProfile: burst-aoe
targetCapType: square-root
gameVersion: 12.1.0
season: Midnight Season 2
updatedAt: 2026-09-14
hotfixAligned: 12.1.0.61234-hotfix.0914.1
tags:
  - rogue
  - outlaw
  - rotation
  - aoe
  - 12.1
---

# 狂徒潜行者实战手法与循环优先级

## 1. 核心资源循环与机制

- **基础机制**：剑刃乱舞常驻顺劈，命运骨骰提供高额全能与连击点，冲动极速回能，欺诈者假动作千刀万剐。
- **资源防溢出原则**：核心资源（怒气/能量/精华/法力/连击点）严禁在满溢状态下继续打产能技能。
- **英雄天赋联动**：在开启主力爆发技能时，必须对齐欺诈者的核心触发窗口。

---

## 2. 大秘境实战流程图

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart TD
    A["起手开启剑刃乱舞 (激活顺劈)"] --> B["施放命运骨骰 (Roll the Bones)"]
    B --> C["开启冲动 (Adrenaline Rush)"]
    C --> D["影袭与手枪射击快速攒满连击点"]
    D --> E["打出斩击 (Dispatch) 触发千刀万剐"]
    E --> F{剑刃乱舞即将结束?}
    F -- 是 --> A
    F -- 否 --> D
```

### 实战阶段详解
1. **起手阶段**：挂上核心增益与弱化 Dot，开启主动爆发手牌与主动饰品。
2. **爆发阶段**：对齐大招与英雄天赋核心加成，倾泻所有核心产能与泄能连击。
3. **平稳收尾阶段**：合理保留资源迎接下一波小怪拉怪或 Boss 转阶段。

---

## 3. 新手易错自查清单

- [ ] **爆发手牌错位**：未将饰品与核心大招对齐施放，导致爆发期收益大打折扣。
- [ ] **核心资源溢出**：在高压或急速拉满期只顾狂按同一技能，导致关键能量持续浪费。
- [ ] **减伤打断遗忘**：沉迷打伤害而忽略本专精关键打断与硬控技能。
