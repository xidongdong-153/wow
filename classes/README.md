# 魔兽世界全职业与专精知识库指南

本目录收录魔兽世界当前大版本（12.1.0.61234，至暗之夜 Midnight Season 1，热修对齐：12.1.0.61234-hotfix.0914.1）全部 13 个职业、39 个专精的官方天梯天赋构建、英雄天赋解析与核心点法。

数据基于 Warcraft Logs 与 Archon 近期海量高层大秘境有效实战记录提取。

---

## 维护体系划分

- **深度全文档主力维护（6 专精）**：死亡骑士（3 专精）、圣骑士（3 专精）。每个专精配备完整 5 篇核心手册（专精总览、天梯天赋与实景截图、配装与饰品、输出/减伤手法流程图、WCL 日志精读）。
- **标准天梯手册接入（33 专精）**：战士、猎人、潜行者、牧师、萨满祭司、法师、术士、武僧、德鲁伊、恶魔猎手、唤魔师。每个专精提供官方天梯高层主流天赋、英雄天赋使用率对比与 Wowhead 官方构建代码。

---

## 全职业目录索引

| 职业名称 | 英文标识 | 职责类型 | 专精数 | 涵盖专精与职责分布 |
| :--- | :--- | :--- | :---: | :--- |
| [死亡骑士](./death-knight/README.md) | `death-knight` | 坦克 / 输出 | 3 | [邪恶 (邪DK / 输出)](./death-knight/unholy/talents.md) · [冰霜 (冰DK / 输出)](./death-knight/frost/talents.md) · [鲜血 (血DK / 坦克)](./death-knight/blood/talents.md) |
| [圣骑士](./paladin/README.md) | `paladin` | 坦克 / 输出 / 治疗 | 3 | [惩戒 (惩戒骑 / 输出)](./paladin/retribution/talents.md) · [防护 (防骑 / 坦克)](./paladin/protection/talents.md) · [神圣 (奶骑 / 治疗)](./paladin/holy/talents.md) |
| [战士](./warrior/README.md) | `warrior` | 坦克 / 输出 | 3 | [武器 (武器战 / 输出)](./warrior/arms/talents.md) · [狂暴 (狂暴战 / 输出)](./warrior/fury/talents.md) · [防护 (防战 / 坦克)](./warrior/protection/talents.md) |
| [猎人](./hunter/README.md) | `hunter` | 输出 | 3 | [野兽控制 (兽王猎 / 输出)](./hunter/beast-mastery/talents.md) · [射击 (射击猎 / 输出)](./hunter/marksmanship/talents.md) · [生存 (生存猎 / 输出)](./hunter/survival/talents.md) |
| [潜行者](./rogue/README.md) | `rogue` | 输出 | 3 | [奇袭 (奇袭贼 / 输出)](./rogue/assassination/talents.md) · [狂徒 (狂徒贼 / 输出)](./rogue/outlaw/talents.md) · [敏锐 (敏锐贼 / 输出)](./rogue/subtlety/talents.md) |
| [牧师](./priest/README.md) | `priest` | 治疗 / 输出 | 3 | [暗影 (暗牧 / 输出)](./priest/shadow/talents.md) · [神圣 (神牧 / 治疗)](./priest/holy/talents.md) · [戒律 (戒律牧 / 治疗)](./priest/discipline/talents.md) |
| [萨满祭司](./shaman/README.md) | `shaman` | 治疗 / 输出 | 3 | [元素 (元素萨 / 输出)](./shaman/elemental/talents.md) · [增强 (增强萨 / 输出)](./shaman/enhancement/talents.md) · [恢复 (奶萨 / 治疗)](./shaman/restoration/talents.md) |
| [法师](./mage/README.md) | `mage` | 输出 | 3 | [奥术 (奥法 / 输出)](./mage/arcane/talents.md) · [火焰 (火法 / 输出)](./mage/fire/talents.md) · [冰霜 (冰法 / 输出)](./mage/frost/talents.md) |
| [术士](./warlock/README.md) | `warlock` | 输出 | 3 | [恶魔学识 (恶魔术 / 输出)](./warlock/demonology/talents.md) · [毁灭 (毁灭术 / 输出)](./warlock/destruction/talents.md) · [痛苦 (痛苦术 / 输出)](./warlock/affliction/talents.md) |
| [武僧](./monk/README.md) | `monk` | 坦克 / 输出 / 治疗 | 3 | [踏风 (踏风 / 输出)](./monk/windwalker/talents.md) · [酒仙 (酒仙 / 坦克)](./monk/brewmaster/talents.md) · [织雾 (织雾 / 治疗)](./monk/mistweaver/talents.md) |
| [德鲁伊](./druid/README.md) | `druid` | 坦克 / 输出 / 治疗 | 4 | [平衡 (鸟德 / 输出)](./druid/balance/talents.md) · [野性 (野德 / 输出)](./druid/feral/talents.md) · [守护 (熊德 / 坦克)](./druid/guardian/talents.md) · [恢复 (奶德 / 治疗)](./druid/restoration/talents.md) |
| [恶魔猎手](./demon-hunter/README.md) | `demon-hunter` | 坦克 / 输出 | 2 | [浩劫 (浩劫 / 输出)](./demon-hunter/havoc/talents.md) · [复仇 (复仇 / 坦克)](./demon-hunter/vengeance/talents.md) |
| [唤魔师](./evoker/README.md) | `evoker` | 治疗 / 输出 | 3 | [湮灭 (湮灭龙 / 输出)](./evoker/devastation/talents.md) · [增辉 (增辉龙 / 辅助输出)](./evoker/augmentation/talents.md) · [恩护 (奶龙 / 治疗)](./evoker/preservation/talents.md) |

---

## 39 专精英雄天赋与天梯实战数据速查

数据源自各专精天梯大秘境（+7 至 +22 层）实战统计。

| 职业 | 专精 | 职责 | 样本量 | 主流英雄天赋分支（使用率 / 表现） | 次选英雄天赋分支（使用率 / 表现） |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **死亡骑士** | [邪恶](./death-knight/unholy/talents.md) | 输出 | 105,632 | **萨莱茵**（57.7% / DPS 311.3K） | 天启骑士（42.2% / DPS 266.3K） |
| **死亡骑士** | [冰霜](./death-knight/frost/talents.md) | 输出 | 73,688 | **死亡使者**（98.2% / DPS 292.9K） | 天启骑士（1.7% / DPS 249.0K） |
| **死亡骑士** | [鲜血](./death-knight/blood/talents.md) | 坦克 | 478,288 | **萨莱茵**（90.0% / DPS 197.2K） | 死亡使者（9.9% / DPS 152.6K） |
| **圣骑士** | [惩戒](./paladin/retribution/talents.md) | 输出 | 310,614 | **太阳先锋**（82.5% / DPS 303.8K） | 圣殿骑士（17.4% / DPS 238.4K） |
| **圣骑士** | [防护](./paladin/protection/talents.md) | 坦克 | 279,438 | **铸光者**（79.4% / DPS 154.3K） | 圣殿骑士（20.5% / DPS 130.8K） |
| **圣骑士** | [神圣](./paladin/holy/talents.md) | 治疗 | 396,441 | **太阳先锋**（69.9% / HPS 165.5K） | 铸光者（30.0% / HPS 178.0K） |
| **战士** | [武器](./warrior/arms/talents.md) | 输出 | 385,524 | **屠戮者**（99.8% / DPS 303.2K） | 巨神（0.1% / DPS 243.8K） |
| **战士** | [狂暴](./warrior/fury/talents.md) | 输出 | 44,764 | **屠戮者**（74.7% / DPS 289.8K） | 山丘领主（25.2% / DPS 261.3K） |
| **战士** | [防护](./warrior/protection/talents.md) | 坦克 | 107,332 | **山丘领主**（96.5% / DPS 158.3K） | 巨神（3.4% / DPS 164.7K） |
| **猎人** | [野兽控制](./hunter/beast-mastery/talents.md) | 输出 | 337,019 | **兽群领袖**（99.0% / DPS 292.7K） | 黑暗游侠（0.9% / DPS 242.5K） |
| **猎人** | [射击](./hunter/marksmanship/talents.md) | 输出 | 42,641 | **哨兵**（97.3% / DPS 260.4K） | 黑暗游侠（2.6% / DPS 248.0K） |
| **猎人** | [生存](./hunter/survival/talents.md) | 输出 | 21,800 | **哨兵**（66.5% / DPS 268.1K） | 兽群领袖（33.4% / DPS 273.2K） |
| **潜行者** | [奇袭](./rogue/assassination/talents.md) | 输出 | 142,288 | **命运宿敌**（72.9% / DPS 319.2K） | 死亡行者（27.0% / DPS 296.1K） |
| **潜行者** | [狂徒](./rogue/outlaw/talents.md) | 输出 | 40,699 | **欺诈者**（99.6% / DPS 300.8K） | 命运宿敌（0.3% / DPS 209.3K） |
| **潜行者** | [敏锐](./rogue/subtlety/talents.md) | 输出 | 61,027 | **死亡行者**（90.0% / DPS 300.6K） | 欺诈者（9.9% / DPS 270.3K） |
| **牧师** | [暗影](./priest/shadow/talents.md) | 输出 | 89,331 | **执政官**（62.3% / DPS 266.8K） | 虚空编织者（37.6% / DPS 272.8K） |
| **牧师** | [神圣](./priest/holy/talents.md) | 治疗 | 220,617 | **神谕者**（95.8% / HPS 171.8K） | 执政官（4.1% / HPS 135.4K） |
| **牧师** | [戒律](./priest/discipline/talents.md) | 治疗 | 40,585 | **神谕者**（86.7% / HPS 149.5K） | 虚空编织者（13.2% / HPS 137.4K） |
| **萨满祭司** | [元素](./shaman/elemental/talents.md) | 输出 | 343,271 | **先知**（99.4% / DPS 319.7K） | 风暴使者（0.5% / DPS 203.9K） |
| **萨满祭司** | [增强](./shaman/enhancement/talents.md) | 输出 | 67,192 | **风暴使者**（98.8% / DPS 288.5K） | 图腾巨擘（1.1% / DPS 234.9K） |
| **萨满祭司** | [恢复](./shaman/restoration/talents.md) | 治疗 | 328,559 | **图腾巨擘**（97.7% / HPS 156.2K） | 先知（2.2% / HPS 133.1K） |
| **法师** | [奥术](./mage/arcane/talents.md) | 输出 | 625,771 | **日怒**（99.6% / DPS 311.8K） | 魔导士（0.3% / DPS 266.5K） |
| **法师** | [火焰](./mage/fire/talents.md) | 输出 | 10,383 | **日怒**（97.5% / DPS 288.1K） | 霜火（2.4% / DPS 230.2K） |
| **法师** | [冰霜](./mage/frost/talents.md) | 输出 | 27,272 | **魔导士**（75.5% / DPS 237.4K） | 霜火（24.4% / DPS 253.2K） |
| **术士** | [恶魔学识](./warlock/demonology/talents.md) | 输出 | 349,067 | **恶魔修习者**（99.8% / DPS 330.1K） | 灵魂收割者（0.1% / DPS 219.4K） |
| **术士** | [毁灭](./warlock/destruction/talents.md) | 输出 | 23,600 | **恶魔修习者**（83.4% / DPS 276.3K） | 唤魔者（16.5% / DPS 247.2K） |
| **术士** | [痛苦](./warlock/affliction/talents.md) | 输出 | 28,500 | **灵魂收割者**（91.5% / DPS 297.5K） | 唤魔者（8.4% / DPS 261.0K） |
| **武僧** | [踏风](./monk/windwalker/talents.md) | 输出 | 91,834 | **天神御尊**（50.7% / DPS 328.8K） | 影踪派（常规备选） |
| **武僧** | [酒仙](./monk/brewmaster/talents.md) | 坦克 | 75,911 | **祥和大师**（78.2% / DPS 150.8K） | 影踪派（常规备选） |
| **武僧** | [织雾](./monk/mistweaver/talents.md) | 治疗 | 93,720 | **天神御尊**（95.9% / HPS 162.8K） | 祥和大师（4.0% / HPS 151.7K） |
| **德鲁伊** | [平衡](./druid/balance/talents.md) | 输出 | 140,339 | **艾露恩之选**（98.8% / DPS 285.1K） | 丛林守护者（1.1% / DPS 227.6K） |
| **德鲁伊** | [野性](./druid/feral/talents.md) | 输出 | 51,046 | **利爪德鲁伊**（90.7% / DPS 312.7K） | 荒野追猎者（9.2% / DPS 264.0K） |
| **德鲁伊** | [守护](./druid/guardian/talents.md) | 坦克 | 188,216 | **艾露恩之选**（99.1% / DPS 154.1K） | 利爪德鲁伊（0.8% / DPS 129.4K） |
| **德鲁伊** | [恢复](./druid/restoration/talents.md) | 治疗 | 85,695 | **荒野追猎者**（89.3% / HPS 159.3K） | 丛林守护者（10.6% / HPS 144.0K） |
| **恶魔猎手** | [浩劫](./demon-hunter/havoc/talents.md) | 输出 | 109,739 | **奥达奇收割者**（主流配置 / DPS 261.2K） | 邪痕枭雄（常规备选） |
| **恶魔猎手** | [复仇](./demon-hunter/vengeance/talents.md) | 坦克 | 101,357 | **邪痕枭雄**（96.8% / DPS 157.7K） | 奥达奇收割者（3.1% / DPS 133.0K） |
| **唤魔师** | [湮灭](./evoker/devastation/talents.md) | 输出 | 49,316 | **鳞长**（98.2% / DPS 275.0K） | 塑焰者（1.7% / DPS 232.7K） |
| **唤魔师** | [增辉](./evoker/augmentation/talents.md) | 输出 | 11,336 | **鳞长**（51.2% / DPS 212.2K） | 时空守卫（48.7% / DPS 227.7K） |
| **唤魔师** | [恩护](./evoker/preservation/talents.md) | 治疗 | 66,016 | **塑焰者**（95.7% / HPS 159.5K） | 时空守卫（4.2% / HPS 144.1K） |
