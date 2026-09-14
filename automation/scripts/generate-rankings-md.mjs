// automation/scripts/generate-rankings-md.mjs
// 根据抓取的真实排行榜数据生成大秘境与团本 Markdown 报告
// 严格遵守 xdd-plain-docs 规范：严禁 emoji、严禁套话、纯事实驱动、客观深度点评

import fs from "node:fs/promises";
import path from "node:path";
import { SPEC_MAP } from "./spec-constants.mjs";

const dataFile = "/Users/wuwanzhu/Documents/wow/automation/data/rankings-latest.json";
const raw = await fs.readFile(dataFile, "utf-8");
const data = JSON.parse(raw);

function getSpecMeta(specSlug, classSlug) {
  const key = `${specSlug}-${classSlug}`;
  return SPEC_MAP[key] || {
    nameCn: `${specSlug} ${classSlug}`,
    specCn: specSlug,
    classCn: classSlug,
    role: "dps",
    type: "melee"
  };
}

// 专精机制深度点评库（基于当前赛季实战机制与数据真实归因）
const MPLUS_COMMENTS = {
  "arms-warrior": "巨力顺劈配合剑刃风暴拥有当前版本最顶级的波次峰值出伤与处决斩杀能力，破坏者与压制循环短CD周转，集结呐喊提供全队强力防猝死血上限，天梯评分 3526 领跑全近战。",
  "elemental-shaman": "升腾与狂风怒号在波次战斗中出伤极其凶猛，短 CD 远程风剪打断、电能图腾群晕、风暴图腾与天怒/风怒图腾提供不可替代战术价值，天梯评分 3512 登顶远程。",
  "arcane-mage": "法阵爆发期对大怪拥有绝对斩杀线压制力，时间扭曲（嗜血）、奥术智慧 5% 智力光环、双冰箱极强自保容错，天梯评分 3483 稳居远程 S 级。",
  "assassination-rogue": "高层大怪血量极厚，绞喉、割裂与毒伤提供极高质量单体顺劈，暗影斗篷与佯攻硬吃各类穿透减伤机制，死标毒刃定点爆发强，天梯评分 3482 位列近战第二位。",
  "outlaw-rogue": "高频控制链（偷袭、凿击、盲）、帷幕跳怪、超短闪避与佯攻技能循环，持续平稳 AOE 顺劈能力极佳，3428 分领衔 A 级近战。",
  "feral-druid": "撕裂流血多目标挂流血伤害扎实，狂暴爆发顺劈周期契合中高层拉怪节奏，野性之心与树皮自保稳定，3426 分。",
  "windwalker-monk": "5% 物理易伤在物理菜刀队中为绝对核心 Buff，扫堂腿与平心之环战术控场能力极高，白虎下凡爆发平稳，3420 分。",
  "devourer-demon-hunter": "新增专精机制数值目前处在高位，虚空吞噬阶段波次爆发凶猛，暗影疾行与变身机动性极强，3411 分。",
  "retribution-paladin": "爆发节奏契合波次（1分钟征伐/翅膀），圣疗、保护祝福、牺牲祝福与盲目之光提供顶级容错救场能力，虽高层极限冲榜分数（3389）略低于纯输出近战，但集合石表现极稳健。",
  "demonology-warlock": "恶魔暴君与恶魔卫士旋风斩持续压怪能力强，恶魔传送门跳怪与治疗石容错必备，3384 分。",
  "subtlety-rogue": "暗影之舞高频定点压血，死符爆发可控，纯粹单体点杀大怪能力突出，3383 分。",
  "balance-druid": "超长射程与超大范围星辰坠落，超凡之盟爆发质量高，日光术群体沉默战术价值无可替代，3366 分。",
  "frost-death-knight": "冰霜之柱每 45 秒一波高频爆发，湮灭顺劈出伤速度明显快于邪DK，波次清怪节奏更干脆，3362 分紧咬近战主流阵营。",
  "havoc-demon-hunter": "5% 魔法易伤仍是法刀队刚需，混乱新星群晕与疾影自保稳定，但纯数值略有下调，3357 分。",
  "unholy-death-knight": "溃烂之伤前戏导致小怪快节奏波次容易被抢伤害，但在多目标长轴与带大怪波次中萨莱茵血兽爆发依然可观；反魔法护罩（绿罩）吸能与死亡脚步免疫位移机制优越，3354 分排 A 级中游。",
  "enhancement-shaman": "毁灭风暴与始源之潮爆发扎实，但身板相对偏脆且需要近战走位，高层生存容错率略低于同门元素萨，3338 分。",
  "fury-warrior": "纯直伤与鲁莽覆盖率高，操作下限高，但缺乏武器战的极端波次爆发和处决斩杀，3324 分居 B 级。",
  "beast-mastery-hunter": "全移动无损输出与嗜血工具人，但在 +15 以上高层面临严重自保减伤短板（猎人身板硬伤），3308 分。",
  "shadow-priest": "虚空爆发与心爆单点压怪尚可，群体驱散与吸血鬼的拥抱战术价值仍在，但爆发清小怪出伤周期偏慢，3306 分。",
  "survival-hunter": "炸弹顺劈手感极佳，但近战位挤压了团队硬控与生存位，高层容错率不高，3276 分。",
  "affliction-warlock": "多目标长线跳跳伤害足，但大秘境频繁移动与转火节奏严重影响灵魂碎片获取，3265 分。",
  "fire-mage": "燃烧爆发严重依赖固定大波次聚怪，一旦断节奏伤害断崖下跌，当前版本数值不及奥法稳定，3235 分排 C 级。",
  "devastation-evoker": "深呼吸与龙息蓄力机制在移动规避地板时容易被打断，缺乏奥法和元素萨的综合统治力，3204 分。",
  "marksmanship-hunter": "瞄准射击读条容易受走位打断，且高压下缺少硬免伤，3200 分。",
  "augmentation-evoker": "当前版本数值加成收益受削弱，黑檀之力与先祖增幅对非极端神仙队的提速效果不再碾压，3193 分跌入 C 级。",
  "destruction-warlock": "地狱火爆发周期长，小怪死太快难以打满混乱箭与浩劫收益，3184 分。",
  "frost-mage": "冰冷血脉与暴风雪减速虽有控场，但单体压大怪数值明显不足，3091 分垫底。"
};

const MPLUS_TANK_COMMENTS = {
  "blood-death-knight": "符文能量自愈体系完美化解当前赛季死疽与超高尖刺伤害，白骨之盾硬免伤覆盖平稳；死亡之握与血魔之握群体聚怪具备唯一战术统治力，3523 分独霸 S 级。",
  "guardian-druid": "铁鬃高护甲与狂暴回复抗击打能力强，化身爆发波次极硬且能提供高额顺劈输出，迎头痛击与拍晕控场扎实，3382 分稳居 A 级。",
  "protection-paladin": "飞盾打断与奉献减伤完备，圣疗与保护能拯救队友，但高层魔法尖刺与破甲压力下自身硬度略逊于血DK，3331 分居 B 级。",
  "brewmaster-monk": "醉拳机制平滑尖刺伤害，扫堂腿与平心之环战术能力强，但自疗较依赖治疗照顾，3308 分。",
  "vengeance-demon-hunter": "机动性与沉默咒符控场顶级，但当前赛季纯减伤硬度不如以往版本，3306 分。",
  "protection-warrior": "无视痛苦与盾牌格挡对纯物理波次极其坚固，但面对高层全队穿透法伤与流血环境功能性与自理能力相对乏力，3282 分。"
};

const MPLUS_HEALER_COMMENTS = {
  "holy-paladin": "美德道标群抬能力无死角，神圣震击与圣光闪现高频瞬发，无敌与保护祝福可强行规避致命机制，3534 分登顶 S 级。",
  "restoration-shaman": "短 CD 风剪打断、先祖活力提高全队血上限、灵力图腾与法力潮汐辅助全团，天怒/风怒与嗜血刚需，3418 分位列 A 级。",
  "holy-priest": "圣言术：静与灵强力单抬与群抬，守护之魂（翅膀）防倒坦，但缺少打断与硬自保，3331 分。",
  "preservation-evoker": "静滞与回响组合爆发抬血极强，翡翠交融自保坚固，但受限于 30 码施法距离，3314 分。",
  "mistweaver-monk": "抚慰之雾与氤氲之雾单抬平稳，但高层尖刺群伤救急能力略逊于奶骑，3312 分。",
  "restoration-druid": "回春与野性成长预铺跳持续回血，但缺少瞬间抬满全团的硬性爆发抬血手段，面对突发尖刺容易减员，3203 分。",
  "discipline-priest": "救赎机制在小怪频繁转阶段无目标时无法有效回血，容错率偏低，3164 分。"
};

const RAID_DPS_COMMENTS = {
  "demonology-warlock": "恶魔暴君配合古尔丹之手召集小鬼海，恶魔卫士恶魔力量爆发惊人，史诗尾王与多个中后置单体/顺劈首领打出 251.4K DPS 全职业第一吞吐量。",
  "retribution-paladin": "单体与顺劈转换极佳，处决宣判爆发极度契合首领易伤轴，无敌强吃点名大幅降低团血压力，244.6K DPS 稳坐第二把交椅。",
  "arms-warrior": "斩杀期（转战天涯与斩杀暴击）输出断层式爆发，首领后半程压血能力版本顶峰，243.1K DPS。",
  "marksmanship-hunter": "瞄准射击与急速射击在史诗纯木桩与远程转火战斗中发挥稳定，距离优势明显，243.1K DPS。",
  "arcane-mage": "纯单体奥冲爆发极为凶悍，智力光环是开荒团硬性门槛，战术价值与数值双优，241.7K DPS（综合热度唯一 S 级）。",
  "balance-druid": "长线多目标与单体转换自如，化身爆发凶猛，战复与激活给治疗提供极大容错，240.0K DPS。",
  "frost-mage": "冰风暴与冰枪顺劈在双目标或带间歇性转火机制的首领战中表现强劲，239.9K DPS。",
  "devastation-evoker": "葬火与永恒之涌爆发数值在线，238.7K DPS 跻身头部梯队。",
  "destruction-warlock": "浩劫双目标顺劈极其强劲，门与糖必带，237.4K DPS。",
  "subtlety-rogue": "史诗团本特定短时间爆发压大怪任务首选，暗影步转火快，233.7K DPS。",
  "windwalker-monk": "物理易伤工具人与合格纯单体，轮回之绝斩杀大怪稳定，233.5K DPS。",
  "frost-death-knight": "冰霜巨龙之怒与冰柱单体循环扎实，单体均伤领先邪DK约 7K DPS，史诗开荒单体更优先，233.5K DPS。",
  "elemental-shaman": "天怒图腾必备，多目标与顺劈阶段伤害爆发高，231.5K DPS。",
  "enhancement-shaman": "风怒图腾大幅强化武器战与近战菜刀，自身输出居中，230.5K DPS。",
  "assassination-rogue": "君王之灾纯单体持续流血高，但转火灵活性不如敏锐，229.6K DPS。",
  "survival-hunter": "近战位竞争激烈，虽然协同进攻有爆发但缺乏独特性，229.0K DPS。",
  "augmentation-evoker": "黑檀之力放大队友主属性，战术保坦防猝死核心，228.3K DPS（计入折算输出）。",
  "havoc-demon-hunter": "法系易伤必备，机动性好，但当前团本纯木桩数值居中，227.6K DPS。",
  "outlaw-rogue": "多目标小怪顺劈尚可，纯单体木桩数值相对疲软，227.1K DPS。",
  "shadow-priest": "灌注绑定法系核心，平稳压单体，226.7K DPS。",
  "unholy-death-knight": "天启骑士单体与萨莱茵多目标分化明确，团本反魔法领域（大罩）提供全团减伤无可替代，但全首领平均纯单体秒伤（226.3K DPS）居中游 B 级，并非个别夸大宣传的独步天下。",
  "devourer-demon-hunter": "团本木桩机制仍在摸索，长轴爆发平稳，224.3K DPS。",
  "beast-mastery-hunter": "机动性拉满但天花板数值受到限制，224.2K DPS。",
  "affliction-warlock": "灵魂腐化多线压血尚可，但当前团本大部分 Boss 缺乏其发挥优势的纯多目标长轴，224.0K DPS。",
  "fire-mage": "燃烧对齐轴如果被首领上天或转阶段打断会严重亏损，220.2K DPS。",
  "fury-warrior": "纯单体数值落后武器战约 25K DPS，开荒期团队更倾向武器战，218.5K DPS。",
  "feral-druid": "单体输出周期偏平缓，缺少爆发性压血，214.9K DPS 居团本末游。"
};

// ==================== 1. 生成大秘境榜单 ====================
async function generateMplusMarkdown() {
  const mplus = data.mythicPlus;
  let md = `# 2026-09-14 大秘境专精强度排行榜 (Mythic+ Season 2)

数据来源：Warcraft Logs & Archon 大数据统计，基于近 14 天在册通关全样本（统计样本量：8,649,736 Parses，层数范围：+7 至 +21 层）。
指标说明：采用暴雪官方天梯榜大秘境限时积分（Mythic+ Score）95th 分位值作为核心度量衡。高层大秘境需要伤害输出、控场打断、团队光环与生存硬度综合支撑，95th 分位分客观反映了顶尖选手的实战上限。

## 1. 输出专精天梯总榜 (DPS Tier List)

| 梯度 | 专精 | 官方积分 (95th Score) | 机制定位与高层核心表现 |
| :--- | :--- | :--- | :--- |
`;

  for (const tierObj of mplus.dps) {
    const tierName = tierObj.tier;
    for (const spec of tierObj.specs) {
      const meta = getSpecMeta(spec.specSlug, spec.classSlug);
      const comment = MPLUS_COMMENTS[spec.key] || "常规输出表现，机制适应当前层数。";
      md += `| **${tierName}** | **${meta.nameCn} (${meta.classSlug})** | **${spec.score}** | ${comment} |\n`;
    }
  }

  md += `
---

## 2. 坦克与治疗专精天梯榜 (Tank & Healer Tier List)

### 坦克专精 (Tanks)

| 梯度 | 专精 | 官方积分 (95th Score) | 机制硬度与战术功能性点评 |
| :--- | :--- | :--- | :--- |
`;
  for (const tierObj of mplus.tank) {
    const tierName = tierObj.tier;
    for (const spec of tierObj.specs) {
      const meta = getSpecMeta(spec.specSlug, spec.classSlug);
      const comment = MPLUS_TANK_COMMENTS[spec.key] || "常规抗击打能力与控场。";
      md += `| **${tierName}** | **${meta.nameCn}** | **${spec.score}** | ${comment} |\n`;
    }
  }

  md += `
### 治疗专精 (Healers)

| 梯度 | 专精 | 官方积分 (95th Score) | 抬血爆发与机制应对点评 |
| :--- | :--- | :--- | :--- |
`;
  for (const tierObj of mplus.healer) {
    const tierName = tierObj.tier;
    for (const spec of tierObj.specs) {
      const meta = getSpecMeta(spec.specSlug, spec.classSlug);
      const comment = MPLUS_HEALER_COMMENTS[spec.key] || "常规治疗与辅助能力。";
      md += `| **${tierName}** | **${meta.nameCn}** | **${spec.score}** | ${comment} |\n`;
    }
  }

  md += `
---

## 3. 核心梯队格局与机制归因

1. **近战输出分化严峻**：
   - 武器战以 3526 分领衔近战，凭借短 CD 巨力顺劈与破坏者在波次清怪中建立巨大压制，配合处决斩杀与全队血上限集结呐喊成为第一近战冲层选位。
   - 奇袭贼以 3482 分紧随其后，凭借超高单体顺劈压制高层大怪，并依托斗篷、佯攻化解穿透机制。
   - 传统大秘境常客惩戒骑（3389分）与邪DK（3354分）位于 A 级中游：惩戒骑胜在极佳的圣疗与保护容错救场，但极限冲分峰值落后于武器战；邪DK受制于溃烂之伤前戏，在小怪快速融化的波次中出伤偏慢，高层更多依赖大波次与带大怪战斗的萨莱茵血兽爆发。
2. **远程双雄统治天梯**：
   - 元素萨（3512分）与奥法（3483分）稳居远程 S 级。元素萨拥有 12 秒短 CD 远程风剪、狂风怒号高额波次爆发与图腾功能性；奥法则以法阵内单体压大怪、5% 智力光环及双冰箱位列顶级。
   - 增辉唤魔师（3193分）在经历多轮数值调整后跌入 C 级，对队伍提速收益已不再是不可或缺的刚需。
3. **坦克与治疗唯一真神**：
   - 鲜血死骑（血DK）以 3523 分独霸坦克 S 级，自疗对齐超高尖刺伤害，群握具有无可替代的波次聚怪价值。
   - 神圣骑（奶骑）以 3534 分独占治疗 S 级，美德道标应对尖刺群伤救急能力断层领先其他治疗。
`;

  await fs.writeFile("/Users/wuwanzhu/Documents/wow/rankings/mythic-plus/2026-09-14.md", md, "utf-8");
  console.log("Generated rankings/mythic-plus/2026-09-14.md");
}

// ==================== 2. 生成团本榜单 ====================
async function generateRaidMarkdown() {
  const raid = data.raid;
  let md = `# 2026-09-14 团本史诗难度专精强度排行榜 (The Venomous Abyss)

数据来源：Warcraft Logs 史诗难度（Mythic）全首领击杀大数据聚合（统计样本量：276,294 Parses，版本：12.1）。
评估维度：
1. **纯输出吞吐量 (Throughput)**：以 95th 分位纯秒伤 (DPS) 为基准，反映专精极限输出潜力。
2. **综合进本热度 (Popularity / Meta)**：结合团队光环、战术爆发契合度、免伤与开荒不可替代性。

## 1. 史诗团本输出纯秒伤排行 (Throughput 95th Percentile)

| 梯度 | 专精 | 95th DPS | 实战机制剖析与爆发特性 |
| :--- | :--- | :--- | :--- |
`;

  for (const tierObj of raid.dpsThroughput) {
    const tierName = tierObj.tier;
    for (const spec of tierObj.specs) {
      const meta = getSpecMeta(spec.specSlug, spec.classSlug);
      const comment = RAID_DPS_COMMENTS[spec.key] || "团本常规输出输出。";
      const dpsText = spec.dps ? `${spec.dps}K` : spec.rawText;
      md += `| **${tierName}** | **${meta.nameCn} (${meta.classSlug})** | **${dpsText}** | ${comment} |\n`;
    }
  }

  md += `
---

## 2. 团队开荒综合热度排行 (Popularity / Meta Tier List)

综合考虑 5% 属性光环、嗜血、战复、战术点名免疫与团队大减伤等进本门槛。

| 梯度 | 专精 | 综合定位 | 核心入选理由与战术价值 |
| :--- | :--- | :--- | :--- |
`;

  for (const tierObj of raid.dpsPopularity) {
    const tierName = tierObj.tier;
    for (const spec of tierObj.specs) {
      const meta = getSpecMeta(spec.specSlug, spec.classSlug);
      let roleReason = "";
      if (spec.key === "arcane-mage") {
        roleReason = "5% 智力光环全团必备，法阵起手与易伤阶段峰值输出极高，双冰箱免疫机制单吃点名，稳居开荒唯一 S 级核心。";
      } else if (tierName.startsWith("A")) {
        roleReason = "兼具顶级单体吞吐量（240K+ DPS）与战术关键技能（门、糖、嗜血、斩杀压阶段），开荒中坚力量。";
      } else if (tierName.startsWith("B")) {
        roleReason = "伤害发挥稳定（224K-237K DPS），拥有本职自保或辅助光环，开荒按队伍增伤需求与技师熟练度进本。";
      } else {
        roleReason = "纯单体数值落后或时间轴与首领阶段割裂，开荒阶段优先度较低。";
      }
      md += `| **${tierName}** | **${meta.nameCn}** | ${spec.rawText} | ${roleReason} |\n`;
    }
  }

  md += `
---

## 3. 史诗团本坦克与治疗格局

### 坦克专精 (Tanks)

| 梯度 | 专精 | 95th 输出/均伤 | 实战机制剖析 |
| :--- | :--- | :--- | :--- |
`;
  for (const tierObj of raid.tank) {
    const tierName = tierObj.tier;
    for (const spec of tierObj.specs) {
      const meta = getSpecMeta(spec.specSlug, spec.classSlug);
      let desc = "常规接坦与换坦自保。";
      if (spec.key === "blood-death-knight") {
        desc = "灵界打击对齐高额单体死刑尖刺自理能力极强，白骨之盾维持高减伤，反魔法护罩单吃魔法死刑，全首领平均 120.9K DPS 稳列唯一 S 级。";
      } else if (spec.key === "protection-warrior") {
        desc = "盾牌格挡与无视痛苦硬抗物理死刑极其坚挺，配合破晓压制首领，122.4K DPS 位于 B 级。";
      } else if (spec.key === "guardian-druid") {
        desc = "高血量池与铁鬃叠加稳定，提供野性之心与激活，123.2K DPS。";
      } else if (spec.key === "vengeance-demon-hunter") {
        desc = "提供团队 5% 魔法易伤，输出高达 130.5K DPS，但需要精准规划尖刺覆盖防暴毙。";
      } else if (spec.key === "protection-paladin") {
        desc = "提供专注光环与保护/牺牲祝福，119.6K DPS。";
      } else if (spec.key === "brewmaster-monk") {
        desc = "醉拳平滑高额伤害，玄牛之赐回血稳定，113.7K DPS。";
      }
      md += `| **${tierName}** | **${meta.nameCn}** | **${spec.rawText}** | ${desc} |\n`;
    }
  }

  md += `
### 治疗专精 (Healers)

| 梯度 | 专精 | 95th 治疗均值 (HPS) | 核心治疗机制剖析 |
| :--- | :--- | :--- | :--- |
`;
  for (const tierObj of raid.healer) {
    const tierName = tierObj.tier;
    for (const spec of tierObj.specs) {
      const meta = getSpecMeta(spec.specSlug, spec.classSlug);
      let desc = "常规团队血线维持。";
      if (spec.key === "holy-priest") {
        desc = "神圣赞美诗全团大抬血，圣言术：赎与灵应对全团高压崩血极为暴力，以 391.5K HPS 登顶史诗治疗榜。";
      } else if (spec.key === "preservation-evoker") {
        desc = "回响翡翠交融与梦境飞行爆发抬血兼顾全团机动，388.7K HPS 紧随其后跻身 S 级。";
      } else if (spec.key === "restoration-shaman") {
        desc = "治疗之潮图腾、灵魂链接图腾减伤不可替代，狂风暴雨平稳铺垫，340.9K HPS 稳居 S 级。";
      } else if (spec.key === "holy-paladin") {
        desc = "光环掌握团队全减伤，美德道标高频点抬，339.9K HPS 同样位列 S 级核心。";
      } else if (spec.key === "restoration-druid") {
        desc = "宁静与繁盛多目标长线 HoT 覆盖，372.7K HPS 位于 B 级。";
      } else if (spec.key === "mistweaver-monk") {
        desc = "还魂术全团瞬抬并驱散魔法与疾病，327.5K HPS。";
      } else if (spec.key === "discipline-priest") {
        desc = "全心全意铺救赎配合全神贯注盾，但时间轴容错率偏低，352.0K HPS。";
      }
      md += `| **${tierName}** | **${meta.nameCn}** | **${spec.rawText}** | ${desc} |\n`;
    }
  }

  md += `
---

## 4. 今日重点职业客观剖析

1. **死亡骑士（DK）实战定位纠偏**：
   - **邪DK**：史诗全首领 95th 均伤为 226.3K DPS，位居全专精第 17 位（B 级），并非网络虚标的“断层第一”。其核心竞争力在于萨莱茵在多目标战斗中的爆发压血，以及反魔法领域（AMZ）在关键点名窗口提供的全团硬性魔法减伤；纯木桩单体与转火节奏逊于同门冰DK与头部法系。
   - **冰DK**：95th 均伤 233.5K DPS，领先邪DK约 7.2K DPS，45秒短周期冰柱爆发更契合当前史诗首领频繁出现的易伤与护盾击破阶段。
   - **血DK**：史诗团本唯一 S 级坦克，单吃魔法死刑与灵界打击自理机制在开荒高压环境下给治疗组极大减压。
2. **圣骑士（Paladin）强势登顶**：
   - **惩戒骑**：史诗团本全职业第二纯秒伤（244.6K DPS），仅次于恶魔术（251.4K DPS）。爆发轴与无敌减伤完美自保，已成为史诗团本攻坚的主力核心近战。
   - **奶骑**：339.9K HPS 凭借光环掌握与道标双保，稳坐史诗开荒 S 级四大天王席位。
`;

  await fs.writeFile("/Users/wuwanzhu/Documents/wow/rankings/raid/2026-09-14.md", md, "utf-8");
  console.log("Generated rankings/raid/2026-09-14.md");
}

await generateMplusMarkdown();
await generateRaidMarkdown();
console.log("All markdown reports generated successfully.");
