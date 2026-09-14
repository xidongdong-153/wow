// automation/scripts/sync-spell-translations.mjs
// 魔兽世界全量天赋官方简中译名权威同步工具
//
// 机制:
//   1. 遍历 13 个职业天赋底图，收集全部全局唯一 spellId
//   2. 并发向官方多语言 Tooltip 接口请求标准简中译名
//   3. 缓存至本地权威字典 automation/data/spell-translations.json
//   4. 全量回填至 talent-blueprints/*.json、各专精 talents.json 与 talents.md

import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import { getHeroTalentCn } from "./hero-talent-constants.mjs";

const BASE_DIR = "/Users/wuwanzhu/Documents/wow";
const BLUEPRINTS_DIR = path.join(BASE_DIR, "automation/data/talent-blueprints");
const TRANSLATIONS_FILE = path.join(BASE_DIR, "automation/data/spell-translations.json");
const CLASSES_DIR = path.join(BASE_DIR, "classes");

console.log("==================================================");
console.log("启动魔兽世界官方天赋简中译名权威同步器");
console.log("==================================================");

// 读取已有缓存
let translations = {};
try {
  const content = await fs.readFile(TRANSLATIONS_FILE, "utf-8");
  translations = JSON.parse(content);
} catch (e) {
  translations = {};
}

// 1. 扫描全部 spellId
const blueprintFiles = (await fs.readdir(BLUEPRINTS_DIR)).filter(f => f.endsWith(".json"));
const spellIdsToFetch = new Set();
const spellInfoMap = new Map();

for (const f of blueprintFiles) {
  const content = await fs.readFile(path.join(BLUEPRINTS_DIR, f), "utf-8");
  const json = JSON.parse(content);
  for (const spec of Object.values(json.specs || {})) {
    for (const node of spec.nodes || []) {
      for (const ab of node.abilities || []) {
        if (ab.spellId) {
          spellInfoMap.set(ab.spellId, ab.nameEn);
          if (!translations[ab.spellId]) {
            spellIdsToFetch.add(ab.spellId);
          }
        }
      }
    }
  }
}

console.log(`全职业唯一技能总量: ${spellInfoMap.size}`);
console.log(`本地已缓存译名: ${Object.keys(translations).length}`);
console.log(`本次需联网获取: ${spellIdsToFetch.size}`);

// 2. 并发请求函数
function fetchSpellCn(spellId) {
  return new Promise((resolve) => {
    const url = `https://nether.wowhead.com/tooltip/spell/${spellId}?dataEnv=1&locale=4`;
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 10000 }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({ spellId, nameCn: json.name || null, icon: json.icon || null });
        } catch (e) {
          resolve({ spellId, nameCn: null, icon: null });
        }
      });
    }).on("error", () => resolve({ spellId, nameCn: null, icon: null }))
      .on("timeout", () => resolve({ spellId, nameCn: null, icon: null }));
  });
}

// 3. 批量限流抓取（批大小 25）
const fetchList = Array.from(spellIdsToFetch);
const BATCH_SIZE = 25;
let fetchedCount = 0;
let successFetch = 0;

for (let i = 0; i < fetchList.length; i += BATCH_SIZE) {
  const batch = fetchList.slice(i, i + BATCH_SIZE);
  const results = await Promise.all(batch.map(fetchSpellCn));
  for (const r of results) {
    if (r.nameCn) {
      translations[r.spellId] = {
        nameCn: r.nameCn,
        icon: r.icon,
        nameEn: spellInfoMap.get(r.spellId) || ""
      };
      successFetch++;
    }
  }
  fetchedCount += batch.length;
  if (fetchedCount % 200 === 0 || fetchedCount === fetchList.length) {
    console.log(`  抓取进度: [${fetchedCount}/${fetchList.length}] 成功匹配: ${successFetch}`);
    // 中途定期存盘
    await fs.writeFile(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), "utf-8");
  }
}

// 存盘权威字典
await fs.writeFile(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), "utf-8");
console.log(`--------------------------------------------------`);
console.log(`权威简中译名库更新完成! 累计收录: ${Object.keys(translations).length} 条`);
console.log(`--------------------------------------------------`);

// 4. 回填更新 13 个职业底图
console.log("正在回填底图库 (talent-blueprints)...");
for (const f of blueprintFiles) {
  const fp = path.join(BLUEPRINTS_DIR, f);
  const content = await fs.readFile(fp, "utf-8");
  const json = JSON.parse(content);
  for (const spec of Object.values(json.specs || {})) {
    for (const node of spec.nodes || []) {
      for (const ab of node.abilities || []) {
        if (ab.spellId && translations[ab.spellId]?.nameCn) {
          ab.nameCn = translations[ab.spellId].nameCn;
        } else if (!ab.spellId || ab.spellId === 0) {
          const heroCn = getHeroTalentCn(ab.nameEn);
          if (heroCn && heroCn !== ab.nameEn) {
            ab.nameCn = heroCn;
          }
        }
      }
    }
  }
  await fs.writeFile(fp, JSON.stringify(json, null, 2), "utf-8");
}

// 5. 回填更新 39 个专精的 talents.json 与 talents.md
console.log("正在回填各专精 talents.json 与 talents.md...");
let updatedSpecs = 0;

for (const f of blueprintFiles) {
  const classSlug = f.replace(".json", "");
  const classDir = path.join(CLASSES_DIR, classSlug);
  let specDirs = [];
  try {
    specDirs = await fs.readdir(classDir);
  } catch (e) {
    continue;
  }

  for (const specSlug of specDirs) {
    const jsonPath = path.join(classDir, specSlug, "talents.json");
    const mdPath = path.join(classDir, specSlug, "talents.md");

    let specTalents = null;
    try {
      const c = await fs.readFile(jsonPath, "utf-8");
      specTalents = JSON.parse(c);
    } catch (e) {
      continue;
    }

    // 更新 selectedNodes
    for (const n of specTalents.selectedNodes || []) {
      if (n.spellId && translations[n.spellId]?.nameCn) {
        n.nameCn = translations[n.spellId].nameCn;
      } else if (!n.spellId || n.spellId === 0) {
        // 英雄天赋根节点或特异节点，使用英雄天赋词典
        const heroCn = getHeroTalentCn(n.nameEn);
        if (heroCn && heroCn !== n.nameEn) {
          n.nameCn = heroCn;
        }
      }
    }
    await fs.writeFile(jsonPath, JSON.stringify(specTalents, null, 2), "utf-8");

    // 更新 talents.md
    try {
      let md = await fs.readFile(mdPath, "utf-8");
      // 遍历所有翻译项，若 md 包含 "**nameEn** (nameEn)"，替换为 "**nameCn** (nameEn)"
      for (const n of specTalents.selectedNodes || []) {
        if (n.nameCn && n.nameEn && n.nameCn !== n.nameEn) {
          const rawPattern = `**${n.nameEn}** (${n.nameEn})`;
          const replacement = `**${n.nameCn}** (${n.nameEn})`;
          if (md.includes(rawPattern)) {
            md = md.replaceAll(rawPattern, replacement);
          }
        }
      }
      await fs.writeFile(mdPath, md, "utf-8");
      updatedSpecs++;
    } catch (e) {}
  }
}

console.log("==================================================");
console.log(`回填完成! 共对齐 ${updatedSpecs} 个专精的 talents.json 与 talents.md`);
console.log("==================================================");
