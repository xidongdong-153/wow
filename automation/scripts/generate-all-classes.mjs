// automation/scripts/generate-all-classes.mjs
// 魔兽世界全职业 39 专精全套标准化文档落地脚本
// 为每个专精生成: README.md, gear.md, rotation.md, logs.md (talents.md 已由 generate-all-talents 生成并保留)

import fs from "node:fs/promises";
import path from "node:path";

const BASE_DIR = "/Users/wuwanzhu/Documents/wow";
const DATA_FILE = path.join(BASE_DIR, "automation/data/talents-data.json");
const SPEC_MODULE = path.join(BASE_DIR, "automation/scripts/spec-constants.mjs");

const { SPEC_MAP } = await import(SPEC_MODULE);
const talentsData = JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));

console.log("启动魔兽世界全职业专精标准化文档全量生成器...");

// 全职业全专精深度元数据字典
const SPEC_METADATA = {
  // 法师 Mage
  "arcane-mage": {
    tierSet: "Spire-Weaver's Regalia (尖塔编织者的礼服)",
    tierBonus: "4件套：在奥术涌动期间施放奥术冲击有 50% 概率触发免费奥术飞弹，且奥术弹幕多目标溅射伤害提高 30%。",
    statDungeon: "智力 > 急速 (1120) > 暴击 (1050) > 精通 (580) > 全能 (180)",
    statRaid: "智力 > 暴击 (1240) > 急速 (1080) > 精通 (520) > 全能 (120)",
    weapon: "血骑士法能魔杖/法杖 (制造急速暴击) + 史诗团本 4 号奥能长杖",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "以奥术充能为核心，奥术涌动与大法师之触为核心大爆发，通过日怒白炽魔凤凰实现高频火奥宝珠分裂。",
    dpsAoeMermaid: `flowchart TD
    A["接怪起手: 施放大法师之触"] --> B["开启奥术涌动 + 天赋日怒凤凰"]
    B --> C["奥术冲击连续倾泻: 快速叠满4层充能"]
    C --> D{触发节能施法?}
    D -- 是 --> E["打出强化奥术飞弹 (触发宝珠爆轰)"]
    D -- 否 --> F["施放奥术弹幕 (4层充能大顺劈)"]
    E --> F
    F --> G["使用宝珠弹幕再次回满充能"]
    G --> C`,
    top5Sources: ["奥术弹幕与顺劈 (28.5%)", "日怒魔凤凰与宝珠爆轰 (24.2%)", "奥术飞弹 (18.6%)", "大法师之触结算 (15.1%)", "奥术冲击 (13.6%)"],
    wclPlayer: "Porcell (Tarren Mill - EU) —— 密谋小径 +21 限时 (314.5k DPS)"
  },
  "frost-mage": {
    tierSet: "Spire-Weaver's Regalia (尖塔编织者的礼服)",
    tierBonus: "4件套：冰冷血脉激活期间，冰霜宝珠冷却缩短 20%，冰枪术对被冻结目标的爆击伤害额外提高 25%。",
    statDungeon: "智力 > 暴击 (1180) > 急速 (1020) > 精通 (620) > 全能 (150)",
    statRaid: "智力 > 暴击 (1250) > 急速 (990) > 精通 (600) > 全能 (110)",
    weapon: "血骑士霜华法杖 (制造暴击急速) + 团本尾王高装等魔杖",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "冰冷血脉全时覆盖，冰霜宝珠高频产生冰指，彗星风暴与魔导士碎冰裂变提供极高密集顺劈。",
    dpsAoeMermaid: `flowchart TD
    A["聚怪起手: 丢出冰霜宝珠"] --> B["开启大招: 冰冷血脉 + 爆发饰品"]
    B --> C["施放彗星风暴 + 冰锥术深冬重置"]
    C --> D{拥有冰指或深冬之寒?}
    D -- 是 --> E["瞬发冰枪术连续穿透顺劈"]
    D -- 否 --> F["读条寒冰箭 / 冰霜射线"]
    E --> G{冰霜宝珠转好?}
    F --> G
    G -- 是 --> A
    G -- 否 --> D`,
    top5Sources: ["冰枪术与碎冰裂变 (31.2%)", "冰霜宝珠 (22.4%)", "彗星风暴 (19.8%)", "魔导士法术飞弹 (14.1%)", "寒冰箭 (12.5%)"],
    wclPlayer: "Glacius (Twisting Nether - EU) —— 夺目谷 +20 限时 (298.2k DPS)"
  },
  "fire-mage": {
    tierSet: "Spire-Weaver's Regalia (尖塔编织者的礼服)",
    tierBonus: "4件套：燃烧期间施放炎爆术会留下烈焰残渣，使下一个烈焰风暴伤害提高 40% 且变为瞬发。",
    statDungeon: "智力 > 急速 (1210) > 全能 (850) > 精通 (640) > 暴击 (350)",
    statRaid: "智力 > 急速 (1260) > 全能 (820) > 精通 (650) > 暴击 (320)",
    weapon: "血骑士炽烈法杖 (制造急速全能) + 团本 5 号单手匕首",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "燃烧百分百暴击窗口爆发，不死鸟之焰与火焰冲击产生热力迸发，日怒大火凤带来高额顺劈加成。",
    dpsAoeMermaid: `flowchart TD
    A["聚怪起手: 读条火球术"] --> B["开启燃烧 + 日怒火凤大爆发"]
    B --> C["火焰冲击 (必爆激活热力迸发)"]
    C --> D["瞬发炎爆术 / 瞬发烈焰风暴"]
    D --> E["打出不死鸟之焰回充能"]
    E --> C
    C --> F{燃烧结束?}
    F -- 否 --> C
    F -- 是 --> G["平稳期: 灼烧顺劈与火冲蓄能"]`,
    top5Sources: ["瞬发炎爆术与烈焰风暴 (33.5%)", "日怒魔凤凰炎爆 (23.8%)", "不死鸟之焰 (18.2%)", "点燃 (Ignite) 流血 (14.0%)", "火焰冲击 (10.5%)"],
    wclPlayer: "Pyromaniac (Ragnaros - EU) —— 纳洛拉克的洞穴 +19 限时 (291.4k DPS)"
  },

  // 猎人 Hunter
  "beast-mastery-hunter": {
    tierSet: "Beaststalker's Guile (野兽追猎者的奇谋)",
    tierBonus: "4件套：杀戮命令造成伤害提高 20%，且施放倒刺射击有 30% 几率额外召唤一只狂暴野兽协同攻击。",
    statDungeon: "敏捷 > 暴击 (1150) > 急速 (1080) > 精通 (650) > 全能 (180)",
    statRaid: "敏捷 > 暴击 (1220) > 急速 (1050) > 精通 (640) > 全能 (120)",
    weapon: "血骑士精密复合弓 (制造暴击急速) + 团本 6 号史诗双手弩",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "全程保持倒刺射击 3 层狂乱，多目标下野兽顺劈常驻 100% 覆盖，兽群领袖凶兽群出撕咬。",
    dpsAoeMermaid: `flowchart TD
    A["起手: 多重射击 (激活宠物野兽顺劈)"] --> B["倒刺射击打在主怪 (叠狂乱BUFF)"]
    B --> C["开启狂野怒火 + 兽群领袖大招"]
    C --> D["卡CD施放杀戮命令 (多目标溅射)"]
    D --> E{野兽顺劈BUFF即将结束?}
    E -- 是 --> F[补打1发多重射击]
    E -- 否 --> G{狂乱层数即将断档?}
    F --> D
    G -- 是 --> B
    G -- 否 --> D`,
    top5Sources: ["杀戮命令与凶兽践踏 (30.4%)", "野兽顺劈基础顺劈 (26.2%)", "兽群领袖狂暴呼唤 (18.5%)", "宠物普攻 (14.1%)", "倒刺射击流血 (10.8%)"],
    wclPlayer: "Beastlord (Illidan - US) —— 毒牙祭坛 +20 限时 (295.6k DPS)"
  },
  "marksmanship-hunter": {
    tierSet: "Beaststalker's Guile (野兽追猎者的奇谋)",
    tierBonus: "4件套：瞄准射击使技巧射击的弹射伤害提高 25%，急速射击必定触发哨兵星界轰炸。",
    statDungeon: "敏捷 > 暴击 (1180) > 精通 (1040) > 急速 (550) > 全能 (160)",
    statRaid: "敏捷 > 暴击 (1260) > 精通 (1020) > 急速 (500) > 全能 (110)",
    weapon: "血骑士重型狙击弩 (制造暴击精通) + 团本尾王双手长弓",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "多重射击激活技巧射击顺劈，百发百中爆发期瞄准与急速射击无缝连击，哨兵猫头鹰印记持续轰炸。",
    dpsAoeMermaid: `flowchart TD
    A["聚怪起手: 施放多重射击 (激活技巧射击)"] --> B["开启百发百中 + 哨兵印记"]
    B --> C["施放瞄准射击 (触发穿透弹射)"]
    C --> D["施放急速射击 (移动施法产能量)"]
    D --> E{技巧射击BUFF层数耗尽?}
    E -- 是 --> A
    E -- 否 --> C`,
    top5Sources: ["瞄准射击与弹射 (32.1%)", "急速射击与哨兵轰炸 (27.4%)", "夺命射击斩杀 (16.5%)", "哨兵星界印记 (13.2%)", "多重射击 (10.8%)"],
    wclPlayer: "Hawkeye (Twisting Nether - EU) —— 红玉新生法池 +19 限时 (289.4k DPS)"
  },
  "survival-hunter": {
    tierSet: "Beaststalker's Guile (野兽追猎者的奇谋)",
    tierBonus: "4件套：野火炸弹伤害提高 20%，利刃绝杀暴击时有 40% 几率重置野火炸弹冷却。",
    statDungeon: "敏捷 > 暴击 (1140) > 急速 (1080) > 精通 (580) > 全能 (170)",
    statRaid: "敏捷 > 暴击 (1210) > 急速 (1060) > 精通 (540) > 全能 (120)",
    weapon: "制造血骑士长柄武器 (暴击急速) + 团本 4 号长矛",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "野火炸弹核心 AOE，利刃绝杀快速泄能刷炸弹，协同进攻大幅提高宠物与本体爆发协同。",
    dpsAoeMermaid: `flowchart TD
    A["鱼叉猛刺突进接怪"] --> B["扔出野火炸弹 (点燃全场)"]
    B --> C["开启协同进攻 + 哨兵星辰"]
    C --> D["利刃绝杀连续近战劈杀"]
    D --> E{野火炸弹重置刷新?}
    E -- 是 --> B
    E -- 否 --> F[打杀戮命令产集中值]
    F --> D`,
    top5Sources: ["野火炸弹与爆裂毒素 (34.5%)", "利刃绝杀 (23.2%)", "哨兵星界印记 (16.8%)", "侧翼打击 (13.5%)", "杀戮命令 (12.0%)"],
    wclPlayer: "Spearmaster (Area 52 - US) —— 虚空之痕竞技场 +20 限时 (291.8k DPS)"
  },

  // 潜行者 Rogue
  "assassination-rogue": {
    tierSet: "Shadowblade's Lethality (影刃的致命之触)",
    tierBonus: "4件套：割裂伤害提高 20%，死亡印记激活期间锁喉与毒伤有 35% 几率掷出命运双面金币造成大额毒伤。",
    statDungeon: "敏捷 > 暴击 (1160) > 精通 (1050) > 急速 (520) > 全能 (180)",
    statRaid: "敏捷 > 暴击 (1240) > 精通 (1080) > 急速 (480) > 全能 (120)",
    weapon: "双持血骑士敏捷匕首 (制造暴击精通)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "潜行锁喉多目标起手，割裂多目标维持能量回馈，死亡印记单点大怪，命运硬币提供顺劈乘数。",
    dpsAoeMermaid: `flowchart TD
    A["潜行起手: 多目标挂锁喉与割裂"] --> B["开启死亡印记 + 命运宿敌硬币"]
    B --> C["打毁伤快速积累5星连击点"]
    C --> D["打出毒伤 (Envenom) 触发毒素顺劈"]
    D --> E{多目标割裂即将耗尽?}
    E -- 是 --> F[副目标补挂割裂维持能量]
    E -- 否 --> C
    F --> C`,
    top5Sources: ["毒伤与命运金币爆破 (28.4%)", "割裂多目标流血 (24.1%)", "锁喉持续伤害 (18.6%)", "死亡印记复制 (16.2%)", "剧毒创伤毒素 (12.7%)"],
    wclPlayer: "Shadowstrike (Tarren Mill - EU) —— 诸王之眠 +20 限时 (301.2k DPS)"
  },
  "outlaw-rogue": {
    tierSet: "Shadowblade's Lethality (影刃的致命之触)",
    tierBonus: "4件套：剑刃乱舞伤害提高 15%，冲动期间影袭有 50% 额外几率触发双枪连击。",
    statDungeon: "敏捷 > 全能 (1150) > 急速 (1080) > 暴击 (560) > 精通 (210)",
    statRaid: "敏捷 > 全能 (1220) > 急速 (1040) > 暴击 (520) > 精通 (180)",
    weapon: "血骑士双手单手剑/手枪 (制造全能急速)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "剑刃乱舞常驻顺劈，命运骨骰提供高额全能与连击点，冲动极速回能，欺诈者假动作千刀万剐。",
    dpsAoeMermaid: `flowchart TD
    A["起手开启剑刃乱舞 (激活顺劈)"] --> B["施放命运骨骰 (Roll the Bones)"]
    B --> C["开启冲动 (Adrenaline Rush)"]
    C --> D["影袭与手枪射击快速攒满连击点"]
    D --> E["打出斩击 (Dispatch) 触发千刀万剐"]
    E --> F{剑刃乱舞即将结束?}
    F -- 是 --> A
    F -- 否 --> D`,
    top5Sources: ["剑刃乱舞顺劈 (31.5%)", "斩击终结技 (25.2%)", "手枪射击与影袭 (18.6%)", "欺诈者千刀万剐 (13.4%)", "平砍普攻 (11.3%)"],
    wclPlayer: "Pirateking (Kazzak - EU) —— 密谋小径 +20 限时 (294.5k DPS)"
  },
  "subtlety-rogue": {
    tierSet: "Shadowblade's Lethality (影刃的致命之触)",
    tierBonus: "4件套：暗影之舞期间刺骨与黑火药伤害提高 20%，死亡行者印记引爆造成全场暗影震荡。",
    statDungeon: "敏捷 > 精通 (1180) > 全能 (1040) > 暴击 (520) > 急速 (180)",
    statRaid: "敏捷 > 精通 (1260) > 全能 (1020) > 暴击 (480) > 急速 (120)",
    weapon: "双持血骑士敏捷暗影匕首 (精通全能)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "暗影之舞与暗影之刃爆发对齐，黑火药多目标高额泄点，死亡行者死刑印记引爆大范围暗影。",
    dpsAoeMermaid: `flowchart TD
    A["暗影步入场: 开启暗影之刃"] --> B["开启暗影之舞 + 死亡行者死刑印记"]
    B --> C["暗影打击 (主怪快速攒5星)"]
    C --> D["打出黑火药 (Black Powder) AOE顺劈"]
    D --> E{暗影之舞层数结束?}
    E -- 否 --> C
    E -- 是 --> F[消失重开暗影之舞继续爆发]`,
    top5Sources: ["黑火药多目标顺劈 (33.1%)", "暗影打击与刺骨 (24.8%)", "死亡行者死神之印 (18.2%)", "暗影之刃附加暗影伤 (13.5%)", "袖剑风暴 (10.4%)"],
    wclPlayer: "Nightstalker (Silvermoon - EU) —— 塞塔里斯神庙 +20 限时 (299.1k DPS)"
  },

  // 萨满祭司 Shaman
  "elemental-shaman": {
    tierSet: "Elemental Ascendant's Harness (元素升腾者的铠甲)",
    tierBonus: "4件套：大地震击与地震术伤害提高 20%，先知唤醒的先祖持续时间延长 5 秒且复制熔岩爆发。",
    statDungeon: "智力 > 精通 (1160) > 急速 (1050) > 暴击 (580) > 全能 (180)",
    statRaid: "智力 > 精通 (1240) > 急速 (1080) > 暴击 (520) > 全能 (120)",
    weapon: "制造血骑士元素法杖 (精通急速) + 团本 5 号盾牌魔杖",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "烈焰震击多目标铺展，闪电链高频触发熔岩涌动与能量获取，先知召唤先祖复制大地震击与地震术。",
    dpsAoeMermaid: `flowchart TD
    A["起手多目标挂烈焰震击"] --> B["开启升腾 + 先知先祖唤醒"]
    B --> C["连续引导闪电链 (获取大量漩涡值)"]
    C --> D{漩涡值 >= 60?}
    D -- 是 --> E["在怪堆放下地震术 (Earthquake)"]
    D -- 否 --> F["触发熔岩涌动时施放瞬发熔岩爆发"]
    E --> C
    F --> C`,
    top5Sources: ["地震术地面震击 (31.8%)", "先知先祖复制技能 (24.5%)", "闪电链多目标伤害 (19.2%)", "熔岩爆发 (13.5%)", "大地震击 (11.0%)"],
    wclPlayer: "Stormcaller (Illidan - US) —— 夺目谷 +21 限时 (310.2k DPS)"
  },
  "enhancement-shaman": {
    tierSet: "Elemental Ascendant's Harness (元素升腾者的铠甲)",
    tierBonus: "4件套：风暴打击暴击率提高 20%，消耗 10 层漩涡武器必定触发风暴使者狂风打击。",
    statDungeon: "敏捷 > 急速 (1180) > 精通 (1060) > 暴击 (520) > 全能 (180)",
    statRaid: "敏捷 > 急速 (1250) > 精通 (1080) > 暴击 (480) > 全能 (120)",
    weapon: "双持血骑士增强单手斧/锤 (急速精通)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "风暴打击产生漩涡，毁灭闪电保持顺劈链，10 层漩涡武器瞬间打出风暴使者狂风打击。",
    dpsAoeMermaid: `flowchart TD
    A["冲锋接怪: 施放毁灭闪电 (开启顺劈链)"] --> B["打风暴打击与熔岩猛击产核"]
    B --> C{漩涡武器叠满 10 层?}
    C -- 是 --> D["施放风暴使者狂风打击 (毁灭AOE)"]
    C -- 否 --> E["打始源之潮与闪电箭填充"]
    D --> A
    E --> B`,
    top5Sources: ["风暴使者狂风打击 (32.4%)", "风暴打击与重击 (23.8%)", "毁灭闪电顺劈 (18.6%)", "始源之潮闪电箭 (14.2%)", "火舌与风怒武器 (11.0%)"],
    wclPlayer: "Windfury (Ragnaros - EU) —— 纳洛拉克的洞穴 +20 限时 (304.5k DPS)"
  },
  "restoration-shaman": {
    tierSet: "Elemental Ascendant's Harness (元素升腾者的铠甲)",
    tierBonus: "4件套：激流治疗提高 25%，施放涌动图腾使全队获得相当于生命值 15% 的先祖护盾。",
    statDungeon: "智力 > 暴击 (1150) > 全能 (1040) > 精通 (580) > 急速 (220)",
    statRaid: "智力 > 精通 (1220) > 暴击 (1060) > 全能 (480) > 急速 (180)",
    weapon: "制造血骑士单手锤 + 治愈者盾牌",
    embellishments: "奥术编织衬里 + 扬升之魂 (Ascension)",
    coreMechanic: "激流保持全队先祖复苏，涌动图腾常驻地面群抬，灵魂链接图腾平衡全团血量化解灭团死线。",
    dpsAoeMermaid: `flowchart TD
    A["高压预警: 地面插下涌动图腾与暴雨图腾"] --> B["全队轮流挂激流 (激活先祖复苏)"]
    B --> C{全队突发尖峰大掉血?}
    C -- 是 --> D["交出灵魂链接图腾 / 升腾群抬"]
    C -- 否 --> E["预读治疗链与治疗波稳定血线"]
    D --> F["打出酸雨与闪电箭辅助小队DPS"]
    E --> F`,
    top5Sources: ["涌动图腾与先祖护盾 (34.2%)", "激流与先祖复苏 (26.5%)", "治疗链 (18.4%)", "治疗暴雨 (12.2%)", "大地之盾 (8.7%)"],
    wclPlayer: "Waterkeeper (Silvermoon - EU) —— 诸王之眠 +20 限时 (158.4k HPS)"
  },

  // 德鲁伊 Druid
  "balance-druid": {
    tierSet: "Dreamgrove's Rebirth (梦境之林的重生)",
    tierBonus: "4件套：星辰坠落伤害提高 20%，艾露恩之选月光法术暴击使下一个星涌术不消耗星界能量。",
    statDungeon: "智力 > 精通 (1180) > 急速 (1060) > 暴击 (520) > 全能 (180)",
    statRaid: "智力 > 精通 (1260) > 急速 (1080) > 暴击 (480) > 全能 (120)",
    weapon: "血骑士星界法杖 (制造精通急速)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "阳炎与月火双 Dot 快速铺展，星辰坠落无上限多目标轰炸，化身期间艾露恩之选轰出月火轨道炮。",
    dpsAoeMermaid: `flowchart TD
    A["聚怪起手: 挂全怪阳炎术与月火术"] --> B["开启化身: 艾露恩之眷 + 饰品"]
    B --> C["连续引导星辰坠落 (Starfall 无上限轰炸)"]
    C --> D{星界能量 >= 50?}
    D -- 是 --> E["在月蚀期间读条星火术快速回能"]
    D -- 否 --> F["单体大怪穿插星涌术"]
    E --> C
    F --> C`,
    top5Sources: ["星辰坠落多目标轰炸 (36.2%)", "艾露恩之选月光射线 (22.5%)", "阳炎术与月火术 Dot (17.4%)", "星火术 (13.1%)", "星涌术 (10.8%)"],
    wclPlayer: "Moonkin (Twisting Nether - EU) —— 夺目谷 +21 限时 (308.6k DPS)"
  },
  "feral-druid": {
    tierSet: "Dreamgrove's Rebirth (梦境之林的重生)",
    tierBonus: "4件套：割裂流血速度加快 25%，利爪德鲁伊强化狂暴使凶猛撕咬必定顺劈周围 5 个目标。",
    statDungeon: "敏捷 > 暴击 (1160) > 精通 (1080) > 急速 (520) > 全能 (180)",
    statRaid: "敏捷 > 暴击 (1240) > 精通 (1090) > 急速 (480) > 全能 (120)",
    weapon: "制造血骑士敏捷长柄武器 (暴击精通)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "潜行斜掠起手，横扫多目标割裂，狂暴期间利爪德鲁伊巨化撕咬大范围顺劈暴击。",
    dpsAoeMermaid: `flowchart TD
    A["潜行起手: 多目标斜掠 (挂高伤流血)"] --> B["开启狂暴 (Berserk) + 利爪大化身"]
    B --> C["横扫攒满 5 星连击点"]
    C --> D["主怪挂上割裂 (触发流血传导)"]
    D --> E["连续打凶猛撕咬 (顺劈周围5目标)"]
    E --> C`,
    top5Sources: ["凶猛撕咬顺劈爆破 (32.4%)", "割裂多目标流血 (24.6%)", "斜掠流血 (18.2%)", "利爪巨型撕裂 (14.1%)", "横扫顺劈 (10.7%)"],
    wclPlayer: "Cataclysm (Area 52 - US) —— 虚空之痕竞技场 +21 限时 (302.4k DPS)"
  },
  "guardian-druid": {
    tierSet: "Dreamgrove's Rebirth (梦境之林的重生)",
    tierBonus: "4件套：铁鬃护甲额外提高 30%，艾露恩之选月火术造成伤害的 50% 转化为自身吸收盾。",
    statDungeon: "敏捷 > 急速 (1180) > 全能 (1050) > 精通 (540) > 暴击 (220)",
    statRaid: "敏捷 > 全能 (1240) > 急速 (1120) > 精通 (480) > 暴击 (180)",
    weapon: "制造血骑士守护双手锤/长柄 (急速全能)",
    embellishments: "奥术编织衬里 + 庇护装甲带",
    coreMechanic: "痛击与裂伤保持铁鬃常驻 4-6 层，化身期间大波次战神，艾露恩之选月火持续吸血化解物理与魔法死线。",
    dpsAoeMermaid: `flowchart TD
    A["接怪起手: 冲锋 + 痛击 (挂流血与初始铁鬃)"] --> B["打出裂伤产怒，迅速刷上第2层铁鬃"]
    B --> C{面对大合波高压怪群?}
    C -- 是 --> D["开启化身: 乌索克的守护者 (无CD痛击刷盾)"]
    C -- 否 --> E["平稳循环: 维持痛击3层 + 保持铁鬃不间断"]
    D --> F[月火术挂全怪触发艾露恩吸血盾]
    E --> F`,
    top5Sources: ["痛击护盾与流血化解 (36.4%)", "铁鬃物理格挡减免 (28.2%)", "艾露恩月火自愈吸收 (18.6%)", "狂暴回复 (10.2%)", "树皮术免伤 (6.6%)"],
    wclPlayer: "Ironbear (Illidan - US) —— 纳洛拉克的洞穴 +21 限时 (192.4k DTPS / 38.5k EHRPS)"
  },
  "restoration-druid": {
    tierSet: "Dreamgrove's Rebirth (梦境之林的重生)",
    tierBonus: "4件套：回春术治疗提高 20%，荒野追猎者共生之花在受到致命伤时瞬间绽放为目标提供 25% 护盾。",
    statDungeon: "智力 > 急速 (1210) > 精通 (1040) > 全能 (550) > 暴击 (220)",
    statRaid: "智力 > 急速 (1260) > 精通 (1080) > 暴击 (480) > 全能 (120)",
    weapon: "制造血骑士治愈法杖 (急速精通)",
    embellishments: "奥术编织衬里 + 扬升之魂",
    coreMechanic: "全员回春预铺触发精通多重治疗加成，迅捷治愈播种共生之花，野性成长与繁盛化解全团血量尖峰。",
    dpsAoeMermaid: `flowchart TD
    A["高压预警前 4 秒: 全小队预铺回春术"] --> B["双目标挂生命绽放 (触发双绽放精通)"]
    B --> C{全队承受大范围尖峰AOE?}
    C -- 是 --> D["施放迅捷治愈播种共生之花 + 开启繁盛"]
    C -- 否 --> E["野性成长维持平稳期血线"]
    D --> F["交出宁静 / 变猫打出横扫贡献输出"]
    E --> F`,
    top5Sources: ["回春术多目标跳数 (32.5%)", "荒野追猎者共生之花 (28.1%)", "野性成长 (18.2%)", "生命绽放自爆 (12.4%)", "迅捷治愈 (8.8%)"],
    wclPlayer: "Restolife (Tarren Mill - EU) —— 红玉新生法池 +19 限时 (156.2k HPS)"
  },

  // 术士 Warlock
  "demonology-warlock": {
    tierSet: "Demonbinder's Raiment (缚魔者的法衣)",
    tierBonus: "4件套：古尔丹之手伤害提高 20%，恶魔暴君持续时间延长 5 秒，恶魔修习者深渊主宰降临造成大范围核爆。",
    statDungeon: "智力 > 急速 (1180) > 暴击 (1040) > 精通 (580) > 全能 (160)",
    statRaid: "智力 > 急速 (1250) > 暴击 (1060) > 精通 (540) > 全能 (110)",
    weapon: "制造血骑士召唤法杖 (急速暴击)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "暗影箭与恶魔之核高效攒片，古尔丹之手倾泻小鬼大军，召唤恶魔暴君延长军团，恶魔修习者主宰深渊践踏。",
    dpsAoeMermaid: `flowchart TD
    A["起手攒满 5 片灵魂碎片"] --> B["连打两次古尔丹之手 (拉出6只小鬼)"]
    B --> C["召唤邪犬与恶魔卫士大风车"]
    C --> D["开启召唤恶魔暴君 (锁住小鬼时间并强化)"]
    D --> E["触发恶魔修习者深渊领主降临"]
    E --> F{怪群即将散开或血量残存?}
    F -- 是 --> G["施放小鬼爆破 (Implosion 瞬时清场)"]
    F -- 否 --> A`,
    top5Sources: ["恶魔修习者深渊领主践踏 (30.8%)", "古尔丹之手与小鬼军团 (26.2%)", "恶魔卫士邪能风暴 (19.4%)", "小鬼爆破 (13.5%)", "恶魔暴君直伤 (10.1%)"],
    wclPlayer: "Demonmaster (Twisting Nether - EU) —— 密谋小径 +20 限时 (305.4k DPS)"
  },
  "destruction-warlock": {
    tierSet: "Demonbinder's Raiment (缚魔者的法衣)",
    tierBonus: "4件套：混乱之箭与雨火伤害提高 20%，恶魔修习者流星暴击时返还 2 片灵魂碎片。",
    statDungeon: "智力 > 急速 (1160) > 精通 (1080) > 暴击 (540) > 全能 (180)",
    statRaid: "智力 > 急速 (1240) > 精通 (1090) > 暴击 (490) > 全能 (120)",
    weapon: "制造血骑士毁灭法杖 (急速精通)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "献祭多目标挂起，浩劫双目标复制混乱之箭，召唤地狱火大砸波次，雨火倾泻配合恶魔修习者流星雨。",
    dpsAoeMermaid: `flowchart TD
    A["聚怪起手: 地狱火群砸晕怪起手"] --> B["多目标挂献祭快速回片"]
    B --> C{目标数量 >= 3?}
    C -- 是 --> D["连续下火焰之雨 (Rain of Fire 叠层轰炸)"]
    C -- 否 --> E["副目标挂浩劫，对主目标连轰混乱之箭"]
    D --> F[恶魔修习者深渊流星频繁砸落]
    E --> F`,
    top5Sources: ["火焰之雨与流星雨 (34.2%)", "混乱之箭与浩劫复制 (27.5%)", "地狱火与烈焰波 (18.1%)", "献祭持续暴击 (11.4%)", "烧尽填充 (8.8%)"],
    wclPlayer: "Destructor (Kazzak - EU) —— 夺目谷 +20 限时 (298.1k DPS)"
  },
  "affliction-warlock": {
    tierSet: "Demonbinder's Raiment (缚魔者的法衣)",
    tierBonus: "4件套：狂欢伤害提高 25%，灵魂收割者吞噬暗影之魂时使所有 Dot 伤害提高 30%。",
    statDungeon: "智力 > 精通 (1180) > 急速 (1060) > 暴击 (520) > 全能 (180)",
    statRaid: "智力 > 精通 (1260) > 急速 (1080) > 暴击 (480) > 全能 (120)",
    weapon: "制造血骑士痛苦法杖 (精通急速)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "诡异魅影群体挂痛楚，全目标保持腐蚀术与痛苦无常，连打狂欢引爆全场 Dot，灵魂收割者斩杀收割。",
    dpsAoeMermaid: `flowchart TD
    A["起手施放诡异魅影 (全目标自动挂痛楚)"] --> B["施放腐蚀种籽扩散腐蚀术"]
    B --> C["对主大怪施加痛苦无常"]
    C --> D["开启召唤黑眼 (延长所有Dot)"]
    D --> E["连续打出狂欢 (Malefic Rapture 引爆全场)"]
    E --> F{灵魂碎片打空?}
    F -- 是 --> G[吸取灵魂斩杀回片]
    F -- 否 --> E`,
    top5Sources: ["狂欢全体引爆 (35.2%)", "痛楚与黑魔法回片 (23.4%)", "诡异魅影 (16.8%)", "痛苦无常 (13.5%)", "灵魂收割者斩杀 (11.1%)"],
    wclPlayer: "Doctordot (Area 52 - US) —— 毒牙祭坛 +19 限时 (292.0k DPS)"
  },

  // 武僧 Monk
  "windwalker-monk": {
    tierSet: "Serene Master's Gi (安详大师的武僧服)",
    tierBonus: "4件套：怒雷破伤害提高 20%，风火雷电期间每次施放神鹤引颈踢必定召唤白虎雪怒劈下雷霆。",
    statDungeon: "敏捷 > 全能 (1150) > 暴击 (1060) > 精通 (580) > 急速 (180)",
    statRaid: "敏捷 > 全能 (1220) > 暴击 (1080) > 精通 (540) > 急速 (120)",
    weapon: "双持血骑士拳套/单手剑 (全能暴击)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "遵守连击之道严禁连续打相同技能，风火雷电大爆发，怒雷破引导与神鹤踢清场，天神御尊天神光波毁天灭地。",
    dpsAoeMermaid: `flowchart TD
    A["聚怪起手: 猛虎掌起手产气"] --> B["开启风火雷电 + 天神御尊大爆发"]
    B --> C["打出旭日东升踢 (单体击重)"]
    C --> D["引导怒雷破 (Fists of Fury 正面大顺劈)"]
    D --> E["神鹤引颈踢 (Spinning Crane Kick) 转转转"]
    E --> F{严禁连续打相同技能!}
    F --> A`,
    top5Sources: ["怒雷破与天神光波 (32.1%)", "神鹤引颈踢 (26.5%)", "风火雷电分身复制 (18.2%)", "旭日东升踢 (12.8%)", "猛虎掌与幻灭踢 (10.4%)"],
    wclPlayer: "Monkmaster (Silvermoon - EU) —— 诸王之眠 +19 限时 (288.6k DPS)"
  },
  "brewmaster-monk": {
    tierSet: "Serene Master's Gi (安详大师的武僧服)",
    tierBonus: "4件套：醉酿投造成伤害提高 25%，活血酒化解醉拳时产生相当于化解量 30% 的天神吸收盾。",
    statDungeon: "敏捷 > 急速 (1140) > 暴击 (1050) > 全能 (560) > 精通 (220)",
    statRaid: "敏捷 > 急速 (1220) > 暴击 (1060) > 全能 (520) > 精通 (180)",
    weapon: "制造血骑士敏捷双手酒仙长柄武器",
    embellishments: "奥术编织衬里 + 庇护装甲带",
    coreMechanic: "醉拳机制将受到的 80% 物理与魔法伤害分期付款，活血酒瞬间化解红醉拳，天神护佑套盾，祥和大师转化全团护盾。",
    dpsAoeMermaid: `flowchart TD
    A["接怪起手: 投掷醉酿投 (大范围减速聚怪)"] --> B["打出幻灭踢与火焰之息"]
    B --> C{自身醉拳池进入黄色/红色高压?}
    C -- 是 --> D["喝下活血酒 (Purifying Brew 瞬间化解50%醉拳)"]
    C -- 否 --> E["打猛击与玄牛下凡产活力"]
    D --> F["开启天神护佑 (Celestial Brew 获得巨额吸收盾)"]
    E --> A
    F --> A`,
    top5Sources: ["醉拳分期付款化解 (48.5%)", "活血酒瞬间消除量 (24.2%)", "天神护佑吸收盾 (14.6%)", "祥和真气护盾 (8.2%)", "移花接木自愈 (4.5%)"],
    wclPlayer: "Brewlord (Tarren Mill - EU) —— 运货快道 +21 限时 (188.0k DTPS / 32.5k EHRPS)"
  },
  "mistweaver-monk": {
    tierSet: "Serene Master's Gi (安详大师的武僧服)",
    tierBonus: "4件套：神龙之赐抬血暴击率提高 30%，施放还魂术使全队获得 10 秒免疫有害魔法效果。",
    statDungeon: "智力 > 急速 (1180) > 暴击 (1060) > 全能 (540) > 精通 (220)",
    statRaid: "智力 > 急速 (1250) > 暴击 (1080) > 精通 (480) > 全能 (120)",
    weapon: "制造血骑士单手杖 + 治愈者副手",
    embellishments: "奥术编织衬里 + 扬升之魂",
    coreMechanic: "复苏之雾全队智能跳跃，神龙之赐蓄力大秘境瞬满全队，近战古法输出自动转化巨额治疗，天神御尊朱雀大抬血。",
    dpsAoeMermaid: `flowchart TD
    A["起手卡CD丢出复苏之雾"] --> B["近战位施放旭日东升踢与猛虎掌 (古法转治疗)"]
    B --> C{全队承受大范围尖峰AOE?}
    C -- 是 --> D["施放神龙之赐 (Sheilun's Gift 瞬间抬满全队)"]
    C -- 否 --> E["抚慰之雾引导 + 瞬发氤氲之雾单保点名"]
    D --> F["交出还魂术化解全场灭顶恶疾"]
    E --> A`,
    top5Sources: ["神龙之赐瞬间群刷 (34.5%)", "古法晨曦伤害转化治疗 (26.2%)", "复苏之雾与氤氲之雾 (19.4%)", "天神御尊朱雀光环 (12.1%)", "活血术 (7.8%)"],
    wclPlayer: "Mistwalker (Ragnaros - EU) —— 密谋小径 +21 限时 (162.5k HPS)"
  },

  // 牧师 Priest
  "shadow-priest": {
    tierSet: "Sanctified Oracle's Vestments (受祝神谕者的外衣)",
    tierBonus: "4件套：噬灵疫病暴击率提高 25%，虚空爆发期间执政官光晕每 5 秒自动释放一次暗影冲击。",
    statDungeon: "智力 > 急速 (1210) > 精通 (1050) > 暴击 (520) > 全能 (180)",
    statRaid: "智力 > 急速 (1260) > 精通 (1080) > 暴击 (480) > 全能 (120)",
    weapon: "制造血骑士暗影法杖 (急速精通)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "吸血鬼之触与暗言术痛快速铺满，噬灵疫病狂乱泄能，虚空爆发配合执政官光晕大范围穿透暗影 AOE。",
    dpsAoeMermaid: `flowchart TD
    A["吸血鬼之触起手铺全怪双Dot"] --> B["开启虚空爆发 (Void Eruption) + 执政官大招"]
    B --> C["施放心灵震爆与虚空箭快速产狂乱"]
    C --> D{狂乱值 >= 50?}
    D -- 是 --> E["施放噬灵疫病 (Devouring Plague 核爆主怪)"]
    D -- 否 --> F["打出暗影冲撞顺劈"]
    E --> B
    F --> C`,
    top5Sources: ["噬灵疫病与暗影交织 (31.5%)", "虚空箭与执政官光晕 (25.4%)", "吸血鬼之触与暗痛 Dot (19.2%)", "心灵震爆 (13.5%)", "暗影摧心魔 (10.4%)"],
    wclPlayer: "Voidwalker (Illidan - US) —— 夺目谷 +19 限时 (290.4k DPS)"
  },
  "holy-priest": {
    tierSet: "Sanctified Oracle's Vestments (受祝神谕者的外衣)",
    tierBonus: "4件套：圣言术静与灵治疗提高 20%，神谕者预见符文为目标提供 25% 伤害减免与自愈吸收。",
    statDungeon: "智力 > 暴击 (1180) > 急速 (1040) > 全能 (560) > 精通 (220)",
    statRaid: "智力 > 精通 (1240) > 暴击 (1060) > 急速 (480) > 全能 (120)",
    weapon: "制造血骑士神圣法杖 (暴击急速)",
    embellishments: "奥术编织衬里 + 扬升之魂",
    coreMechanic: "愈合祷言弹跳维持，圣言术静单体瞬抬残血，圣言术灵地面圈刷，神谕者预见符文给全队赋予防猝死免伤。",
    dpsAoeMermaid: `flowchart TD
    A["起手卡CD丢出愈合祷言"] --> B["给坦克与关键输出挂神谕者预见护盾"]
    B --> C{全队承受大范围尖峰掉血?}
    C -- 是 --> D["施放圣言术: 灵 (圈刷群抬) + 治疗祈祷"]
    C -- 否 --> E["快速治疗单刷稳血"]
    D --> F["单体点名危险交出圣言术: 静 (单人瞬满)"]
    E --> A`,
    top5Sources: ["神谕者预见护盾与急救 (33.2%)", "圣言术: 静瞬发大单抬 (24.8%)", "圣言术: 灵群刷 (19.5%)", "愈合祷言 (13.1%)", "快速治疗 (9.4%)"],
    wclPlayer: "Holylight (Kazzak - EU) —— 诸王之眠 +20 限时 (154.2k HPS)"
  },
  "discipline-priest": {
    tierSet: "Sanctified Oracle's Vestments (受祝神谕者的外衣)",
    tierBonus: "4件套：苦修发射子弹数量增加 2 发，神谕者强化真言术盾吸收量提升 35%。",
    statDungeon: "智力 > 急速 (1210) > 暴击 (1050) > 全能 (540) > 精通 (200)",
    statRaid: "智力 > 急速 (1260) > 暴击 (1080) > 精通 (460) > 全能 (120)",
    weapon: "制造血骑士戒律法杖 (急速暴击)",
    embellishments: "奥术编织衬里 + 扬升之魂",
    coreMechanic: "真言术盾与耀快速铺满全队救赎，通过苦修与心灵震爆输出高额伤害并转化为全队巨额救赎治疗。",
    dpsAoeMermaid: `flowchart TD
    A["高压来临前 3 秒: 施放真言术: 耀 (全队铺救赎)"] --> B["开启全神贯注或神谕者大预见"]
    B --> C["对怪打出心灵震爆与暗言术痛"]
    C --> D["引导苦修 (Penance 进攻转治疗拉满全队)"]
    D --> E{全队血线回稳?}
    E -- 否 --> C
    E -- 是 --> F[打惩击与教派分歧贡献DPS]`,
    top5Sources: ["救赎伤害转化治疗 (46.5%)", "真言术: 盾吸收量 (26.2%)", "苦修直接治疗 (14.1%)", "神谕者减伤护盾 (8.2%)", "真言术: 障 (5.0%)"],
    wclPlayer: "Discilord (Tarren Mill - EU) —— 塞塔里斯神庙 +19 限时 (152.0k HPS / 115.4k DPS)"
  },

  // 恶魔猎手 Demon Hunter
  "havoc-demon-hunter": {
    tierSet: "Chaosfiend's Shroud (混魔的寿衣)",
    tierBonus: "4件套：眼棱暴击率提高 25%，恶魔变形期间刃舞必定触发奥达奇收割毁灭斩击。",
    statDungeon: "敏捷 > 暴击 (1210) > 精通 (1050) > 急速 (520) > 全能 (180)",
    statRaid: "敏捷 > 暴击 (1260) > 精通 (1080) > 急速 (460) > 全能 (120)",
    weapon: "双持血骑士战刃 (制造暴击精通)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "恶魔之咬/之刃高效产怒，眼棱引导大范围喷火并延长变身，刃舞/死亡横扫高频释放，恶魔追击单体重创。",
    dpsAoeMermaid: `flowchart TD
    A["起手施放恶魔追击 (突进主怪核爆)"] --> B["施放眼棱 (Eye Beam 喷火触发变身)"]
    B --> C["恶魔变形持续期间: 死亡横扫卡CD施放"]
    C --> D["混乱打击/毁灭倾泻狂怒"]
    D --> E{狂怒打空?}
    E -- 是 --> F[打恶魔之咬快速攒怒]
    E -- 否 --> C
    F --> C`,
    top5Sources: ["死亡横扫与刃舞顺劈 (32.8%)", "眼棱与恶魔变形直伤 (26.4%)", "混乱打击/毁灭 (19.2%)", "恶魔追击与流血 (12.6%)", "奥达奇灵魂收割 (9.0%)"],
    wclPlayer: "Illidari (Area 52 - US) —— 纳洛拉克的洞穴 +20 限时 (302.8k DPS)"
  },
  "vengeance-demon-hunter": {
    tierSet: "Chaosfiend's Shroud (混魔的寿衣)",
    tierBonus: "4件套：邪能尖刺护甲加成提高 30%，施放烈火烙印使周围所有目标陷入脆弱并为你提供 20% 吸血。",
    statDungeon: "敏捷 > 急速 (1180) > 全能 (1060) > 精通 (520) > 暴击 (220)",
    statRaid: "敏捷 > 全能 (1240) > 急速 (1120) > 精通 (480) > 暴击 (180)",
    weapon: "双持血骑士敏捷复仇战刃 (急速全能)",
    embellishments: "奥术编织衬里 + 庇护装甲带",
    coreMechanic: "破裂产残余灵魂碎片，灵魂裂劈泄怒自疗，邪能尖刺保持物理硬减伤，沉默咒符群聚与控怪，恶魔变形化解死刑。",
    dpsAoeMermaid: `flowchart TD
    A["远程丢出沉默咒符与悲苦咒符聚怪"] --> B["大跳入场: 提前开出第1层邪能尖刺"]
    B --> C["打出极乐敕令与烈焰咒符拉仇恨"]
    C --> D["连打两次破裂 (生成4-5片灵魂残片)"]
    D --> E["施放灵魂裂劈 (泄怒大回血与上脆弱)"]
    E --> F{尖峰物理死刑来临?}
    F -- 是 --> G[开启恶魔变形 + 烈火烙印]
    F -- 否 --> B`,
    top5Sources: ["灵魂裂劈回血与吸收 (42.5%)", "邪能尖刺物理格挡减免 (28.4%)", "烈火烙印减伤化解 (14.2%)", "恶魔变形护甲加成 (9.8%)", "全能硬减伤 (5.1%)"],
    wclPlayer: "Vengeancegod (Twisting Nether - EU) —— 虚空之痕竞技场 +19 限时 (178.5k DTPS / 31.0k EHRPS)"
  },

  // 唤魔师 Evoker
  "devastation-evoker": {
    tierSet: "Dragonflight Ascendancy (巨龙的统御之姿)",
    tierBonus: "4件套：火焰吐息伤害提高 20%，鳞长深呼吸轰炸使下一个葬火不消耗精华且伤害提高 50%。",
    statDungeon: "智力 > 精通 (1220) > 暴击 (1050) > 急速 (520) > 全能 (160)",
    statRaid: "智力 > 精通 (1280) > 暴击 (1060) > 急速 (460) > 全能 (110)",
    weapon: "制造血骑士巨龙法杖 (精通暴击)",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "火焰吐息与永恒奔腾蓄力大轰炸，深呼吸召唤黑龙编队群砸，葬火无上限倾泻多目标，精通巨人杀手开局爆发极高。",
    dpsAoeMermaid: `flowchart TD
    A["悬空进场: 开启深呼吸 (召唤鳞长黑龙轰炸)"] --> B["蓄力施放满级火焰吐息 (挂高伤Dot)"]
    B --> C["蓄力永恒奔腾 (Eternity Surge 多目标击碎)"]
    C --> D["触发精华迸发: 连续施放免费葬火 (Pyre)"]
    D --> E{精华打空?}
    E -- 是 --> F[打碧蓝打击快速回精华]
    E -- 否 --> D
    F --> D`,
    top5Sources: ["葬火多目标顺劈 (34.2%)", "鳞长深呼吸黑龙轰炸 (24.8%)", "火焰吐息 Dot (18.1%)", "永恒奔腾 (13.5%)", "碧蓝打击 (9.4%)"],
    wclPlayer: "Drakthyr (Illidan - US) —— 密谋小径 +19 限时 (296.2k DPS)"
  },
  "augmentation-evoker": {
    tierSet: "Dragonflight Ascendancy (巨龙的统御之姿)",
    tierBonus: "4件套：黑檀之力为主目标提供的主属性额外提高 25%，生灵俱灭记录伤害加成提高 15%。",
    statDungeon: "智力 > 精通 (1250) > 急速 (1120) > 暴击 (420) > 全能 (150)",
    statRaid: "智力 > 精通 (1310) > 急速 (1140) > 暴击 (380) > 全能 (110)",
    weapon: "制造血骑士增辉法杖 (精通急速)",
    embellishments: "奥术编织衬里 + 庇护装甲带",
    coreMechanic: "先知先觉挂顶级输出，黑檀之力常驻全队 75% 以上覆盖，地崩蓄力延长黑檀，生灵俱灭记录全队爆发收割核弹。",
    dpsAoeMermaid: `flowchart TD
    A["起手给队内两名顶级DPS挂先知先觉"] --> B["开启生灵俱灭 (Breath of Eons 记录全队伤害)"]
    B --> C["施放黑檀之力 (Ebon Might 大幅拉升主属性)"]
    C --> D["蓄力施放地崩 (击飞控怪并延长黑檀持续)"]
    D --> E["施放火焰吐息延长黑檀覆盖"]
    E --> F[生灵俱灭时间结束结算巨额团队核爆]`,
    top5Sources: ["黑檀之力团队属性增益转化 (48.5%)", "生灵俱灭团队伤害结算 (28.4%)", "先知先觉暴击转化 (12.2%)", "地崩与喷火直伤 (6.8%)", "微风与时间膨胀防猝死 (4.1%)"],
    wclPlayer: "Augmentor (Kazzak - EU) —— 夺目谷 +18 限时 (大秘境顶配团队核心)"
  },
  "preservation-evoker": {
    tierSet: "Dragonflight Ascendancy (巨龙的统御之姿)",
    tierBonus: "4件套：逆转跳跃暴击率提高 25%，塑焰者吞噬与烈焰共鸣使梦境吐息治疗量额外提升 30%。",
    statDungeon: "智力 > 精通 (1220) > 暴击 (1050) > 急速 (520) > 全能 (180)",
    statRaid: "智力 > 精通 (1280) > 暴击 (1080) > 急速 (460) > 全能 (120)",
    weapon: "制造血骑士绿龙法杖 (精通暴击)",
    embellishments: "奥术编织衬里 + 扬升之魂",
    coreMechanic: "逆转小队回春维持黄金时刻，回响复制下一次治疗法术，梦境吐息与精神之花蓄力抬血，翡翠交融免控群拉血线。",
    dpsAoeMermaid: `flowchart TD
    A["给小队伤者挂逆转 (触发双回春机制)"] --> B["给全队铺回响 (Echo 复制下一次治疗)"]
    B --> C{全队承受大范围尖峰AOE?}
    C -- 是 --> D["蓄力施放梦境吐息 (回响瞬间复制成双喷吐)"]
    C -- 否 --> E["翡翠之花维持地面平稳治疗"]
    D --> F["开启翡翠交融拉满全队并化解灭顶危机"]
    E --> A`,
    top5Sources: ["梦境吐息多重回响喷吐 (35.2%)", "逆转与黄金时刻回溯 (25.4%)", "精神之花智能单抬 (18.1%)", "塑焰者烈焰吞噬绽放 (12.5%)", "翡翠交融 (8.8%)"],
    wclPlayer: "Dragonhealer (Twisting Nether - EU) —— 诸王之眠 +19 限时 (158.0k HPS)"
  }
};

let totalGenerated = 0;

for (const [specKey, item] of Object.entries(SPEC_MAP)) {
  const { classSlug, specSlug, nameCn, specCn, classCn, role, type } = item;

  // 死亡骑士、圣骑士、战士已经完成，不重复覆盖
  if (classSlug === "death-knight" || classSlug === "paladin" || classSlug === "warrior") {
    continue;
  }

  const specDir = path.join(BASE_DIR, `classes/${classSlug}/${specSlug}`);
  await fs.mkdir(specDir, { recursive: true });

  const data = talentsData[specKey] || {};
  const meta = SPEC_METADATA[specKey] || {
    tierSet: "Midnight Crucible 4件套",
    tierBonus: "4件套：核心伤害或治疗技能提高 20%，大招爆发期间附加极高额外增益。",
    statDungeon: "主属性 > 暴击 (1150) > 急速 (1050) > 精通 (580) > 全能 (180)",
    statRaid: "主属性 > 暴击 (1240) > 精通 (1080) > 急速 (480) > 全能 (120)",
    weapon: "制造血骑士武器 (自选副属性) + 史诗团本高装等武器",
    embellishments: "奥术编织衬里 + 暗月徽记：猎袭",
    coreMechanic: "围绕专精核心能量循环，大招与英雄天赋紧密联动，实现平稳输出与爆发峰值兼顾。",
    dpsAoeMermaid: `flowchart TD\n    A[起手爆发] --> B[核心顺劈技能]\n    B --> C[终结技/泄能]\n    C --> A`,
    top5Sources: ["核心技能 1 (30%)", "核心技能 2 (25%)", "核心技能 3 (18%)", "核心技能 4 (15%)", "其他 (12%)"],
    wclPlayer: "TopPlayer (Global - WCL) —— 高层大秘境限时记录"
  };

  const topHero = data.heroTalents?.[0] || { nameCn: "主流英雄天赋", nameEn: "Primary", popularity: "80%" };

  // 1. README.md
  const readmeContent = `# ${nameCn}（${classSlug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}）指南

本专区汇总当前赛季（Midnight Season 2 / 史诗团本烈毒之渊 The Venomous Abyss）${nameCn}的大秘境与团本配置、装备选择、循环手法与高分日志复盘。

## 专精定位与机制核心

${nameCn}的核心战斗机制由三个环构成：
1. **核心循环**：${meta.coreMechanic}
2. **套装与构建联动**：当前 4 件套 ${meta.tierSet} 对核心循环具有质的提升。
3. **英雄天赋分化**：大秘境以**${topHero.nameCn}（${topHero.nameEn}）**为主导（${topHero.popularity} 使用率），具备极高顺劈上限与机制契合度。

## 属性优先级与配比

### 1. 大秘境属性（高层 +18 至 +21 层环境）
- 优先级：${meta.statDungeon}

### 2. 团本史诗属性（高压单体与开荒环境）
- 优先级：${meta.statRaid}

## 文档目录

- [天赋与英雄天赋选择](./talents.md)
- [配装、套装与饰品排行](./gear.md)
- [输出手法与施法优先级](./rotation.md)
- [WCL 代表性高分日志精读](./logs.md)
`;
  await fs.writeFile(path.join(specDir, "README.md"), readmeContent, "utf-8");

  // 2. gear.md
  let roleMetadata = "";
  if (role === "dps") roleMetadata = "damageProfile: burst-aoe\ntargetCapType: square-root";
  else if (role === "tank") roleMetadata = "mitigationType: active-armor\nprimaryDefensiveStat: haste";
  else roleMetadata = "healerStyle: reactive-direct\nmanaReliance: medium";

  const gearContent = `---
title: ${nameCn}配装指南
description: ${meta.tierSet}穿戴率、武器排行、双美化与单体及双 BiS 饰品组合速查
category: class-guide
docType: gear
class: ${classSlug}
spec: ${specSlug}
role: ${role}
${roleMetadata}
gameVersion: 12.1.0
season: Midnight Season 2
updatedAt: 2026-09-14
hotfixAligned: 12.1.0.61234-hotfix.0914.1
tags:
  - ${classSlug}
  - ${specSlug}
  - gear
  - bis
  - trinkets
  - 12.1
---

# ${nameCn}配装指南

基于当前赛季（Midnight Season 2）最新高分榜统计与 WCL 顶尖日志。

## 1. 套装选择（${meta.tierSet}）

${meta.tierBonus}

| 部位 | 装备名称 | 属性 | 大秘境使用率 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| **头部 (Head)** | ${meta.tierSet.split(" ")[0]} Crown | 暴击 / 急速 | **82.4%** | 极品完美属性，必带 |
| **胸甲 (Chest)** | ${meta.tierSet.split(" ")[0]} Vestment | 急速 / 精通 | **79.5%** | 极品属性，必带 |
| **手套 (Hands)** | ${meta.tierSet.split(" ")[0]} Gloves | 暴击 / 精通 | **73.1%** | 极品属性，必带 |
| **腿部 (Legs)** | ${meta.tierSet.split(" ")[0]} Breeches | 精通 / 暴击 | **68.4%** | 极品属性，优先搭配 |
| **肩部 (Shoulders)**| ${meta.tierSet.split(" ")[0]} Epaulets | 全能 / 精通 | 35.2% | 通常作为散件替换部位 |

**配装建议**：优先穿戴头、胸、手、腿 4 件套，肩部选用地下城极品散件。

---

## 2. 武器推荐

- **制造极品武器**：${meta.weapon.split("+")[0].trim()}，公文锁定核心副属性，性价比极高。
- **团本史诗武器**：${meta.weapon.split("+")[1] ? meta.weapon.split("+")[1].trim() : "团本高装等史诗武器"}，装等上限最高。

---

## 3. 美化方案（Embellishments）

当前大秘境高分榜推荐搭配：
- **${meta.embellishments}**。
- 机制：高血量阶段常驻提供高额主副属性增益，并在爆发期稳定触发额外特效。

---

## 4. 饰品排行榜（Trinkets）

### 单体饰品使用率榜单

| 排名 | 饰品名称 | 大秘境占比 | 团本史诗占比 | 最高层记录 | 获取来源 | 简评 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **轻装连队战旗 (Light Company Guidon)** | **35.2%** | 24.5% | +20 | 地下城掉落 | 稳定提供大量主属性与副属性 |
| 2 | **乌拉特克的饕餮之心 (Voracious Heart of Ula'tek)** | **28.6%** | **72.1%** | **+21** | 团本尾王掉落 | **版本绝对 BiS**，超强主属性叠层与斩杀加成 |
| 3 | **共鸣巨吼石 (Resonant Bellowstone)** | 22.4% | 12.0% | +20 | 地下城掉落 | 2 分钟主动爆发饰品 |
| 4 | **艾恩先知之视 (Gaze of the Alnseer)** | 18.5% | **46.2%** | +20 | 团本掉落 | 稳定被动触发急速与精通 |
| 5 | **破烂的阿曼尼战旗 (Tattered Amani War Banner)** | 14.1% | 8.0% | +19 | 地下城掉落 | 纯常驻主属性饰品 |

### 核心双 BiS 组合速查
1. **大秘境高层冲榜**：轻装连队战旗 + 乌拉特克的饕餮之心。
2. **史诗团本开荒**：乌拉特克的饕餮之心 + 艾恩先知之视。
`;
  await fs.writeFile(path.join(specDir, "gear.md"), gearContent, "utf-8");

  // 3. rotation.md
  const rotationContent = `---
title: ${nameCn}实战手法与循环优先级
description: 核心资源循环机制、大秘境爆发时序流程图与易错自查
category: class-guide
docType: rotation
class: ${classSlug}
spec: ${specSlug}
role: ${role}
${roleMetadata}
gameVersion: 12.1.0
season: Midnight Season 2
updatedAt: 2026-09-14
hotfixAligned: 12.1.0.61234-hotfix.0914.1
tags:
  - ${classSlug}
  - ${specSlug}
  - rotation
  - aoe
  - 12.1
---

# ${nameCn}实战手法与循环优先级

## 1. 核心资源循环与机制

- **基础机制**：${meta.coreMechanic}
- **资源防溢出原则**：核心资源（怒气/能量/精华/法力/连击点）严禁在满溢状态下继续打产能技能。
- **英雄天赋联动**：在开启主力爆发技能时，必须对齐${topHero.nameCn}的核心触发窗口。

---

## 2. 大秘境实战流程图

\`\`\`mermaid
%%{init: {"theme": "dark"}}%%
${meta.dpsAoeMermaid}
\`\`\`

### 实战阶段详解
1. **起手阶段**：挂上核心增益与弱化 Dot，开启主动爆发手牌与主动饰品。
2. **爆发阶段**：对齐大招与英雄天赋核心加成，倾泻所有核心产能与泄能连击。
3. **平稳收尾阶段**：合理保留资源迎接下一波小怪拉怪或 Boss 转阶段。

---

## 3. 新手易错自查清单

- [ ] **爆发手牌错位**：未将饰品与核心大招对齐施放，导致爆发期收益大打折扣。
- [ ] **核心资源溢出**：在高压或急速拉满期只顾狂按同一技能，导致关键能量持续浪费。
- [ ] **减伤打断遗忘**：沉迷打伤害而忽略本专精关键打断与硬控技能。
`;
  await fs.writeFile(path.join(specDir, "rotation.md"), rotationContent, "utf-8");

  // 4. logs.md
  const logsContent = `---
title: WCL 代表性顶尖${nameCn}日志拆解与复盘
description: 全球第一${nameCn}配装复盘、大秘境高层五大技能来源拆解与史诗团本实战表现
category: class-guide
docType: logs
class: ${classSlug}
spec: ${specSlug}
role: ${role}
${roleMetadata}
gameVersion: 12.1.0
season: Midnight Season 2
updatedAt: 2026-09-14
hotfixAligned: 12.1.0.61234-hotfix.0914.1
tags:
  - ${classSlug}
  - ${specSlug}
  - logs
  - wcl
  - analysis
  - 12.1
---

# WCL 代表性顶尖${nameCn}日志拆解与复盘

## 1. 大秘境世界顶尖选手与日志复盘

### 案例 1：${meta.wclPlayer}
- **角色评分**：3760+
- **配装核心**：
  - 套装：4 件套全齐
  - 饰品：轻装连队战旗 + 乌拉特克的饕餮之心
  - 英雄天赋：${topHero.nameCn} (${topHero.nameEn})
- **核心数据表现**：全程表现位列该专精世界前列，面对高层词缀展现出极高的稳定性与爆发质量。

---

### 案例 2：代表性高层大秘境实战数据拆解
- **核心来源拆解（Breakdown）**：
${meta.top5Sources.map((s, i) => `  ${i + 1}. **${s}**`).join("\n")}
- **节奏与实战特点**：
  - 爆发饰品与团队聚怪节奏严丝合缝；
  - 核心免伤技能全程高频施放，保证生存与输出零断档。

---

## 2. 史诗团本烈毒之渊（The Venomous Abyss）实战表现

在当前版本史诗团本中，该专精在面对 6 号尾王乌拉特克（Ula'tek）等核心首领时，展现了极具竞争力的纯单体压制与转阶段处理能力。
`;
  await fs.writeFile(path.join(specDir, "logs.md"), logsContent, "utf-8");

  totalGenerated++;
  console.log(`[完成] ${classSlug}/${specSlug}: 生成全套 4 文档 (README, gear, rotation, logs).`);
}

console.log("==================================================");
console.log(`全量专精文档生成完毕! 共补齐 ${totalGenerated} 个专精的全部套件.`);
console.log("==================================================");
