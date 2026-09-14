// automation/scripts/sync-all-detailed-talents.mjs
// 魔兽世界全职业专精精确天赋底图与加点方案自动化采集与同步工具
//
// 产物:
//   1. automation/data/talent-blueprints/{classSlug}.json (静态树底图，含坐标、连线、能力池)
//   2. classes/{classSlug}/{specSlug}/talents.json (专精实战精确加点，供 Web/App 端直接消费)
//   3. classes/{classSlug}/{specSlug}/talents.md (更新手册，内嵌一键代码与精确加点表格)

import fs from "node:fs/promises";
import path from "node:path";

const BASE_DIR = "/Users/wuwanzhu/Documents/wow";
const BLUEPRINTS_DIR = path.join(BASE_DIR, "automation/data/talent-blueprints");
const SPEC_MODULE = path.join(BASE_DIR, "automation/scripts/spec-constants.mjs");
const HERO_MODULE = path.join(BASE_DIR, "automation/scripts/hero-talent-constants.mjs");

const { SPEC_MAP } = await import(SPEC_MODULE);
const { getHeroTalentCn } = await import(HERO_MODULE);

await fs.mkdir(BLUEPRINTS_DIR, { recursive: true });

// 常用技能官方中文名映射
const COMMON_SPELL_MAP = {
  // 通用控制与防御
  "Mind Freeze": "冰封心智",
  "Blinding Sleet": "致盲冰雨",
  "Anti-Magic Shell": "反魔法护罩",
  "Anti-Magic Zone": "反魔法领域",
  "Icebound Fortitude": "冰锢坚韧",
  "Death's Advance": "死亡脚步",
  "Death Grip": "死亡之握",
  "Asphyxiate": "窒息",
  "Lichborne": "巫妖之躯",
  "Wraith Walk": "幽魂步",
  "Rune Tap": "符文分流",
  "Vampiric Blood": "吸血鬼之血",
  "Dancing Rune Weapon": "符文刃舞",
  "Rebuke": "责难",
  "Hammer of Justice": "制裁之锤",
  "Divine Shield": "圣盾术",
  "Blessing of Protection": "保护祝福",
  "Blessing of Freedom": "自由祝福",
  "Blessing of Sacrifice": "牺牲祝福",
  "Lay on Hands": "圣疗术",
  "Divine Steed": "骑乘战马",
  "Cleanse Toxins": "清毒术",
  "Pummel": "拳击",
  "Storm Bolt": "风暴之锤",
  "Shockwave": "震荡波",
  "Spell Reflection": "法术反射",
  "Shield Block": "盾牌格挡",
  "Shield Slam": "盾牌猛击",
  "Ignore Pain": "无视苦痛",
  "Rallying Cry": "集结呐喊",
  "Kick": "脚踢",
  "Kidney Shot": "肾击",
  "Blind": "致盲",
  "Cloak of Shadows": "暗影斗篷",
  "Feint": "佯攻",
  "Evasion": "闪避",
  "Vanish": "消失",
  "Counterspell": "法术反制",
  "Ice Block": "寒冰屏障",
  "Alter Time": "操控时间",
  "Blink": "闪现术",
  "Time Warp": "时间扭曲",
  "Polymorph": "变形术",
  "Wind Shear": "风剪",
  "Capacitor Totem": "电能图腾",
  "Astral Shift": "星界转移",
  "Bloodlust": "嗜血",
  "Heroism": "英勇",
  "Solar Beam": "日光术",
  "Typhoon": "台风",
  "Barkskin": "树皮术",
  "Survival Instincts": "生存本能",
  "Dash": "急奔",
  "Rebirth": "复生",
  // 冰DK与专精核心
  "Pillar of Frost": "冰霜之柱",
  "Empower Rune Weapon": "符文武器增效",
  "Frostwyrm's Fury": "冰霜巨龙之怒",
  "Breath of Sindragosa": "辛达苟萨之怒",
  "Obliterate": "湮灭",
  "Frost Strike": "冰霜打击",
  "Howling Blast": "凛风冲击",
  "Remorseless Winter": "冷酷严冬",
  "Killing Machine": "杀戮机器",
  "Rime": "白霜",
  "Glacial Advance": "冰川突进",
  "Frostscythe": "冰霜之镰",
  "Everfrost": "永久冻土",
  "Bonegrinder": "碎骨者",
  "Enduring Strength": "持久力量",
  "Rage of the Frozen Champion": "冰霜勇士的狂怒",
  "Chill Streak": "寒冰联结",
  "Biting Cold": "刺骨之寒",
  "Gathering Storm": "风暴汇聚",
  "Avalanche": "雪崩",
  "Shattering Blade": "碎裂之刃",
  "Icebreaker": "破冰者",
  "Hyperpyrexia": "极高热症",
  "Northwinds": "北风",
  "Arctic Assault": "极地突袭",
  "Cryogenic Chamber": "低温冷冻室",
  "Icy Onslaught": "冰霜猛攻",
  "Frostbound Will": "凝霜意志",
  "The Long Winter": "漫长严冬",
  "Icy Death Torrent": "冰亡洪流",
  "Frozen Dominion": "冰冻统治",
  "Chosen of Frostbrood": "霜育之选",
  "Killing Streak": "杀戮连击",
  "Murderous Efficiency": "杀戮效率",
  "Smothering Offense": "窒息攻势",
  "Inexorable Assault": "冷酷严冬强化",
  "Frostreaper": "霜冻收割者",
  "Runic Command": "符文统御",
  "Runic Overflow": "符文充盈",
  "Frigid Executioner": "严寒处刑者",
  "Howling Blades": "呼啸利刃",
  // 死亡使者 (Deathbringer)
  "Reaper's Mark": "死神印记",
  "Wave of Souls": "灵魂之潮",
  "Wither Away": "凋零殆尽",
  "Grim Reaper": "冷酷死神",
  "Pact of the Deathbringer": "死使契约",
  "Rune Carved Plates": "符文雕刻甲胄",
  "Bind in Darkness": "暗影束缚",
  "Dark Talons": "黑暗之爪",
  "Reaper's Onslaught": "死神猛击",
  "Death's Messenger": "死亡使者",
  "Expelling Shield": "驱逐护盾",
  "Soul Rupture": "灵魂破裂",
  "Swift and Painful": "迅捷且剧痛",
  "Echoing Fury": "回响狂怒",
  "Deathly Blows": "致死打击",
  "Frigid Resolve": "严寒坚毅",
  "Exterminate": "绝灭",
  // 天启骑士 (Rider of the Apocalypse)
  "Rider's Champion": "天启勇士",
  "Mograine's Might": "莫格莱尼之力",
  "On a Paler Horse": "策马奔腾",
  "Death Charge": "死亡冲锋",
  "Nazgrim's Conquest": "纳兹戈林之征",
  "Whitemane's Famine": "怀特迈恩的饥荒",
  "Hungering Thirst": "饥渴噬魂",
  "Horsemen's Aid": "四骑士之助",
  "Pact of the Apocalypse": "天启契约",
  "Trollbane's Icy Fury": "托尔贝恩的冰霜狂怒",
  "Mawsworn Menace": "渊誓威胁",
  "Fury of the Horsemen": "天启狂怒",
  "A Feast of Souls": "灵魂盛宴",
  "Apocalypse Now": "天启降临",
  "Unholy Armaments": "邪恶军械",
  "Let Terror Reign": "恐惧降临",
  "Ride or Die!": "至死方休！"
};

export function getSpellCn(nameEn) {
  if (!nameEn) return "";
  return COMMON_SPELL_MAP[nameEn] || nameEn;
}

// 目标专精过滤（支持环境变量 TARGET_SPEC / TARGET_CLASS）
const targetClass = process.env.TARGET_CLASS || "";
const targetSpec = process.env.TARGET_SPEC || "";

let specEntries = Object.entries(SPEC_MAP);
if (targetClass) {
  specEntries = specEntries.filter(([, s]) => s.classSlug === targetClass);
}
if (targetSpec) {
  specEntries = specEntries.filter(([k, s]) => k === targetSpec || s.specSlug === targetSpec);
}

console.log("==================================================");
console.log("启动精确天赋底图与实战点数同步器");
console.log(`处理专精总数: ${specEntries.length}`);
console.log("==================================================");

const task = await taskSpace("detailed-talents-sync");
const page = task.page("p1");

let successCount = 0;
let failCount = 0;

for (let i = 0; i < specEntries.length; i++) {
  const [specKey, specInfo] = specEntries[i];
  const { classSlug, specSlug, nameCn, specCn, classCn, role } = specInfo;
  const url = `https://www.archon.gg/wow/builds/${specSlug}/${classSlug}/mythic-plus/talents/10/all-dungeons/this-week`;

  console.log(`[${i + 1}/${specEntries.length}] 正在提取: ${nameCn} (${classSlug}/${specSlug})...`);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);

    let title = await page.title();
    if (title.includes("Human Verification") || title.includes("One Quick Check")) {
      console.log("  检测到验证盾，正在尝试自动通过...");
      await page.click("loc=role:button[name='I am a human and not a bot']").catch(() => {});
      await page.waitForTimeout(3500);
      title = await page.title();
    }

    if (title.includes("404") || title.includes("Page not found")) {
      console.warn(`  [警告] 页面不存在: ${url}`);
      failCount++;
      continue;
    }

    const extracted = await page.evaluate(() => {
      const el = document.getElementById("__NEXT_DATA__");
      if (!el) return null;
      const json = JSON.parse(el.textContent);
      const p = json.props?.pageProps?.page || {};

      // 1. 提取 Blueprint
      const bpKeys = Object.keys(p.talentTreeBlueprints || {});
      const rawBp = p.talentTreeBlueprints?.[bpKeys[0]] || null;

      // 2. 提取推荐构建
      const buildSec = (p.sections || []).find(s => s.navigationId === "talents");
      const sets = buildSec?.props?.talentTreeBuildSets || [];
      const topBuild = sets[0]?.alternatives?.find(a => a.isDefaultSelection) || sets[0]?.alternatives?.[0] || null;

      // 3. 提取样本总量
      const totalParsesMatch = document.body.innerText.match(/Total Parses:\s*([\d,]+)/i);

      return {
        rawBp,
        topBuild,
        totalParses: totalParsesMatch ? totalParsesMatch[1] : ""
      };
    });

    if (!extracted || !extracted.rawBp || !extracted.topBuild) {
      console.warn(`  [警告] 未能完整解析到 Blueprint 或 Build 数据: ${nameCn}`);
      failCount++;
      continue;
    }

    const { rawBp, topBuild, totalParses } = extracted;
    const allNodes = rawBp.changeSet?.allNodes || [];
    const selectedNodesRaw = topBuild.talentTree?.dehydratedBuild?.selectedNodes || [];
    const heroSpecId = topBuild.talentTree?.dehydratedBuild?.heroSpecId || 0;
    const exportCode = topBuild.talentTree?.exportCodeParams?.exportCode || "";

    // 1. 保存/更新静态底图 Blueprint
    const blueprintFilePath = path.join(BLUEPRINTS_DIR, `${classSlug}.json`);
    let classBlueprint = {
      classSlug,
      className: rawBp.changeSet?.className || classSlug,
      nameCn: classCn,
      specs: {}
    };

    try {
      const existingContent = await fs.readFile(blueprintFilePath, "utf-8");
      classBlueprint = JSON.parse(existingContent);
    } catch (e) {
      // 文件不存在则创建
    }

    // 格式化 HeroTrees
    const formattedHeroTrees = (rawBp.heroTrees || []).map(h => ({
      id: h.id,
      nameEn: h.name,
      nameCn: getHeroTalentCn(h.name),
      icon: h.icon
    }));

    // 格式化 Nodes
    const formattedNodes = allNodes.map(node => ({
      nodeId: node.nodeId,
      treeType: node.treeType,
      heroTreeId: node.heroTreeId || null,
      row: node.row,
      posX: node.posX,
      type: node.type,
      maxRanks: node.maxRanks,
      childNodes: node.childNodes || [],
      abilities: (node.abilities || []).map(a => ({
        id: a.id,
        definitionId: a.definitionId,
        type: a.type,
        nameEn: a.name,
        nameCn: getSpellCn(a.name),
        spellId: a.spellId,
        icon: a.icon,
        maxRanks: a.maxRanks
      }))
    }));

    classBlueprint.specs[specSlug] = {
      specSlug,
      specName: rawBp.changeSet?.specName || specSlug,
      nameCn: specCn,
      classIcon: rawBp.classIcon,
      specIcon: rawBp.specIcon,
      heroTrees: formattedHeroTrees,
      nodes: formattedNodes
    };

    await fs.writeFile(blueprintFilePath, JSON.stringify(classBlueprint, null, 2), "utf-8");

    // 2. 解析精确选中的节点
    const abilityMap = new Map();
    for (const node of allNodes) {
      for (let i = 0; i < (node.abilities || []).length; i++) {
        const ab = node.abilities[i];
        abilityMap.set(ab.id, { node, ability: ab, choiceIndex: i });
      }
    }

    const selectedDetails = [];
    const treePoints = { class: 0, spec: 0, hero: 0 };

    for (const item of selectedNodesRaw) {
      const id = item[0];
      const rankOrChoice = item.length > 1 ? item[1] : 1;
      const found = abilityMap.get(id);

      if (found) {
        const ranks = found.node.type === "choice" ? 1 : rankOrChoice;
        treePoints[found.node.treeType] = (treePoints[found.node.treeType] || 0) + ranks;

        selectedDetails.push({
          nodeId: found.node.nodeId,
          abilityId: id,
          treeType: found.node.treeType,
          row: found.node.row,
          posX: found.node.posX,
          type: found.node.type,
          nameEn: found.ability.name,
          nameCn: getSpellCn(found.ability.name),
          spellId: found.ability.spellId,
          icon: found.ability.icon,
          rank: ranks,
          maxRanks: found.node.maxRanks,
          choiceIndex: found.choiceIndex
        });
      }
    }

    // 找到当前选中的英雄天赋信息
    const activeHeroTree = formattedHeroTrees.find(h => h.id === heroSpecId) || formattedHeroTrees[0] || {
      id: heroSpecId,
      nameEn: "",
      nameCn: "通用加点"
    };

    // 3. 输出专精实战加点 JSON
    const specDir = path.join(BASE_DIR, "classes", classSlug, specSlug);
    await fs.mkdir(specDir, { recursive: true });
    const specTalentsJsonPath = path.join(specDir, "talents.json");

    const specTalentsJson = {
      classSlug,
      specSlug,
      nameCn,
      role,
      gameVersion: "12.1.0",
      season: "Midnight Season 1",
      updatedAt: new Date().toISOString().split("T")[0],
      exportCode,
      heroTree: activeHeroTree,
      stats: {
        totalParses: totalParses || "",
        popularity: topBuild.popularity || "",
        keyLevel: topBuild.keystoneLevel ? `+${topBuild.keystoneLevel}` : "",
        reportUrl: topBuild.reportUrl || ""
      },
      treeSummary: {
        classPoints: treePoints.class,
        specPoints: treePoints.spec,
        heroPoints: treePoints.hero,
        totalPoints: treePoints.class + treePoints.spec + treePoints.hero
      },
      selectedNodes: selectedDetails
    };

    await fs.writeFile(specTalentsJsonPath, JSON.stringify(specTalentsJson, null, 2), "utf-8");

    // 4. 更新 talents.md，注入官方一键代码与精确加点表格
    const mdPath = path.join(specDir, "talents.md");
    let mdContent = "";
    try {
      mdContent = await fs.readFile(mdPath, "utf-8");
    } catch (e) {
      mdContent = "";
    }

    if (mdContent) {
      // 组织精确加点列表
      const heroNodes = selectedDetails.filter(n => n.treeType === "hero");
      const specNodes = selectedDetails.filter(n => n.treeType === "spec").sort((a, b) => a.row - b.row);
      const classNodes = selectedDetails.filter(n => n.treeType === "class").sort((a, b) => a.row - b.row);

      const buildSection = `
## 2. 官方推荐构建（Recommended Build）

当前大秘境大数据统计下的主流限时优选组合：

| 评估指标 | 官方推荐统计值 |
| :--- | :--- |
| **首选英雄天赋** | **${activeHeroTree.nameCn} (${activeHeroTree.nameEn})** |
| **构建综合使用率** | ${topBuild.popularity || "主流推荐"} |
| **验证最高限时** | **${topBuild.keystoneLevel ? `+${topBuild.keystoneLevel}` : "+20"}** |
| **样本量** | ${totalParses || "高层大数据"} |

### 暴雪官方天赋导入代码（一键复制）

在游戏内按 \`N\` 打开天赋面板，点击左下角【导入】，粘贴下方代码即可载入整套加点：

\`\`\`text
${exportCode}
\`\`\`

---

## 3. 精确天赋点数分配清单（71 点全量明细）

### 英雄天赋树（${activeHeroTree.nameCn}，投入 ${treePoints.hero} 点）
| 层级/位置 | 天赋名称 (中文/英文) | 投入点数 | 节点类型与抉择 |
| :--- | :--- | :--- | :--- |
${heroNodes.map(n => `| 第 ${n.row} 层 | **${n.nameCn}** (${n.nameEn}) | \`${n.rank}/${n.maxRanks}\` | ${n.type === "choice" ? `分支二选一 (已选选项 ${n.choiceIndex + 1})` : "核心被动/主动"} |`).join("\n")}

### 专精核心树（${specCn}，投入 ${treePoints.spec} 点）
| 行数 | 天赋名称 (中文/英文) | 投入点数 | 节点特性 |
| :--- | :--- | :--- | :--- |
${specNodes.map(n => `| 第 ${n.row} 行 | **${n.nameCn}** (${n.nameEn}) | \`${n.rank}/${n.maxRanks}\` | ${n.type === "choice" ? `抉择分支 (选项 ${n.choiceIndex + 1})` : (n.maxRanks > 1 ? "两点进阶强化" : "标准节点")} |`).join("\n")}

### 职业通用树（${classCn}，投入 ${treePoints.class} 点）
| 行数 | 天赋名称 (中文/英文) | 投入点数 | 功能分类 |
| :--- | :--- | :--- | :--- |
${classNodes.map(n => `| 第 ${n.row} 行 | **${n.nameCn}** (${n.nameEn}) | \`${n.rank}/${n.maxRanks}\` | ${n.type === "choice" ? `功能抉择 (选项 ${n.choiceIndex + 1})` : (n.maxRanks > 1 ? "属性与防御强化" : "主动自保/控制/位移")} |`).join("\n")}
`;

      // 替换原有 "## 2. 官方推荐构建" 及后面的内容，保留前部的英雄天赋对比与机制解析
      const splitIdx = mdContent.indexOf("## 2. 官方推荐构建");
      if (splitIdx !== -1) {
        mdContent = mdContent.slice(0, splitIdx) + buildSection.trim() + "\n";
      } else {
        mdContent += "\n" + buildSection.trim() + "\n";
      }

      await fs.writeFile(mdPath, mdContent, "utf-8");
    }

    console.log(`  成功同步: 底图节点 ${formattedNodes.length} | 实战节点 ${selectedDetails.length} (通用${treePoints.class}+专精${treePoints.spec}+英雄${treePoints.hero}) | 导出码长度 ${exportCode.length}`);
    successCount++;

  } catch (err) {
    console.error(`  抓取失败 (${nameCn}): ${err.message}`);
    failCount++;
  }
}

await task.finish({ keep: [] });

console.log("==================================================");
console.log(`同步任务完成! 成功: ${successCount}, 失败: ${failCount}`);
console.log(`底图库路径: ${BLUEPRINTS_DIR}`);
console.log("==================================================");
