// automation/scripts/sync-all-talents-wowhead.mjs
// 魔兽世界全职业全专精天赋节点中英文权威数据（含描述、消耗、CD、子技能、Tooltip）同步工具
// 参考: Wowhead 官方 Tooltip API (locale=4 简中, locale=0 英文)

import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";

import { getHeroTreeDescription } from "./hero-talent-descriptions.mjs";

const BASE_DIR = "/Users/wuwanzhu/Documents/wow";
const BLUEPRINTS_DIR = path.join(BASE_DIR, "automation/data/talent-blueprints");
const TRANSLATIONS_FILE = path.join(BASE_DIR, "automation/data/spell-translations.json");
const CLASSES_DIR = path.join(BASE_DIR, "classes");

// 工具函数：解析 Tooltip HTML
export function parseWowheadTooltip(html) {
  if (!html) return null;

  // 清洗不可见零宽字符
  const cleanHtml = html.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // 1. 提取法术名
  const nameMatch = cleanHtml.match(/<b class="whtt-name">(.*?)<\/b>/i);
  const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, "").trim() : null;

  // 2. 提取子类别/类型（如 "天赋" / "Talent"）
  const typeMatch = cleanHtml.match(/<div class="q0">(.*?)<\/div>/i);
  const talentType = typeMatch ? typeMatch[1].replace(/<[^>]+>/g, "").trim() : null;

  // 3. 提取冷却时间 (<!--cooldownText-->...<!--cooldownText-->)
  let cooldown = null;
  const cdMatch = cleanHtml.match(/<!--cooldownText-->(.*?)<!--cooldownText-->/i);
  if (cdMatch) {
    cooldown = cdMatch[1].replace(/<[^>]+>/g, "").trim();
  }

  // 4. 提取充能 (<!--chargesText-->...<!--chargesText-->)
  let charges = null;
  const chMatch = cleanHtml.match(/<!--chargesText-->(.*?)<!--chargesText-->/i);
  if (chMatch) {
    charges = chMatch[1].replace(/<[^>]+>/g, "").trim();
  }

  // 5. 提取施法时间 (瞬发, 被动, 引导, X 秒施法时间, Instant, Passive, Channeled, X sec cast)
  let castTime = null;
  const castMatch = cleanHtml.match(/(瞬发|被动|引导|Instant|Passive|Channeled|[\d\.]+\s*(?:秒\s*施法时间|秒施法|sec cast))/i);
  if (castMatch) {
    castTime = castMatch[1].trim();
  }

  // 6. 提取消耗 (cost) 与 射程 (range)
  let cost = null;
  let range = null;

  // 查找是否有近战范围
  if (/近战范围/i.test(cleanHtml)) {
    range = "近战范围";
  } else if (/Melee Range/i.test(cleanHtml)) {
    range = "Melee Range";
  }

  // 查找 table 里的 td 和 th
  const tableMatch = cleanHtml.match(/<table width="100%"><tr><td>(.*?)<\/td>(?:<th>(.*?)<\/th>)?<\/tr><\/table>/i);
  if (tableMatch) {
    const tdText = tableMatch[1].replace(/<[^>]+>/g, "").trim();
    const thText = tableMatch[2] ? tableMatch[2].replace(/<[^>]+>/g, "").trim() : "";

    // 检查 td 是否是 cost
    if (/符文|能量|怒气|法力|集中值|旋涡|真气|碎片|连击点|Rune|Power|Mana|Energy|Rage|Focus|Maelstrom|Chi|Shard|Point|base mana/i.test(tdText)) {
      cost = tdText.replace(/值\s*值$/g, "值").trim();
    }

    // 检查 th 是否是 range
    if (/码范围|yd range/i.test(thText)) {
      range = thText;
    }
  }

  // 检查是否有在 table 外单独标出的消耗
  if (!cost) {
    const looseCostMatch = cleanHtml.match(/<\/b><\/a><br \/>([^<]*(?:法力|能量|怒气|集中值|符文|Mana|Energy|Rage|Focus|Rune)[^<]*)<table/i);
    if (looseCostMatch) {
      cost = looseCostMatch[1].replace(/值\s*值$/g, "值").trim();
    }
  }

  // 7. 提取技能正文描述与子法术
  let description = "";
  const subSpells = [];

  const qMatch = cleanHtml.match(/<div class="q">(.*?)<\/div>/s);
  if (qMatch) {
    let rawContent = qMatch[1];

    // 清洗掉注释
    rawContent = rawContent.replace(/<!--.*?-->/g, "");

    const firstSubIdx = rawContent.search(/<span style="color:\s*#FFFFFF">/i);
    if (firstSubIdx !== -1) {
      description = rawContent.substring(0, firstSubIdx)
        .replace(/<span class="tooltip-inside-icon"[^>]*><\/span>/g, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .trim();

      const subChunk = rawContent.substring(firstSubIdx);
      const subRegex = /(?:<span class="tooltip-inside-icon"[^>]*url\([^)]*\/icons\/small\/([a-zA-Z0-9_\-]+)\.(?:jpg|png)\)[^>]*><\/span>\s*)?<span style="color:\s*#FFFFFF">(.*?)<\/span>(?:<br \/>)?\s*(?:<a href="[^"]*"[^>]*>(.*?)<\/a>|([^<]+))/gis;
      let match;
      while ((match = subRegex.exec(subChunk)) !== null) {
        const subIcon = match[1] || "";
        const subName = match[2] ? match[2].replace(/<[^>]+>/g, "").trim() : "";
        const subDesc = (match[3] || match[4] || "")
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<!--.*?-->/g, "")
          .replace(/<[^>]+>/g, "")
          .trim();

        if (subName && (subDesc || subIcon)) {
          subSpells.push({
            name: subName,
            icon: subIcon,
            description: subDesc
          });
        }
      }
    } else {
      description = rawContent
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .trim();
    }

    // 如果主描述为空但存在子法术，将子法术组合为主描述
    if (!description && subSpells.length > 0) {
      description = subSpells.map(s => s.name ? `${s.name}：${s.description}` : s.description).join("\n\n");
    }
  }

  return {
    name,
    talentType,
    cost,
    range,
    castTime,
    cooldown,
    charges,
    description,
    subSpells,
    tooltipHtml: cleanHtml
  };
}

// 请求单条 tooltip 的 Promise
function fetchTooltip(spellId, locale) {
  return new Promise((resolve) => {
    const url = `https://nether.wowhead.com/tooltip/spell/${spellId}?dataEnv=1&locale=${locale}`;
    const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 8000 }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
  });
}

// 批量请求带重试
async function fetchSpellDataWithRetry(spellId, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const [cnRaw, enRaw] = await Promise.all([
      fetchTooltip(spellId, 4),
      fetchTooltip(spellId, 0)
    ]);
    if (cnRaw && enRaw) {
      const cnParsed = parseWowheadTooltip(cnRaw.tooltip);
      const enParsed = parseWowheadTooltip(enRaw.tooltip);
      return {
        spellId,
        icon: cnRaw.icon || enRaw.icon || "",
        cn: cnParsed,
        en: enParsed
      };
    }
    // 延迟重试
    if (attempt < retries) {
      await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  return null;
}

// 主流程
async function run() {
  console.log("==================================================");
  console.log("魔兽世界全职业天赋节点中英文与描述全量同步工具");
  console.log("==================================================");

  // 1. 读取所有职业底图，收集全部全局唯一 spellId
  const blueprintFiles = (await fs.readdir(BLUEPRINTS_DIR)).filter(f => f.endsWith(".json"));
  const allSpellIds = new Set();
  const spellClassMap = new Map();

  for (const f of blueprintFiles) {
    const content = await fs.readFile(path.join(BLUEPRINTS_DIR, f), "utf-8");
    const json = JSON.parse(content);
    const className = f.replace(".json", "");
    for (const spec of Object.values(json.specs || {})) {
      for (const node of spec.nodes || []) {
        for (const ab of node.abilities || []) {
          if (ab.spellId) {
            allSpellIds.add(ab.spellId);
            if (!spellClassMap.has(ab.spellId)) {
              spellClassMap.set(ab.spellId, new Set());
            }
            spellClassMap.get(ab.spellId).add(className);
          }
        }
      }
    }
  }

  console.log(`全职业唯一天赋技能总量: ${allSpellIds.size}`);

  // 2. 读取已有缓存
  let translations = {};
  try {
    const content = await fs.readFile(TRANSLATIONS_FILE, "utf-8");
    translations = JSON.parse(content);
  } catch (e) {
    translations = {};
  }

  // 检查哪些需要抓取（如果没有 descriptionCn 或者 descriptionEn 则需要抓取）
  const idsToFetch = [];
  for (const id of allSpellIds) {
    const cached = translations[id];
    if (!cached || !cached.descriptionCn || !cached.descriptionEn) {
      idsToFetch.push(id);
    }
  }

  console.log(`已有完整数据: ${allSpellIds.size - idsToFetch.length}`);
  console.log(`本次需抓取: ${idsToFetch.length}`);

  // 3. 并发抓取
  const BATCH_SIZE = 35;
  let finished = 0;
  let successCount = 0;

  for (let i = 0; i < idsToFetch.length; i += BATCH_SIZE) {
    const batch = idsToFetch.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(id => fetchSpellDataWithRetry(id)));

    for (const r of results) {
      if (r && r.cn) {
        translations[r.spellId] = {
          spellId: r.spellId,
          icon: r.icon,
          nameCn: r.cn.name || translations[r.spellId]?.nameCn || "",
          nameEn: r.en?.name || translations[r.spellId]?.nameEn || "",
          talentTypeCn: r.cn.talentType || "天赋",
          talentTypeEn: r.en?.talentType || "Talent",
          costCn: r.cn.cost || null,
          costEn: r.en?.cost || null,
          rangeCn: r.cn.range || null,
          rangeEn: r.en?.range || null,
          castTimeCn: r.cn.castTime || null,
          castTimeEn: r.en?.castTime || null,
          cooldownCn: r.cn.cooldown || null,
          cooldownEn: r.en?.cooldown || null,
          chargesCn: r.cn.charges || null,
          chargesEn: r.en?.charges || null,
          descriptionCn: r.cn.description || "",
          descriptionEn: r.en?.description || "",
          subSpellsCn: r.cn.subSpells || [],
          subSpellsEn: r.en?.subSpells || [],
          tooltipHtmlCn: r.cn.tooltipHtml || "",
          tooltipHtmlEn: r.en?.tooltipHtml || ""
        };
        successCount++;
      }
    }

    finished += batch.length;
    if (finished % 140 === 0 || finished === idsToFetch.length) {
      console.log(`  进度: [${finished}/${idsToFetch.length}] (成功匹配: ${successCount})`);
      await fs.writeFile(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), "utf-8");
    }
  }

  // 最终存盘权威字典
  await fs.writeFile(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), "utf-8");
  console.log(`--------------------------------------------------`);
  console.log(`权威中英文字典更新完成! 累计收录: ${Object.keys(translations).length} 条`);
  console.log(`--------------------------------------------------`);

  // 4. 全量回填更新 13 个职业底图 (talent-blueprints)
  console.log("正在回填底图库 (talent-blueprints)...");
  for (const f of blueprintFiles) {
    const fp = path.join(BLUEPRINTS_DIR, f);
    const content = await fs.readFile(fp, "utf-8");
    const json = JSON.parse(content);
    let classUpdatedCount = 0;

    for (const spec of Object.values(json.specs || {})) {
      for (const node of spec.nodes || []) {
        for (const ab of node.abilities || []) {
          // 处理英雄天赋树选择节点 (spellId === 0)
          if (node.treeType === "hero" && ab.spellId === 0) {
            const heroDesc = getHeroTreeDescription(ab.nameEn);
            if (heroDesc) {
              ab.nameCn = heroDesc.nameCn;
              ab.nameEn = heroDesc.nameEn;
              ab.descriptionCn = heroDesc.descCn;
              ab.descriptionEn = heroDesc.descEn;
              ab.talentTypeCn = "英雄天赋";
              ab.talentTypeEn = "Hero Talent";
              classUpdatedCount++;
              continue;
            }
          }

          if (ab.spellId && translations[ab.spellId]) {
            const tr = translations[ab.spellId];
            if (tr.nameCn) ab.nameCn = tr.nameCn;
            if (tr.nameEn) ab.nameEn = tr.nameEn;
            if (tr.icon) ab.icon = tr.icon;
            ab.descriptionCn = tr.descriptionCn || "";
            ab.descriptionEn = tr.descriptionEn || "";
            ab.costCn = tr.costCn || null;
            ab.costEn = tr.costEn || null;
            ab.rangeCn = tr.rangeCn || null;
            ab.rangeEn = tr.rangeEn || null;
            ab.castTimeCn = tr.castTimeCn || null;
            ab.castTimeEn = tr.castTimeEn || null;
            ab.cooldownCn = tr.cooldownCn || null;
            ab.cooldownEn = tr.cooldownEn || null;
            ab.chargesCn = tr.chargesCn || null;
            ab.chargesEn = tr.chargesEn || null;
            ab.subSpellsCn = tr.subSpellsCn || [];
            ab.subSpellsEn = tr.subSpellsEn || [];
            ab.tooltipHtmlCn = tr.tooltipHtmlCn || "";
            ab.tooltipHtmlEn = tr.tooltipHtmlEn || "";
            classUpdatedCount++;
          }
        }
      }
    }

    await fs.writeFile(fp, JSON.stringify(json, null, 2), "utf-8");
    console.log(`  底图对齐: ${f} (${classUpdatedCount} 个技能节点更新)`);
  }

  // 5. 全量回填更新 39 个专精手册的 talents.json
  console.log("正在回填各专精 talents.json...");
  const classDirs = await fs.readdir(CLASSES_DIR);
  let updatedSpecs = 0;

  for (const cDir of classDirs) {
    if (cDir.startsWith("_") || cDir.startsWith(".")) continue;
    const fullClassDir = path.join(CLASSES_DIR, cDir);
    const stat = await fs.stat(fullClassDir);
    if (!stat.isDirectory()) continue;

    const specDirs = await fs.readdir(fullClassDir);
    for (const sDir of specDirs) {
      const jsonPath = path.join(fullClassDir, sDir, "talents.json");
      try {
        const fileContent = await fs.readFile(jsonPath, "utf-8");
        const specJson = JSON.parse(fileContent);

        if (specJson.selectedNodes && Array.isArray(specJson.selectedNodes)) {
          let nodeUpdated = 0;
          for (const node of specJson.selectedNodes) {
            // 处理英雄天赋树选择节点 (spellId === 0)
            if (node.treeType === "hero" && node.spellId === 0) {
              const heroDesc = getHeroTreeDescription(node.nameEn);
              if (heroDesc) {
                node.nameCn = heroDesc.nameCn;
                node.nameEn = heroDesc.nameEn;
                node.descriptionCn = heroDesc.descCn;
                node.descriptionEn = heroDesc.descEn;
                node.talentTypeCn = "英雄天赋";
                node.talentTypeEn = "Hero Talent";
                nodeUpdated++;
                continue;
              }
            }

            if (node.spellId && translations[node.spellId]) {
              const tr = translations[node.spellId];
              if (tr.nameCn) node.nameCn = tr.nameCn;
              if (tr.nameEn) node.nameEn = tr.nameEn;
              if (tr.icon) node.icon = tr.icon;
              node.descriptionCn = tr.descriptionCn || "";
              node.descriptionEn = tr.descriptionEn || "";
              node.costCn = tr.costCn || null;
              node.costEn = tr.costEn || null;
              node.rangeCn = tr.rangeCn || null;
              node.rangeEn = tr.rangeEn || null;
              node.castTimeCn = tr.castTimeCn || null;
              node.castTimeEn = tr.castTimeEn || null;
              node.cooldownCn = tr.cooldownCn || null;
              node.cooldownEn = tr.cooldownEn || null;
              node.chargesCn = tr.chargesCn || null;
              node.chargesEn = tr.chargesEn || null;
              node.subSpellsCn = tr.subSpellsCn || [];
              node.subSpellsEn = tr.subSpellsEn || [];
              nodeUpdated++;
            }
          }
          await fs.writeFile(jsonPath, JSON.stringify(specJson, null, 2), "utf-8");
          updatedSpecs++;
        }
      } catch (e) {
        // 如果文件不存在则跳过
      }
    }
  }

  console.log(`回填完成! 共对齐 ${updatedSpecs} 个专精的 talents.json`);
}

run().catch(console.error);
